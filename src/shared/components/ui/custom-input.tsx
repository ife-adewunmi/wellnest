import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`focus:ring-[blue-500 rounded-[6px] border border-[#CBD5E0] px-[1rem] py-[14px] placeholder:text-[18px] placeholder:text-[#1A202C] focus:border-blue-500 focus:ring-1 focus:outline-none ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
