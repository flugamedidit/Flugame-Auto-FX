import { MediaAsset, RuntimeProviderConfig } from '../types';

interface GenerationRuntimeConfig extends Pick<RuntimeProviderConfig, 'imageProvider'|'videoProvider'|'imageApiKey'|'videoApiKey'|'imageEndpoint'|'videoEndpoint'|'customImageModel'|'customVideoModel'> {}

const dataUrlToAsset = (url: string, mimeType: string, name: string): MediaAsset => ({
  id: Math.random().toString(36).slice(2, 10),
  name,
  type: mimeType.startsWith('video/') ? 'video' : 'image',
  url,
  mimeType,
});

const resolveModel = (model: string, customModel: string = ''): string => customModel.trim() || model;

async function generate(kind: 'image' | 'video', prompt: string, model: string, runtimeConfig: GenerationRuntimeConfig): Promise<MediaAsset> {
  const endpoint = kind === 'image' ? '/api/generate-image' : '/api/generate-video';
  const provider = kind === 'image' ? runtimeConfig.imageProvider : runtimeConfig.videoProvider;
  const apiKey = kind === 'image' ? runtimeConfig.imageApiKey : runtimeConfig.videoApiKey;
  const endpointUrl = kind === 'image' ? runtimeConfig.imageEndpoint : runtimeConfig.videoEndpoint;
  const customModel = kind === 'image' ? runtimeConfig.customImageModel : runtimeConfig.customVideoModel;
  const resolved = resolveModel(model, customModel);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      model: resolved,
      provider,
      apiKey,
      endpoint: endpointUrl,
      customModel: customModel || undefined,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `${kind === 'image' ? 'Image' : 'Video'} generation failed`);
  }

  const data = await response.json();
  return dataUrlToAsset(data.url, data.mimeType || (kind === 'image' ? 'image/png' : 'video/mp4'), `${model} ${kind}`);
}

export async function generateImage(prompt: string, model: string, runtimeConfig: GenerationRuntimeConfig): Promise<MediaAsset> {
  return generate('image', prompt, model, runtimeConfig);
}

export async function generateVideo(prompt: string, model: string, runtimeConfig: GenerationRuntimeConfig): Promise<MediaAsset> {
  return generate('video', prompt, model, runtimeConfig);
}
