import type { ImageBlock as ImageBlockType } from '@/types/presentation';
import { ImageIcon } from 'lucide-react';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  if (!block.src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2"
        style={{
          backgroundColor: 'var(--df-surface)',
          borderRadius: 'var(--df-radius)',
          color: 'var(--df-muted)',
        }}
      >
        <ImageIcon className="w-10 h-10" />
        <span className="text-sm">
          {block.alt || 'Image placeholder'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={block.src}
      alt={block.alt}
      className="w-full h-full"
      style={{
        objectFit: block.objectFit || 'cover',
        borderRadius: 'var(--df-radius)',
      }}
      draggable={false}
    />
  );
}
