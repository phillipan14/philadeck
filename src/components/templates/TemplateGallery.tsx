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
    <div className="flex h-2 w-full overflow-hidden rounded-t-lg">
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
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ThemeColorStrip themeId={template.themeId} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Layers className="h-3 w-3" />
            {template.slideCount}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
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
      className="group flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[160px]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
        <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Blank Presentation</p>
        <p className="text-xs text-muted-foreground mt-0.5">Start from scratch</p>
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
        <TabsList className="mb-4">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {categoryLabels[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <TabsContent key={cat} value={cat}>
            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3">
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
