'use client';

import { useEffect } from 'react';
import { usePresentationStore } from '@/stores/presentation-store';

/**
 * Returns true if the currently focused element is an input, textarea,
 * or contenteditable — in which case most keyboard shortcuts should be suppressed.
 */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  // Also check if inside a contenteditable ancestor
  if (target.closest('[contenteditable="true"]')) return true;
  return false;
}

/**
 * Hook that registers global keyboard shortcuts for the DeckForge editor.
 *
 * Shortcuts:
 * - Cmd/Ctrl + Z        → undo
 * - Cmd/Ctrl + Shift + Z (or Cmd/Ctrl + Y) → redo
 * - Cmd/Ctrl + D        → duplicate current slide
 * - Delete / Backspace   → delete selected block (only when not typing)
 * - Escape               → deselect block, then deselect slide
 * - Cmd/Ctrl + C        → copy selected block
 * - Cmd/Ctrl + V        → paste copied block
 * - Arrow keys           → navigate slides (when no block selected)
 * - Tab                  → cycle through blocks on current slide
 */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const state = usePresentationStore.getState();
      if (!state.presentation) return;

      const isMod = e.metaKey || e.ctrlKey;
      const isEditable = isEditableTarget(e.target);

      // --- Cmd/Ctrl + Z → undo ---
      if (isMod && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        state.undo();
        return;
      }

      // --- Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y → redo ---
      if ((isMod && e.shiftKey && e.key === 'z') || (isMod && e.key === 'y')) {
        e.preventDefault();
        state.redo();
        return;
      }

      // --- Cmd/Ctrl + D → duplicate current slide ---
      if (isMod && e.key === 'd') {
        e.preventDefault();
        if (state.selectedSlideId) {
          state.duplicateSlide(state.selectedSlideId);
        }
        return;
      }

      // --- Cmd/Ctrl + C → copy selected block ---
      if (isMod && e.key === 'c' && !isEditable) {
        if (state.selectedBlockId && state.selectedSlideId) {
          const slide = state.presentation.slides.find(
            (s) => s.id === state.selectedSlideId
          );
          const block = slide?.content.find(
            (b) => b.id === state.selectedBlockId
          );
          if (block) {
            e.preventDefault();
            state.copyBlock(block);
          }
        }
        return;
      }

      // --- Cmd/Ctrl + V → paste copied block ---
      if (isMod && e.key === 'v' && !isEditable) {
        if (state.copiedBlock && state.selectedSlideId) {
          e.preventDefault();
          state.pasteBlock(state.selectedSlideId);
        }
        return;
      }

      // Skip remaining shortcuts when inside editable fields
      if (isEditable) return;

      // --- Delete / Backspace → delete selected block ---
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedBlockId && state.selectedSlideId) {
        e.preventDefault();
        state.deleteBlock(state.selectedSlideId, state.selectedBlockId);
        return;
      }

      // --- Escape → deselect block, then deselect slide ---
      if (e.key === 'Escape') {
        e.preventDefault();
        if (state.selectedBlockId) {
          state.selectBlock(null);
        } else if (state.selectedSlideId) {
          state.selectSlide(null);
        }
        return;
      }

      // --- Arrow keys → navigate slides (when no block selected) ---
      if (!state.selectedBlockId && (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
        const slides = state.presentation.slides;
        const currentIdx = slides.findIndex((s) => s.id === state.selectedSlideId);
        if (currentIdx === -1) return;

        e.preventDefault();

        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          if (currentIdx > 0) {
            state.selectSlide(slides[currentIdx - 1].id);
          }
        } else {
          if (currentIdx < slides.length - 1) {
            state.selectSlide(slides[currentIdx + 1].id);
          }
        }
        return;
      }

      // --- Tab → cycle through blocks on current slide ---
      if (e.key === 'Tab' && state.selectedSlideId) {
        const slide = state.presentation.slides.find(
          (s) => s.id === state.selectedSlideId
        );
        if (!slide || slide.content.length === 0) return;

        e.preventDefault();

        if (!state.selectedBlockId) {
          // Select first block
          state.selectBlock(slide.content[0].id);
        } else {
          const currentBlockIdx = slide.content.findIndex(
            (b) => b.id === state.selectedBlockId
          );
          if (e.shiftKey) {
            // Shift+Tab → previous block (wrap around)
            const prevIdx = currentBlockIdx <= 0 ? slide.content.length - 1 : currentBlockIdx - 1;
            state.selectBlock(slide.content[prevIdx].id);
          } else {
            // Tab → next block (wrap around)
            const nextIdx = (currentBlockIdx + 1) % slide.content.length;
            state.selectBlock(slide.content[nextIdx].id);
          }
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
