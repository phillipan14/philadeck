'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import SlideRenderer from '@/components/editor/SlideRenderer';
import type { Presentation, ThemeProperties } from '@/types/presentation';
import { getTheme } from '@/lib/themes/presets';

interface PresenterViewProps {
  presentation: Presentation;
  initialSlideIndex?: number;
  onExit?: () => void;
}

export default function PresenterView({
  presentation,
  initialSlideIndex = 0,
  onExit,
}: PresenterViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = presentation.slides.length;
  const theme: ThemeProperties = getTheme(presentation.themeId);

  // Start elapsed timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSlides) return;
      setCurrentIndex(index);
    },
    [totalSlides],
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onExit?.();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onExit, goToSlide, totalSlides]);

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hrs > 0) parts.push(String(hrs).padStart(2, '0'));
    parts.push(String(mins).padStart(2, '0'));
    parts.push(String(secs).padStart(2, '0'));

    return parts.join(':');
  };

  const currentSlide = presentation.slides[currentIndex];
  const nextSlideData =
    currentIndex + 1 < totalSlides
      ? presentation.slides[currentIndex + 1]
      : null;

  if (!currentSlide) return null;

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700 flex-shrink-0">
        <div className="text-sm font-medium truncate max-w-[40%]">
          {presentation.title}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-neutral-400">
            Slide {currentIndex + 1} of {totalSlides}
          </div>
          <div className="text-sm font-mono text-neutral-300 bg-neutral-700 px-3 py-1 rounded">
            {formatTime(elapsedSeconds)}
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-neutral-700"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Current slide (large) */}
        <div className="flex-[3] flex flex-col gap-3 min-w-0">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
              <SlideRenderer
                slide={currentSlide}
                theme={theme}
                scale={0.75}
              />
            </div>
          </div>

          {/* Speaker notes */}
          <div className="flex-shrink-0 bg-neutral-800 rounded-lg p-4 max-h-40 overflow-y-auto border border-neutral-700">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Speaker Notes
            </div>
            {currentSlide.speakerNotes ? (
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {currentSlide.speakerNotes}
              </p>
            ) : (
              <p className="text-sm text-neutral-600 italic">
                No speaker notes for this slide
              </p>
            )}
          </div>
        </div>

        {/* Next slide preview (smaller) */}
        <div className="flex-[1] flex flex-col gap-3 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
            Next Slide
          </div>
          <div className="flex-shrink-0 flex items-start justify-center">
            {nextSlideData ? (
              <div className="opacity-70">
                <SlideRenderer
                  slide={nextSlideData}
                  theme={theme}
                  scale={0.3}
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center bg-neutral-800 rounded border border-neutral-700"
                style={{ width: `${960 * 0.3}px`, height: `${540 * 0.3}px` }}
              >
                <span className="text-xs text-neutral-600">
                  End of presentation
                </span>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="flex-1 py-2 px-3 text-xs rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === totalSlides - 1}
              className="flex-1 py-2 px-3 text-xs rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
