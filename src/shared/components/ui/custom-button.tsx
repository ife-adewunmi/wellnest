import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { interSemiBold } from '@/shared/styles/fonts'

const buttonVariants = cva('', {
  variants: {
    variant: {
      default: `bg-[#4299E1] w-full cursor-pointer py-3 sm:py-4 lg:py-[18px] justify-center flex items-center rounded-full text-[#FFFFFF] text-sm sm:text-base lg:text-lg ${interSemiBold.className}`,
      destructive: 'bg-transparent border cursor-pointer border-[#3182CE] py-[4px] px-[8px] rounded-full text-[#3182CE] text-xs sm:text-sm lg:text-[12px] hover:bg-[#3182CE] hover:text-white',
      outline:
        'border cursor-pointer border-[#333333] bg-transparent rounded-full px-6 sm:px-12 lg:px-[7.6875rem] py-3 sm:py-4 lg:py-[1.25rem] text-sm sm:text-base',
      secondary: 'cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: `cursor-pointer items-center bg-[#3182CE] text-xs sm:text-sm lg:text-lg text-white ${interSemiBold.className} px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-[10px] rounded-full gap-2 flex`,
      link: `bg-[#CBD5E0] cursor-pointer rounded-full py-2 px-3 sm:py-[8px] sm:px-[12px] text-[#1A202C] text-xs sm:text-sm ${interSemiBold.className}`,
      dropdown: `bg-[#EDF2F7] cursor-pointer rounded-full py-2 px-3 sm:py-[8px] sm:px-[12px] text-[#1A202C] text-xs sm:text-sm ${interSemiBold.className}`,
      moodDefault: 'w-full bg-transparent, rounded-[72px] border border-[#4A5568] lg:py-[24px] lg:px-[48px] cursor-pointer py-2 px-3 sm:py-[8px] sm:px-[12px] text-[#1A202C] text-xs sm:text-sm',
      moodSelected: 'w-full bg-[#4299E1] rounded-[72px] border border-[#4299E1] lg:py-[24px] lg:px-[48px] cursor-pointer py-2 px-3 sm:py-[8px] sm:px-[12px] text-[#FFFFFF] text-xs sm:text-sm',
    },
    size: {},
  },
  defaultVariants: {},
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
