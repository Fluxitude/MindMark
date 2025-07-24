// MindMark URL Validation Tests
// Test URL validation and normalization utilities

import { describe, it, expect } from "vitest";
import {
  validateAndNormalizeUrl,
  extractDomain,
  isSocialMediaUrl,
  isDevelopmentUrl,
  suggestContentType,
} from "./url-validation";

describe("validateAndNormalizeUrl", () => {
  it("should validate and normalize valid URLs", () => {
    const result = validateAndNormalizeUrl("https://example.com");
    
    expect(result.isValid).toBe(true);
    expect(result.normalizedUrl).toBe("https://example.com/");
    expect(result.metadata).toEqual({
      protocol: "https:",
      hostname: "example.com",
      pathname: "/",
      isSecure: true,
    });
  });

  it("should add https protocol to URLs without protocol", () => {
    const result = validateAndNormalizeUrl("example.com");
    
    expect(result.isValid).toBe(true);
    expect(result.normalizedUrl).toBe("https://example.com/");
  });

  it("should normalize URLs by removing fragments", () => {
    const result = validateAndNormalizeUrl("https://example.com/page#section");
    
    expect(result.isValid).toBe(true);
    expect(result.normalizedUrl).toBe("https://example.com/page");
  });

  it("should sort query parameters", () => {
    const result = validateAndNormalizeUrl("https://example.com?z=1&a=2&m=3");
    
    expect(result.isValid).toBe(true);
    expect(result.normalizedUrl).toBe("https://example.com/?a=2&m=3&z=1");
  });

  it("should reject empty URLs", () => {
    const result = validateAndNormalizeUrl("");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("URL cannot be empty");
  });

  it("should reject URLs with invalid protocols", () => {
    const result = validateAndNormalizeUrl("ftp://example.com");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Only HTTP and HTTPS URLs are supported");
  });

  it("should reject URLs without hostname", () => {
    const result = validateAndNormalizeUrl("https://");

    expect(result.isValid).toBe(false);
    expect(result.error).toContain("cannot be parsed as a URL");
  });

  it("should handle malformed URLs", () => {
    const result = validateAndNormalizeUrl("not a url with spaces");

    expect(result.isValid).toBe(false);
    expect(result.error).toContain("cannot be parsed as a URL");
  });
});

describe("extractDomain", () => {
  it("should extract domain from valid URL", () => {
    const domain = extractDomain("https://www.example.com/path");
    expect(domain).toBe("www.example.com");
  });

  it("should return null for invalid URL", () => {
    const domain = extractDomain("not-a-url");
    expect(domain).toBe(null);
  });

  it("should normalize domain to lowercase", () => {
    const domain = extractDomain("https://EXAMPLE.COM");
    expect(domain).toBe("example.com");
  });
});

describe("isSocialMediaUrl", () => {
  it("should identify Twitter URLs", () => {
    expect(isSocialMediaUrl("https://twitter.com/user")).toBe(true);
    expect(isSocialMediaUrl("https://x.com/user")).toBe(true);
  });

  it("should identify Facebook URLs", () => {
    expect(isSocialMediaUrl("https://facebook.com/page")).toBe(true);
    expect(isSocialMediaUrl("https://www.facebook.com/page")).toBe(true);
  });

  it("should identify YouTube URLs", () => {
    expect(isSocialMediaUrl("https://youtube.com/watch?v=123")).toBe(true);
    expect(isSocialMediaUrl("https://www.youtube.com/watch?v=123")).toBe(true);
  });

  it("should not identify non-social URLs", () => {
    expect(isSocialMediaUrl("https://example.com")).toBe(false);
    expect(isSocialMediaUrl("https://github.com")).toBe(false);
  });

  it("should handle invalid URLs", () => {
    expect(isSocialMediaUrl("not-a-url")).toBe(false);
  });
});

describe("isDevelopmentUrl", () => {
  it("should identify GitHub URLs", () => {
    expect(isDevelopmentUrl("https://github.com/user/repo")).toBe(true);
  });

  it("should identify Stack Overflow URLs", () => {
    expect(isDevelopmentUrl("https://stackoverflow.com/questions/123")).toBe(true);
  });

  it("should identify MDN URLs", () => {
    expect(isDevelopmentUrl("https://developer.mozilla.org/docs")).toBe(true);
  });

  it("should not identify non-development URLs", () => {
    expect(isDevelopmentUrl("https://example.com")).toBe(false);
    expect(isDevelopmentUrl("https://twitter.com")).toBe(false);
  });
});

describe("suggestContentType", () => {
  it("should suggest video for YouTube URLs", () => {
    expect(suggestContentType("https://youtube.com/watch?v=123")).toBe("video");
    expect(suggestContentType("https://vimeo.com/123")).toBe("video");
  });

  it("should suggest reference for documentation URLs", () => {
    expect(suggestContentType("https://docs.example.com")).toBe("reference");
    expect(suggestContentType("https://github.com/user/repo")).toBe("reference");
  });

  it("should suggest tool for app URLs", () => {
    expect(suggestContentType("https://app.example.com")).toBe("tool");
    expect(suggestContentType("https://example.com/app/")).toBe("tool");
  });

  it("should suggest document for file URLs", () => {
    expect(suggestContentType("https://example.com/file.pdf")).toBe("document");
    expect(suggestContentType("https://example.com/doc.docx")).toBe("document");
  });

  it("should suggest article for blog URLs", () => {
    expect(suggestContentType("https://example.com/blog/post")).toBe("article");
    expect(suggestContentType("https://example.com/article/123")).toBe("article");
  });

  it("should default to webpage for unknown URLs", () => {
    expect(suggestContentType("https://example.com")).toBe("webpage");
    expect(suggestContentType("https://unknown-site.com/page")).toBe("webpage");
  });

  it("should handle invalid URLs", () => {
    expect(suggestContentType("not-a-url")).toBe("webpage");
  });
});
