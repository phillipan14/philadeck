'use client';

import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePresentationStore } from '@/stores/presentation-store';
import { themeList } from '@/lib/themes/presets';
import type { ThemeProperties } from '@/types/presentation';

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: ThemeProperties;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative group rounded-xl border p-3.5 text-left transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.02] ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : 'border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center animate-check-in shadow-sm">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Mini slide preview */}
      <div
        className="relative rounded-lg overflow-hidden mb-3 aspect-video border border-zinc-100 dark:border-zinc-800"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Simulated title bar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-1.5">
          <div
            className="h-2 w-3/5 rounded-full opacity-80"
            style={{ backgroundColor: theme.colors.heading }}
          />
          <div
            className="h-1.5 w-2/5 rounded-full opacity-40"
            style={{ backgroundColor: theme.colors.text }}
          />
          <div className="flex gap-1 mt-1.5">
            <div
              className="h-1 w-6 rounded-full opacity-60"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="h-1 w-6 rounded-full opacity-40"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="h-1 w-6 rounded-full opacity-30"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>
      </div>

      {/* Theme info */}
      <p className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">{theme.name}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{theme.description}</p>

      {/* Font preview */}
      <p
        className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 truncate"
        style={{ fontFamily: theme.fonts.heading }}
      >
        {theme.fonts.heading}
        {theme.fonts.heading !== theme.fonts.body &&
          ` / ${theme.fonts.body}`}
      </p>
    </button>
  );
}

interface ThemeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemeSelector({
  open,
  onOpenChange,
}: ThemeSelectorProps) {
  const presentation = usePresentationStore((s) => s.presentation);
  const setTheme = usePresentationStore((s) => s.setTheme);

  if (!presentation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Choose a Theme</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-3 max-h-[60vh] overflow-y-auto pr-1">
          {themeList.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={presentation.themeId === theme.id}
              onSelect={() => {
                setTheme(theme.id);
                onOpenChange(false);
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
