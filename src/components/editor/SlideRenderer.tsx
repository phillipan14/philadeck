'use client';

import type { Slide, ThemeProperties } from '@/types/presentation';
import { getThemeCSSVars } from '@/lib/themes';
import { RenderBlock } from './content-blocks';

interface SlideRendererProps {
  slide: Slide;
  theme: ThemeProperties;
  scale?: number;
  editable?: boolean;
  onBlockClick?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

function getBackgroundStyle(slide: Slide, fallback: string): string {
  if (!slide.background?.value) return fallback;

  switch (slide.background.type) {
    case 'solid':
      return slide.background.value;
    case 'gradient':
      return slide.background.value;
    case 'image':
      return `url(${slide.background.value}) center/cover no-repeat`;
    default:
      return fallback;
  }
}

export default function SlideRenderer({
  slide,
  theme,
  scale = 1,
  editable = false,
  onBlockClick,
  selectedBlockId = null,
}: SlideRendererProps) {
  const cssVars = getThemeCSSVars(theme);
  const bg = getBackgroundStyle(slide, theme.colors.background);

  // Determine if background is a simple color or a complex value (gradient/image)
  const isSimpleColor = slide.background?.type === 'solid' || !slide.background?.value;
  const backgroundStyle = isSimpleColor
    ? { backgroundColor: bg }
    : { background: bg };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...cssVars,
        ...backgroundStyle,
        width: `${960 * scale}px`,
        height: `${540 * scale}px`,
        transformOrigin: 'top left',
      }}
    >
      {slide.content.map((block) => {
        const isSelected = selectedBlockId === block.id;

        return (
          <div
            key={block.id}
            className={`absolute ${
              editable ? 'cursor-pointer transition-shadow duration-150' : ''
            }`}
            style={{
              left: `${block.position.x}%`,
              top: `${block.position.y}%`,
              width: `${block.position.width}%`,
              height: `${block.position.height}%`,
              padding: `${4 * scale}px`,
              outline: isSelected
                ? '2px solid #3B82F6'
                : editable
                  ? '1px dashed transparent'
                  : 'none',
              outlineOffset: '2px',
              borderRadius: isSelected ? '4px' : undefined,
            }}
            onClick={
              editable && onBlockClick
                ? (e) => {
                    e.stopPropagation();
                    onBlockClick(block.id);
                  }
                : undefined
            }
            onMouseEnter={
              editable && !isSelected
                ? (e) => {
                    (e.currentTarget as HTMLElement).style.outline =
                      '1px dashed var(--df-muted)';
                  }
                : undefined
            }
            onMouseLeave={
              editable && !isSelected
                ? (e) => {
                    (e.currentTarget as HTMLElement).style.outline =
                      '1px dashed transparent';
                  }
                : undefined
            }
          >
            <RenderBlock block={block} editable={editable && isSelected} />
          </div>
        );
      })}
    </div>
  );
}
