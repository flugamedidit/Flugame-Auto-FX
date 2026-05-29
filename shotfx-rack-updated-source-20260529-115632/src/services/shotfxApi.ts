import { BRollResult, MediaAsset, MediaKind, MusicVideoScene } from '../types';

const transparentPixel =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';

const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export interface GenerateImageRequest {
  prompt: string;
  referenceImageMediaIds?: string[];
  modelDisplayName?: string;
  aspectRatio?: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  firstFrameImageMediaId?: string;
  audioReferenceMediaIds?: string[];
  sourceVideoMediaId?: string;
  sourceVideoMode?: string;
  modelDisplayName?: string;
  aspectRatio?: string;
  durationSeconds?: number;
}

export const shotfxApi = {
  async selectMedia(kind: MediaKind): Promise<MediaAsset | null> {
    const label = kind.toUpperCase();
    return {
      mediaId: makeId(kind),
      base64: transparentPixel,
      name: `Mock ${label} Reference`,
      mimeType: kind === 'audio' ? 'audio/mpeg' : kind === 'video' ? 'video/mp4' : 'image/png'
    };
  },

  async selectMultipleMedia(kind: MediaKind, maxCount: number): Promise<MediaAsset[]> {
    const item = await this.selectMedia(kind);
    return item ? [item].slice(0, maxCount) : [];
  },

  async generateText(_userContext: string, _options?: { systemInstruction?: string }): Promise<{ text: string }> {
    const scenes: MusicVideoScene[] = [
      {
        id: '1',
        title: 'Glass Penthouse Pressure',
        location: 'high-rise suite overlooking the city at night',
        visualTone: 'expensive, sharp, controlled',
        lightingStyle: 'cool window light with hard practical highlights',
        colorPalette: 'black, chrome, icy blue, white highlights',
        cameraFraming: 'centered medium performance frame',
        characterPresentation: 'artist locked to camera with clean silhouette separation',
        whyItWorks: 'It gives the panel a premium mock scene without calling any AI service.',
        bestUse: 'Main hook performance'
      },
      {
        id: '2',
        title: 'Industrial Alley Flash',
        location: 'wet backlot alley with hard side light',
        visualTone: 'gritty, kinetic, dangerous',
        lightingStyle: 'single sodium practical with blue edge fill',
        colorPalette: 'black, amber, steel, rain reflections',
        cameraFraming: 'low handheld angle',
        characterPresentation: 'artist moving through haze with aggressive eye contact',
        whyItWorks: 'It preserves the music-video lane while staying mock-only.',
        bestUse: 'Verse energy'
      },
      {
        id: '3',
        title: 'Red Room Editorial',
        location: 'minimal performance room with sculptural lighting',
        visualTone: 'surreal, bold, graphic',
        lightingStyle: 'red wash with narrow white key',
        colorPalette: 'deep red, black, warm skin tones',
        cameraFraming: 'tight portrait performance frame',
        characterPresentation: 'artist framed like a poster-ready hero shot',
        whyItWorks: 'It creates a clean visual option without generating media.',
        bestUse: 'Bridge or intro'
      }
    ];

    return { text: JSON.stringify(scenes) };
  },

  async generateImage(request: GenerateImageRequest): Promise<MediaAsset> {
    return {
      mediaId: makeId('mock_image'),
      base64: transparentPixel,
      name: request.modelDisplayName || 'Mock Generated Image',
      mimeType: 'image/png'
    };
  },

  async generateVideo(request: GenerateVideoRequest): Promise<BRollResult> {
    return {
      id: makeId('mock_video_result'),
      mediaId: makeId('mock_video'),
      base64: transparentPixel,
      name: request.modelDisplayName || 'Mock Generated Video',
      mimeType: 'video/mp4',
      type: 'VIDEO',
      timestamp: Date.now()
    };
  },

  async saveAsset(asset: MediaAsset & { mimeType?: string; name?: string }): Promise<void> {
    console.info('Mock save requested:', asset.name || asset.mediaId);
  }
};
