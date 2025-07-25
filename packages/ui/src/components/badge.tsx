import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/cn"

const badgeVariants = cva(
  // Cult UI badge base styling with neomorphic design
  "inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-all duration-300 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          // Cult UI primary badge with signature styling
          "rounded-[12px] border border-white/60 dark:border-neutral-700/50 bg-neutral-50 dark:bg-neutral-800 text-foreground " +
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset] " +
          "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)] " +
          "[a&]:hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] [a&]:hover:-translate-y-0.5",
        secondary:
          // Cult UI secondary badge with muted styling
          "rounded-[12px] border border-white/60 dark:border-neutral-700/50 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 " +
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] " +
          "[a&]:hover:bg-neutral-200 dark:[a&]:hover:bg-neutral-600",
        destructive:
          // Cult UI destructive badge with warning styling
          "rounded-[12px] border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 " +
          "shadow-[inset_0_1px_2px_rgba(239,68,68,0.1)] dark:shadow-[inset_0_1px_2px_rgba(239,68,68,0.2)] " +
          "[a&]:hover:bg-red-100 dark:[a&]:hover:bg-red-900/30",
        outline:
          // Cult UI outline badge with subtle styling
          "rounded-[12px] border border-neutral-300 dark:border-neutral-600 bg-transparent text-foreground " +
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] " +
          "[a&]:hover:bg-neutral-50 dark:[a&]:hover:bg-neutral-800/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
