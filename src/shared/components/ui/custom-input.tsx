import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`focus:ring-[blue-500 rounded-[6px] border border-[#A0AEC0] px-[1rem] py-[17px] placeholder:text-[18px] placeholder:text-[#A0AEC0] focus:border-blue-500 focus:ring-1 focus:outline-none ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
