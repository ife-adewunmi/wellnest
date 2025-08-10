/*
  Modern ES-style Request class (arrow function methods) modeled after your reference.
  - Uses Fetch API (no axios dependency)
  - Methods: get, post, put, delete, poll, wait, invokeError
  - Robust error normalization into CustomError
  - Optional auth token, headers, params, timeout
  - JSON/text/blob auto parsing based on Content-Type
  - Arrow functions ensure 'this' is bound and code remains modern
*/

import { HttpMethod } from '../enums/http-method'

// export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface PollOptions {
  maxAttempts?: number
  interval?: number
  validityTest?: () => boolean
  retryIf?: (response: Response) => boolean
  authToken?: string
  timeout?: number
}

export interface GetOptions {
  suppressErrorLogs?: boolean
  timeout?: number
}

export interface RequestOptions extends GetOptions {
  authToken?: string
  headers?: Record<string, string>
  body?: any
  params?: Record<string, unknown>
  method?: HttpMethod
}

export interface AppErrorLike {
  errorCode?: number | string
  errorText?: string
  response?: {
    status?: number
    statusText?: string
    data?: unknown
    headers?: Record<string, string>
  } | null
}

export class CustomError extends Error implements AppErrorLike {
  errorCode?: number | string
  errorText?: string
  response?: AppErrorLike['response']
  constructor(init: AppErrorLike) {
    super(init.errorText || 'Request failed')
    this.name = 'CustomError'
    this.errorCode = init.errorCode
    this.errorText = init.errorText
    this.response = init.response ?? null
  }
}

const DEFAULT_POLL: Required<Pick<PollOptions, 'maxAttempts' | 'interval'>> = {
  maxAttempts: 10,
  interval: 1000,
}

const buildQuery = (params?: Record<string, unknown>): string => {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k, String(vv)))
    else if (typeof v === 'object') usp.append(k, JSON.stringify(v))
    else usp.append(k, String(v))
  })
  const str = usp.toString()
  return str ? `?${str}` : ''
}

const parseResponseBody = async (res: Response): Promise<unknown> => {
  const ct = res.headers.get('Content-Type') || ''
  if (res.status === 204) return null
  try {
    if (ct.includes('application/json')) return await res.json()
    if (ct.startsWith('text/')) return await res.text()
    return await res.blob()
  } catch {
    try {
      return await res.text()
    } catch {
      return null
    }
  }
}

const headersToObject = (headers: Headers): Record<string, string> => {
  const obj: Record<string, string> = {}
  headers.forEach((v, k) => (obj[k] = v))
  return obj
}

export class Request {
  public get = async (
    url: string,
    authToken?: string,
    options?: GetOptions & { params?: Record<string, unknown>; headers?: Record<string, string> },
  ): Promise<any> => {
    const reqOptions: RequestOptions = { ...options, authToken, method: HttpMethod.GET }
    return this.fetchRequest(url, reqOptions)
  }

  public post = async (url: string, data: any = {}, options?: RequestOptions): Promise<any> => {
    const reqOptions: RequestOptions = { ...options, method: HttpMethod.POST, body: data }
    return this.fetchRequest(url, reqOptions)
  }

  public put = async (url: string, data: any = {}, options?: RequestOptions): Promise<any> => {
    const reqOptions: RequestOptions = { ...options, method: HttpMethod.PUT, body: data }
    return this.fetchRequest(url, reqOptions)
  }

  public delete = async (
    url: string,
    authToken?: string,
    options?: GetOptions & { params?: Record<string, unknown>; headers?: Record<string, string> },
  ): Promise<any> => {
    const reqOptions: RequestOptions = { ...options, authToken, method: HttpMethod.DELETE }
    return this.fetchRequest(url, reqOptions)
  }

