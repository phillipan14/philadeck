'use client';

import { useState, useEffect } from 'react';
import type { ChartBlock as ChartBlockType } from '@/types/presentation';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ChartBlockProps {
  block: ChartBlockType;
  editable?: boolean;
}

const DEFAULT_COLORS = [
  'var(--df-primary)',
  'var(--df-accent)',
  'var(--df-secondary)',
  'var(--df-muted)',
];

// Resolve CSS variable to actual color value for recharts (which needs real colors in SVG)
function resolveCSSColor(cssVar: string): string {
  if (typeof window === 'undefined') return '#6366f1';
  const temp = document.createElement('div');
  temp.style.color = cssVar;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  return computed;
}

export default function ChartBlock({ block }: ChartBlockProps) {
  const [mounted, setMounted] = useState(false);
  const [resolvedColors, setResolvedColors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Resolve CSS variables to actual colors for recharts SVG rendering
    const resolved = DEFAULT_COLORS.map(resolveCSSColor);
    setResolvedColors(resolved);
  }, [mounted]);

  if (!mounted) {
    // SSR / pre-hydration placeholder
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ color: 'var(--df-muted)', backgroundColor: 'var(--df-surface)', borderRadius: 'var(--df-radius)' }}
      >
        Loading chart...
      </div>
    );
  }

  const primaryColor = resolvedColors[0] || '#6366f1';
  const accentColor = resolvedColors[1] || '#f59e0b';

  // Prepare data with resolved colors for pie/donut
  const pieData = block.data.map((d, i) => ({
    ...d,
    fill: d.color ? resolveCSSColor(d.color) : resolvedColors[i % resolvedColors.length] || primaryColor,
  }));

  const renderChart = () => {
    switch (block.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={block.data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--df-muted)" opacity={0.3} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--df-text)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--df-muted)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--df-text)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--df-muted)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--df-surface)',
                  border: '1px solid var(--df-muted)',
                  borderRadius: 'var(--df-radius)',
                  color: 'var(--df-text)',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={block.data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--df-muted)" opacity={0.3} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--df-text)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--df-muted)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--df-text)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--df-muted)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--df-surface)',
                  border: '1px solid var(--df-muted)',
                  borderRadius: 'var(--df-radius)',
                  color: 'var(--df-text)',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={2.5}
                dot={{ fill: primaryColor, r: 4, strokeWidth: 0 }}
                activeDot={{ fill: accentColor, r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius="75%"
                strokeWidth={2}
                stroke="var(--df-background)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--df-surface)',
                  border: '1px solid var(--df-muted)',
                  borderRadius: 'var(--df-radius)',
                  color: 'var(--df-text)',
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--df-text)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="75%"
                strokeWidth={2}
                stroke="var(--df-background)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--df-surface)',
                  border: '1px solid var(--df-muted)',
                  borderRadius: 'var(--df-radius)',
                  color: 'var(--df-text)',
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--df-text)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {block.title && (
        <h3
          className="font-semibold mb-2 text-center flex-shrink-0"
          style={{
            fontFamily: 'var(--df-font-heading)',
            color: 'var(--df-heading)',
            fontSize: '1.1rem',
          }}
        >
          {block.title}
        </h3>
      )}
      <div className="flex-1 min-h-0">
        {renderChart()}
      </div>
    </div>
  );
}
