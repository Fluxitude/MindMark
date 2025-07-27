// Enhanced Screenshot Service
// Website screenshot capture with multiple sizes and caching

import FirecrawlApp from "@mendable/firecrawl-js";
import { createSupabaseClient } from "@mindmark/supabase";

export interface ScreenshotResult {
  url: string;
  thumbnails: {
    small: string;   // 300x200 for list view
    medium: string;  // 600x400 for card view  
    large: string;   // 1200x800 for gallery view
  };
  source: 'cache' | 'firecrawl' | 'fallback';
  cached: boolean;
}

export interface ScreenshotOptions {
  useCache?: boolean;
  timeout?: number;
  quality?: number;
  fullPage?: boolean;
  waitFor?: number;
  generateThumbnails?: boolean;
}

export class ScreenshotService {
  private supabase = createSupabaseClient();
  private firecrawl: FirecrawlApp;
  private readonly STORAGE_BUCKET = 'screenshots';
  private readonly THUMBNAIL_BUCKET = 'thumbnails';
  private readonly DEFAULT_TIMEOUT = 15000;

  constructor() {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      // In client-side or development without API key, create a mock instance
      console.warn("FIRECRAWL_API_KEY not available - screenshot service will use fallbacks");
      this.firecrawl = null as any; // Will be handled in methods
    } else {
      this.firecrawl = new FirecrawlApp({ apiKey });
    }
    this.ensureBucketsExist();
  }

  /**
   * Capture screenshot for a URL with thumbnail generation
   */
  async captureScreenshot(url: string, options: ScreenshotOptions = {}): Promise<ScreenshotResult> {
    const {
      useCache = true,
      timeout = this.DEFAULT_TIMEOUT,
      quality = 80,
      fullPage = false,
      waitFor = 2000,
      generateThumbnails = true
    } = options;

    const normalizedUrl = this.normalizeUrl(url);
    const cacheKey = this.generateCacheKey(normalizedUrl, { fullPage, quality });

    // Try cache first
    if (useCache) {
      const cached = await this.getCachedScreenshot(cacheKey);
      if (cached) {
        return {
          url: cached.screenshot,
          thumbnails: cached.thumbnails,
          source: 'cache',
          cached: true
        };
      }
    }

    try {
      // Capture screenshot with Firecrawl
      const screenshotData = await Promise.race([
        this.captureWithFirecrawl(normalizedUrl, { fullPage, waitFor, quality }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Screenshot timeout')), timeout)
        )
      ]);

      // Generate thumbnails if requested
      let thumbnails = {
        small: screenshotData,
        medium: screenshotData,
        large: screenshotData
      };

      if (generateThumbnails) {
        thumbnails = await this.generateThumbnails(screenshotData, cacheKey);
      }

      // Cache the results
      if (useCache) {
        await this.cacheScreenshot(cacheKey, screenshotData, thumbnails);
      }

      return {
        url: screenshotData,
        thumbnails,
        source: 'firecrawl',
        cached: false
      };

    } catch (error) {
      console.error("Screenshot capture failed:", error);
      
      // Return fallback placeholder
      const fallbackThumbnails = this.generateFallbackThumbnails(normalizedUrl);
      return {
        url: fallbackThumbnails.large,
        thumbnails: fallbackThumbnails,
        source: 'fallback',
        cached: false
      };
    }
  }

  /**
   * Capture screenshot using Firecrawl
   */
  private async captureWithFirecrawl(url: string, options: {
    fullPage: boolean;
    waitFor: number;
    quality: number;
  }): Promise<string> {
    if (!this.firecrawl) {
      throw new Error('Firecrawl service not available - API key missing');
    }

    const result = await this.firecrawl.scrapeUrl(url, {
      formats: ['screenshot'],
      onlyMainContent: false,
      waitFor: options.waitFor,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!result.success || !(result as any).screenshot) {
      throw new Error('No screenshot returned from Firecrawl');
    }

    return (result as any).screenshot;
  }

  /**
   * Generate multiple thumbnail sizes from a screenshot
   */
  private async generateThumbnails(screenshotUrl: string, cacheKey: string): Promise<{
    small: string;
    medium: string;
    large: string;
  }> {
    try {
      // For now, return the same screenshot for all sizes
      // In a production environment, you'd want to use an image processing service
      // like Supabase's image transformation or a service like Cloudinary
      
      const thumbnails = {
        small: screenshotUrl,
        medium: screenshotUrl,
        large: screenshotUrl
      };

      // TODO: Implement actual thumbnail generation using image processing
      // This could be done with:
      // 1. Supabase's built-in image transformation
      // 2. Sharp.js for server-side processing
      // 3. External service like Cloudinary or ImageKit

      return thumbnails;
    } catch (error) {
      console.warn("Thumbnail generation failed:", error);
      return {
        small: screenshotUrl,
        medium: screenshotUrl,
        large: screenshotUrl
      };
    }
  }

  /**
   * Get cached screenshot from Supabase Storage
   */
  private async getCachedScreenshot(cacheKey: string): Promise<{
    screenshot: string;
    thumbnails: { small: string; medium: string; large: string };
  } | null> {
    try {
      // Check if main screenshot exists
      const { data: screenshotData } = await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(`${cacheKey}.png`);

      // Verify the file exists
      const response = await fetch(screenshotData.publicUrl, { method: 'HEAD' });
      if (!response.ok) return null;

      // Get thumbnail URLs (for now, same as main screenshot)
      const thumbnails = {
        small: screenshotData.publicUrl,
        medium: screenshotData.publicUrl,
        large: screenshotData.publicUrl
      };

      return {
        screenshot: screenshotData.publicUrl,
        thumbnails
      };
    } catch {
      return null;
    }
  }

  /**
   * Cache screenshot in Supabase Storage
   */
  private async cacheScreenshot(
    cacheKey: string, 
    screenshotUrl: string, 
    thumbnails: { small: string; medium: string; large: string }
  ): Promise<void> {
    try {
      // Download the screenshot
      const response = await fetch(screenshotUrl);
      if (!response.ok) return;

      const blob = await response.blob();
      
      // Upload to Supabase Storage
      await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(`${cacheKey}.png`, blob, {
          contentType: 'image/png',
          upsert: true
        });

      // TODO: Cache thumbnails separately when thumbnail generation is implemented
    } catch (error) {
      console.warn('Failed to cache screenshot:', error);
    }
  }

  /**
   * Generate fallback placeholder thumbnails
   */
  private generateFallbackThumbnails(url: string): {
    small: string;
    medium: string;
    large: string;
  } {
    const domain = this.extractDomain(url);
    const encodedDomain = encodeURIComponent(domain);
    
    return {
      small: `https://via.placeholder.com/300x200/6366f1/ffffff?text=${encodedDomain}`,
      medium: `https://via.placeholder.com/600x400/6366f1/ffffff?text=${encodedDomain}`,
      large: `https://via.placeholder.com/1200x800/6366f1/ffffff?text=${encodedDomain}`
    };
  }

  /**
   * Generate cache key for screenshot
   */
  private generateCacheKey(url: string, options: { fullPage: boolean; quality: number }): string {
    const domain = this.extractDomain(url);
    const optionsHash = `${options.fullPage ? 'full' : 'viewport'}-q${options.quality}`;
    return `${domain}-${optionsHash}`;
  }

  /**
   * Normalize URL for consistent caching
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.href;
    } catch {
      return url;
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return 'unknown';
    }
  }

  /**
   * Ensure storage buckets exist
   */
  private async ensureBucketsExist(): Promise<void> {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      
      const screenshotBucketExists = buckets?.some(bucket => bucket.name === this.STORAGE_BUCKET);
      const thumbnailBucketExists = buckets?.some(bucket => bucket.name === this.THUMBNAIL_BUCKET);
      
      if (!screenshotBucketExists) {
        await this.supabase.storage.createBucket(this.STORAGE_BUCKET, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
          fileSizeLimit: 10 * 1024 * 1024 // 10MB
        });
      }

      if (!thumbnailBucketExists) {
        await this.supabase.storage.createBucket(this.THUMBNAIL_BUCKET, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        });
      }
    } catch (error) {
      console.warn('Failed to ensure screenshot buckets exist:', error);
    }
  }

  /**
   * Bulk process screenshots for multiple URLs
   */
  async bulkCaptureScreenshots(urls: string[], options: ScreenshotOptions = {}): Promise<Map<string, ScreenshotResult>> {
    const results = new Map<string, ScreenshotResult>();
    const promises = urls.map(async (url) => {
      try {
        const result = await this.captureScreenshot(url, options);
        results.set(url, result);
      } catch (error) {
        console.warn(`Failed to capture screenshot for ${url}:`, error);
      }
    });

    await Promise.allSettled(promises);
    return results;
  }
}

// Export singleton instance
export const screenshotService = new ScreenshotService();
