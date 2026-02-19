import { NextRequest, NextResponse } from 'next/server';

interface UnsplashSearchResult {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
  };
  links: {
    download: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashSearchResult[];
  total: number;
  total_pages: number;
}

function generatePlaceholders(query: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${query}-${i}`,
    url: `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(query)}`,
    thumbUrl: `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(query)}`,
    alt: query,
    photographer: 'Placeholder',
    downloadUrl: `https://placehold.co/1600x1200/e2e8f0/64748b?text=${encodeURIComponent(query)}`,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, page = 1, perPage = 12 } = body as {
      query: string;
      page?: number;
      perPage?: number;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 },
      );
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      // Fallback: return placeholder images when no API key is configured
      const placeholders = generatePlaceholders(query, perPage);
      return NextResponse.json(placeholders);
    }

    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Unsplash API error: ${response.status} ${response.statusText}`,
      );
      // Fall back to placeholders on API error
      const placeholders = generatePlaceholders(query, perPage);
      return NextResponse.json(placeholders);
    }

    const data: UnsplashSearchResponse = await response.json();

    const images = data.results.map((result) => ({
      id: result.id,
      url: result.urls.regular,
      thumbUrl: result.urls.thumb,
      alt: result.alt_description || query,
      photographer: result.user.name,
      downloadUrl: result.links.download,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json(
      { error: 'Failed to search images' },
      { status: 500 },
    );
  }
}
