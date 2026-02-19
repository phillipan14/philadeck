import { z } from 'zod';

// ─── Position schema (shared) ───────────────────────────────────────────────

const positionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
});

// ─── Outline schemas ────────────────────────────────────────────────────────

export const outlineSlideSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(6),
  layout: z.enum([
    'title',
    'title-content',
    'two-column',
    'content-image-right',
    'section-header',
    'blank',
  ]),
  imageQuery: z.string().optional(),
  speakerNotes: z.string().optional(),
});

export const outlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  themeId: z.string(),
  slides: z.array(outlineSlideSchema).min(1).max(20),
});

export type OutlineSlide = z.infer<typeof outlineSlideSchema>;
export type Outline = z.infer<typeof outlineSchema>;

// ─── Content block schemas (for slide generation) ───────────────────────────

const textBlockSchema = z.object({
  type: z.literal('text'),
  content: z.string(),
  textStyle: z.enum(['title', 'subtitle', 'heading', 'body', 'caption']),
  alignment: z.enum(['left', 'center', 'right']),
  position: positionSchema,
});

const imageBlockSchema = z.object({
  type: z.literal('image'),
  src: z.string(),
  alt: z.string(),
  query: z.string(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
  position: positionSchema,
});

const listItemSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const listBlockSchema = z.object({
  type: z.literal('list'),
  variant: z.enum(['bullet', 'numbered', 'checklist']),
  items: z.array(listItemSchema).min(1),
  position: positionSchema,
});

const quoteBlockSchema = z.object({
  type: z.literal('quote'),
  text: z.string(),
  attribution: z.string(),
  position: positionSchema,
});

const iconListItemSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const iconListBlockSchema = z.object({
  type: z.literal('icon-list'),
  items: z.array(iconListItemSchema).min(1),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  position: positionSchema,
});

export const contentBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  imageBlockSchema,
  listBlockSchema,
  quoteBlockSchema,
  iconListBlockSchema,
]);

export const slideContentSchema = z.object({
  blocks: z.array(contentBlockSchema).min(1),
});

export type SlideContent = z.infer<typeof slideContentSchema>;
export type ContentBlockGenerated = z.infer<typeof contentBlockSchema>;
