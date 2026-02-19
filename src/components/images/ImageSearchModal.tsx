'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageGrid from '@/components/images/ImageGrid';
import { searchImages } from '@/lib/images/unsplash';
import type { UnsplashImage } from '@/lib/images/unsplash';

interface ImageSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, alt: string) => void;
  initialQuery?: string;
}

export default function ImageSearchModal({
  open,
  onOpenChange,
  onSelect,
  initialQuery = '',
}: ImageSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (searchQuery: string, searchPage: number, append: boolean) => {
    if (!searchQuery.trim()) {
      setImages([]);
      setSearched(false);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const results = await searchImages(searchQuery.trim(), searchPage, 12);
      if (append) {
        setImages((prev) => [...prev, ...results]);
      } else {
        setImages(results);
      }
      setHasMore(results.length === 12);
      setSearched(true);
    } catch {
      if (!append) {
        setImages([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search on query change
  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPage(1);
      performSearch(query, 1, false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, open, performSearch]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setImages([]);
      setPage(1);
      setHasMore(true);
      setSearched(false);
    }
  }, [open, initialQuery]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(query, nextPage, true);
  };

  const handleSelect = (url: string, alt: string) => {
    onSelect(url, alt);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-1.5">
          <DialogTitle>Search Images</DialogTitle>
          <DialogDescription>
            Search for free images from Unsplash
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images..."
              className="pl-9 h-10"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 px-6 pb-6" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          <div className="space-y-4">
            <ImageGrid
              images={images}
              onSelect={handleSelect}
              loading={loading}
            />

            {searched && !loading && images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No images found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Try a different search term
                </p>
              </div>
            )}

            {!searched && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Type to search for images
                </p>
              </div>
            )}

            {hasMore && images.length > 0 && !loading && (
              <div className="flex justify-center pt-2 pb-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
