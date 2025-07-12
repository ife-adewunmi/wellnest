import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`border border-[#E2E8F0] rounded-[6px] py-[17px] px-[1rem] placeholder:text-[#A0AEC0] placeholder:text-[18px] focus:outline-none focus:border-[#4299E1] focus:ring-1 focus:ring-[#4299E1] ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
