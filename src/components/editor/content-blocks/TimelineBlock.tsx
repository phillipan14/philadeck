'use client';

import type { TimelineBlock as TimelineBlockType } from '@/types/presentation';

interface TimelineBlockProps {
  block: TimelineBlockType;
  editable?: boolean;
}

export default function TimelineBlock({ block }: TimelineBlockProps) {
  if (block.orientation === 'horizontal') {
    return <HorizontalTimeline items={block.items} />;
  }
  return <VerticalTimeline items={block.items} />;
}

function VerticalTimeline({
  items,
}: {
  items: TimelineBlockType['items'];
}) {
  return (
    <div className="w-full h-full overflow-auto py-2 px-1">
      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-3 top-2 bottom-2 w-0.5"
          style={{ backgroundColor: 'var(--df-primary)', opacity: 0.4 }}
        />

        <div className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 flex-shrink-0"
                style={{
                  borderColor: 'var(--df-primary)',
                  backgroundColor: index === 0 ? 'var(--df-primary)' : 'var(--df-background)',
                  boxShadow: '0 0 0 3px color-mix(in srgb, var(--df-primary) 15%, transparent)',
                }}
              />

              {/* Content */}
              <div>
                {item.date && (
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{
                      fontFamily: 'var(--df-font-body)',
                      color: 'var(--df-muted)',
                    }}
                  >
                    {item.date}
                  </span>
                )}
                <h4
                  className="font-semibold mt-0.5"
                  style={{
                    fontFamily: 'var(--df-font-heading)',
                    color: 'var(--df-heading)',
                    fontSize: '0.95rem',
                  }}
                >
                  {item.title}
                </h4>
                {item.description && (
                  <p
                    className="mt-1 leading-relaxed"
                    style={{
                      fontFamily: 'var(--df-font-body)',
                      color: 'var(--df-text)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HorizontalTimeline({
  items,
}: {
  items: TimelineBlockType['items'];
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-auto px-2">
      <div className="relative">
        {/* Horizontal line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2"
          style={{ backgroundColor: 'var(--df-primary)', opacity: 0.4 }}
        />

        <div
          className="relative flex justify-between items-center"
          style={{ minWidth: items.length > 5 ? `${items.length * 140}px` : undefined }}
        >
          {items.map((item, index) => {
            const isAbove = index % 2 === 0;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center flex-1"
                style={{ maxWidth: '180px' }}
              >
                {/* Content above or below based on alternation */}
                {isAbove ? (
                  <>
                    <div className="text-center mb-3 min-h-[60px] flex flex-col justify-end">
                      {item.date && (
                        <span
                          className="text-xs font-medium uppercase tracking-wider block"
                          style={{
                            fontFamily: 'var(--df-font-body)',
                            color: 'var(--df-muted)',
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                      <h4
                        className="font-semibold mt-0.5"
                        style={{
                          fontFamily: 'var(--df-font-heading)',
                          color: 'var(--df-heading)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                    {/* Dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 z-10"
                      style={{
                        borderColor: 'var(--df-primary)',
                        backgroundColor: index === 0 ? 'var(--df-primary)' : 'var(--df-background)',
                        boxShadow: '0 0 0 3px color-mix(in srgb, var(--df-primary) 15%, transparent)',
                      }}
                    />
                    <div className="text-center mt-3 min-h-[60px]">
                      {item.description && (
                        <p
                          className="leading-relaxed"
                          style={{
                            fontFamily: 'var(--df-font-body)',
                            color: 'var(--df-text)',
                            fontSize: '0.7rem',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3 min-h-[60px] flex flex-col justify-end">
                      {item.description && (
                        <p
                          className="leading-relaxed"
                          style={{
                            fontFamily: 'var(--df-font-body)',
                            color: 'var(--df-text)',
                            fontSize: '0.7rem',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    {/* Dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 z-10"
                      style={{
                        borderColor: 'var(--df-primary)',
                        backgroundColor: index === 0 ? 'var(--df-primary)' : 'var(--df-background)',
                        boxShadow: '0 0 0 3px color-mix(in srgb, var(--df-primary) 15%, transparent)',
                      }}
                    />
                    <div className="text-center mt-3 min-h-[60px]">
                      {item.date && (
                        <span
                          className="text-xs font-medium uppercase tracking-wider block"
                          style={{
                            fontFamily: 'var(--df-font-body)',
                            color: 'var(--df-muted)',
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                      <h4
                        className="font-semibold mt-0.5"
                        style={{
                          fontFamily: 'var(--df-font-heading)',
                          color: 'var(--df-heading)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
