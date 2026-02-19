'use client';

import { useState, useCallback } from 'react';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import GeneratingOverlay from './GeneratingOverlay';
import type { Presentation, Slide, ContentBlock, SlideLayout } from '@/types/presentation';
import { getStoredKeys } from './APIKeySettings';

interface OutlineSlide {
  title: string;
  bullets: string[];
  layout: string;
  imageQuery?: string;
  speakerNotes?: string;
}

interface OutlineData {
  title: string;
  description: string;
  themeId: string;
  slides: OutlineSlide[];
}

interface OutlineEditorProps {
  outline: OutlineData;
  provider: string;
  onComplete: (presentation: Presentation) => void;
  onBack: () => void;
}

function buildContentBlocks(
  slideData: OutlineSlide,
  layout: SlideLayout,
): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Title block for all layouts
  blocks.push({
    id: `block_${nanoid(8)}`,
    type: 'text',
    content: slideData.title,
    textStyle: layout === 'title' || layout === 'section-header' ? 'title' : 'heading',
    alignment: layout === 'title' || layout === 'section-header' ? 'center' : 'left',
    position: {
      x: layout === 'title' || layout === 'section-header' ? 10 : 5,
      y: layout === 'title' ? 30 : layout === 'section-header' ? 35 : 5,
      width: layout === 'title' || layout === 'section-header' ? 80 : 90,
      height: layout === 'title' ? 20 : 12,
    },
  });

  // Bullet list for layouts that have content
  if (
    slideData.bullets.length > 0 &&
    layout !== 'title' &&
    layout !== 'section-header' &&
    layout !== 'image-full'
  ) {
    const isImageLayout =
      layout === 'content-image-right' || layout === 'content-image-left';
    const isLeftImage = layout === 'content-image-left';

    blocks.push({
      id: `block_${nanoid(8)}`,
      type: 'list',
      variant: 'bullet',
      items: slideData.bullets.map((text) => ({
        id: nanoid(6),
        text,
      })),
      position: {
        x: isImageLayout ? (isLeftImage ? 50 : 5) : 5,
        y: 22,
        width: isImageLayout ? 45 : layout === 'two-column' ? 42 : 90,
        height: 70,
      },
    });

    // Second column for two-column layout
    if (layout === 'two-column' && slideData.bullets.length > 2) {
      const half = Math.ceil(slideData.bullets.length / 2);
      // Reassign the first list to only the first half
      const firstList = blocks[blocks.length - 1];
      if (firstList.type === 'list') {
        const allItems = firstList.items;
        firstList.items = allItems.slice(0, half);

        blocks.push({
          id: `block_${nanoid(8)}`,
          type: 'list',
          variant: 'bullet',
          items: allItems.slice(half),
          position: { x: 53, y: 22, width: 42, height: 70 },
        });
      }
    }

    // Image block for image layouts
    if (isImageLayout) {
      blocks.push({
        id: `block_${nanoid(8)}`,
        type: 'image',
        src: '',
        alt: slideData.imageQuery || slideData.title,
        query: slideData.imageQuery || slideData.title,
        position: {
          x: isLeftImage ? 5 : 55,
          y: 5,
          width: 40,
          height: 87,
        },
      });
    }
  }

  // Subtitle on title slide
  if (layout === 'title' && slideData.bullets.length > 0) {
    blocks.push({
      id: `block_${nanoid(8)}`,
      type: 'text',
      content: slideData.bullets[0],
      textStyle: 'subtitle',
      alignment: 'center',
      position: { x: 20, y: 55, width: 60, height: 10 },
    });
  }

  return blocks;
}

