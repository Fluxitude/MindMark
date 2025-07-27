import { NextRequest, NextResponse } from 'next/server';
import { screenshotService } from '@mindmark/content/services/screenshot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, ...options } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    try {
      const result = await screenshotService.captureScreenshot(url, options);
      return NextResponse.json(result);
    } catch (screenshotError) {
      // If screenshot service fails, return a fallback response
      console.warn('Screenshot service failed, returning fallback:', screenshotError);

      return NextResponse.json({
        url: `https://via.placeholder.com/800x400/f3f4f6/6b7280?text=${encodeURIComponent(new URL(url).hostname)}`,
        thumbnails: {
          small: `https://via.placeholder.com/200x100/f3f4f6/6b7280?text=${encodeURIComponent(new URL(url).hostname)}`,
          medium: `https://via.placeholder.com/400x200/f3f4f6/6b7280?text=${encodeURIComponent(new URL(url).hostname)}`,
          large: `https://via.placeholder.com/800x400/f3f4f6/6b7280?text=${encodeURIComponent(new URL(url).hostname)}`
        },
        source: 'fallback',
        cached: false,
        size: 0
      });
    }
  } catch (error) {
    console.error('Screenshot API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to capture screenshot';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
