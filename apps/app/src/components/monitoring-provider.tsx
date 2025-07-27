'use client'

import { useEffect } from 'react'
import { useWebVitals } from '@/lib/monitoring'

interface MonitoringProviderProps {
  children: React.ReactNode
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  // Initialize web vitals tracking only in development or when needed
  useWebVitals()

  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 MindMark app initialized')

      // Track initial page load
      if (typeof window !== 'undefined') {
        const loadTime = Date.now() - performance.timeOrigin
        console.log('📊 Initial page load time:', `${loadTime}ms`)
      }
    }
  }, [])

  return <>{children}</>
}
