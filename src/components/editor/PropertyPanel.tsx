'use client';

import { useState } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePresentationStore } from '@/stores/presentation-store';
import ImageSearchModal from '@/components/images/ImageSearchModal';
import type {
  TextBlock,
  ImageBlock,
  SlideLayout,
  ContentBlock,
} from '@/types/presentation';

const TEXT_STYLES = [
  { value: 'title', label: 'Title' },
  { value: 'subtitle', label: 'Subtitle' },
  { value: 'heading', label: 'Heading' },
  { value: 'body', label: 'Body' },
  { value: 'caption', label: 'Caption' },
] as const;

const LAYOUTS: { value: SlideLayout; label: string }[] = [
  { value: 'title', label: 'Title' },
  { value: 'title-content', label: 'Title + Content' },
  { value: 'two-column', label: 'Two Columns' },
  { value: 'section-header', label: 'Section Header' },
  { value: 'content-image-right', label: 'Content + Image Right' },
  { value: 'content-image-left', label: 'Content + Image Left' },
  { value: 'image-full', label: 'Full Image' },
  { value: 'blank', label: 'Blank' },
  { value: 'three-column', label: 'Three Columns' },
  { value: 'comparison', label: 'Comparison' },
];

const FONT_SIZE_MAP: Record<string, number> = {
  title: 48,
  subtitle: 28,
  heading: 36,
  body: 18,
  caption: 14,
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.08em]">
      {children}
    </h3>
  );
}

function SlideProperties() {
  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const updateSlideBackground = usePresentationStore(
    (s) => s.updateSlideBackground,
  );
  const updateSpeakerNotes = usePresentationStore(
    (s) => s.updateSpeakerNotes,
  );

  const slide = presentation?.slides.find((s) => s.id === selectedSlideId);

  if (!slide) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SectionHeader>Slide Properties</SectionHeader>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Layout</label>
          <Select
            value={slide.layout}
            disabled
          >
            <SelectTrigger className="h-8 text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LAYOUTS.map((layout) => (
                <SelectItem key={layout.value} value={layout.value}>
                  {layout.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">
            Background Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={
                slide.background.type === 'solid' && slide.background.value
                  ? slide.background.value
                  : '#ffffff'
              }
              onChange={(e) =>
                updateSlideBackground(slide.id, {
                  type: 'solid',
                  value: e.target.value,
                })
              }
              className="h-8 w-8 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer bg-transparent transition-all duration-200 hover:scale-105"
            />
            <Input
              value={
                slide.background.type === 'solid'
                  ? slide.background.value
                  : ''
              }
              onChange={(e) =>
                updateSlideBackground(slide.id, {
                  type: 'solid',
                  value: e.target.value,
                })
              }
              placeholder="Use theme default"
              className="h-8 text-xs flex-1 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-200/60 dark:bg-zinc-700/60" />

      <div className="space-y-3">
        <SectionHeader>Speaker Notes</SectionHeader>
        <Textarea
          value={slide.speakerNotes}
          onChange={(e) => updateSpeakerNotes(slide.id, e.target.value)}
          placeholder="Add speaker notes..."
          className="min-h-[100px] text-xs resize-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      </div>
    </div>
  );
}

function TextBlockProperties({ block }: { block: TextBlock }) {
  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const updateBlock = usePresentationStore((s) => s.updateBlock);

  if (!selectedSlideId) return null;

  const currentFontSize = FONT_SIZE_MAP[block.textStyle] || 18;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SectionHeader>Text Properties</SectionHeader>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Text Style</label>
          <Select
            value={block.textStyle}
            onValueChange={(value) =>
              updateBlock(selectedSlideId, block.id, {
                textStyle: value as TextBlock['textStyle'],
              } as Partial<ContentBlock>)
            }
          >
            <SelectTrigger className="h-8 text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Font Size</label>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
              {currentFontSize}px
            </span>
          </div>
          <Slider
            value={[currentFontSize]}
            min={10}
            max={72}
            step={1}
            onValueChange={([value]) => {
              // Map approximate font size back to the nearest text style
              let textStyle: TextBlock['textStyle'] = 'body';
              if (value >= 44) textStyle = 'title';
              else if (value >= 32) textStyle = 'heading';
              else if (value >= 24) textStyle = 'subtitle';
              else if (value >= 16) textStyle = 'body';
              else textStyle = 'caption';

              updateBlock(selectedSlideId, block.id, {
                textStyle,
              } as Partial<ContentBlock>);
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Alignment</label>
          <div className="flex gap-1">
            {(
              [
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
              ] as const
            ).map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={block.alignment === value ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() =>
                  updateBlock(selectedSlideId, block.id, {
                    alignment: value,
                  } as Partial<ContentBlock>)
                }
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageBlockProperties({ block }: { block: ImageBlock }) {
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const updateBlock = usePresentationStore((s) => s.updateBlock);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);

  if (!selectedSlideId) return null;

  const handleImageSelect = (url: string, alt: string) => {
    updateBlock(selectedSlideId, block.id, {
      src: url,
      alt,
    } as Partial<ContentBlock>);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SectionHeader>Image Properties</SectionHeader>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Image URL</label>
          <Input
            value={block.src}
            onChange={(e) =>
              updateBlock(selectedSlideId, block.id, {
                src: e.target.value,
              } as Partial<ContentBlock>)
            }
            placeholder="https://..."
            className="h-8 text-xs rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">Alt Text</label>
          <Input
            value={block.alt}
            onChange={(e) =>
              updateBlock(selectedSlideId, block.id, {
                alt: e.target.value,
              } as Partial<ContentBlock>)
            }
            placeholder="Image description"
            className="h-8 text-xs rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 gap-1.5 rounded-lg border-zinc-200/60 dark:border-zinc-700/60 hover:border-primary/40 transition-all duration-200"
          onClick={() => setImageSearchOpen(true)}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="text-xs">Search Image</span>
        </Button>

        <ImageSearchModal
          open={imageSearchOpen}
          onOpenChange={setImageSearchOpen}
          onSelect={handleImageSelect}
          initialQuery={block.query}
        />
      </div>
    </div>
  );
}

export default function PropertyPanel() {
  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const selectedBlockId = usePresentationStore((s) => s.selectedBlockId);

  const slide = presentation?.slides.find((s) => s.id === selectedSlideId);
  const selectedBlock = slide?.content.find((b) => b.id === selectedBlockId);

  if (!presentation) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-3 py-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {selectedBlock ? 'Element' : 'Slide'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedBlock?.type === 'text' ? (
          <TextBlockProperties block={selectedBlock as TextBlock} />
        ) : selectedBlock?.type === 'image' ? (
          <ImageBlockProperties block={selectedBlock as ImageBlock} />
        ) : (
          <SlideProperties />
        )}
      </div>
    </div>
  );
}
