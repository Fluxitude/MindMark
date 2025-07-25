"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/cn"

const avatarVariants = cva(
  // Cult UI base avatar styling with neomorphic design
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-300",
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        xl: "size-16",
        "2xl": "size-20",
      },
      variant: {
        default: [
          // Cult UI neomorphic border and shadow
          "border border-white/60 dark:border-neutral-700/50",
          "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset]",
          "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)]",
        ],
        outline: [
          // Subtle outline variant
          "border-2 border-neutral-200 dark:border-neutral-700",
          "shadow-sm",
        ],
        solid: [
          // Solid background variant
          "border border-primary/20",
          "shadow-md shadow-primary/10",
        ],
      },
      status: {
        none: "",
        online: "after:absolute after:bottom-0 after:right-0 after:size-3 after:rounded-full after:bg-green-500 after:border-2 after:border-background",
        offline: "after:absolute after:bottom-0 after:right-0 after:size-3 after:rounded-full after:bg-neutral-400 after:border-2 after:border-background",
        busy: "after:absolute after:bottom-0 after:right-0 after:size-3 after:rounded-full after:bg-red-500 after:border-2 after:border-background",
        away: "after:absolute after:bottom-0 after:right-0 after:size-3 after:rounded-full after:bg-yellow-500 after:border-2 after:border-background",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
      status: "none",
    },
  }
)

function Avatar({
  className,
  size,
  variant,
  status,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, variant, status }), className)}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Cult UI fallback with neomorphic background
        "flex size-full items-center justify-center rounded-full",
        "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300",
        // Cult UI typography for cognitive accessibility
        "cult-text-sm cult-weight-medium",
        className
      )}
      {...props}
    />
  )
}

// Enhanced UserAvatar component with automatic initials generation
interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string | null
  alt?: string
  name?: string | null
  email?: string | null
  fallbackIcon?: React.ReactNode
}

function UserAvatar({
  src,
  alt,
  name,
  email,
  fallbackIcon,
  className,
  ...props
}: UserAvatarProps) {
  // Generate initials from name or email
  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    if (email) {
      return email.charAt(0).toUpperCase()
    }

    return '?'
  }

  const initials = getInitials(name, email)
  const displayName = name || email?.split('@')[0] || 'User'

  return (
    <Avatar className={className} {...props}>
      {src && (
        <AvatarImage
          src={src}
          alt={alt || `${displayName} avatar`}
        />
      )}
      <AvatarFallback>
        {fallbackIcon || initials}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar, avatarVariants }
export type { UserAvatarProps }