  public wait = async (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))

  public poll = async (query: string, options?: PollOptions): Promise<any> => {
    const { maxAttempts, interval, validityTest, retryIf, authToken, timeout } = options || {}

    let response = await this.rawFetch(
      query,
      this.getRequestParams(HttpMethod.GET, authToken, undefined, timeout),
    )
    let retries = 0
    const retryIfTest = retryIf ?? ((r: Response) => r.status === 202)

    while (retryIfTest(response)) {
      retries += 1
      if (
        retries <= (maxAttempts ?? DEFAULT_POLL.maxAttempts) &&
        (!validityTest || validityTest())
      ) {
        console.log(`Waiting ${interval ?? DEFAULT_POLL.interval}ms before retrying`, {
          url: query,
        })
        await this.wait(interval ?? DEFAULT_POLL.interval)
        response = await this.rawFetch(
          query,
          this.getRequestParams(HttpMethod.GET, authToken, undefined, timeout),
        )
      } else {
        console.log('Max polling limit reached')
        return Promise.reject('Max limit')
      }
    }

    const data = await parseResponseBody(response)
    if (response.ok && !(data as any)?.error) {
      console.log(response.statusText, { statusCode: response.status, url: query, data })
      return data
    }

    return this.handleError(
      new CustomError({
        errorCode: response.status,
        errorText: response.statusText,
        response: {
          status: response.status,
          statusText: response.statusText,
          data,
          headers: headersToObject(response.headers),
        },
      }),
      undefined,
    )
  }

  public invokeError = async (error: any, options?: GetOptions): Promise<AppErrorLike> =>
    this.handleError(error, options)

  private fetchRequest = async (url: string, options: RequestOptions): Promise<any> => {
    const { method = HttpMethod.GET, params, body, headers, authToken, timeout } = options
    const fullUrl = `${url}${buildQuery(params)}`

    // Stringify JSON bodies if plain object and not FormData
    let reqBody: BodyInit | undefined
    const hdrs: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(headers || {}),
    }
    if (body !== undefined) {
      if (
        typeof body === 'string' ||
        body instanceof Blob ||
        body instanceof FormData ||
        body instanceof URLSearchParams
      ) {
        reqBody = body as BodyInit
        if (body instanceof FormData) {
          // Let the browser set Content-Type with boundary
          delete hdrs['Content-Type']
        }
      } else {
        reqBody = JSON.stringify(body)
      }
    }

    const init = this.getRequestParams(method, authToken, hdrs, timeout)
    const response = await this.rawFetch(fullUrl, { ...init, body: reqBody })
    return this.handleResponse(response)
  }

  private rawFetch = async (url: string, init: RequestInit): Promise<Response> => {
    const controller = new AbortController()
    const signal = init.signal ?? controller.signal
    let timer: any
    const timeoutMs = (init as any)._timeout as number | undefined
    if (timeoutMs && timeoutMs > 0) {
      timer = setTimeout(() => controller.abort(), timeoutMs)
    }

    try {
      const res = await fetch(url, { ...init, signal })
      return res
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  private handleResponse = async (response: Response): Promise<any> => {
    const data = await parseResponseBody(response)
    const isSuccess = response.ok && !(data as any)?.error

    if (isSuccess) {
      return data
    }

    console.error('Request failed', {
      text: response.statusText,
      statusCode: response.status,
      url: (response as any).url,
      data,
    })

    return Promise.reject(
      new CustomError({
        errorCode: response.status,
        errorText: response.statusText,
        response: {
          status: response.status,
          statusText: response.statusText,
          data,
          headers: headersToObject(response.headers),
        },
      }),
    )
  }

  private handleError = async (error: any, options?: GetOptions): Promise<AppErrorLike> => {
    const { message, errorCode, errorText } = error || {}
    const response = error?.response
    const statusText: string | undefined = errorText || response?.statusText
    const status: number | undefined = errorCode || response?.status

    const respData = response?.data
    const respHeaders = response?.headers

    let rejectText: string | undefined = statusText
    let rejectCode: number | string | undefined = status

    if (message) {
      try {
        const { code, exceptions, identifier } = JSON.parse(message)
        rejectCode = code
        const exceptionText =
          typeof exceptions === 'object' && exceptions
            ? Object.values(exceptions as any).join(', ')
            : (exceptions || identifier || '').toString()
        rejectText = `Error code: ${code}; ${exceptionText}`
      } catch {
        rejectText = message
      }
    }

    if (!options || !options?.suppressErrorLogs) {
      console.error('Request error', { text: rejectText, statusCode: rejectCode, data: error })
    }

    return Promise.reject(
      new CustomError({
        errorCode: rejectCode,
        errorText: rejectText,
        response: response ?? { status, statusText, data: respData, headers: respHeaders },
      }),
    )
  }

  private getRequestParams = (
    method: HttpMethod,
    token?: string,
    extraHeaders?: Record<string, string>,
    timeout?: number,
  ): RequestInit & { _timeout?: number } => ({
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrer: 'no-referrer',
    _timeout: timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extraHeaders || {}),
    },
  })
}

export const request = new Request()
