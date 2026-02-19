import type { IconListBlock as IconListBlockType } from '@/types/presentation';
import { icons, CircleAlert, type LucideIcon } from 'lucide-react';

interface IconListBlockProps {
  block: IconListBlockType;
}

const iconMap = icons as Record<string, LucideIcon>;

function getIcon(name: string): LucideIcon {
  // Try direct lookup first (PascalCase name)
  if (iconMap[name]) return iconMap[name];

  // Convert kebab-case or lowercase to PascalCase for lucide lookup
  const pascalName = name
    .split(/[-_\s]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  return iconMap[pascalName] || CircleAlert;
}

export default function IconListBlock({ block }: IconListBlockProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  } as const;

  return (
    <div
      className={`w-full h-full grid ${gridCols[block.columns]} auto-rows-fr`}
      style={{ gap: 'var(--df-gap)' }}
    >
      {block.items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <div
            key={item.id}
            className="flex flex-col items-center text-center p-4"
            style={{
              backgroundColor: 'var(--df-surface)',
              borderRadius: 'var(--df-radius)',
            }}
          >
            <Icon
              className="w-8 h-8 mb-3 flex-shrink-0"
              style={{ color: 'var(--df-primary)' }}
            />
            <h4
              className="font-semibold mb-1"
              style={{
                fontFamily: 'var(--df-font-heading)',
                color: 'var(--df-heading)',
                fontSize: '0.95rem',
              }}
            >
              {item.title}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: 'var(--df-font-body)',
                color: 'var(--df-text)',
                fontSize: '0.8rem',
              }}
            >
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
