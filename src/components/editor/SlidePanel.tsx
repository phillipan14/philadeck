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
      className={`group relative w-full flex items-start gap-2 p-1.5 rounded-lg transition-colors ${
        isSelected
          ? 'bg-accent'
          : 'hover:bg-muted/50'
      }`}
    >
      <span className="text-[10px] text-muted-foreground font-medium mt-1 w-4 text-right flex-shrink-0">
        {index + 1}
      </span>
      <div
        className={`relative w-full aspect-video rounded-md border overflow-hidden transition-shadow ${
          isSelected
            ? 'border-primary ring-2 ring-primary/20 shadow-sm'
            : 'border-border group-hover:border-muted-foreground/30'
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
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Slides
        </span>
        <span className="text-xs text-muted-foreground">
          {presentation.slides.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
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

      <div className="p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs">Add Slide</span>
            </Button>
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
