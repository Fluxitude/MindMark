// MindMark Design System - ExpandableCard Modal Implementation
// Modal-based expansion for multiple bookmark cards

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";

// Modal Dialog Components (using Radix Dialog)
import * as Dialog from "@radix-ui/react-dialog";

export interface ExpandableCardModalProps {
  children: React.ReactNode;
  modalContent: React.ReactNode;
  modalTitle?: string;
  modalDescription?: string;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  ariaLabel?: string;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

// Variant styles
const variantStyles = {
  default: "p-4",
  compact: "p-3",
  detailed: "p-6"
};

export function ExpandableCardModal({
  children,
  modalContent,
  modalTitle,
  modalDescription,
  variant = 'default',
  className,
  ariaLabel,
  onModalOpen,
  onModalClose,
}: ExpandableCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      onModalOpen?.();
    } else {
      onModalClose?.();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <motion.div
          className={cn(
            // Base styles with Cult UI integration
            "relative overflow-hidden cursor-pointer",
            "bg-background border border-border",
            "rounded-3xl", // Signature 24px Cult UI radius
            "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset]",
            "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1)]",
            // Hover effects
            "hover:bg-accent/50 hover:shadow-lg",
            "transition-all duration-200 ease-out",
            // Variant-specific padding
            variantStyles[variant],
            className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
          {/* Visual indicator that this opens a modal */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </motion.div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            {modalTitle && (
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                {modalTitle}
              </Dialog.Title>
            )}
            {modalDescription && (
              <Dialog.Description className="text-sm text-muted-foreground">
                {modalDescription}
              </Dialog.Description>
            )}
          </div>
          
          <div className="flex-1">
            {modalContent}
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Convenience component for bookmark modal content
export function BookmarkModalContent({
  title,
  url,
  description,
  tags,
  aiSummary,
  actions,
  className,
}: {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  aiSummary?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
          {url}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
          <p className="text-sm leading-relaxed">{description}</p>
        </div>
      )}

      {/* AI Summary */}
      {aiSummary && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            ✨ AI Summary
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-2xl">
            <p className="text-sm leading-relaxed">{aiSummary}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div className="pt-4 border-t">
          {actions}
        </div>
      )}
    </div>
  );
}

export default ExpandableCardModal;
