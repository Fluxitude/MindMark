// Enhanced Favicon Service
// Multi-source favicon fetching with caching and fallbacks

import { createSupabaseClient } from "@mindmark/supabase";

export interface FaviconResult {
  url: string;
  source: 'cache' | 'google' | 'clearbit' | 'duckduckgo' | 'direct' | 'fallback';
  cached: boolean;
  size: number;
}

export interface FaviconOptions {
  size?: number;
  useCache?: boolean;
  timeout?: number;
  fallbackToGeneric?: boolean;
}

export class FaviconService {
  private supabase = createSupabaseClient();
  private readonly STORAGE_BUCKET = 'favicons';
  private readonly DEFAULT_SIZE = 32;
  private readonly TIMEOUT = 5000;

  // Rate limiting and request deduplication
  private requestCache = new Map<string, Promise<FaviconResult>>();
  private lastRequestTime = new Map<string, number>();
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests per domain

  constructor() {
    this.ensureBucketExists();
  }

  /**
   * Get favicon for a domain with multiple fallback sources
   */
  async getFavicon(domain: string, options: FaviconOptions = {}): Promise<FaviconResult> {
    const {
      size = this.DEFAULT_SIZE,
      useCache = true,
      timeout = this.TIMEOUT,
      fallbackToGeneric = true
    } = options;

    const normalizedDomain = this.normalizeDomain(domain);
    const cacheKey = `${normalizedDomain}-${size}`;

    // Check if there's already a pending request for this domain
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey)!;
    }

    // Rate limiting: check if we've made a request too recently
    const lastRequest = this.lastRequestTime.get(normalizedDomain);
    if (lastRequest && Date.now() - lastRequest < this.MIN_REQUEST_INTERVAL) {
      // Return a fallback immediately to avoid overwhelming the network
      return {
        url: this.getGenericFavicon(normalizedDomain),
        source: 'fallback',
        cached: false,
        size
      };
    }

    // Create the request promise and cache it
    const requestPromise = this.fetchFaviconInternal(normalizedDomain, cacheKey, size, useCache, timeout, fallbackToGeneric);
    this.requestCache.set(cacheKey, requestPromise);
    this.lastRequestTime.set(normalizedDomain, Date.now());

    // Clean up cache after request completes
    requestPromise.finally(() => {
      this.requestCache.delete(cacheKey);
    });

    return requestPromise;
  }

  private async fetchFaviconInternal(
    normalizedDomain: string,
    cacheKey: string,
    size: number,
    useCache: boolean,
    timeout: number,
    fallbackToGeneric: boolean
  ): Promise<FaviconResult> {
    // Try cache first
    if (useCache) {
      const cached = await this.getCachedFavicon(cacheKey);
      if (cached) {
        return {
          url: cached,
          source: 'cache',
          cached: true,
          size
        };
      }
    }

    // Try multiple favicon sources in order of preference
    const sources = [
      () => this.getGoogleFavicon(normalizedDomain, size),
      () => this.getClearbitFavicon(normalizedDomain, size),
      () => this.getDuckDuckGoFavicon(normalizedDomain, size),
      () => this.getDirectFavicon(normalizedDomain),
    ];

    for (let index = 0; index < sources.length; index++) {
      const getSource = sources[index];
      try {
        const faviconUrl = await Promise.race([
          getSource?.() || Promise.reject(new Error('No source function')),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);

        if (await this.validateFavicon(faviconUrl)) {
          // Cache the successful result
          if (useCache) {
            await this.cacheFavicon(cacheKey, faviconUrl);
          }

          return {
            url: faviconUrl,
            source: ['google', 'clearbit', 'duckduckgo', 'direct'][index] as any,
            cached: false,
            size
          };
        }
      } catch (error) {
        console.warn(`Favicon source ${index} failed for ${normalizedDomain}:`, error);
        continue;
      }
    }

    // Fallback to generic icon
    if (fallbackToGeneric) {
      return {
        url: this.getGenericFavicon(normalizedDomain),
        source: 'fallback',
        cached: false,
        size
      };
    }

    throw new Error(`No favicon found for domain: ${normalizedDomain}`);
  }

  /**
   * Google Favicon API (most reliable)
   */
  private async getGoogleFavicon(domain: string, size: number): Promise<string> {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  }

  /**
   * Clearbit Logo API (high quality)
   */
  private async getClearbitFavicon(domain: string, size: number): Promise<string> {
    return `https://logo.clearbit.com/${domain}?size=${size}`;
  }

  /**
   * DuckDuckGo Favicon API (privacy-focused)
   */
  private async getDuckDuckGoFavicon(domain: string, size: number): Promise<string> {
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  }

  /**
   * Direct favicon.ico fetch
   */
  private async getDirectFavicon(domain: string): Promise<string> {
    const possiblePaths = [
      `https://${domain}/favicon.ico`,
      `https://${domain}/favicon.png`,
      `https://${domain}/apple-touch-icon.png`,
      `https://www.${domain}/favicon.ico`,
    ];

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          return path;
        }
      } catch {
        continue;
      }
    }

    throw new Error('No direct favicon found');
  }

  /**
   * Validate that a favicon URL returns a valid image
   */
  private async validateFavicon(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && Boolean(
        contentType?.includes('image') ||
        contentType?.includes('icon')
      );
    } catch {
      return false;
    }
  }

  /**
   * Get cached favicon from Supabase Storage
   */
  private async getCachedFavicon(cacheKey: string): Promise<string | null> {
    try {
      const { data } = await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(`${cacheKey}.png`);

      // Verify the file exists (with timeout to prevent hanging)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      try {
        const response = await fetch(data.publicUrl, {
          method: 'HEAD',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response.ok ? data.publicUrl : null;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        return null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Cache favicon in Supabase Storage
   */
  private async cacheFavicon(cacheKey: string, faviconUrl: string): Promise<void> {
    try {
      // Download the favicon
      const response = await fetch(faviconUrl);
      if (!response.ok) return;

      const blob = await response.blob();
      
      // Upload to Supabase Storage
      await this.supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(`${cacheKey}.png`, blob, {
          contentType: 'image/png',
          upsert: true
        });
    } catch (error) {
      console.warn('Failed to cache favicon:', error);
    }
  }

  /**
   * Generate a generic favicon based on domain
   */
  private getGenericFavicon(domain: string): string {
    // Use a service that generates letter-based favicons
    const letter = domain.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${letter}&size=32&background=6366f1&color=ffffff&format=png`;
  }

  /**
   * Normalize domain (remove protocol, www, etc.)
   */
  private normalizeDomain(domain: string): string {
    if (!domain) return '';
    return domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0] || ''
      .toLowerCase();
  }

  /**
   * Ensure the favicons bucket exists
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.STORAGE_BUCKET);
      
      if (!bucketExists) {
        await this.supabase.storage.createBucket(this.STORAGE_BUCKET, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/x-icon'],
          fileSizeLimit: 1024 * 1024 // 1MB
        });
      }
    } catch (error) {
      console.warn('Failed to ensure favicon bucket exists:', error);
    }
  }

  /**
   * Bulk process favicons for multiple domains
   */
  async bulkProcessFavicons(domains: string[], options: FaviconOptions = {}): Promise<Map<string, FaviconResult>> {
    const results = new Map<string, FaviconResult>();
    const promises = domains.map(async (domain) => {
      try {
        const result = await this.getFavicon(domain, options);
        results.set(domain, result);
      } catch (error) {
        console.warn(`Failed to process favicon for ${domain}:`, error);
      }
    });

    await Promise.allSettled(promises);
    return results;
  }
}

// Export singleton instance
export const faviconService = new FaviconService();
