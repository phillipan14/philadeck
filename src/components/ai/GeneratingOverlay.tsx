'use client';

import { Sparkles } from 'lucide-react';

interface GeneratingOverlayProps {
  currentSlide: number;
  totalSlides: number;
  status?: string;
  completedThumbnails?: Array<{ title: string; layout: string }>;
}

export default function GeneratingOverlay({
  currentSlide,
  totalSlides,
  status,
  completedThumbnails = [],
}: GeneratingOverlayProps) {
  const progress =
    totalSlides > 0 ? Math.round((currentSlide / totalSlides) * 100) : 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-xl border border-border bg-background p-8 shadow-lg">
        {/* Animated sparkle icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute inset-0 h-10 w-10 animate-ping opacity-20">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Status text */}
        <p className="text-center text-sm font-medium mb-1">
          {status || `Generating slide ${currentSlide} of ${totalSlides}...`}
        </p>
        <p className="text-center text-xs text-muted-foreground mb-4">
          {progress}% complete
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Completed slide thumbnails */}
        {completedThumbnails.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Completed slides:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {completedThumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-md border border-border bg-muted/50 flex items-center justify-center p-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="text-[9px] text-muted-foreground text-center leading-tight truncate">
                    {thumb.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
