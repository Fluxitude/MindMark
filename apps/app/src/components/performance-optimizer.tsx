// MindMark Performance Optimizer
// Critical resource loading and performance optimizations

"use client";

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = [
        '/icons/mindmark-logo.svg',
        '/icons/favicon.ico',
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Preload critical scripts
      const criticalScripts = [
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/pages/_app.js',
      ];

      criticalScripts.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize font loading
    const optimizeFontLoading = () => {
      // Add font-display: swap to improve FCP
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Geist Sans';
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    };

    // Optimize images with intersection observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // Prefetch next likely pages
    const prefetchLikelyPages = () => {
      const likelyPages = [
        '/collections',
        '/search',
        '/settings',
      ];

      likelyPages.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Run optimizations
    preloadCriticalResources();
    optimizeFontLoading();
    optimizeImages();
    
    // Prefetch after initial load
    setTimeout(prefetchLikelyPages, 2000);

    // Cleanup function
    return () => {
      // Remove any observers or listeners if needed
    };
  }, []);

  // Monitor performance in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Track performance metrics
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('🚀 Performance Metrics:', {
              TTFB: navEntry.responseStart - navEntry.requestStart,
              DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.requestStart,
              LoadComplete: navEntry.loadEventEnd - navEntry.requestStart,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }

    return () => {}; // Return empty cleanup function when not in development
  }, []);

  return <>{children}</>;
}

// Hook for performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log performance entries in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 ${entry.name}:`, (entry as any).value || entry.duration);
          }
        });
      });

      // Observe different types of performance entries
      try {
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (e) {
        // Fallback for older browsers
        console.warn('Performance Observer not fully supported');
      }

      return () => observer.disconnect();
    }

    return () => {}; // Return empty cleanup function when window is not available
  }, []);
}

// Utility function to preload a resource
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
}

// Utility function to prefetch a page
export function prefetchPage(href: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}
