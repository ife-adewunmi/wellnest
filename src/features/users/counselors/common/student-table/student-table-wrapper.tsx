interface StudentTableWrapperProps {
  children: React.ReactNode
}

export function StudentTableWrapper({ children }: StudentTableWrapperProps) {
  return <div className="mt-6">{children}</div>
}
