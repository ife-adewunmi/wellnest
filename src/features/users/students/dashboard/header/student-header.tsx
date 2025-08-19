import { interBold } from '@/shared/styles/fonts'

export function StudentHeader() {
  return (
    <header className="w-full">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 className={`mb-1 text-2xl ${interBold.className}`}>Welcome back!</h1>
        <p className="text-sm text-blue-100">Use the dashboard to track your wellbeing and sessions.</p>
      </div>
    </header>
  )
}

