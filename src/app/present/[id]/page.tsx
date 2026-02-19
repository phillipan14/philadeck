'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadPresentation } from '@/lib/storage';
import { getTheme } from '@/lib/themes/presets';
import SlideRenderer from '@/components/editor/SlideRenderer';
import type { Presentation, ThemeProperties } from '@/types/presentation';

const SLIDE_BASE_WIDTH = 960;
const SLIDE_BASE_HEIGHT = 540;
const CURSOR_HIDE_DELAY_MS = 3000;

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load presentation from localStorage
  useEffect(() => {
    if (!id) return;
    const pres = loadPresentation(id);
    if (!pres) {
      router.replace('/');
      return;
    }
    setPresentation(pres);
  }, [id, router]);

  // Calculate scale to fit screen while maintaining 16:9 aspect ratio
  const updateScale = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scaleX = vw / SLIDE_BASE_WIDTH;
    const scaleY = vh / SLIDE_BASE_HEIGHT;
    const newScale = Math.min(scaleX, scaleY);

    setScale(newScale);
    setOffsetX((vw - SLIDE_BASE_WIDTH * newScale) / 2);
    setOffsetY((vh - SLIDE_BASE_HEIGHT * newScale) / 2);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const totalSlides = presentation?.slides.length ?? 0;

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSlides || index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);
    },
    [totalSlides, currentIndex],
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const exitPresentation = useCallback(() => {
    router.push(`/editor/${id}`);
  }, [router, id]);

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
          exitPresentation();
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
  }, [nextSlide, prevSlide, exitPresentation, goToSlide, totalSlides]);

  // Click navigation: left half = prev, right half = next
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const midpoint = rect.width / 2;

      if (x > midpoint) {
        nextSlide();
      } else {
        prevSlide();
      }
    },
    [nextSlide, prevSlide],
  );

  // Auto-hide cursor after inactivity
  const resetCursorTimer = useCallback(() => {
    setCursorVisible(true);
    if (cursorTimerRef.current) {
      clearTimeout(cursorTimerRef.current);
    }
    cursorTimerRef.current = setTimeout(() => {
      setCursorVisible(false);
    }, CURSOR_HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    resetCursorTimer();

    function handleMouseMove() {
      resetCursorTimer();
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
    };
  }, [resetCursorTimer]);

  if (!presentation) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading presentation...</div>
      </div>
    );
  }

  const currentSlide = presentation.slides[currentIndex];
  const theme: ThemeProperties = getTheme(presentation.themeId);

  if (!currentSlide) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/40 text-sm">No slides found</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black select-none overflow-hidden"
      style={{ cursor: cursorVisible ? 'default' : 'none' }}
      onClick={handleClick}
    >
      {/* Slide container - centered with letterboxing */}
      <div
        className="absolute transition-opacity duration-200 ease-in-out"
        style={{
          left: `${offsetX}px`,
          top: `${offsetY}px`,
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        <SlideRenderer slide={currentSlide} theme={theme} scale={scale} />
      </div>

      {/* Slide number indicator */}
      <div
        className="fixed bottom-4 right-6 text-white/30 text-xs font-mono transition-opacity duration-300"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      >
        {currentIndex + 1} / {totalSlides}
      </div>
    </div>
  );
}
