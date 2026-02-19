'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { usePresentationStore } from '@/stores/presentation-store';
import { getTheme } from '@/lib/themes/presets';
import SlideRenderer from './SlideRenderer';

// Base slide dimensions (16:9)
const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

export default function SlideCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const presentation = usePresentationStore((s) => s.presentation);
  const selectedSlideId = usePresentationStore((s) => s.selectedSlideId);
  const selectedBlockId = usePresentationStore((s) => s.selectedBlockId);
  const selectBlock = usePresentationStore((s) => s.selectBlock);

  const selectedSlide = presentation?.slides.find(
    (s) => s.id === selectedSlideId,
  );
  const theme = presentation ? getTheme(presentation.themeId) : null;

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Add padding around the slide
    const padding = 64;
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const scaleX = availableWidth / SLIDE_WIDTH;
    const scaleY = availableHeight / SLIDE_HEIGHT;
    const newScale = Math.min(scaleX, scaleY, 1);

    setScale(Math.max(newScale, 0.1));
  }, []);

  useEffect(() => {
    calculateScale();

    const observer = new ResizeObserver(() => {
      calculateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculateScale]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on the canvas background
      if (e.target === e.currentTarget) {
        selectBlock(null);
      }
    },
    [selectBlock],
  );

  const handleSlideBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      // Deselect block when clicking the slide background (not a block)
      if (e.target === e.currentTarget) {
        selectBlock(null);
      }
    },
    [selectBlock],
  );

  if (!presentation || !selectedSlide || !theme) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">No slide selected</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-muted/30 overflow-hidden"
      onClick={handleCanvasClick}
    >
      <div
        className="shadow-lg rounded-sm"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        onClick={handleSlideBackgroundClick}
      >
        <SlideRenderer
          slide={selectedSlide}
          theme={theme}
          scale={1}
          editable
          onBlockClick={(blockId) => selectBlock(blockId)}
          selectedBlockId={selectedBlockId}
        />
      </div>
    </div>
  );
}
