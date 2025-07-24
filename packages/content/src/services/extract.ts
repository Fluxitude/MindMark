// Content Extraction Service
// Web content scraping and analysis with Firecrawl

import FirecrawlApp from "@mendable/firecrawl-js";

export interface ExtractedContent {
  title: string;
  description?: string;
  content: string;
  markdown: string;
  metadata: {
    url: string;
    favicon?: string;
    image?: string;
    author?: string;
    publishedDate?: string;
    wordCount: number;
    language: string;
  };
  screenshot?: string;
}

export interface ExtractionOptions {
  includeScreenshot?: boolean;
  extractImages?: boolean;
  waitFor?: number;
  timeout?: number;
}

export class ContentExtractor {
  private firecrawl: FirecrawlApp;

  constructor(apiKey?: string) {
    if (!apiKey && !process.env.FIRECRAWL_API_KEY) {
      throw new Error("Firecrawl API key is required");
    }

    this.firecrawl = new FirecrawlApp({
      apiKey: apiKey || process.env.FIRECRAWL_API_KEY!,
    });
  }

  async extractContent(
    url: string,
    options: ExtractionOptions = {}
  ): Promise<ExtractedContent> {
    const { includeScreenshot = false } = options;

    try {
      // Simplified implementation for now - will be enhanced once Firecrawl API is properly configured
      const scrapeResult = await this.firecrawl.scrapeUrl(url);

      if (!scrapeResult.success) {
        throw new Error(
          `Failed to scrape URL: ${scrapeResult.error || "Unknown error"}`
        );
      }

      const data = scrapeResult as any; // Type assertion for now

      // Extract metadata
      const metadata = {
        url,
        favicon: data.metadata?.favicon,
        image: data.metadata?.ogImage || data.metadata?.image,
        author: data.metadata?.author,
        publishedDate: data.metadata?.publishedTime,
        wordCount: this.countWords(data.markdown || ""),
        language: data.metadata?.language || "en",
      };

      return {
        title: data.metadata?.title || "Untitled",
        description: data.metadata?.description,
        content: data.html || "",
        markdown: data.markdown || "",
        metadata,
        screenshot: includeScreenshot ? data.screenshot : undefined,
      };
    } catch (error) {
      console.error("Content extraction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to extract content from ${url}: ${errorMessage}`);
    }
  }

  async extractMultipleUrls(
    urls: string[],
    options: ExtractionOptions = {}
  ): Promise<ExtractedContent[]> {
    const results = await Promise.allSettled(
      urls.map((url) => this.extractContent(url, options))
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<ExtractedContent> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  }

  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  async getPageScreenshot(url: string): Promise<string | null> {
    try {
      const result = await this.firecrawl.scrapeUrl(url, {
        formats: ["markdown"],
      });

      return result.success ? null : null; // Screenshot functionality to be implemented
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      return null;
    }
  }
}
