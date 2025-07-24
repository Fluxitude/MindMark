// MindMark URL Validation Utilities
// Validate and normalize URLs for bookmark creation

export interface URLValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
  metadata?: {
    protocol: string;
    hostname: string;
    pathname: string;
    isSecure: boolean;
  };
}

/**
 * Validate and normalize a URL for bookmark creation
 */
export function validateAndNormalizeUrl(url: string): URLValidationResult {
  try {
    // Remove leading/trailing whitespace
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return {
        isValid: false,
        error: "URL cannot be empty",
      };
    }

    // Check if URL already has a protocol
    let normalizedUrl = trimmedUrl;
    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(normalizedUrl);

    if (hasProtocol) {
      // Validate protocol if already present
      const protocolMatch = normalizedUrl.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//i);
      if (protocolMatch && protocolMatch[1]) {
        const protocol = protocolMatch[1].toLowerCase();
        if (!["http", "https"].includes(protocol)) {
          return {
            isValid: false,
            error: "Only HTTP and HTTPS URLs are supported",
          };
        }
      }
    } else {
      // Add https protocol if missing
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Parse URL
    const parsedUrl = new URL(normalizedUrl);

    // Validate hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0 || parsedUrl.hostname === "") {
      return {
        isValid: false,
        error: "Invalid hostname",
      };
    }

    // Check for localhost/private IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = parsedUrl.hostname.toLowerCase();
      const privatePatterns = [
        /^localhost$/,
        /^127\./,
        /^192\.168\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/,
      ];

      if (privatePatterns.some(pattern => pattern.test(hostname))) {
        return {
          isValid: false,
          error: "Private/local URLs are not allowed",
        };
      }
    }

    // Normalize URL (remove fragment, sort query params)
    const finalUrl = new URL(parsedUrl.href);
    finalUrl.hash = ""; // Remove fragment

    // Sort query parameters for consistency
    const sortedParams = new URLSearchParams();
    Array.from(finalUrl.searchParams.keys())
      .sort()
      .forEach(key => {
        finalUrl.searchParams.getAll(key).forEach(value => {
          sortedParams.append(key, value);
        });
      });
    finalUrl.search = sortedParams.toString();

    return {
      isValid: true,
      normalizedUrl: finalUrl.href,
      metadata: {
        protocol: finalUrl.protocol,
        hostname: finalUrl.hostname,
        pathname: finalUrl.pathname,
        isSecure: finalUrl.protocol === "https:",
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid URL format",
    };
  }
}

/**
 * Extract domain from URL for duplicate detection
 */
export function extractDomain(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Check if URL is likely a social media post
 */
export function isSocialMediaUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const socialDomains = [
      "twitter.com",
      "x.com",
      "facebook.com",
      "instagram.com",
      "linkedin.com",
      "tiktok.com",
      "youtube.com",
      "reddit.com",
      "pinterest.com",
      "snapchat.com",
      "discord.com",
      "telegram.org",
      "whatsapp.com",
    ];

    return socialDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Check if URL is likely a development/documentation site
 */
export function isDevelopmentUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const devDomains = [
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "stackoverflow.com",
      "stackexchange.com",
      "developer.mozilla.org",
      "docs.microsoft.com",
      "aws.amazon.com",
      "cloud.google.com",
      "vercel.com",
      "netlify.com",
      "heroku.com",
      "npmjs.com",
      "pypi.org",
      "packagist.org",
    ];

    return devDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Suggest content type based on URL
 */
export function suggestContentType(url: string): "webpage" | "article" | "video" | "document" | "tool" | "reference" {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    // Video platforms
    if (hostname.includes("youtube.com") || hostname.includes("vimeo.com") || hostname.includes("twitch.tv")) {
      return "video";
    }

    // Documentation sites
    if (isDevelopmentUrl(url) || hostname.includes("docs.") || pathname.includes("/docs/")) {
      return "reference";
    }

    // Tools and applications
    if (hostname.includes("app.") || pathname.includes("/app/") || pathname.includes("/tool/")) {
      return "tool";
    }

    // Document formats
    if (pathname.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/)) {
      return "document";
    }

    // Articles (blogs, news sites)
    if (pathname.includes("/blog/") || pathname.includes("/article/") || pathname.includes("/post/")) {
      return "article";
    }

    // Default to webpage
    return "webpage";
  } catch {
    return "webpage";
  }
}
