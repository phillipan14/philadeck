'use client';

import { useState, useCallback } from 'react';
import { Loader2, Sparkles, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ModelSelector from './ModelSelector';
import APIKeySettings from './APIKeySettings';
import OutlineEditor from './OutlineEditor';
import { getStoredKeys, getStoredProvider } from './APIKeySettings';
import type { Presentation } from '@/types/presentation';

const examplePrompts = [
  'Startup pitch deck for a SaaS product',
  'Quarterly business review',
  'Product launch presentation',
  'Team onboarding guide',
  'Research findings presentation',
];

interface OutlineData {
  title: string;
  description: string;
  themeId: string;
  slides: Array<{
    title: string;
    bullets: string[];
    layout: string;
    imageQuery?: string;
    speakerNotes?: string;
  }>;
}

interface AIPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (presentation: Presentation) => void;
}

export default function AIPromptModal({
  open,
  onOpenChange,
  onComplete,
}: AIPromptModalProps) {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState(() => getStoredProvider());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outline, setOutline] = useState<OutlineData | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    const keys = getStoredKeys();
    const apiKey = keys[provider as keyof typeof keys];

    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider,
          apiKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || `Failed to generate outline (${response.status})`,
        );
      }

      const data = await response.json();
      setOutline(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate outline',
      );
    } finally {
      setLoading(false);
    }
  }, [prompt, provider]);

  const handleComplete = useCallback(
    (presentation: Presentation) => {
      onComplete(presentation);
      // Reset state
      setPrompt('');
      setOutline(null);
      setError(null);
    },
    [onComplete],
  );

  const handleBack = useCallback(() => {
    setOutline(null);
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        // Reset state when closing
        setPrompt('');
        setOutline(null);
        setError(null);
        setLoading(false);
      }
      onOpenChange(newOpen);
    },
    [onOpenChange],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden"
          showCloseButton={!loading}
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent dark:from-primary/[0.04] pointer-events-none rounded-lg" />
          {/* Show outline editor if outline is ready */}
          {outline ? (
            <OutlineEditor
              outline={outline}
              provider={provider}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          ) : (
            /* Prompt input view */
            <div className="flex flex-col relative">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center gap-2.5 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create with AI
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                  Describe the presentation you want and AI will generate an
                  outline for you to review.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-5">
                {/* Prompt textarea */}
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the presentation you want to create..."
                  className="min-h-[140px] text-base resize-none rounded-xl border-zinc-200/60 dark:border-zinc-700/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) {
                      handleGenerate();
                    }
                  }}
                />

                {/* Example prompts */}
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Try an example:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setPrompt(example)}
                        disabled={loading}
                        className="text-xs px-3.5 py-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-primary/40 hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-all duration-200 disabled:opacity-50"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Footer: Model selector + Generate button */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/40 dark:border-zinc-700/40">
                  <div className="flex items-center gap-2">
                    <ModelSelector
                      value={provider}
                      onChange={setProvider}
                      compact
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSettingsOpen(true)}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>API key settings</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loading}
                    className="gap-2 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating outline...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* API Key Settings sheet */}
      <APIKeySettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
