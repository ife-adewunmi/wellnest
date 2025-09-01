'use client'

import React from 'react'
import { Menu } from 'lucide-react'

interface HamburgerButtonProps {
  onClick: () => void
  className?: string
}

export function HamburgerButton({ onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white p-2 shadow-md transition-colors hover:bg-gray-50 lg:hidden ${className}`}
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6 text-gray-700" />
    </button>
  )
}
