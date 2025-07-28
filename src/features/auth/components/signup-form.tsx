
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/shared/store/useUserStore"
import GoogleSignupButton from "@/shared/components/ui/google-signup-button"
import { Separator } from "@/shared/components/ui/seperator"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/custom-input"
import PasswordInput from "@/shared/components/ui/password-input"
import { Button } from "@/shared/components/ui/custom-button"
import { ArrowRight } from "lucide-react"
import LayoutImage from "@/shared/components/layout-image"
import HomeMessage from "@/shared/components/ui/home-screen-popup"
import useSignup from "@/features/auth/hooks/useSignup"
import { signupSchema, SignupFormData } from "@/shared/lib/validations"
import { toast } from 'react-toastify'; 
import { interMedium, interRegular } from "@/shared/styles/fonts"

export default function SignupForm() {
  const { mutate: createUser, isPending } = useSignup()
  const router = useRouter()
  const { setUser } = useUserStore()
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationResult = signupSchema.safeParse(formData)

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

    const { confirmPassword, ...userData } = validationResult.data
    createUser({
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
    }, {
      onSuccess: (data) => {
        console.log('User created successfully:', data)

        // Set user in store if user data is returned
        if (data.user) {
          setUser({
            id: data.user.id,
            first_name: data.user.name.split(' ')[0] || '',
            last_name: data.user.name.split(' ')[1] || '',
            email: data.user.email,
            password: ''
          })
        }

        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
        })

        toast.success('User created successfully!')
        router.push('/dashboard')
      },
      onError: (error) => {
        toast.error("Failed to create user!")
        console.error('Failed to create user:', error)

      }
    })
  }

return (
  <div className="flex w-full" style={{paddingRight: '4.44vw', paddingLeft: '2.22vw', paddingTop: '2.22vh', paddingBottom: '2.22vh'}}>
    <div className="flex w-full max-w-[1346px] gap-[4.44vw]">
      <div style={{ width: 'fit-content' }}>
        <LayoutImage />
      </div>
      <div className="w-full flex items-center flex-col">
        <HomeMessage />
        <div className="w-full max-w-[458px] mt-[3.125rem]">
          <div className="text-center">
            <h1 className={`text-[#333333] text-[1.25rem] ${interMedium.className}`}>Sign up</h1>
          </div>

          <div className="mt-[2.5rem]">
            <GoogleSignupButton />

            {/* OR divider */}
            <div className="flex items-center gap-[1.5rem] mt-[2.5rem]">
              <div className="w-full h-[2px] bg-[#66666640]"></div>
              <div className="">
                <span className={`text-[#666666] ${interMedium.className} text-[18px]`}>OR</span>
              </div>
              <div className="w-full h-[2px] bg-[#66666640]"></div>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit}>

         
            <div className="mt-[2.5rem] flex flex-col gap-[1rem]">
              <div className="flex items-center gap-[1rem] w-full">
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <Label htmlFor="firstName" className={`text-[1rem] text-[#666666] ${interRegular.className}`}>
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`w-full ${validationErrors.firstName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.firstName && (
                    <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <Label htmlFor="lastName" className={`text-[1rem] text-[#666666] ${interRegular.className}`}>
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`w-full ${validationErrors.lastName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.lastName && (
                    <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[4px]">
                <Label htmlFor="email" className={`text-[1rem] text-[#666666] ${interRegular.className}`}>
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

              {/* Password fields with validation */}
              <div className="flex items-start gap-[1rem]">
                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(value) => handleInputChange("password", value)}
                  />
                  {validationErrors.password && (
                    <span className="text-red-500 text-sm mt-1 block">{validationErrors.password}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <PasswordInput
                    id="confirmPassword"
                    label="Confirm your password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(value) => handleInputChange("confirmPassword", value)}
                  />
                  {validationErrors.confirmPassword && (
                    <span className="text-red-500 text-sm mt-1 block">{validationErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <p className={`${interRegular.className} text-[#666666] text-[14px]`}>
                Use 8 or more characters with a mix of letters, numbers & symbols
              </p>
              
              <div className="mt-[2.5rem] flex items-center justify-center">
                <Button
                  variant={'default'}
                  className="flex items-center"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? 'Creating account...' : 'Sign up'}
                  {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
              
              <div className="mt-[2.5rem] flex items-center justify-center">
                <p className={`${interRegular.className} text-[#666666] text-[14px]`}>
                  Already have an account?{" "}
                  <Link href="/signin" className="underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
               </form>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
