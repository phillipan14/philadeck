import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { Presentation, Slide, ContentBlock, SlideLayout } from '@/types/presentation';
import { getTheme } from '@/lib/themes/presets';

const MAX_HISTORY = 50;

interface PresentationState {
  presentation: Presentation | null;
  selectedSlideId: string | null;
  selectedBlockId: string | null;

  // Undo/Redo history
  history: Presentation[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Copy/paste
  copiedBlock: ContentBlock | null;

  // Presentation actions
  createPresentation: (title?: string, themeId?: string) => string;
  loadPresentation: (presentation: Presentation) => void;
  updateTitle: (title: string) => void;
  setTheme: (themeId: string) => void;

  // Slide actions
  addSlide: (layout?: SlideLayout, afterIndex?: number) => string;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  selectSlide: (slideId: string | null) => void;
  updateSlideBackground: (slideId: string, background: Slide['background']) => void;
  updateSpeakerNotes: (slideId: string, notes: string) => void;

  // Block actions
  selectBlock: (blockId: string | null) => void;
  addBlock: (slideId: string, block: ContentBlock) => void;
  updateBlock: (slideId: string, blockId: string, updates: Partial<ContentBlock>) => void;
  deleteBlock: (slideId: string, blockId: string) => void;

  // Bulk operations
  setSlides: (slides: Slide[]) => void;

  // Undo/Redo actions
  undo: () => void;
  redo: () => void;

  // Copy/paste actions
  copyBlock: (block: ContentBlock) => void;
  pasteBlock: (slideId: string) => void;
}

function createDefaultSlide(layout: SlideLayout = 'title', index: number): Slide {
  const id = `slide_${nanoid(8)}`;
  const blocks: ContentBlock[] = [];

  if (layout === 'title') {
    blocks.push(
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Untitled Presentation',
        textStyle: 'title',
        alignment: 'center',
        position: { x: 10, y: 30, width: 80, height: 20 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Click to add subtitle',
        textStyle: 'subtitle',
        alignment: 'center',
        position: { x: 20, y: 55, width: 60, height: 10 },
      }
    );
  } else if (layout === 'title-content') {
    blocks.push(
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Slide Title',
        textStyle: 'heading',
        alignment: 'left',
        position: { x: 5, y: 5, width: 90, height: 12 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Add your content here',
        textStyle: 'body',
        alignment: 'left',
        position: { x: 5, y: 22, width: 90, height: 70 },
      }
    );
  } else if (layout === 'section-header') {
    blocks.push({
      id: `block_${nanoid(8)}`,
      type: 'text',
      content: 'Section Title',
      textStyle: 'title',
      alignment: 'center',
      position: { x: 10, y: 35, width: 80, height: 20 },
    });
  } else if (layout === 'two-column') {
    blocks.push(
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Slide Title',
        textStyle: 'heading',
        alignment: 'left',
        position: { x: 5, y: 5, width: 90, height: 12 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Left column content',
        textStyle: 'body',
        alignment: 'left',
        position: { x: 5, y: 22, width: 42, height: 70 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Right column content',
        textStyle: 'body',
        alignment: 'left',
        position: { x: 53, y: 22, width: 42, height: 70 },
      }
    );
  } else if (layout === 'content-image-right') {
    blocks.push(
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Slide Title',
        textStyle: 'heading',
        alignment: 'left',
        position: { x: 5, y: 5, width: 45, height: 12 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'text',
        content: 'Add your content here',
        textStyle: 'body',
        alignment: 'left',
        position: { x: 5, y: 22, width: 45, height: 70 },
      },
      {
        id: `block_${nanoid(8)}`,
        type: 'image',
        src: '',
        alt: 'Placeholder image',
        query: '',
        position: { x: 55, y: 5, width: 40, height: 87 },
      }
    );
  } else {
    blocks.push({
      id: `block_${nanoid(8)}`,
      type: 'text',
      content: 'Click to add content',
      textStyle: 'body',
      alignment: 'left',
      position: { x: 5, y: 5, width: 90, height: 90 },
    });
  }

  return {
    id,
    index,
    layout,
    content: blocks,
    background: { type: 'solid', value: '' },
    speakerNotes: '',
  };
}

/** Deep clone a presentation to a plain JSON object (no immer proxies). */
function clonePresentation(p: Presentation): Presentation {
  return JSON.parse(JSON.stringify(p));
}

export const usePresentationStore = create<PresentationState>()(
  immer((set, get) => ({
    presentation: null,
    selectedSlideId: null,
    selectedBlockId: null,

    // Undo/Redo state
    history: [],
    historyIndex: -1,
    canUndo: false,
    canRedo: false,

    // Copy/paste state
    copiedBlock: null,

    createPresentation: (title = 'Untitled Presentation', themeId = 'minimal') => {
      const id = `pres_${nanoid(8)}`;
      const firstSlide = createDefaultSlide('title', 0);
      set((state) => {
        state.presentation = {
          id,
          title,
          description: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          themeId,
          slides: [firstSlide],
          metadata: {
            slideCount: 1,
            aspectRatio: '16:9',
          },
        };
        state.selectedSlideId = firstSlide.id;
        state.selectedBlockId = null;
        // Reset history for new presentation
        state.history = [clonePresentation(state.presentation as Presentation)];
        state.historyIndex = 0;
        state.canUndo = false;
        state.canRedo = false;
      });
      return id;
    },

    loadPresentation: (presentation) => {
      set((state) => {
        state.presentation = presentation;
        state.selectedSlideId = presentation.slides[0]?.id || null;
        state.selectedBlockId = null;
        // Reset history for loaded presentation
        state.history = [clonePresentation(presentation)];
        state.historyIndex = 0;
        state.canUndo = false;
        state.canRedo = false;
      });
    },

    updateTitle: (title) => {
      set((state) => {
        if (state.presentation) {
          // Push history before mutation
          pushHistoryInDraft(state);
          state.presentation.title = title;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    setTheme: (themeId) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          state.presentation.themeId = themeId;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    addSlide: (layout = 'title-content', afterIndex) => {
      const state = get();
      const slides = state.presentation?.slides || [];
      const insertAt = afterIndex !== undefined ? afterIndex + 1 : slides.length;
      const newSlide = createDefaultSlide(layout, insertAt);

      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          state.presentation.slides.splice(insertAt, 0, newSlide);
          state.presentation.slides.forEach((s, i) => { s.index = i; });
          state.presentation.metadata.slideCount = state.presentation.slides.length;
          state.presentation.updatedAt = new Date().toISOString();
          state.selectedSlideId = newSlide.id;
          state.selectedBlockId = null;
        }
      });
      return newSlide.id;
    },

    deleteSlide: (slideId) => {
      set((state) => {
        if (state.presentation && state.presentation.slides.length > 1) {
          pushHistoryInDraft(state);
          const idx = state.presentation.slides.findIndex((s) => s.id === slideId);
          state.presentation.slides.splice(idx, 1);
          state.presentation.slides.forEach((s, i) => { s.index = i; });
          state.presentation.metadata.slideCount = state.presentation.slides.length;
          if (state.selectedSlideId === slideId) {
            state.selectedSlideId = state.presentation.slides[Math.max(0, idx - 1)]?.id || null;
          }
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    duplicateSlide: (slideId) => {
      set((state) => {
        if (state.presentation) {
          const idx = state.presentation.slides.findIndex((s) => s.id === slideId);
          if (idx === -1) return;
          pushHistoryInDraft(state);
          const original = state.presentation.slides[idx];
          const duplicate: Slide = JSON.parse(JSON.stringify(original));
          duplicate.id = `slide_${nanoid(8)}`;
          duplicate.content.forEach((block) => { block.id = `block_${nanoid(8)}`; });
          state.presentation.slides.splice(idx + 1, 0, duplicate);
          state.presentation.slides.forEach((s, i) => { s.index = i; });
          state.presentation.metadata.slideCount = state.presentation.slides.length;
          state.selectedSlideId = duplicate.id;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    reorderSlides: (fromIndex, toIndex) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const [moved] = state.presentation.slides.splice(fromIndex, 1);
          state.presentation.slides.splice(toIndex, 0, moved);
          state.presentation.slides.forEach((s, i) => { s.index = i; });
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    selectSlide: (slideId) => {
      set((state) => {
        state.selectedSlideId = slideId;
        state.selectedBlockId = null;
      });
    },

    updateSlideBackground: (slideId, background) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) slide.background = background;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    updateSpeakerNotes: (slideId, notes) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) slide.speakerNotes = notes;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    selectBlock: (blockId) => {
      set((state) => {
        state.selectedBlockId = blockId;
      });
    },

    addBlock: (slideId, block) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) {
            slide.content.push(block);
            state.presentation.updatedAt = new Date().toISOString();
          }
        }
      });
    },

    updateBlock: (slideId, blockId, updates) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) {
            const block = slide.content.find((b) => b.id === blockId);
            if (block) {
              Object.assign(block, updates);
              state.presentation.updatedAt = new Date().toISOString();
            }
          }
        }
      });
    },

    deleteBlock: (slideId, blockId) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) {
            slide.content = slide.content.filter((b) => b.id !== blockId);
            if (state.selectedBlockId === blockId) state.selectedBlockId = null;
            state.presentation.updatedAt = new Date().toISOString();
          }
        }
      });
    },

    setSlides: (slides) => {
      set((state) => {
        if (state.presentation) {
          pushHistoryInDraft(state);
          state.presentation.slides = slides;
          state.presentation.metadata.slideCount = slides.length;
          state.presentation.updatedAt = new Date().toISOString();
        }
      });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0 && state.history.length > 0) {
          state.historyIndex -= 1;
          // Restore from plain JSON snapshot
          const snapshot = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
          state.presentation = snapshot;
          state.canUndo = state.historyIndex > 0;
          state.canRedo = state.historyIndex < state.history.length - 1;
          // Try to keep selection valid
          if (state.presentation) {
            const slideExists = state.presentation.slides.some((s) => s.id === state.selectedSlideId);
            if (!slideExists) {
              state.selectedSlideId = state.presentation.slides[0]?.id || null;
            }
            if (state.selectedBlockId) {
              const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
              const blockExists = slide?.content.some((b) => b.id === state.selectedBlockId);
              if (!blockExists) {
                state.selectedBlockId = null;
              }
            }
          }
        }
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          const snapshot = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
          state.presentation = snapshot;
          state.canUndo = state.historyIndex > 0;
          state.canRedo = state.historyIndex < state.history.length - 1;
          // Try to keep selection valid
          if (state.presentation) {
            const slideExists = state.presentation.slides.some((s) => s.id === state.selectedSlideId);
            if (!slideExists) {
              state.selectedSlideId = state.presentation.slides[0]?.id || null;
            }
            if (state.selectedBlockId) {
              const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
              const blockExists = slide?.content.some((b) => b.id === state.selectedBlockId);
              if (!blockExists) {
                state.selectedBlockId = null;
              }
            }
          }
        }
      });
    },

    copyBlock: (block) => {
      set((state) => {
        state.copiedBlock = JSON.parse(JSON.stringify(block));
      });
    },

    pasteBlock: (slideId) => {
      set((state) => {
        if (state.presentation && state.copiedBlock) {
          pushHistoryInDraft(state);
          const slide = state.presentation.slides.find((s) => s.id === slideId);
          if (slide) {
            const newBlock: ContentBlock = JSON.parse(JSON.stringify(state.copiedBlock));
            newBlock.id = `block_${nanoid(8)}`;
            // Offset the pasted block slightly so it doesn't overlap exactly
            newBlock.position = {
              ...newBlock.position,
              x: newBlock.position.x + 2,
              y: newBlock.position.y + 2,
            };
            slide.content.push(newBlock);
            state.selectedBlockId = newBlock.id;
            state.presentation.updatedAt = new Date().toISOString();
          }
        }
      });
    },
  }))
);

/**
 * Push the current presentation state onto the history stack (called inside an immer draft).
 * Truncates any forward history (redo states) when a new change is made.
 * Caps history at MAX_HISTORY entries.
 */
function pushHistoryInDraft(state: {
  presentation: Presentation | null;
  history: Presentation[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}) {
  if (!state.presentation) return;

  // Clone the current presentation to a plain object before mutation
  const snapshot = clonePresentation(state.presentation as Presentation);

  // Truncate any forward history (redo branch)
  state.history = state.history.slice(0, state.historyIndex + 1);

  // Push the new snapshot
  state.history.push(snapshot);

  // Cap at MAX_HISTORY
  if (state.history.length > MAX_HISTORY) {
    state.history = state.history.slice(state.history.length - MAX_HISTORY);
  }

  state.historyIndex = state.history.length - 1;
  state.canUndo = state.historyIndex > 0;
  state.canRedo = false;
}
