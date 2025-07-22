import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`rounded-[6px] border border-[#E2E8F0] px-[1rem] py-[17px] placeholder:text-[18px] placeholder:text-[#A0AEC0] focus:border-[#4299E1] focus:ring-1 focus:ring-[#4299E1] focus:outline-none ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
