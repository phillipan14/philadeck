'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Key, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const STORAGE_KEY = 'philadeck_api_keys';
const PROVIDER_KEY = 'philadeck_selected_provider';

interface APIKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
}

const providers = [
  {
    id: 'openai' as const,
    name: 'OpenAI',
    placeholder: 'sk-...',
    description: 'GPT-4o',
  },
  {
    id: 'anthropic' as const,
    name: 'Anthropic',
    placeholder: 'sk-ant-...',
    description: 'Claude Sonnet',
  },
  {
    id: 'google' as const,
    name: 'Google',
    placeholder: 'AIza...',
    description: 'Gemini Flash',
  },
];

export function getStoredKeys(): APIKeys {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as APIKeys;
  } catch {
    return {};
  }
}

export function getStoredProvider(): string {
  if (typeof window === 'undefined') return 'openai';
  return localStorage.getItem(PROVIDER_KEY) || 'openai';
}

export function setStoredProvider(provider: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROVIDER_KEY, provider);
}

function setStoredKeys(keys: APIKeys): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

interface APIKeySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function APIKeySettings({
  open,
  onOpenChange,
  children,
}: APIKeySettingsProps) {
  const [keys, setKeys] = useState<APIKeys>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setKeys(getStoredKeys());
  }, [open]);

  const handleChange = useCallback(
    (providerId: keyof APIKeys, value: string) => {
      setKeys((prev) => {
        const updated = { ...prev, [providerId]: value };
        setStoredKeys(updated);
        return updated;
      });
    },
    [],
  );

  const toggleVisibility = useCallback((providerId: string) => {
    setVisibility((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Key Settings
          </SheetTitle>
          <SheetDescription>
            Enter your API keys to use AI features. Keys are stored locally in
            your browser and never sent to our servers.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{provider.name}</label>
                <span className="text-xs text-muted-foreground">
                  {provider.description}
                </span>
              </div>
              <div className="relative">
                <Input
                  type={visibility[provider.id] ? 'text' : 'password'}
                  placeholder={provider.placeholder}
                  value={keys[provider.id] || ''}
                  onChange={(e) => handleChange(provider.id, e.target.value)}
                  className="pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(provider.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {visibility[provider.id] ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {keys[provider.id] && (
                <p className="text-xs text-emerald-600">Key saved</p>
              )}
            </div>
          ))}

          <Separator />

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your API keys are stored in localStorage and used to make direct
              calls to the AI providers. They are never transmitted to any
              third-party server.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
