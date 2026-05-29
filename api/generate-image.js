import { executeGeneration } from './providerAdapter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model, provider, apiKey, endpoint, authHeader, customModel } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const generated = await executeGeneration({
      kind: 'image',
      prompt,
      model: customModel || model,
      provider,
      apiKey,
      endpoint,
      authHeader,
      fallbackApiKey: process.env.GOOGLE_API_KEY,
      fallbackModel: process.env.GOOGLE_IMAGE_MODEL,
      fallbackEndpoint: process.env.GOOGLE_IMAGE_API_URL,
    });

    return res.status(200).json({
      ...generated,
      name: 'Generated image',
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Image generation provider returned an error',
    });
  }
}
