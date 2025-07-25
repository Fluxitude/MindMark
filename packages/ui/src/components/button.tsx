import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  // Cult UI base button styling with comprehensive neomorphic design
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          // Cult UI primary button with signature neomorphic depth
          "bg-neutral-50 dark:bg-neutral-800 text-foreground border border-white/60 dark:border-neutral-700/50 rounded-[16px] " +
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] " +
          "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1)] " +
          "hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(255,252,240,0.6)_inset] " +
          "dark:hover:shadow-[0_2px_0_0_rgba(255,255,255,0.05)_inset,0_0_0_1px_rgba(255,255,255,0.05)_inset,0_4px_8px_0_rgba(0,0,0,0.15)] " +
          "hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
        destructive:
          // Destructive with Cult UI neomorphic styling
          "bg-red-500 text-white border border-red-400/50 rounded-[16px] " +
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_1px_0px_rgba(255,255,255,0.2)_inset] " +
          "hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15),0px_2px_4px_0px_rgba(255,255,255,0.3)_inset] " +
          "hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
        outline:
          // Outline variant with subtle Cult UI effect
          "border border-neutral-300 dark:border-neutral-600 bg-transparent rounded-[16px] " +
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_1px_0px_rgba(255,255,255,0.03)] " +
          "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] " +
          "hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          // Secondary with soft Cult UI styling
          "bg-neutral-100 dark:bg-neutral-700 text-foreground border border-neutral-200 dark:border-neutral-600 rounded-[16px] " +
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_1px_0px_rgba(255,255,255,0.03)] " +
          "hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] " +
          "hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          // Ghost variant with minimal Cult UI effect
          "rounded-[16px] hover:bg-neutral-100 dark:hover:bg-neutral-800 " +
          "hover:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)] dark:hover:shadow-[0px_1px_2px_0px_rgba(255,255,255,0.03)] " +
          "hover:-translate-y-0.5 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline rounded-[8px]",
      },
      size: {
        // Cult UI proportions with signature border radius
        default: "h-10 px-6 py-2 has-[>svg]:px-4 text-sm",
        sm: "h-8 px-4 py-1.5 has-[>svg]:px-3 text-xs rounded-[12px]",
        lg: "h-12 px-8 py-3 has-[>svg]:px-6 text-base rounded-[20px]",
        icon: "size-10 rounded-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
