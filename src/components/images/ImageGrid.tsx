'use client';

import Image from 'next/image';

export interface ImageGridItem {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
}

interface ImageGridProps {
  images: ImageGridItem[];
  onSelect: (url: string, alt: string) => void;
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted animate-pulse" />
  );
}

export default function ImageGrid({ images, onSelect, loading }: ImageGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image) => (
        <button
          key={image.id}
          type="button"
          className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={() => onSelect(image.url, image.alt)}
        >
          <Image
            src={image.thumbUrl}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 200px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-[11px] text-white truncate font-medium">
              {image.photographer}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