export default function OutlineEditor({
  outline,
  provider,
  onComplete,
  onBack,
}: OutlineEditorProps) {
  const [slides, setSlides] = useState<OutlineSlide[]>(outline.slides);
  const [generating, setGenerating] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedThumbnails, setCompletedThumbnails] = useState<
    Array<{ title: string; layout: string }>
  >([]);

  const moveSlide = useCallback((fromIndex: number, direction: -1 | 1) => {
    const toIndex = fromIndex + direction;
    setSlides((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const deleteSlide = useCallback((index: number) => {
    setSlides((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateSlideTitle = useCallback((index: number, title: string) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title } : s)),
    );
  }, []);

  const updateBullet = useCallback(
    (slideIndex: number, bulletIndex: number, text: string) => {
      setSlides((prev) =>
        prev.map((s, i) => {
          if (i !== slideIndex) return s;
          const bullets = [...s.bullets];
          bullets[bulletIndex] = text;
          return { ...s, bullets };
        }),
      );
    },
    [],
  );

  const removeBullet = useCallback(
    (slideIndex: number, bulletIndex: number) => {
      setSlides((prev) =>
        prev.map((s, i) => {
          if (i !== slideIndex) return s;
          return { ...s, bullets: s.bullets.filter((_, bi) => bi !== bulletIndex) };
        }),
      );
    },
    [],
  );

  const addBullet = useCallback((slideIndex: number) => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== slideIndex) return s;
        return { ...s, bullets: [...s.bullets, ''] };
      }),
    );
  }, []);

  const addSlide = useCallback(() => {
    setSlides((prev) => [
      ...prev,
      {
        title: 'New Slide',
        bullets: ['Point 1'],
        layout: 'title-content',
      },
    ]);
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setCurrentSlideIndex(0);
    setCompletedThumbnails([]);

    const keys = getStoredKeys();
    const apiKey = keys[provider as keyof typeof keys] || '';

    const generatedSlides: Slide[] = [];

    for (let i = 0; i < slides.length; i++) {
      setCurrentSlideIndex(i + 1);

      const slideData = slides[i];
      const layout = (slideData.layout || 'title-content') as SlideLayout;

      // Try calling the API for richer content
      let content: ContentBlock[];
      try {
        const response = await fetch('/api/ai/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slide: slideData,
            slideIndex: i,
            totalSlides: slides.length,
            presentationTitle: outline.title,
            provider,
            apiKey,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          content = data.content || buildContentBlocks(slideData, layout);
        } else {
          // Fallback to client-side generation
          content = buildContentBlocks(slideData, layout);
        }
      } catch {
        // Fallback to client-side generation
        content = buildContentBlocks(slideData, layout);
      }

      const slide: Slide = {
        id: `slide_${nanoid(8)}`,
        index: i,
        layout,
        content,
        background: { type: 'solid', value: '' },
        speakerNotes: slideData.speakerNotes || '',
      };

      generatedSlides.push(slide);
      setCompletedThumbnails((prev) => [
        ...prev,
        { title: slideData.title, layout: slideData.layout },
      ]);
    }

    const presentation: Presentation = {
      id: `pres_${nanoid(8)}`,
      title: outline.title,
      description: outline.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themeId: outline.themeId || 'minimal',
      slides: generatedSlides,
      metadata: {
        aiModel: provider,
        originalPrompt: outline.description,
        slideCount: generatedSlides.length,
        aspectRatio: '16:9',
      },
    };

    setGenerating(false);
    onComplete(presentation);
  }, [slides, outline, provider, onComplete]);

  const layoutLabels: Record<string, string> = {
    title: 'Title',
    'title-content': 'Content',
    'two-column': '2 Columns',
    'content-image-right': 'Image Right',
    'content-image-left': 'Image Left',
    'image-full': 'Full Image',
    blank: 'Blank',
    'section-header': 'Section',
    'three-column': '3 Columns',
    comparison: 'Compare',
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">{outline.title}</h2>
          <p className="text-sm text-muted-foreground">
            {slides.length} slides &middot; Review and edit the outline before
            generating
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Back
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleGenerate}
            disabled={generating}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Slides
          </Button>
        </div>
      </div>

      {/* Slide list */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3 max-w-3xl mx-auto">
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="group rounded-lg border border-border bg-background p-4 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Drag handle + number */}
                <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {slideIndex + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Title + Layout badge */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={slide.title}
                      onChange={(e) =>
                        updateSlideTitle(slideIndex, e.target.value)
                      }
                      className="h-8 text-sm font-medium border-transparent bg-transparent hover:border-border focus:border-border"
                      placeholder="Slide title"
                    />
                    <span className="flex-shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {layoutLabels[slide.layout] || slide.layout}
                    </span>
                  </div>

                  {/* Bullets */}
                  <div className="space-y-1.5 pl-1">
                    {slide.bullets.map((bullet, bulletIndex) => (
                      <div
                        key={bulletIndex}
                        className="flex items-center gap-1.5 group/bullet"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                        <Input
                          value={bullet}
                          onChange={(e) =>
                            updateBullet(
                              slideIndex,
                              bulletIndex,
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs border-transparent bg-transparent hover:border-border focus:border-border"
                          placeholder="Bullet point"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(slideIndex, bulletIndex)}
                          className="opacity-0 group-hover/bullet:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBullet(slideIndex)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors pl-3.5"
                    >
                      + Add bullet
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSlide(slideIndex, -1)}
                    disabled={slideIndex === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(slideIndex, 1)}
                    disabled={slideIndex === slides.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <Separator className="my-0.5" />
                  <button
                    type="button"
                    onClick={() => deleteSlide(slideIndex)}
                    disabled={slides.length <= 1}
                    className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add slide button */}
          <button
            type="button"
            onClick={addSlide}
            className="w-full rounded-lg border border-dashed border-border hover:border-foreground/30 p-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Slide
          </button>
        </div>
      </ScrollArea>

      {/* Generating overlay */}
      {generating && (
        <GeneratingOverlay
          currentSlide={currentSlideIndex}
          totalSlides={slides.length}
          completedThumbnails={completedThumbnails}
        />
      )}
    </div>
  );
}
