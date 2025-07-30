'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

type ViewContextType = {
  currentView: string
  setCurrentView: React.Dispatch<React.SetStateAction<string>>
}

const ViewContext = createContext<ViewContextType | null>(null)

type ViewProviderProps = {
  children: ReactNode
}

const ViewProvider = ({ children }: ViewProviderProps) => {
  const [currentView, setCurrentView] = useState('students')

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>{children}</ViewContext.Provider>
  )
}

// Custom hook to use the ViewContext
export const useViewContext = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useViewContext must be used within a ViewProvider')
  }
  return context
}

export { ViewContext, ViewProvider }
