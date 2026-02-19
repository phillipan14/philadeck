'use client';

import { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePresentationStore } from '@/stores/presentation-store';
import { getTheme } from '@/lib/themes/presets';
import type { Slide, SlideLayout, TextBlock } from '@/types/presentation';

function SlideThumbnail({
  slide,
  index,
  isSelected,
  themeId,
  onClick,
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  themeId: string;
  onClick: () => void;
}) {
  const theme = getTheme(themeId);
  const bgColor =
    slide.background.type === 'solid' && slide.background.value
      ? slide.background.value
      : theme.colors.background;

  // Extract text content for preview
  const titleBlock = slide.content.find(
    (b) => b.type === 'text' && (b as TextBlock).textStyle === 'title',
  ) as TextBlock | undefined;
  const headingBlock = slide.content.find(
    (b) => b.type === 'text' && (b as TextBlock).textStyle === 'heading',
  ) as TextBlock | undefined;
  const bodyBlock = slide.content.find(
    (b) =>
      b.type === 'text' &&
      (b as TextBlock).textStyle !== 'title' &&
      (b as TextBlock).textStyle !== 'heading',
  ) as TextBlock | undefined;

  const displayTitle = titleBlock?.content || headingBlock?.content || '';
  const displayBody = bodyBlock?.content || '';

  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-start gap-2 p-1.5 rounded-lg transition-all duration-200 ease-out ${
        isSelected
          ? 'bg-primary/[0.04] dark:bg-primary/[0.08]'
          : 'hover:bg-muted/50'
      }`}
    >
      {/* Left accent bar for selected state */}
      <div className={`absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full transition-all duration-200 ${
        isSelected ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'
      }`} />
      <span className={`text-[10px] font-medium mt-1 w-4 text-right flex-shrink-0 transition-colors duration-200 ${
        isSelected ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {index + 1}
      </span>
      <div
        className={`relative w-full aspect-video rounded-lg border overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'border-primary/40 shadow-sm'
            : 'border-zinc-200/60 dark:border-zinc-700/60 group-hover:border-zinc-300 dark:group-hover:border-zinc-600'
        }`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Mini preview content */}
        <div className="absolute inset-0 p-2 flex flex-col justify-center overflow-hidden">
          {displayTitle && (
            <p
              className="text-[6px] font-semibold leading-tight truncate"
              style={{ color: theme.colors.heading }}
            >
              {displayTitle}
            </p>
          )}
          {displayBody && (
            <p
              className="text-[5px] leading-tight mt-0.5 truncate opacity-70"
              style={{ color: theme.colors.text }}
            >
              {displayBody}
            </p>
          )}
          {!displayTitle && !displayBody && (
            <div className="flex items-center justify-center h-full">
              <span
                className="text-[5px] opacity-40"
                style={{ color: theme.colors.muted }}
              >
                Empty slide
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function SlidePanel() {
  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const selectSlide = usePresentationStore((s) => s.selectSlide);
  const addSlide = usePresentationStore((s) => s.addSlide);

  const selectedSlide = presentation?.slides.find(
    (s) => s.id === selectedSlideId,
  );

  const handleAddSlide = useCallback(
    (layout: SlideLayout) => {
      const currentIndex = selectedSlide?.index;
      addSlide(layout, currentIndex);
    },
    [addSlide, selectedSlide],
  );

  if (!presentation) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Slides
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums">
          {presentation.slides.length}
        </span>
      </div>

      <ScrollArea className="flex-1 relative">
        <div className="p-2 space-y-1 pb-4">
          {presentation.slides.map((slide, index) => (
            <SlideThumbnail
              key={slide.id}
              slide={slide}
              index={index}
              isSelected={slide.id === selectedSlideId}
              themeId={presentation.themeId}
              onClick={() => selectSlide(slide.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-zinc-200/80 dark:border-zinc-700/80 text-zinc-400 dark:text-zinc-500 hover:border-primary/40 hover:text-primary hover:bg-primary/[0.03] dark:hover:bg-primary/[0.06] transition-all duration-200 group">
              <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs font-medium">Add Slide</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top">
            <DropdownMenuItem onClick={() => handleAddSlide('title')}>
              Title Slide
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSlide('title-content')}>
              Title + Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSlide('two-column')}>
              Two Columns
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSlide('section-header')}>
              Section Header
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAddSlide('content-image-right')}
            >
              Content + Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSlide('blank')}>
              Blank
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
