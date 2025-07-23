import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { interSemiBold } from '@/shared/styles/fonts'

const buttonVariants = cva('', {
  variants: {
    variant: {
      default: `bg-[#4299E1] w-full cursor-pointer py-[18px] justify-center flex items-center rounded-[100px] text-[#FFFFFF] text-[18px] ${interSemiBold.className}`,
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline:
        'border cursor-pointer border-[#333333] bg-transparent rounded-[2.5rem] px-[7.6875rem] py-[1.25rem]',
      secondary: 'cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent cursor-pointer hover:text-accent-foreground',
      link: `bg-[#CBD5E0] cursor-pointer rounded-[100px] py-[8px] px-[12px] text-[#1A202C] text-[14px] ${interSemiBold.className}`,
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
