const PROVIDER_DEFAULTS = {
  google: {
    imageModel: 'gemini-2.5-flash-image-preview',
    videoModel: 'veo-2.0-generate-001',
    imageEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}',
    videoEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}',
  },
  openai: {
    imageModel: 'gpt-image-1',
    videoModel: 'gpt-4.1-mini',
    imageEndpoint: 'https://api.openai.com/v1/images/generations',
    videoEndpoint: 'https://api.openai.com/v1/chat/completions',
  },
  recraft: {
    imageModel: 'recraftv3',
    imageEndpoint: 'https://external.api.recraft.ai/v1/images/generations',
  },
  kleene: {
    imageModel: 'kleene-image-1',
    videoModel: 'kleene-video-1',
    imageEndpoint: 'https://api.kleene.ai/v1/images/generations',
    videoEndpoint: 'https://api.kleene.ai/v1/videos/generations',
  },
  custom: {
    imageModel: 'custom',
    videoModel: 'custom',
  },
};

const normalizeProvider = (provider) => {
  if (!provider) return 'google';
  const value = provider.toLowerCase();
  if (value.includes('openai') || value.includes('chatgpt')) return 'openai';
  if (value.includes('recraft')) return 'recraft';
  if (value.includes('kleene')) return 'kleene';
  if (value.includes('custom')) return 'custom';
  return 'google';
};

const toDataUrl = async (remoteUrl, fallbackMimeType) => {
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch remote media payload');
  }
  const mimeType = response.headers.get('content-type') || fallbackMimeType;
  const arrayBuffer = await response.arrayBuffer();
  return `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
};

const parseGooglePayload = (payload, kind) => {
  const candidate = payload?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const inlinePart = parts.find((part) => part.inlineData);
  if (inlinePart?.inlineData) {
    const mimeType = inlinePart.inlineData.mimeType || (kind === 'image' ? 'image/png' : 'video/mp4');
    return { url: `data:${mimeType};base64,${inlinePart.inlineData.data}`, mimeType, name: 'Generated media' };
  }

  const filePart = parts.find((part) => part.fileData);
  if (filePart?.fileData?.fileUri) {
    return { remoteUrl: filePart.fileData.fileUri, mimeType: filePart.fileData.mimeType || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  return null;
};

const parseGenericPayload = (payload, kind) => {
  if (Array.isArray(payload?.data)) {
    const first = payload.data[0];
    if (typeof first?.b64_json === 'string') {
      return { url: `data:${kind === 'image' ? 'image/png' : 'video/mp4'};base64,${first.b64_json}`, mimeType: kind === 'image' ? 'image/png' : 'video/mp4', name: 'Generated media' };
    }
    if (typeof first?.url === 'string') {
      return { remoteUrl: first.url, mimeType: first?.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
    }
    if (typeof first?.image_url === 'string') {
      return { remoteUrl: first.image_url, mimeType: first?.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
    }
  }

  if (typeof payload?.data?.b64_json === 'string') {
    return { url: `data:${kind === 'image' ? 'image/png' : 'video/mp4'};base64,${payload.data.b64_json}`, mimeType: kind === 'image' ? 'image/png' : 'video/mp4', name: 'Generated media' };
  }

  if (typeof payload?.data?.url === 'string') {
    return { remoteUrl: payload.data.url, mimeType: payload.data.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  if (typeof payload?.url === 'string') {
    return { remoteUrl: payload.url, mimeType: payload.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  if (typeof payload?.image_url === 'string') {
    return { remoteUrl: payload.image_url, mimeType: payload.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  const firstImage = payload?.images?.[0];
  if (typeof firstImage?.url === 'string') {
    return { remoteUrl: firstImage.url, mimeType: firstImage.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  const firstOutput = payload?.output?.[0];
  if (typeof firstOutput?.url === 'string') {
    return { remoteUrl: firstOutput.url, mimeType: firstOutput.mime_type || (kind === 'image' ? 'image/png' : 'video/mp4') };
  }

  return null;
};

const buildPayload = (providerName, kind, prompt, modelName) => {
  if (providerName === 'google') {
    return {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };
  }

  if (providerName === 'openai') {
    if (kind === 'image') {
      return {
        model: modelName,
        prompt,
        response_format: 'b64_json',
      };
    }
    return {
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    };
  }

  return {
    prompt,
    model: modelName,
  };
};

export async function executeGeneration({ kind, prompt, model, provider, apiKey, endpoint, authHeader, fallbackApiKey, fallbackModel, fallbackEndpoint }) {
  const providerName = normalizeProvider(provider);
  const providerDefaults = PROVIDER_DEFAULTS[providerName] || {};
  const resolvedModel = model || providerDefaults[kind === 'image' ? 'imageModel' : 'videoModel'] || fallbackModel || 'custom';
  const resolvedEndpoint = endpoint || providerDefaults[kind === 'image' ? 'imageEndpoint' : 'videoEndpoint'] || fallbackEndpoint;

  if (!resolvedEndpoint) {
    throw new Error('Missing provider endpoint');
  }

  let effectiveApiKey = apiKey || fallbackApiKey;
  if (providerName === 'google' && !effectiveApiKey) {
    throw new Error('Missing provider API key');
  }

  const endpointTemplate = resolvedEndpoint.includes('{model}') ? resolvedEndpoint.replace('{model}', encodeURIComponent(resolvedModel)) : resolvedEndpoint;
  const finalEndpoint = providerName === 'google'
    ? endpointTemplate.replace('{apiKey}', encodeURIComponent(effectiveApiKey || ''))
    : endpointTemplate;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (typeof authHeader === 'string') {
    headers.Authorization = authHeader;
  } else if (authHeader && typeof authHeader === 'object') {
    headers[authHeader.name] = authHeader.value;
  } else if (providerName !== 'google' && effectiveApiKey) {
    headers.Authorization = `Bearer ${effectiveApiKey}`;
  }

  const response = await fetch(finalEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(buildPayload(providerName, kind, prompt, resolvedModel)),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const providerError = payload?.error?.message || payload?.message || 'Provider returned an error';
    throw new Error(providerError);
  }

  const parsed = providerName === 'google' ? parseGooglePayload(payload, kind) : parseGenericPayload(payload, kind);
  if (!parsed) {
    throw new Error('Provider returned no media payload');
  }

  if (parsed.remoteUrl) {
    const dataUrl = await toDataUrl(parsed.remoteUrl, parsed.mimeType);
    return { url: dataUrl, mimeType: parsed.mimeType, name: 'Generated media' };
  }

  return parsed;
}
