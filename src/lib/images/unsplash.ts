export interface UnsplashImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  downloadUrl: string;
}

export async function searchImages(
  query: string,
  page = 1,
  perPage = 12,
): Promise<UnsplashImage[]> {
  const res = await fetch('/api/images/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, page, perPage }),
  });
  if (!res.ok) return [];
  return res.json();
}
