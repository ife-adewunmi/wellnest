'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GoogleSignupButton from '@/shared/components/ui/google-signup-button'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/custom-input'
import PasswordInput from '@/shared/components/ui/password-input'
import { Button } from '@/shared/components/ui/custom-button'
import { ArrowRight } from 'lucide-react'
import LayoutImage from '@/shared/components/layout-image'
import HomeMessage from '@/shared/components/ui/home-screen-popup'
import WelcomeMessage from '@/shared/components/ui/welcome-message'

import { loginSchema, LoginFormData } from '../lib/validation'
import useLoginUser from '../hooks/useLoginUser'
import { toast } from 'react-toastify'
import { useUserStore } from '../../store'
import { interMedium, interRegular } from '@/shared/styles/fonts'
import { UserRole } from '../enums'

export default function LoginForm() {
  const router = useRouter()
  const { mutate: loginUser, isPending } = useLoginUser()
  const { setUser } = useUserStore()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [remember, setRemember] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail')
    const savedPassword = localStorage.getItem('rememberPassword')

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
      })
      setRemember(true)
    }
  }, [])
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationResult = loginSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    loginUser(validationResult.data, {
      onSuccess: (data) => {
        if (data.user) {
          setUser(data.user)
        }

        if (remember) {
          localStorage.setItem('rememberEmail', formData.email)
          localStorage.setItem('rememberPassword', formData.password)
        } else {
          localStorage.removeItem('rememberEmail')
          localStorage.removeItem('rememberPassword')
        }

        toast.success('Login successful!')
        if (data.user?.role === UserRole.COUNSELOR) {
          router.push('/dashboard')
        } else {
          router.push('/student')
        }
        router.refresh()
      },
      onError: (error) => {
        console.error('Failed to login:', error)
        toast.error('Invalid email or password!')
      },
    })
  }

  return (
    <div
      className="flex w-full justify-center min-h-screen px-4 sm:px-6 pt-[2rem]"

    >
      <div className="flex w-full max-w-[1346px]   justify-center lg:gap-[3rem] xl:gap-[4rem] ">
        <div className='hidden lg:flex w-full '>
          <LayoutImage />
        </div>
        <div className="flex w-full flex-col items-center w-full max-w-[580px] min-w-[320px]">
          <div className="lg:hidden mb-6 sm:mb-8">
            <WelcomeMessage />
          </div>
          <HomeMessage />
          <div className="mt-6 sm:mt-8 lg:mt-[3.125rem] w-full max-w-[458px]">
            <div className="text-center">
              <h1 className={`text-xl sm:text-2xl lg:text-[1.25rem] text-[#333333] ${interMedium.className}`}>Sign in</h1>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-[2.5rem]">
              <GoogleSignupButton />

              {/* OR divider */}
              <div className="mt-6 sm:mt-8 lg:mt-[2.5rem] flex items-center gap-3 sm:gap-4 lg:gap-[1.5rem]">
                <div className="h-[1px] sm:h-[2px] w-full bg-[#66666640]"></div>
                <div className="">
                  <span className={`text-[#666666] ${interMedium.className} text-sm sm:text-base lg:text-[18px]`}>OR</span>
                </div>
                <div className="h-[1px] sm:h-[2px] w-full bg-[#66666640]"></div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleLogin} className="mt-6 sm:mt-8 lg:mt-[2.5rem] flex flex-col gap-3 sm:gap-4 lg:gap-[1rem]">
                <div className="flex flex-col gap-1 sm:gap-2 lg:gap-[4px]">
                  <Label
                    htmlFor="email"
                    className={`text-sm sm:text-base lg:text-[1rem] text-[#666666] ${interRegular.className}`}
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@eg.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`border border-[#E2E8F0] px-3 sm:px-4 lg:px-[1rem] py-3 sm:py-4 lg:py-[17px] ${validationErrors.email ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.email && (
                    <span className="text-sm text-red-500">{validationErrors.email}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-[4px]">
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                  />
                  {validationErrors.password && (
                    <span className="text-sm text-red-500">{validationErrors.password}</span>
                  )}
                </div>

                <p
                  className={`${interRegular.className} text-end text-sm sm:text-base lg:text-[1rem] text-[#111111] underline`}
                >
                  Forgot your password
                </p>
                <div className="flex gap-2 sm:gap-3 lg:gap-[8px] items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="remember" className="text-xs sm:text-sm">
                    Remember password
                  </label>
                </div>
                <div className="mt-6 sm:mt-8 lg:mt-[2.5rem] flex items-center justify-center">
                  <Button
                    type="submit"
                    variant={'default'}
                    className="flex items-center w-full"
                    disabled={isPending}
                  >
                    {isPending ? 'Signing in...' : 'Sign in'}
                    {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-6 sm:mt-8 lg:mt-[2.5rem] flex items-center justify-center">
                  <p className={`${interRegular.className} text-xs sm:text-sm lg:text-[14px] text-[#666666] text-center`}>
                    You don`t have an account?{' '}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
