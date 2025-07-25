// MindMark Keyboard Shortcuts Hook
// Global keyboard shortcuts for enhanced UX

"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description?: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true' ||
      target.isContentEditable
    ) {
      // Exception: Allow Cmd+K / Ctrl+K even in inputs for search
      const isSearchShortcut = 
        event.key.toLowerCase() === 'k' && 
        (event.metaKey || event.ctrlKey);
      
      if (!isSearchShortcut) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const metaMatches = !!shortcut.metaKey === !!event.metaKey;
      const ctrlMatches = !!shortcut.ctrlKey === !!event.ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === !!event.shiftKey;
      const altMatches = !!shortcut.altKey === !!event.altKey;

      if (keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.callback();
        break;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Hook specifically for search shortcuts
export function useSearchShortcuts(onOpenSearch: () => void) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      metaKey: true, // Cmd+K on Mac
      callback: onOpenSearch,
      description: 'Open search',
    },
    {
      key: 'k',
      ctrlKey: true, // Ctrl+K on Windows/Linux
      callback: onOpenSearch,
      description: 'Open search',
    },
    {
      key: '/',
      callback: onOpenSearch,
      description: 'Open search',
    },
  ];

  useKeyboardShortcuts({ shortcuts });
}

// Detect if user is on Mac
export function isMac() {
  if (typeof window === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
}

// Get the appropriate modifier key text for the platform
export function getModifierKey() {
  return isMac() ? '⌘' : 'Ctrl';
}

// Format keyboard shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.metaKey) parts.push('⌘');
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join('+');
}
