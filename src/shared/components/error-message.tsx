import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-800', className)}>
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
