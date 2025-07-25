"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GoogleSignupButton from "@/shared/components/ui/google-signup-button"
import { Separator } from "@/shared/components/ui/seperator"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/custom-input"
import PasswordInput from "@/shared/components/ui/password-input"
import { Button } from "@/shared/components/ui/custom-button"
import { ArrowRight } from "lucide-react"
import LayoutImage from "@/shared/components/layout-image"
import HomeMessage from "@/shared/components/ui/home-screen-popup"

import { loginSchema, LoginFormData } from "@/shared/lib/validations"
import useLoginUser from "@/shared/hooks/useLoginUser"
import { toast } from 'react-toastify'
import { useUserStore } from "@/shared/store/useUserStore"
import { interMedium, interRegular } from "@/shared/styles/fonts"

export default function LoginForm() {
  const router = useRouter()
  const { mutate: loginUser, isPending } = useLoginUser()
  const { setUser } = useUserStore()

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [remember, setRemember] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail")
    const savedPassword = localStorage.getItem("rememberPassword")

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword
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

    loginUser(validationResult.data, {
      onSuccess: (data) => {
        if (data.user) {
          setUser({
            id: data.user.id.toString(),
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email,
            password: ''
          })
        }

        if (remember) {
          localStorage.setItem('rememberEmail', formData.email)
          localStorage.setItem('rememberPassword', formData.password)
        } else {
          localStorage.removeItem('rememberEmail')
          localStorage.removeItem('rememberPassword')
        }

        toast.success('Login successful!')
        router.push('/dashboard')
      },
      onError: (error) => {
        console.error('Failed to login:', error)
        toast.error('Invalid email or password!')
      }
    })
  }

  return (
    <div className="flex  w-full" style={{ paddingRight: '4.44vw', paddingLeft: '2.22vw', paddingTop: '2.22vh', paddingBottom: '2.22vh' }}>
      <div className="flex w-full max-w-[1346px] gap-[4.44vw]" >


        <div style={{ width: 'fit-content' }}>
          {/* <LayoutImage /> */}
        </div>
        <div className="w-full flex items-center flex-col">
          <HomeMessage />
          <div className="w-full max-w-[458px] mt-[3.125rem]" >
            <div className="text-center">
              <h1 className={`text-[#333333] text-[1.25rem] ${interMedium.className}`}>Sign in</h1>
            </div>

            <div className="mt-[2.5rem]">
              <GoogleSignupButton />

              {/* OR divider */}
              <div className="flex items-center gap-[1.5rem] mt-[2.5rem]">
                <div className="w-full h-[2px] bg-[#66666640]">

                </div>
                <div className="">
                  <span className={`text-[#666666] ${interMedium.className} text-[18px]`}>OR</span>
                </div>
                <div className="w-full h-[2px] bg-[#66666640]">

                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleLogin} className="mt-[2.5rem] flex flex-col gap-[1rem]">


                <div className="flex flex-col gap-[4px]">
                  <Label htmlFor="email" className={`text-[1rem] text-[#666666] ${interRegular.className}`} >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@eg.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`px-[1rem] py-[17px] border border-[#E2E8F0] ${validationErrors.email ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.email && (
                    <span className="text-red-500 text-sm">{validationErrors.email}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-[4px]">
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(value) => handleInputChange("password", value)}
                  />
                  {validationErrors.password && (
                    <span className="text-red-500 text-sm">{validationErrors.password}</span>
                  )}
                </div>

                <p className={`${interRegular.className} text-end  text-[#111111] text-[1rem] underline`}>Forgot your password</p>
                <div className="flex gap-[8px]">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-sm">Remember password</label>
                </div>
                <div className="mt-[2.5rem] flex  items-center justify-center">



                  <Button
                    type="submit"
                    variant={'default'}
                    className="flex items-center"
                    disabled={isPending}
                  >
                    {isPending ? 'Signing in...' : 'Sign in'}
                    {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
                <div className="mt-[2.5rem] flex items-center justify-center">


                  <p className={`${interRegular.className} text-[#666666] text-[14px]`}>
                    You don`t have an account?{" "}
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