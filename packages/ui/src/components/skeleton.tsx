import { cn } from "../utils/cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Cult UI signature 16px border radius for skeleton elements
        "animate-pulse rounded-[16px] bg-neutral-100 dark:bg-neutral-700",
        // Enhanced neomorphic inset shadow for depth
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
        // Subtle border for better definition
        "border border-white/60 dark:border-neutral-600/50",
        className
      )}
      {...props}
    />
  )
}

// Skeleton variants for common use cases
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "cult-card p-6 space-y-4",
        className
      )}
      {...props}
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

function SkeletonText({ 
  lines = 3, 
  className, 
  ...props 
}: React.ComponentProps<"div"> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

function SkeletonAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("size-10 rounded-full", className)}
      {...props}
    />
  )
}

function SkeletonButton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-10 w-24 rounded-[16px]", className)}
      {...props}
    />
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton 
}
