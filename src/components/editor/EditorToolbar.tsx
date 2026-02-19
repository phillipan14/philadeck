'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import {
  ArrowLeft,
  Plus,
  Type,
  Image,
  List,
  Quote,
  Palette,
  Download,
  Play,
  Sparkles,
  Undo2,
  Redo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePresentationStore } from '@/stores/presentation-store';
import { savePresentation } from '@/lib/storage';
import { ExportModal } from '@/components/export/ExportModal';
import type { ContentBlock, SlideLayout } from '@/types/presentation';

interface EditorToolbarProps {
  onThemeOpen: () => void;
}

export default function EditorToolbar({ onThemeOpen }: EditorToolbarProps) {
  const router = useRouter();
  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const updateTitle = usePresentationStore((s) => s.updateTitle);
  const addSlide = usePresentationStore((s) => s.addSlide);
  const addBlock = usePresentationStore((s) => s.addBlock);
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const canUndo = usePresentationStore((s) => s.canUndo);
  const canRedo = usePresentationStore((s) => s.canRedo);

  const selectedSlide = presentation?.slides.find(
    (s) => s.id === selectedSlideId,
  );

  const handleInsertBlock = useCallback(
    (type: 'text' | 'image' | 'list' | 'quote') => {
      if (!selectedSlideId) return;

      let block: ContentBlock;

      switch (type) {
        case 'text':
          block = {
            id: `block_${nanoid(8)}`,
            type: 'text',
            content: 'New text block',
            textStyle: 'body',
            alignment: 'left',
            position: { x: 10, y: 40, width: 80, height: 15 },
          };
          break;
        case 'image':
          block = {
            id: `block_${nanoid(8)}`,
            type: 'image',
            src: '',
            alt: 'Image placeholder',
            query: '',
            position: { x: 25, y: 20, width: 50, height: 60 },
          };
          break;
        case 'list':
          block = {
            id: `block_${nanoid(8)}`,
            type: 'list',
            variant: 'bullet',
            items: [
              { id: nanoid(6), text: 'First item' },
              { id: nanoid(6), text: 'Second item' },
              { id: nanoid(6), text: 'Third item' },
            ],
            position: { x: 10, y: 30, width: 80, height: 40 },
          };
          break;
        case 'quote':
          block = {
            id: `block_${nanoid(8)}`,
            type: 'quote',
            text: 'Your quote here',
            attribution: 'Author',
            position: { x: 15, y: 30, width: 70, height: 30 },
          };
          break;
      }

      addBlock(selectedSlideId, block);
    },
    [selectedSlideId, addBlock],
  );

  const handleAddSlide = useCallback(
    (layout: SlideLayout) => {
      const currentIndex = selectedSlide?.index;
      addSlide(layout, currentIndex);
    },
    [addSlide, selectedSlide],
  );

  const handlePresent = useCallback(() => {
    if (!presentation) return;
    savePresentation(presentation);
    router.push(`/present/${presentation.id}`);
  }, [presentation, router]);

  if (!presentation) return null;

  return (
    <TooltipProvider>
      <div className="flex h-14 items-center border-b border-zinc-200/60 dark:border-zinc-800/60 bg-background shadow-[0_1px_2px_0_rgb(0_0_0/0.03)] px-4 gap-1">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="/">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to home</TooltipContent>
          </Tooltip>

          <Input
            value={presentation.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="h-8 w-60 border-transparent bg-transparent text-[15px] font-medium hover:border-zinc-200/60 dark:hover:border-zinc-700/60 focus:border-zinc-300 dark:focus:border-zinc-600 focus:ring-2 focus:ring-primary/10 transition-all duration-200 rounded-lg"
            placeholder="Untitled Presentation"
          />

          <div className="h-4 w-px bg-zinc-200/60 dark:bg-zinc-700/60 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-all duration-200"
                disabled={!canUndo}
                onClick={undo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Cmd+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-all duration-200"
                disabled={!canRedo}
                onClick={redo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>

        {/* Center section */}
        <div className="flex items-center gap-1 mx-auto">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">Slide</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Add slide</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleAddSlide('title')}>
                Title Slide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddSlide('title-content')}>
                Title + Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddSlide('two-column')}>
                Two Columns
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddSlide('section-header')}
              >
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

          <div className="h-4 w-px bg-zinc-200/60 dark:bg-zinc-700/60 mx-1.5" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                    <Type className="h-4 w-4" />
                    <span className="text-xs">Insert</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Insert element</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleInsertBlock('text')}>
                <Type className="h-4 w-4 mr-2" />
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertBlock('image')}>
                <Image className="h-4 w-4 mr-2" />
                Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertBlock('list')}>
                <List className="h-4 w-4 mr-2" />
                List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertBlock('quote')}>
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-zinc-200/60 dark:bg-zinc-700/60 mx-1.5" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">AI</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>AI actions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center">
              <DropdownMenuItem disabled>
                <Sparkles className="h-4 w-4 mr-2" />
                Rewrite slide content
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate speaker notes
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Sparkles className="h-4 w-4 mr-2" />
                Suggest images
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                onClick={onThemeOpen}
              >
                <Palette className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Change theme</TooltipContent>
          </Tooltip>

          <ExportModal>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Download className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export presentation</TooltipContent>
            </Tooltip>
          </ExportModal>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                onClick={handlePresent}
              >
                <Play className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Present</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start presentation (F5)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
