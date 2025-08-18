'use client'

import { useState } from 'react'
import { Label } from './label'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './custom-input'
import { interRegular } from '@/shared/styles/fonts'

interface PasswordInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      <Label htmlFor={id} className={`text-[1rem] text-[#666666] ${interRegular.className}`}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`ppx-[1rem] w-full rounded-[6px] border border-[#E2E8F0] py-[17px] placeholder:text-[18px] placeholder:text-[#A0AEC0]`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
