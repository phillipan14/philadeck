'use client';

import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { PanelLeftClose, PanelRightClose, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePresentationStore } from '@/stores/presentation-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import EditorToolbar from './EditorToolbar';
import SlidePanel from './SlidePanel';
import SlideCanvas from './SlideCanvas';
import PropertyPanel from './PropertyPanel';
import ThemeSelector from '@/components/theme/ThemeSelector';
import AIPromptModal from '@/components/ai/AIPromptModal';
import TemplateGallery from '@/components/templates/TemplateGallery';
import type { TemplateDefinition } from '@/lib/templates';
import type { Presentation, Slide, ContentBlock } from '@/types/presentation';

export default function EditorLayout() {
  const presentation = usePresentationStore((s) => s.presentation);
  const createPresentation = usePresentationStore(
    (s) => s.createPresentation,
  );
  const loadPresentation = usePresentationStore((s) => s.loadPresentation);

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [themeOpen, setThemeOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useAutoSave();
  useKeyboardShortcuts();

  const handleCreate = useCallback(() => {
    createPresentation();
  }, [createPresentation]);

  const handleAIComplete = useCallback(
    (generatedPresentation: Presentation) => {
      loadPresentation(generatedPresentation);
      setAiModalOpen(false);
    },
    [loadPresentation],
  );

  /** Generate fresh IDs for a template and load it as a new Presentation. */
  const handleTemplateSelect = useCallback(
    (template: TemplateDefinition) => {
      const freshSlides: Slide[] = template.slides.map((slide, idx) => {
        const newBlocks: ContentBlock[] = slide.content.map((block) => {
          const newBlock = { ...block, id: `block_${nanoid(8)}` };
          // Deep-clone list items to assign fresh IDs
          if (newBlock.type === 'list') {
            return {
              ...newBlock,
              items: (newBlock as ContentBlock & { items: Array<{ id: string; text: string }> }).items.map(
                (item: { id: string; text: string }) => ({ ...item, id: `item_${nanoid(6)}` }),
              ),
            };
          }
          return newBlock;
        });
        return {
          ...slide,
          id: `slide_${nanoid(8)}`,
          index: idx,
          content: newBlocks,
        };
      });

      const presentation: Presentation = {
        id: `pres_${nanoid(8)}`,
        title: template.name,
        description: template.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        themeId: template.themeId,
        slides: freshSlides,
        metadata: {
          slideCount: freshSlides.length,
          aspectRatio: '16:9',
        },
      };

      loadPresentation(presentation);
    },
    [loadPresentation],
  );

  // Empty state: no presentation loaded
  if (!presentation) {
    return (
      <>
        <div className="h-screen flex flex-col items-center bg-background dot-grid-bg overflow-auto">
          <div className="w-full max-w-3xl mx-auto px-6 pt-20 pb-16">
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ fontFamily: 'var(--font-sans)' }}>
                Start a new presentation
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Create beautiful, professional presentations in minutes with AI assistance or start from a template.
              </p>
            </div>

            <div className="flex justify-center mb-10">
              <Button
                onClick={() => setAiModalOpen(true)}
                size="lg"
                className="gap-2.5 h-12 px-8 text-sm font-medium shadow-sm animate-subtle-glow transition-all duration-200 hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Create with AI
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-zinc-200/60 dark:bg-zinc-700/60" />
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">or choose a template</span>
              <div className="flex-1 h-px bg-zinc-200/60 dark:bg-zinc-700/60" />
            </div>

            <TemplateGallery
              onSelect={(t) => handleTemplateSelect(t as unknown as TemplateDefinition)}
              onCreateBlank={handleCreate}
            />
          </div>
        </div>

        <AIPromptModal
          open={aiModalOpen}
          onOpenChange={setAiModalOpen}
          onComplete={handleAIComplete}
        />
      </>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Top toolbar */}
        <EditorToolbar onThemeOpen={() => setThemeOpen(true)} />

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Slide thumbnails */}
          <div
            className={`border-r border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-200 ease-out flex-shrink-0 overflow-hidden ${
              leftPanelOpen ? 'w-60' : 'w-0'
            }`}
          >
            {leftPanelOpen && <SlidePanel />}
          </div>

          {/* Center: Canvas + panel toggles */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Panel toggle buttons */}
            <div className="absolute top-2 left-2 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  >
                    <PanelLeftClose
                      className={`h-4 w-4 transition-transform ${
                        leftPanelOpen ? '' : 'rotate-180'
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {leftPanelOpen ? 'Hide slides' : 'Show slides'}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="absolute top-2 right-2 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  >
                    <PanelRightClose
                      className={`h-4 w-4 transition-transform ${
                        rightPanelOpen ? '' : 'rotate-180'
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {rightPanelOpen ? 'Hide properties' : 'Show properties'}
                </TooltipContent>
              </Tooltip>
            </div>

            <SlideCanvas />
          </div>

          {/* Right panel: Properties */}
          <div
            className={`border-l border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-200 ease-out flex-shrink-0 overflow-hidden ${
              rightPanelOpen ? 'w-70' : 'w-0'
            }`}
          >
            {rightPanelOpen && <PropertyPanel />}
          </div>
        </div>

        {/* Theme selector dialog */}
        <ThemeSelector open={themeOpen} onOpenChange={setThemeOpen} />
      </div>
    </TooltipProvider>
  );
}
