'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GoogleSignupButton from '@/shared/components/ui/google-signup-button'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/custom-input'
import PasswordInput from '@/shared/components/ui/password-input'
import { Button } from '@/shared/components/ui/custom-button'
import { ArrowRight } from 'lucide-react'
import LayoutImage from '@/shared/components/layout-image'
import HomeMessage from '@/shared/components/ui/home-screen-popup'
import { loginSchema, LoginFormData } from '@/users/auth/lib/validations'
import { toast } from 'react-toastify'
import { interMedium, interRegular } from '@/shared/styles/fonts'
import { UserRole } from '@/users/auth/enums'
import { useUserStore } from '@/users/state'
import { useAuthStore } from '../state/authStore'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'
import { rememberUser } from '../lib/remember-user'

export default function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [remember, setRemember] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail')
    const savedPassword = localStorage.getItem('rememberPassword')

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
      })
      setRemember(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationResult = loginSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    // Use the store's login method
    login(validationResult.data)
      .then(() => {
        // Handle remember functionality
        rememberUser(validationResult.data)

        toast.success('Login successful!')

        // Small delay to ensure user state is fully updated
        setTimeout(() => {
          // Get updated user from store after successful login
          const currentUser = useUserStore.getState().user

          // Navigate based on role - replace history to prevent back button issues
          const path =
            currentUser?.role === UserRole.COUNSELOR
              ? Endpoints.COUNSELORS.DASHBOARD
              : Endpoints.STUDENTS.DASHBOARD

          // Use replace to prevent users from going back to signin page
          navigateTo(router, path, { replace: true })
        }, 100)
      })
      .catch((error) => {
        console.error('Failed to login:', error)
        toast.error(error.message || 'Invalid email or password!')
      })
  }

  return (
    <div
      className="flex w-full"
      style={{
        paddingRight: '4.44vw',
        paddingLeft: '2.22vw',
        paddingTop: '2.22vh',
        paddingBottom: '2.22vh',
      }}
    >
      <div className="flex w-full max-w-[1346px] gap-[4.44vw]">
        <div style={{ width: 'fit-content' }}>
          <LayoutImage />
        </div>
        <div className="flex w-full flex-col items-center">
          <HomeMessage />
          <div className="mt-[3.125rem] w-full max-w-[458px]">
            <div className="text-center">
              <h1 className={`text-[1.25rem] text-[#333333] ${interMedium.className}`}>Sign in</h1>
            </div>

            <div className="mt-[2.5rem]">
              <GoogleSignupButton />

              {/* OR divider */}
              <div className="mt-[2.5rem] flex items-center gap-[1.5rem]">
                <div className="h-[2px] w-full bg-[#66666640]"></div>
                <div className="">
                  <span className={`text-[#666666] ${interMedium.className} text-[18px]`}>OR</span>
                </div>
                <div className="h-[2px] w-full bg-[#66666640]"></div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleLogin} className="mt-[2.5rem] flex flex-col gap-[1rem]">
                <div className="flex flex-col gap-[4px]">
                  <Label
                    htmlFor="email"
                    className={`text-[1rem] text-[#666666] ${interRegular.className}`}
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@eg.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`border border-[#E2E8F0] px-[1rem] py-[17px] ${validationErrors.email ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.email && (
                    <span className="text-sm text-red-500">{validationErrors.email}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-[4px]">
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                  />
                  {validationErrors.password && (
                    <span className="text-sm text-red-500">{validationErrors.password}</span>
                  )}
                </div>

                <p
                  className={`${interRegular.className} text-end text-[1rem] text-[#111111] underline`}
                >
                  Forgot your password
                </p>
                <div className="flex gap-[8px]">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-sm">
                    Remember password
                  </label>
                </div>
                <div className="mt-[2.5rem] flex items-center justify-center">
                  <Button
                    type="submit"
                    variant={'default'}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-[2.5rem] flex items-center justify-center">
                  <p className={`${interRegular.className} text-[14px] text-[#666666]`}>
                    You don`t have an account?{' '}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
