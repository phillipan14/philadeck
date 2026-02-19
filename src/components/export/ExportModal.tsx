"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePresentationStore } from "@/stores/presentation-store";
import { getTheme } from "@/lib/themes/presets";
import { exportToPptx } from "@/lib/export/pptx";
import { exportToPdf } from "@/lib/export/pdf";

interface ExportModalProps {
  children: React.ReactNode;
}

export function ExportModal({ children }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<"pptx" | "pdf" | null>(null);
  const presentation = usePresentationStore((s) => s.presentation);

  const handleExportPptx = async () => {
    if (!presentation) return;

    setExporting("pptx");
    try {
      const theme = getTheme(presentation.themeId);
      await exportToPptx(presentation, theme);
    } catch (error) {
      console.error("[DeckForge] PPTX export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async () => {
    if (!presentation) return;

    setExporting("pdf");
    try {
      await exportToPdf(presentation.id);
    } catch (error) {
      console.error("[DeckForge] PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const isExporting = exporting !== null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Presentation</DialogTitle>
          <DialogDescription>
            Download your presentation in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {/* PPTX Export */}
          <button
            onClick={handleExportPptx}
            disabled={isExporting || !presentation}
            className="group flex w-full items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              {exporting === "pptx" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileDown className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Download PPTX
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Compatible with PowerPoint, Google Slides, and Keynote
              </p>
            </div>
          </button>

          {/* PDF Export (coming soon) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleExportPdf}
                  disabled={true}
                  className="group flex w-full items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left opacity-50 transition-all disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                    {exporting === "pdf" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Download PDF
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      High-quality PDF for printing and sharing
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    Coming soon
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>PDF export is coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
