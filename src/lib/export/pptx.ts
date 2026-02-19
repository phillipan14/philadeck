import PptxGenJS from "pptxgenjs";
import type {
  Presentation,
  ContentBlock,
  TextBlock,
  ImageBlock,
  ListBlock,
  QuoteBlock,
  IconListBlock,
} from "@/types/presentation";
import type { ThemeProperties } from "@/types/presentation";

// Slide dimensions in inches for 16:9 aspect ratio
const SLIDE_WIDTH = 10;
const SLIDE_HEIGHT = 5.625;

/**
 * Convert percentage-based position to inches.
 * Positions in the presentation model are stored as percentages (0-100).
 */
function toInches(
  position: ContentBlock["position"]
): { x: number; y: number; w: number; h: number } {
  return {
    x: (position.x / 100) * SLIDE_WIDTH,
    y: (position.y / 100) * SLIDE_HEIGHT,
    w: (position.width / 100) * SLIDE_WIDTH,
    h: (position.height / 100) * SLIDE_HEIGHT,
  };
}

/**
 * Map text style to font size in points.
 */
function getFontSize(textStyle: TextBlock["textStyle"]): number {
  switch (textStyle) {
    case "title":
      return 36;
    case "subtitle":
      return 20;
    case "heading":
      return 28;
    case "body":
      return 14;
    case "caption":
      return 11;
    default:
      return 14;
  }
}

/**
 * Map text style to bold/italic settings.
 */
function getFontStyle(textStyle: TextBlock["textStyle"]): {
  bold: boolean;
  italic: boolean;
} {
  switch (textStyle) {
    case "title":
      return { bold: true, italic: false };
    case "subtitle":
      return { bold: false, italic: false };
    case "heading":
      return { bold: true, italic: false };
    case "body":
      return { bold: false, italic: false };
    case "caption":
      return { bold: false, italic: true };
    default:
      return { bold: false, italic: false };
  }
}

/**
 * Strip a leading '#' from a hex color for PptxGenJS compatibility.
 */
function stripHash(color: string): string {
  return color.startsWith("#") ? color.slice(1) : color;
}

/**
 * Render a text block onto a pptx slide.
 */
function renderTextBlock(
  slide: PptxGenJS.Slide,
  block: TextBlock,
  theme: ThemeProperties
): void {
  const pos = toInches(block.position);
  const fontSize = getFontSize(block.textStyle);
  const fontStyle = getFontStyle(block.textStyle);
  const isHeading = ["title", "heading"].includes(block.textStyle);
  const color = isHeading ? theme.colors.heading : theme.colors.text;

  slide.addText(block.content, {
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    fontSize,
    fontFace: isHeading ? theme.fonts.heading : theme.fonts.body,
    color: stripHash(color),
    bold: fontStyle.bold,
    italic: fontStyle.italic,
    align: block.alignment === "center" ? "center" : block.alignment === "right" ? "right" : "left",
    valign: "top",
    wrap: true,
  });
}

/**
 * Render an image block onto a pptx slide.
 */
function renderImageBlock(
  slide: PptxGenJS.Slide,
  block: ImageBlock
): void {
  if (!block.src) return;

  const pos = toInches(block.position);

  // Support both URL and data URI images
  if (block.src.startsWith("data:")) {
    slide.addImage({
      data: block.src,
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
    });
  } else {
    slide.addImage({
      path: block.src,
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
    });
  }
}

/**
 * Render a list block onto a pptx slide.
 */
function renderListBlock(
  slide: PptxGenJS.Slide,
  block: ListBlock,
  theme: ThemeProperties
): void {
  const pos = toInches(block.position);

  const textRows = block.items.map((item, index) => ({
    text: block.variant === "numbered" ? `${index + 1}. ${item.text}` : item.text,
    options: {
      fontSize: 14,
      fontFace: theme.fonts.body,
      color: stripHash(theme.colors.text),
      bullet: block.variant === "bullet" || block.variant === "checklist"
        ? { type: "bullet" as const }
        : false as const,
    },
  }));

  slide.addText(
    textRows as PptxGenJS.TextProps[],
    {
      x: pos.x,
      y: pos.y,
      w: pos.w,
      h: pos.h,
      valign: "top",
      wrap: true,
      paraSpaceAfter: 6,
    }
  );
}

/**
 * Render a quote block onto a pptx slide.
 */
