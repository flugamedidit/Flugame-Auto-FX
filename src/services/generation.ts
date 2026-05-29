import { MediaAsset } from '../types';

const dataUrlToAsset = (url: string, mimeType: string, name: string): MediaAsset => ({
  id: Math.random().toString(36).slice(2, 10),
  name,
  type: mimeType.startsWith('video/') ? 'video' : 'image',
  url,
  mimeType,
});

async function generate(kind: 'image' | 'video', prompt: string, model: string): Promise<MediaAsset> {
  const endpoint = kind === 'image' ? '/api/generate-image' : '/api/generate-video';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `${kind === 'image' ? 'Image' : 'Video'} generation failed`);
  }

  const data = await response.json();
  return dataUrlToAsset(data.url, data.mimeType || (kind === 'image' ? 'image/png' : 'video/mp4'), `${model} ${kind}`);
}

export async function generateImage(prompt: string, model: string): Promise<MediaAsset> {
  return generate('image', prompt, model);
}

export async function generateVideo(prompt: string, model: string): Promise<MediaAsset> {
  return generate('video', prompt, model);
}
