import * as React from "react"

import { cn } from "../utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Cult UI signature input styling with inset neomorphic effect
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-11 w-full min-w-0 px-4 py-3 text-sm transition-all duration-300 outline-none",
        // Cult UI signature 16px border radius for inputs
        "rounded-[16px] border border-white/60 dark:border-neutral-700/50",
        // Cult UI inset neomorphic background
        "bg-neutral-50 dark:bg-neutral-800",
        // Cult UI inset shadow system
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(0,0,0,0.4)]",
        // Enhanced Cult UI focus states
        "focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] focus:border-blue-300/50",
        "dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(0,0,0,0.4),0_0_0_3px_rgba(59,130,246,0.2)] dark:focus:border-blue-400/50",
        // File input styling with Cult UI
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:rounded-[12px] file:px-3 file:mr-3",
        // States
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/40 aria-invalid:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
