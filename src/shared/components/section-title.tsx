import { interBold } from '@/shared/styles/fonts'

export type TitleSize = 'sm' | 'md' | 'lg' | 'xl'

interface SectionTitleProps {
  children: React.ReactNode
  size?: TitleSize
  className?: string
}

const sizeClasses: Record<TitleSize, string> = {
  sm: 'text-base sm:text-lg lg:text-xl',
  md: 'text-lg sm:text-xl lg:text-[1.375rem]',
  lg: 'text-xl sm:text-2xl lg:text-[1.75rem]',
  xl: 'text-2xl sm:text-3xl lg:text-[2rem]',
}

export function SectionTitle({ children, size = 'md', className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-[#121417] ${sizeClasses[size]} ${interBold.className} ${className}`}>
      {children}
    </h2>
  )
}
