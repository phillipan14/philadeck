import type { QuoteBlock as QuoteBlockType } from '@/types/presentation';

interface QuoteBlockProps {
  block: QuoteBlockType;
}

export default function QuoteBlock({ block }: QuoteBlockProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <blockquote
        className="pl-6"
        style={{
          borderLeft: '4px solid var(--df-primary)',
        }}
      >
        <p
          className="italic"
          style={{
            fontFamily: 'var(--df-font-heading)',
            color: 'var(--df-heading)',
            fontSize: '1.5rem',
            lineHeight: '1.5',
          }}
        >
          &ldquo;{block.text}&rdquo;
        </p>
        {block.attribution && (
          <footer
            className="mt-3"
            style={{
              fontFamily: 'var(--df-font-body)',
              color: 'var(--df-muted)',
              fontSize: '0.95rem',
            }}
          >
            &mdash; {block.attribution}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
