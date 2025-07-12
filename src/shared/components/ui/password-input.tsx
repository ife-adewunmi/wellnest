"use client"

import { useState } from "react"
import { Label } from "./label"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "./custom-input"
import { interRegular } from "@/fonts"

interface PasswordInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function PasswordInput({ id, label, placeholder, value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      <Label htmlFor={id} className={`text-[1rem] text-[#666666] ${interRegular.className}`}>
        {label}
      </Label>
      <div className="relative ">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-[6px] ppx-[1rem] py-[17px] border border-[#E2E8F0] placeholder:text-[#A0AEC0] placeholder:text-[18px] `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
