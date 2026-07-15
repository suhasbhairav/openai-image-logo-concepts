import OpenAI from "openai";

export const runtime = "nodejs";

function offlineResult(prompt) {
  return `
OpenAI Image Logo Concepts offline image brief

Prompt:
${prompt}

Generated creative direction:
- Subject: product or campaign concept from the prompt
- Style: polished commercial AI image
- Lighting: clean studio lighting
- Composition: mobile-safe center crop plus wide hero crop
- Production note: add OPENAI_API_KEY to generate real images

This route returns a prompt brief without spending tokens until an API key is configured.
`.trim();
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      demo: true,
      model: "offline-fallback",
      output: offlineResult(prompt),
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: `A logo concept generator starter for brand exploration and creative direction.\n\nUser creative brief: ${prompt}`,
      size: "1024x1024",
    });

    return Response.json({
      demo: false,
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      image: response.data?.[0]?.b64_json || response.data?.[0]?.url,
      output: "Image generated. Render the returned base64 or URL in the UI.",
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Image generation failed." },
      { status: 500 },
    );
  }
}
