import { streamObject } from 'ai';
import { getModel } from '@/lib/ai/providers';
import { slideContentSchema } from '@/lib/ai/schemas';
import { REDESIGN_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import type { Slide } from '@/types/presentation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slide, instruction, provider, apiKey } = body as {
      slide?: Slide;
      instruction?: string;
      provider?: string;
      apiKey?: string;
    };

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required. Please add your API key in settings.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!slide) {
      return new Response(
        JSON.stringify({ error: 'Slide data is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!instruction || instruction.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'A redesign instruction is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = getModel(provider ?? 'openai', apiKey);

    const redesignPrompt = `Redesign this slide based on the following instruction: "${instruction.trim()}"

Current slide data:
- Layout: ${slide.layout}
- Speaker notes: ${slide.speakerNotes || 'None'}
- Current content blocks:
${JSON.stringify(slide.content, null, 2)}

Generate improved content blocks based on the instruction while preserving the core message.`;

    const result = streamObject({
      model,
      schema: slideContentSchema,
      system: REDESIGN_SYSTEM_PROMPT,
      prompt: redesignPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Slide redesign error:', error);

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
