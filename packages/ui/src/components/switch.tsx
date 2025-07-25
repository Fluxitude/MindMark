"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "../utils/cn"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Cult UI inspired switch with neomorphic styling
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border transition-all duration-300 outline-none",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-200 dark:data-[state=unchecked]:bg-neutral-700",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Neomorphic thumb with enhanced styling
          "pointer-events-none block h-5 w-5 rounded-full ring-0 transition-all duration-300",
          "bg-white dark:bg-neutral-100 shadow-md",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:shadow-lg data-[state=unchecked]:shadow-sm"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
