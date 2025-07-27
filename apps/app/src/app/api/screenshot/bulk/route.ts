import { NextRequest, NextResponse } from 'next/server';
import { screenshotService } from '@mindmark/content/services/screenshot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, ...options } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    if (urls.length === 0) {
      return NextResponse.json({});
    }

    // Validate URL formats
    for (const url of urls) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: `Invalid URL format: ${url}` },
          { status: 400 }
        );
      }
    }

    // Limit bulk requests to prevent abuse
    if (urls.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 URLs allowed per bulk request' },
        { status: 400 }
      );
    }

    const results = await screenshotService.bulkCaptureScreenshots(urls, options);
    
    // Convert Map to Object for JSON serialization
    const resultsObject = Object.fromEntries(results);
    
    return NextResponse.json(resultsObject);
  } catch (error) {
    console.error('Bulk screenshot API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to capture screenshots';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
