export interface Presentation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  themeId: string;
  themeOverrides?: Partial<ThemeColors>;
  slides: Slide[];
  metadata: {
    aiModel?: string;
    originalPrompt?: string;
    slideCount: number;
    aspectRatio: '16:9' | '4:3';
  };
}

export interface Slide {
  id: string;
  index: number;
  layout: SlideLayout;
  content: ContentBlock[];
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
  };
  speakerNotes: string;
  transition?: 'none' | 'fade' | 'slide';
}

export type SlideLayout =
  | 'title'
  | 'title-content'
  | 'two-column'
  | 'content-image-right'
  | 'content-image-left'
  | 'image-full'
  | 'blank'
  | 'section-header'
  | 'three-column'
  | 'comparison';

// Content Block Types

export interface BaseBlock {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  textStyle: 'title' | 'subtitle' | 'heading' | 'body' | 'caption';
  alignment: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  query: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  variant: 'bullet' | 'numbered' | 'checklist';
  items: Array<{
    id: string;
    text: string;
  }>;
}

export interface ChartBlock extends BaseBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'donut';
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
}

export interface IconListBlock extends BaseBlock {
  type: 'icon-list';
  items: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  columns: 2 | 3 | 4;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  attribution: string;
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  items: Array<{
    id: string;
    title: string;
    description: string;
    date?: string;
  }>;
  orientation: 'horizontal' | 'vertical';
}

export interface DiagramBlock extends BaseBlock {
  type: 'diagram';
  diagramType: 'cycle' | 'pyramid' | 'funnel' | 'flowchart' | 'venn';
  items: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | ListBlock
  | ChartBlock
  | IconListBlock
  | QuoteBlock
  | TimelineBlock
  | DiagramBlock;

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  heading: string;
  muted: string;
  accent: string;
}

export interface ThemeProperties {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    padding: number;
    gap: number;
  };
  borderRadius: string;
  darkMode: boolean;
}
