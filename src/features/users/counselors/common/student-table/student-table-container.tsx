import type { StudentTableContainerProps } from './types'

export function StudentTableContainer({ children }: StudentTableContainerProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}
