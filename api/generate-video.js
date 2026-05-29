export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model } = req.body || {};
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GOOGLE_API_KEY in environment' });
  }

  const modelName = model || process.env.GOOGLE_VIDEO_MODEL || 'veo-2.0-generate-001';
  const customEndpoint = process.env.GOOGLE_VIDEO_API_URL;
  const endpoint = customEndpoint
    ? customEndpoint.includes('{model}')
      ? customEndpoint.replace('{model}', encodeURIComponent(modelName))
      : customEndpoint
    : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return res.status(response.status).json({
      error: payload?.error?.message || 'Video generation provider returned an error',
    });
  }

  const candidate = payload?.candidates?.[0];
  const inlinePart = candidate?.content?.parts?.find((part) => part.inlineData);
  if (inlinePart?.inlineData) {
    const mimeType = inlinePart.inlineData.mimeType || 'video/mp4';
    const url = `data:${mimeType};base64,${inlinePart.inlineData.data}`;
    return res.status(200).json({ url, mimeType, name: 'Generated video' });
  }

  const filePart = candidate?.content?.parts?.find((part) => part.fileData);
  if (filePart?.fileData?.fileUri) {
    const remoteResponse = await fetch(filePart.fileData.fileUri);
    if (!remoteResponse.ok) {
      return res.status(502).json({ error: 'Failed to fetch remote video payload' });
    }
    const mimeType = remoteResponse.headers.get('content-type') || 'video/mp4';
    const arrayBuffer = await remoteResponse.arrayBuffer();
    const url = `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    return res.status(200).json({ url, mimeType, name: 'Generated video' });
  }

  return res.status(502).json({
    error: 'Video provider returned no media payload',
    debug: payload,
  });
}
