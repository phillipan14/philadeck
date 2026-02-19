"use client";

import { useEffect, useRef } from "react";
import { usePresentationStore } from "@/stores/presentation-store";
import { savePresentation } from "@/lib/storage";

const AUTO_SAVE_DELAY_MS = 2000;

/**
 * Custom hook that watches the presentation store and automatically
 * saves to localStorage with a 2-second debounce.
 *
 * Usage: Call `useAutoSave()` once in the editor layout or page component.
 * It will subscribe to store changes and persist automatically.
 */
export function useAutoSave(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Subscribe to store changes via Zustand's subscribe
    const unsubscribe = usePresentationStore.subscribe((state) => {
      const presentation = state.presentation;
      if (!presentation) return;

      // Clear any pending save
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Debounce the save
      timerRef.current = setTimeout(() => {
        savePresentation(presentation);
      }, AUTO_SAVE_DELAY_MS);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
}
