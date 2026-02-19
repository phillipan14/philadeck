import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

export type AIProvider = 'openai' | 'anthropic' | 'google';

const PROVIDER_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  google: 'gemini-2.0-flash',
};

/**
 * Returns the appropriate AI model instance for the given provider and API key.
 * Users store their API keys in localStorage and pass them via request body.
 */
export function getModel(provider: string, apiKey: string): LanguageModel {
  switch (provider) {
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(PROVIDER_MODELS.anthropic);
    }
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(PROVIDER_MODELS.google);
    }
    case 'openai':
    default: {
      const openai = createOpenAI({ apiKey });
      return openai(PROVIDER_MODELS.openai);
    }
  }
}
