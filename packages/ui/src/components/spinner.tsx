import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const spinnerVariants = cva(
  // Cult UI inspired spinner with smooth animation
  "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-6", 
        lg: "size-8",
        xl: "size-12"
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-600"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

interface SpinnerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

function Spinner({ 
  className, 
  size, 
  variant, 
  label = "Loading...",
  ...props 
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

// Loading overlay component
function LoadingOverlay({ 
  children, 
  isLoading, 
  className,
  spinnerSize = "lg",
  ...props 
}: {
  children?: React.ReactNode
  isLoading: boolean
  spinnerSize?: VariantProps<typeof spinnerVariants>["size"]
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm rounded-2xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size={spinnerSize} />
        {children && (
          <div className="text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading button component
function LoadingButton({
  children,
  isLoading,
  disabled,
  className,
  ...props
}: {
  children: React.ReactNode
  isLoading?: boolean
} & React.ComponentProps<"button">) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "cult-button relative",
        isLoading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" variant="muted" />
        </div>
      )}
      <span className={cn(isLoading && "opacity-0")}>
        {children}
      </span>
    </button>
  )
}

export { 
  Spinner, 
  LoadingOverlay, 
  LoadingButton,
  spinnerVariants 
}
