'use client';

import type { DiagramBlock as DiagramBlockType } from '@/types/presentation';

interface DiagramBlockProps {
  block: DiagramBlockType;
  editable?: boolean;
}

export default function DiagramBlock({ block }: DiagramBlockProps) {
  switch (block.diagramType) {
    case 'cycle':
      return <CycleDiagram items={block.items} />;
    case 'pyramid':
      return <PyramidDiagram items={block.items} />;
    case 'funnel':
      return <FunnelDiagram items={block.items} />;
    case 'flowchart':
      return <FlowchartDiagram items={block.items} />;
    case 'venn':
      return <VennDiagram items={block.items} />;
    default:
      return null;
  }
}

// --- Cycle Diagram ---
function CycleDiagram({ items }: { items: DiagramBlockType['items'] }) {
  const count = items.length;
  if (count === 0) return null;

  // Layout items in a circle using SVG
  const svgSize = 300;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = 105;
  const nodeRadius = 32;

  const angleStep = (2 * Math.PI) / count;
  // Start from the top (-PI/2)
  const startAngle = -Math.PI / 2;

  const nodePositions = items.map((_, i) => {
    const angle = startAngle + i * angleStep;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle,
    };
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full" style={{ maxWidth: svgSize, maxHeight: svgSize }}>
        {/* Arrow paths between nodes */}
        {nodePositions.map((pos, i) => {
          const next = nodePositions[(i + 1) % count];
          // Calculate the start and end of the arrow (offset from node center)
          const dx = next.x - pos.x;
          const dy = next.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;

          const startX = pos.x + nx * (nodeRadius + 4);
          const startY = pos.y + ny * (nodeRadius + 4);
          const endX = next.x - nx * (nodeRadius + 8);
          const endY = next.y - ny * (nodeRadius + 8);

          // Curved path via midpoint offset
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const perpX = -ny * 15;
          const perpY = nx * 15;

          return (
            <g key={`arrow-${i}`}>
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    style={{ fill: 'var(--df-primary)' }}
                  />
                </marker>
              </defs>
              <path
                d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                fill="none"
                strokeWidth={2}
                markerEnd={`url(#arrowhead-${i})`}
                style={{ stroke: 'var(--df-primary)' }}
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodePositions.map((pos, i) => {
          const item = items[i];
          return (
            <g key={item.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                strokeWidth={2.5}
                style={{
                  fill: 'var(--df-surface)',
                  stroke: 'var(--df-primary)',
                }}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: 'var(--df-heading)',
                  fontFamily: 'var(--df-font-heading)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {truncateText(item.label, 12)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Pyramid Diagram ---
function PyramidDiagram({ items }: { items: DiagramBlockType['items'] }) {
  const count = items.length;
  if (count === 0) return null;

  const svgWidth = 320;
  const svgHeight = 260;
  const topWidth = 40;
  const bottomWidth = 280;
  const startY = 15;
  const totalHeight = svgHeight - 30;
  const layerGap = 3;
  const layerHeight = (totalHeight - layerGap * (count - 1)) / count;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" style={{ maxWidth: svgWidth, maxHeight: svgHeight }}>
        {items.map((item, i) => {
          const t1 = i / count;
          const t2 = (i + 1) / count;
          const w1 = topWidth + (bottomWidth - topWidth) * t1;
          const w2 = topWidth + (bottomWidth - topWidth) * t2;
          const y1 = startY + i * (layerHeight + layerGap);
          const y2 = y1 + layerHeight;
          const cx = svgWidth / 2;

          const x1Left = cx - w1 / 2;
          const x1Right = cx + w1 / 2;
          const x2Left = cx - w2 / 2;
          const x2Right = cx + w2 / 2;

          const opacity = 1 - i * 0.12;

          return (
            <g key={item.id}>
              <polygon
                points={`${x1Left},${y1} ${x1Right},${y1} ${x2Right},${y2} ${x2Left},${y2}`}
                strokeWidth={1.5}
                opacity={opacity}
                style={{
                  fill: 'var(--df-primary)',
                  stroke: 'var(--df-background)',
                }}
              />
              <text
                x={cx}
                y={(y1 + y2) / 2}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: 'var(--df-background)',
                  fontFamily: 'var(--df-font-heading)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {truncateText(item.label, 20)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Funnel Diagram ---
function FunnelDiagram({ items }: { items: DiagramBlockType['items'] }) {
  const count = items.length;
  if (count === 0) return null;

  const svgWidth = 320;
  const svgHeight = 260;
  const topWidth = 280;
  const bottomWidth = 60;
  const startY = 15;
  const totalHeight = svgHeight - 30;
  const layerGap = 3;
  const layerHeight = (totalHeight - layerGap * (count - 1)) / count;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" style={{ maxWidth: svgWidth, maxHeight: svgHeight }}>
        {items.map((item, i) => {
          const t1 = i / count;
          const t2 = (i + 1) / count;
          const w1 = topWidth - (topWidth - bottomWidth) * t1;
          const w2 = topWidth - (topWidth - bottomWidth) * t2;
          const y1 = startY + i * (layerHeight + layerGap);
          const y2 = y1 + layerHeight;
          const cx = svgWidth / 2;

          const x1Left = cx - w1 / 2;
          const x1Right = cx + w1 / 2;
          const x2Left = cx - w2 / 2;
          const x2Right = cx + w2 / 2;

          const opacity = 1 - i * 0.1;

          return (
            <g key={item.id}>
              <polygon
                points={`${x1Left},${y1} ${x1Right},${y1} ${x2Right},${y2} ${x2Left},${y2}`}
                strokeWidth={1.5}
                opacity={opacity}
                style={{
                  fill: 'var(--df-primary)',
                  stroke: 'var(--df-background)',
                }}
              />
              <text
                x={cx}
                y={(y1 + y2) / 2 - (item.description ? 5 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: 'var(--df-background)',
                  fontFamily: 'var(--df-font-heading)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {truncateText(item.label, 20)}
              </text>
              {item.description && (
                <text
                  x={cx}
                  y={(y1 + y2) / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fill: 'var(--df-background)',
                    fontFamily: 'var(--df-font-body)',
                    fontSize: '9px',
                    opacity: 0.85,
                  }}
                >
                  {truncateText(item.description, 25)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Flowchart Diagram ---
function FlowchartDiagram({ items }: { items: DiagramBlockType['items'] }) {
  if (items.length === 0) return null;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto px-2 py-2">
      <div className="flex items-center gap-0">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center flex-shrink-0">
            {/* Box */}
            <div
              className="px-4 py-3 text-center min-w-[100px] max-w-[160px]"
              style={{
                backgroundColor: 'var(--df-surface)',
                border: '2px solid var(--df-primary)',
                borderRadius: 'var(--df-radius)',
              }}
            >
              <div
                className="font-semibold"
                style={{
                  fontFamily: 'var(--df-font-heading)',
                  color: 'var(--df-heading)',
                  fontSize: '0.8rem',
                }}
              >
                {item.label}
              </div>
              {item.description && (
                <div
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--df-font-body)',
                    color: 'var(--df-text)',
                    fontSize: '0.65rem',
                    lineHeight: 1.3,
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>

            {/* Arrow between boxes */}
            {i < items.length - 1 && (
              <svg width="36" height="20" viewBox="0 0 36 20" className="flex-shrink-0">
                <line
                  x1="2"
                  y1="10"
                  x2="28"
                  y2="10"
                  strokeWidth={2}
                  style={{ stroke: 'var(--df-primary)' }}
                />
                <polygon
                  points="26,5 34,10 26,15"
                  style={{ fill: 'var(--df-primary)' }}
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Venn Diagram ---
function VennDiagram({ items }: { items: DiagramBlockType['items'] }) {
  const count = Math.min(items.length, 3);
  if (count === 0) return null;

  const svgWidth = 320;
  const svgHeight = 260;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;
  const circleRadius = count === 1 ? 80 : count === 2 ? 70 : 60;
  const overlap = circleRadius * 0.55;

  // Colors as an array
  const colorVars = ['var(--df-primary)', 'var(--df-accent)', 'var(--df-secondary)'];

  const positions: Array<{ x: number; y: number }> = [];
  if (count === 1) {
    positions.push({ x: cx, y: cy });
  } else if (count === 2) {
    positions.push({ x: cx - overlap, y: cy });
    positions.push({ x: cx + overlap, y: cy });
  } else {
    // 3 circles in triangle arrangement
    const angleOffset = -Math.PI / 2;
    for (let i = 0; i < 3; i++) {
      const angle = angleOffset + (2 * Math.PI * i) / 3;
      positions.push({
        x: cx + overlap * Math.cos(angle),
        y: cy + overlap * Math.sin(angle),
      });
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" style={{ maxWidth: svgWidth, maxHeight: svgHeight }}>
        {/* Circles */}
        {positions.map((pos, i) => {
          const item = items[i];
          return (
            <g key={item.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={circleRadius}
                opacity={0.25}
                style={{ fill: colorVars[i] }}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={circleRadius}
                fill="none"
                strokeWidth={2}
                opacity={0.7}
                style={{ stroke: colorVars[i] }}
              />
            </g>
          );
        })}

        {/* Labels - positioned slightly away from center for multi-circle */}
        {positions.map((pos, i) => {
          const item = items[i];
          // Push label slightly outward from center for readability
          let labelX = pos.x;
          let labelY = pos.y;
          if (count > 1) {
            const dx = pos.x - cx;
            const dy = pos.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              labelX = pos.x + (dx / dist) * (circleRadius * 0.3);
              labelY = pos.y + (dy / dist) * (circleRadius * 0.3);
            }
          }

          return (
            <g key={`label-${item.id}`}>
              <text
                x={labelX}
                y={labelY - (item.description ? 6 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: 'var(--df-heading)',
                  fontFamily: 'var(--df-font-heading)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {truncateText(item.label, 14)}
              </text>
              {item.description && (
                <text
                  x={labelX}
                  y={labelY + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fill: 'var(--df-text)',
                    fontFamily: 'var(--df-font-body)',
                    fontSize: '9px',
                  }}
                >
                  {truncateText(item.description, 18)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Utility ---
function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '\u2026';
}