function renderQuoteBlock(
  slide: PptxGenJS.Slide,
  block: QuoteBlock,
  theme: ThemeProperties
): void {
  const pos = toInches(block.position);

  // Add a left border accent shape
  slide.addShape("rect" as unknown as PptxGenJS.ShapeType, {
    x: pos.x,
    y: pos.y,
    w: 0.05,
    h: pos.h,
    fill: { color: stripHash(theme.colors.primary) },
    line: { color: stripHash(theme.colors.primary), width: 0 },
  });

  // Add quote text
  slide.addText(
    [
      {
        text: `"${block.text}"`,
        options: {
          fontSize: 18,
          fontFace: theme.fonts.body,
          color: stripHash(theme.colors.text),
          italic: true,
        },
      },
      {
        text: block.attribution ? `\n\n-- ${block.attribution}` : "",
        options: {
          fontSize: 12,
          fontFace: theme.fonts.body,
          color: stripHash(theme.colors.muted),
        },
      },
    ],
    {
      x: pos.x + 0.15,
      y: pos.y,
      w: pos.w - 0.15,
      h: pos.h,
      valign: "middle",
      wrap: true,
    }
  );
}

/**
 * Render an icon list block onto a pptx slide.
 */
function renderIconListBlock(
  slide: PptxGenJS.Slide,
  block: IconListBlock,
  theme: ThemeProperties
): void {
  const pos = toInches(block.position);
  const itemWidth = pos.w / block.columns;

  block.items.forEach((item, index) => {
    const col = index % block.columns;
    const row = Math.floor(index / block.columns);
    const rowHeight = 1.2;

    slide.addText(
      [
        {
          text: item.title,
          options: {
            fontSize: 14,
            fontFace: theme.fonts.heading,
            color: stripHash(theme.colors.heading),
            bold: true,
          },
        },
        {
          text: `\n${item.description}`,
          options: {
            fontSize: 11,
            fontFace: theme.fonts.body,
            color: stripHash(theme.colors.text),
          },
        },
      ],
      {
        x: pos.x + col * itemWidth,
        y: pos.y + row * rowHeight,
        w: itemWidth - 0.1,
        h: rowHeight,
        valign: "top",
        wrap: true,
      }
    );
  });
}

/**
 * Export a presentation as a PPTX file.
 * Downloads the file to the user's machine.
 */
export async function exportToPptx(
  presentation: Presentation,
  theme: ThemeProperties
): Promise<void> {
  const pptx = new PptxGenJS();

  // Configure the presentation
  pptx.layout = "LAYOUT_WIDE"; // 16:9 (13.33" x 7.5") - closest built-in to our model
  pptx.title = presentation.title;
  pptx.author = "PhilaDeck";

  for (const slideData of presentation.slides) {
    const slide = pptx.addSlide();

    // Set background
    const bgColor =
      slideData.background.type === "solid" && slideData.background.value
        ? slideData.background.value
        : theme.colors.background;

    if (slideData.background.type === "gradient" && slideData.background.value) {
      // For gradient backgrounds, use the theme background as fallback
      slide.background = { fill: stripHash(bgColor) };
    } else {
      slide.background = { fill: stripHash(bgColor) };
    }

    // Render each content block
    for (const block of slideData.content) {
      switch (block.type) {
        case "text":
          renderTextBlock(slide, block, theme);
          break;
        case "image":
          renderImageBlock(slide, block);
          break;
        case "list":
          renderListBlock(slide, block, theme);
          break;
        case "quote":
          renderQuoteBlock(slide, block, theme);
          break;
        case "icon-list":
          renderIconListBlock(slide, block, theme);
          break;
        // chart, timeline, diagram blocks are more complex and handled as text fallbacks
        case "chart":
          slide.addText(block.title || "Chart", {
            x: toInches(block.position).x,
            y: toInches(block.position).y,
            w: toInches(block.position).w,
            h: toInches(block.position).h,
            fontSize: 14,
            fontFace: theme.fonts.body,
            color: stripHash(theme.colors.text),
            align: "center",
            valign: "middle",
          });
          break;
        case "timeline": {
          const timelineTexts = block.items
            .map((item) => `${item.date ? item.date + ": " : ""}${item.title}`)
            .join("\n");
          slide.addText(timelineTexts, {
            x: toInches(block.position).x,
            y: toInches(block.position).y,
            w: toInches(block.position).w,
            h: toInches(block.position).h,
            fontSize: 12,
            fontFace: theme.fonts.body,
            color: stripHash(theme.colors.text),
            valign: "top",
            wrap: true,
          });
          break;
        }
        case "diagram": {
          const diagramTexts = block.items
            .map((item) => item.label)
            .join(" > ");
          slide.addText(diagramTexts, {
            x: toInches(block.position).x,
            y: toInches(block.position).y,
            w: toInches(block.position).w,
            h: toInches(block.position).h,
            fontSize: 12,
            fontFace: theme.fonts.body,
            color: stripHash(theme.colors.text),
            align: "center",
            valign: "middle",
            wrap: true,
          });
          break;
        }
      }
    }
  }

  // Download the file
  const fileName = presentation.title.replace(/[^a-zA-Z0-9\s-_]/g, "").trim() || "presentation";
  await pptx.writeFile({ fileName: `${fileName}.pptx` });
}
