import { streamObject } from 'ai';
import { getModel } from '@/lib/ai/providers';
import { outlineSchema } from '@/lib/ai/schemas';
import { OUTLINE_SYSTEM_PROMPT } from '@/lib/ai/prompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, provider, apiKey } = body as {
      prompt?: string;
      provider?: string;
      apiKey?: string;
    };

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required. Please add your API key in settings.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'A prompt is required to generate a presentation outline.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = getModel(provider ?? 'openai', apiKey);

    const result = streamObject({
      model,
      schema: outlineSchema,
      system: OUTLINE_SYSTEM_PROMPT,
      prompt: prompt.trim(),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Outline generation error:', error);

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
