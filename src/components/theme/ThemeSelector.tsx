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
      className={`relative group rounded-lg border p-3 text-left transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : 'border-border hover:border-muted-foreground/30'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Color palette strip */}
      <div className="flex h-8 rounded-md overflow-hidden mb-2.5">
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.background }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* Theme info */}
      <p className="text-sm font-medium leading-none">{theme.name}</p>
      <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>

      {/* Font preview */}
      <p
        className="text-[10px] text-muted-foreground mt-1.5 truncate"
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
          <DialogTitle>Choose a Theme</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
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
