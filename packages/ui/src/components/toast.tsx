"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "../utils/cn"

const toastVariants = cva(
  // Cult UI signature 16px border radius for toasts with base styles
  [
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[16px] p-4 transition-all duration-300",
    // Cult UI neomorphic background and borders
    "bg-neutral-50 dark:bg-neutral-800 border border-white/60 dark:border-neutral-700/50",
    // Cult UI complex shadow system for floating elements
    "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)]",
    "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1)]",
    // Enhanced shadow for floating toasts
    "shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.2)]"
  ],
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20",
        success: "border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20",
        warning: "border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-900/20",
        info: "border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const toastIconVariants = cva("size-5 shrink-0", {
  variants: {
    variant: {
      default: "text-foreground",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400", 
      info: "text-blue-600 dark:text-blue-400"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

interface ToastProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  showIcon?: boolean
}

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
}

function Toast({
  className,
  variant = "default",
  title,
  description,
  action,
  onClose,
  showIcon = true,
  children,
  ...props
}: ToastProps) {
  const Icon = iconMap[variant || "default"]

  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start space-x-3 flex-1">
        {showIcon && (
          <Icon className={cn(toastIconVariants({ variant }))} />
        )}
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold leading-none tracking-tight">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {action}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-[12px] p-2 bg-neutral-100 dark:bg-neutral-700 border border-white/60 dark:border-neutral-600/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Toast provider context
interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id"> & { id?: string }) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Simple toast provider (for basic usage)
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, "id"> & { id?: string }) => {
    const id = toast.id || Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export { Toast, toastVariants }
