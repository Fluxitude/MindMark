// FREE Performance and Error Monitoring
// Uses console logging + Vercel Analytics (free tier)

import React from 'react'

export const freeMonitoring = {
  // Track Core Web Vitals (FREE with Vercel Analytics)
  trackWebVitals: (metric: any) => {
    const { name, value, id } = metric
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, value)
    }

    // Send to Vercel Analytics (FREE tier)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', name)
    }

    // Log performance issues
    const thresholds = {
      FCP: 1500, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      INP: 200,  // Interaction to Next Paint (replaces FID)
      CLS: 0.1,  // Cumulative Layout Shift
      TTFB: 600, // Time to First Byte
    }

    if (value > thresholds[name as keyof typeof thresholds]) {
      console.warn(`🐌 Poor ${name} score:`, {
        value,
        threshold: thresholds[name as keyof typeof thresholds],
        id,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Track API performance (FREE logging)
  trackAPICall: (
    endpoint: string,
    method: string,
    startTime: number,
    status: number,
    error?: Error
  ) => {
    const duration = Date.now() - startTime
    
    const logData = {
      endpoint,
      method,
      duration,
      status,
      timestamp: new Date().toISOString(),
      error: error?.message,
    }

    // Log slow API calls
    if (duration > 1000) {
      console.warn('🐌 Slow API call:', logData)
    }

    // Log errors
    if (error || status >= 400) {
      console.error('❌ API Error:', logData)
    }

    // Log successful calls in development
    if (process.env.NODE_ENV === 'development' && status < 400) {
      console.log('✅ API Success:', logData)
    }
  },

  // Error boundary reporting (FREE)
  reportError: (error: Error, errorInfo?: any) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    }

    console.error('🚨 Application Error:', errorData)
    
    // In production, you could send this to a free service like:
    // - Vercel logs (automatically captured)
    // - Your own simple logging endpoint
    // - Browser's error reporting
    
    if (process.env.NODE_ENV === 'production') {
      // Store in localStorage for debugging (FREE)
      try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
        errors.push(errorData)
        // Keep only last 10 errors to prevent storage bloat
        localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10)))
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  },

  // Performance timing (FREE)
  startTimer: (label: string) => {
    const startTime = Date.now()
    return {
      end: () => {
        const duration = Date.now() - startTime
        console.log(`⏱️ ${label}:`, `${duration}ms`)
        return duration
      }
    }
  },

  // User interaction tracking (FREE)
  trackUserAction: (action: string, data?: any) => {
    const actionData = {
      action,
      data,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.pathname : 'server',
    }

    console.log('👤 User Action:', actionData)

    // Send to Vercel Analytics (FREE tier)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', action)
    }
  },

  // Memory usage tracking (FREE)
  trackMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      const memoryData = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        timestamp: new Date().toISOString(),
      }

      console.log('🧠 Memory Usage:', memoryData)

      // Warn if memory usage is high
      if (memoryData.used > 100) {
        console.warn('⚠️ High memory usage detected:', memoryData)
      }

      return memoryData
    }
    return null
  },
}

// Web Vitals tracking hook (FREE)
export function useWebVitals() {
  if (typeof window !== 'undefined') {
    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then((webVitals) => {
      if (webVitals.onCLS) webVitals.onCLS(freeMonitoring.trackWebVitals)
      if (webVitals.onINP) webVitals.onINP(freeMonitoring.trackWebVitals) // FID is deprecated, use INP
      if (webVitals.onFCP) webVitals.onFCP(freeMonitoring.trackWebVitals)
      if (webVitals.onLCP) webVitals.onLCP(freeMonitoring.trackWebVitals)
      if (webVitals.onTTFB) webVitals.onTTFB(freeMonitoring.trackWebVitals)
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error)
    })
  }
}

// API wrapper with automatic monitoring (FREE)
export function monitoredFetch(url: string, options?: RequestInit) {
  const startTime = Date.now()
  const method = options?.method || 'GET'

  return fetch(url, options)
    .then(response => {
      freeMonitoring.trackAPICall(url, method, startTime, response.status)
      return response
    })
    .catch(error => {
      freeMonitoring.trackAPICall(url, method, startTime, 0, error)
      throw error
    })
}

// Error boundary component helper (FREE)
export function withErrorMonitoring<T extends React.ComponentType<any>>(
  Component: T,
  componentName?: string
): T {
  const WrappedComponent = (props: any) => {
    try {
      return React.createElement(Component, props)
    } catch (error) {
      freeMonitoring.reportError(
        error as Error,
        { componentName: componentName || Component.name, props }
      )
      throw error
    }
  }

  WrappedComponent.displayName = `withErrorMonitoring(${componentName || Component.name})`
  return WrappedComponent as T
}

// Global error handler setup (FREE)
if (typeof window !== 'undefined') {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    freeMonitoring.reportError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      { type: 'unhandledrejection', reason: event.reason }
    )
  })

  // Catch global errors
  window.addEventListener('error', (event) => {
    freeMonitoring.reportError(
      event.error || new Error(event.message),
      { 
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    )
  })
}
