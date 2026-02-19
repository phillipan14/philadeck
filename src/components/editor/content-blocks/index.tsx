import type { ContentBlock } from '@/types/presentation';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import ListBlock from './ListBlock';
import QuoteBlock from './QuoteBlock';
import IconListBlock from './IconListBlock';
import ChartBlock from './ChartBlock';
import TimelineBlock from './TimelineBlock';
import DiagramBlock from './DiagramBlock';

export { TextBlock, ImageBlock, ListBlock, QuoteBlock, IconListBlock, ChartBlock, TimelineBlock, DiagramBlock };

export interface RenderBlockProps {
  block: ContentBlock;
  editable?: boolean;
  onUpdate?: (content: string) => void;
}

export function RenderBlock({ block, editable, onUpdate }: RenderBlockProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} editable={editable} onUpdate={onUpdate} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'quote':
      return <QuoteBlock block={block} />;
    case 'icon-list':
      return <IconListBlock block={block} />;
    case 'chart':
      return <ChartBlock block={block} editable={editable} />;
    case 'timeline':
      return <TimelineBlock block={block} editable={editable} />;
    case 'diagram':
      return <DiagramBlock block={block} editable={editable} />;
    default:
      return null;
  }
}
