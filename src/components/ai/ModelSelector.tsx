'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Bot, Brain, Cpu } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getStoredKeys,
  getStoredProvider,
  setStoredProvider,
} from './APIKeySettings';
import APIKeySettings from './APIKeySettings';

const models = [
  {
    id: 'openai',
    name: 'GPT-4o',
    provider: 'OpenAI',
    icon: Bot,
  },
  {
    id: 'anthropic',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    icon: Brain,
  },
  {
    id: 'google',
    name: 'Gemini Flash',
    provider: 'Google',
    icon: Cpu,
  },
];

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  compact?: boolean;
}

export default function ModelSelector({
  value: controlledValue,
  onChange,
  compact = false,
}: ModelSelectorProps) {
  const [internalValue, setInternalValue] = useState('openai');
  const [missingKey, setMissingKey] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const selectedValue = controlledValue ?? internalValue;

  useEffect(() => {
    const stored = getStoredProvider();
    if (!controlledValue) {
      setInternalValue(stored);
    }
  }, [controlledValue]);

  useEffect(() => {
    const keys = getStoredKeys();
    const keyId = selectedValue as keyof typeof keys;
    setMissingKey(!keys[keyId]);
  }, [selectedValue, settingsOpen]);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    setStoredProvider(newValue);
    onChange?.(newValue);
  };

  const selectedModel = models.find((m) => m.id === selectedValue) || models[0];
  const Icon = selectedModel.icon;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Select value={selectedValue} onValueChange={handleChange}>
          <SelectTrigger
            size="sm"
            className={compact ? 'h-8 w-[160px] text-xs' : 'h-9 w-[200px]'}
          >
            <SelectValue>
              <span className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">
                  {selectedModel.name}
                </span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => {
              const ModelIcon = model.icon;
              return (
                <SelectItem key={model.id} value={model.id}>
                  <span className="flex items-center gap-2">
                    <ModelIcon className="h-3.5 w-3.5" />
                    <span>
                      <span className="font-medium">{model.name}</span>
                      <span className="text-muted-foreground ml-1.5">
                        {model.provider}
                      </span>
                    </span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {missingKey && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="p-1 text-amber-500 hover:text-amber-400 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              No API key for {selectedModel.provider}. Click to add.
            </TooltipContent>
          </Tooltip>
        )}

        <APIKeySettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </TooltipProvider>
  );
}
