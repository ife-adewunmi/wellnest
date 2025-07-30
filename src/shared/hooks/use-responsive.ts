'use client'

import * as React from 'react'

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
}

export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    width: number
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
  })

  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        width,
      })
    }

    // Set initial values
    updateScreenSize()

    // Add event listener
    window.addEventListener('resize', updateScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}
