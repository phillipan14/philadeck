import type { ThemeProperties } from '@/types/presentation';
import type { CSSProperties } from 'react';

export { themes, themeList, getTheme } from './presets';

export function getThemeCSSVars(theme: ThemeProperties): CSSProperties {
  return {
    '--df-primary': theme.colors.primary,
    '--df-secondary': theme.colors.secondary,
    '--df-background': theme.colors.background,
    '--df-surface': theme.colors.surface,
    '--df-text': theme.colors.text,
    '--df-heading': theme.colors.heading,
    '--df-muted': theme.colors.muted,
    '--df-accent': theme.colors.accent,
    '--df-font-heading': theme.fonts.heading,
    '--df-font-body': theme.fonts.body,
    '--df-padding': theme.spacing.padding + 'px',
    '--df-gap': theme.spacing.gap + 'px',
    '--df-radius': theme.borderRadius,
  } as CSSProperties;
}
