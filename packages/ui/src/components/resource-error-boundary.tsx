"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ResourceErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ResourceErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export class ResourceErrorBoundary extends React.Component<
  ResourceErrorBoundaryProps,
  ResourceErrorBoundaryState
> {
  constructor(props: ResourceErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ResourceErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Resource loading error caught by boundary:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-4 text-gray-500 bg-gray-50 rounded-lg">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Resource temporarily unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useResourceErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.warn('Resource error handled:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
