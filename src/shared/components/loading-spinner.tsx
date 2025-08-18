import { cn } from '@/shared/lib/utils'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-b-2 border-gray-900',
        sizeClasses[size],
        className,
      )}
    />
  )
}
