import type { ListBlock as ListBlockType } from '@/types/presentation';
import { Check } from 'lucide-react';

interface ListBlockProps {
  block: ListBlockType;
}

export default function ListBlock({ block }: ListBlockProps) {
  const baseStyle = {
    fontFamily: 'var(--df-font-body)',
    color: 'var(--df-text)',
    fontSize: '1rem',
    lineHeight: '1.8',
  };

  if (block.variant === 'numbered') {
    return (
      <ol className="w-full h-full list-decimal pl-6 space-y-1" style={baseStyle}>
        {block.items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    );
  }

  if (block.variant === 'checklist') {
    return (
      <ul className="w-full h-full space-y-2" style={baseStyle}>
        {block.items.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <span
              className="mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
              style={{
                backgroundColor: 'var(--df-primary)',
                color: 'var(--df-background)',
              }}
            >
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Default: bullet
  return (
    <ul className="w-full h-full list-disc pl-6 space-y-1" style={baseStyle}>
      {block.items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
