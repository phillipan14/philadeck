'use client';

import { useState, useMemo } from 'react';
import { Plus, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { templates, type TemplateDefinition } from '@/lib/templates';
import { themes } from '@/lib/themes/presets';
import type { Presentation } from '@/types/presentation';

type Category = 'all' | 'business' | 'education' | 'creative';

interface TemplateGalleryProps {
  onSelect: (presentation: Presentation) => void;
  onCreateBlank: () => void;
}

const categoryLabels: Record<Category, string> = {
  all: 'All',
  business: 'Business',
  education: 'Education',
  creative: 'Creative',
};

const categoryPillColors: Record<TemplateDefinition['category'], string> = {
  business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  education: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  creative: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

function ThemeColorStrip({ themeId }: { themeId: string }) {
  const theme = themes[themeId];
  if (!theme) return null;

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.background,
  ];

  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-t-xl">
      {colors.map((color, i) => (
        <div
          key={i}
          className="flex-1"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function TemplateCard({
  template,
  onClick,
}: {
  template: TemplateDefinition;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-card text-left transition-all duration-200 ease-out hover:border-primary/40 hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      <ThemeColorStrip themeId={template.themeId} />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors duration-200">
            {template.name}
          </h3>
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <Layers className="h-3 w-3" />
            {template.slideCount}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {template.description}
        </p>
        <div className="mt-auto pt-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${categoryPillColors[template.category]}`}
          >
            {template.category}
          </span>
        </div>
      </div>
    </button>
  );
}

function BlankCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200/80 dark:border-zinc-700/80 bg-card/30 p-8 transition-all duration-200 ease-out hover:border-primary/40 hover:bg-card hover:shadow-sm hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[160px]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 transition-all duration-200 group-hover:bg-primary/10 group-hover:scale-110">
        <Plus className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-hover:text-primary transition-colors duration-200" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Blank Presentation</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Start from scratch</p>
      </div>
    </button>
  );
}

export default function TemplateGallery({
  onSelect,
  onCreateBlank,
}: TemplateGalleryProps) {
  const [activeTab, setActiveTab] = useState<Category>('all');

  const filteredTemplates = useMemo(() => {
    if (activeTab === 'all') return templates;
    return templates.filter((t) => t.category === activeTab);
  }, [activeTab]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Category)}
      >
        <TabsList className="mb-6 bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-lg">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="rounded-md text-xs font-medium transition-all duration-200 data-[state=active]:shadow-sm">
              {categoryLabels[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <TabsContent key={cat} value={cat}>
            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-2 gap-5 pb-4 sm:grid-cols-3">
                <BlankCard onClick={onCreateBlank} />
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.name}
                    template={template}
                    onClick={() => onSelect(template as unknown as Presentation)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
