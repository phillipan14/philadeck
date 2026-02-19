import { streamObject } from 'ai';
import { getModel } from '@/lib/ai/providers';
import { slideContentSchema, type Outline } from '@/lib/ai/schemas';
import { SLIDE_CONTENT_SYSTEM_PROMPT } from '@/lib/ai/prompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outline, slideIndex, provider, apiKey } = body as {
      outline?: Outline;
      slideIndex?: number;
      provider?: string;
      apiKey?: string;
    };

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required. Please add your API key in settings.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!outline || slideIndex === undefined || slideIndex === null) {
      return new Response(
        JSON.stringify({ error: 'Outline and slideIndex are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const slide = outline.slides[slideIndex];
    if (!slide) {
      return new Response(
        JSON.stringify({ error: `Slide at index ${slideIndex} not found in outline.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = getModel(provider ?? 'openai', apiKey);

    const slidePrompt = `Generate content blocks for slide ${slideIndex + 1} of the presentation "${outline.title}".

Slide details:
- Title: ${slide.title}
- Layout: ${slide.layout}
- Key points:
${slide.bullets.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}
${slide.imageQuery ? `- Image suggestion: ${slide.imageQuery}` : ''}
${slide.speakerNotes ? `- Speaker notes context: ${slide.speakerNotes}` : ''}

Theme: ${outline.themeId}

Generate the appropriate content blocks for a "${slide.layout}" layout slide.`;

    const result = streamObject({
      model,
      schema: slideContentSchema,
      system: SLIDE_CONTENT_SYSTEM_PROMPT,
      prompt: slidePrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Slide generation error:', error);

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
