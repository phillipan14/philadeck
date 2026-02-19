'use client';

import type { TextBlock as TextBlockType } from '@/types/presentation';
import { useCallback, useRef } from 'react';

interface TextBlockProps {
  block: TextBlockType;
  editable?: boolean;
  onUpdate?: (content: string) => void;
}

const textStyleMap: Record<
  TextBlockType['textStyle'],
  { fontSize: string; fontWeight: string; colorVar: string; fontVar: string; lineHeight: string }
> = {
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    colorVar: 'var(--df-heading)',
    fontVar: 'var(--df-font-heading)',
    lineHeight: '1.1',
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: '400',
    colorVar: 'var(--df-text)',
    fontVar: 'var(--df-font-body)',
    lineHeight: '1.4',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    colorVar: 'var(--df-heading)',
    fontVar: 'var(--df-font-heading)',
    lineHeight: '1.2',
  },
  body: {
    fontSize: '1rem',
    fontWeight: '400',
    colorVar: 'var(--df-text)',
    fontVar: 'var(--df-font-body)',
    lineHeight: '1.6',
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: '400',
    colorVar: 'var(--df-text)',
    fontVar: 'var(--df-font-body)',
    lineHeight: '1.5',
  },
};

export default function TextBlock({ block, editable = false, onUpdate }: TextBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const style = textStyleMap[block.textStyle];

  const handleBlur = useCallback(() => {
    if (ref.current && onUpdate) {
      onUpdate(ref.current.textContent || '');
    }
  }, [onUpdate]);

  return (
    <div
      ref={ref}
      className="w-full h-full outline-none"
      style={{
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.colorVar,
        fontFamily: style.fontVar,
        lineHeight: style.lineHeight,
        textAlign: block.alignment,
      }}
      contentEditable={editable}
      suppressContentEditableWarning={editable}
      onBlur={editable ? handleBlur : undefined}
    >
      {block.content}
    </div>
  );
}
