import type { Presentation } from "@/types/presentation";

const STORAGE_PREFIX = "philadeck_pres_";

/**
 * Save a presentation to localStorage.
 */
export function savePresentation(presentation: Presentation): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_PREFIX}${presentation.id}`;
    const data = JSON.stringify(presentation);
    localStorage.setItem(key, data);
  } catch (error) {
    console.error("[PhilaDeck] Failed to save presentation:", error);
  }
}

/**
 * Load a presentation from localStorage by ID.
 * Returns null if not found or on error.
 */
export function loadPresentation(id: string): Presentation | null {
  if (typeof window === "undefined") return null;

  try {
    const key = `${STORAGE_PREFIX}${id}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as Presentation;
  } catch (error) {
    console.error("[PhilaDeck] Failed to load presentation:", error);
    return null;
  }
}

/**
 * List all saved presentations with basic metadata.
 * Returns an array sorted by updatedAt (most recent first).
 */
export function listPresentations(): Array<{
  id: string;
  title: string;
  updatedAt: string;
}> {
  if (typeof window === "undefined") return [];

  try {
    const presentations: Array<{
      id: string;
      title: string;
      updatedAt: string;
    }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;

      try {
        const data = localStorage.getItem(key);
        if (!data) continue;
        const parsed = JSON.parse(data) as Presentation;
        presentations.push({
          id: parsed.id,
          title: parsed.title,
          updatedAt: parsed.updatedAt,
        });
      } catch {
        // Skip corrupted entries
        continue;
      }
    }

    // Sort by most recently updated
    presentations.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return presentations;
  } catch (error) {
    console.error("[PhilaDeck] Failed to list presentations:", error);
    return [];
  }
}

/**
 * Delete a presentation from localStorage by ID.
 */
export function deletePresentation(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_PREFIX}${id}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("[PhilaDeck] Failed to delete presentation:", error);
  }
}
