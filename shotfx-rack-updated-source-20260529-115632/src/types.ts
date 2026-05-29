export type MediaKind = 'image' | 'video' | 'audio';

export interface MediaAsset {
  mediaId: string;
  base64: string;
  name?: string;
  mimeType?: string;
}

export interface CharacterRef extends MediaAsset {
  id: string;
  name: string;
  subject: string;
}

export interface CharacterCreatorState {
  mode: 'EXISTING' | 'CREATE';
  uploadedImages: MediaAsset[];
  generatedSheet: MediaAsset | null;
  isGenerating: boolean;
  name: string;
  archetype: string;
  description: string;
  worldDescription: string;
  includeEnvironment: boolean;
  outfitPreference: string;
  notes: string;
}

export interface MusicVideoScene {
  id: string;
  title: string;
  location: string;
  visualTone: string;
  lightingStyle: string;
  colorPalette: string;
  cameraFraming: string;
  characterPresentation: string;
  whyItWorks: string;
  bestUse: string;
  heroFrame?: BRollResult;
}

export interface BRollResult extends MediaAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  timestamp: number;
}

export interface MusicVideoState {
  sceneRef: MediaAsset | null;
  worldRef: MediaAsset | null;
  moodRef: MediaAsset | null;
  audioRef: MediaAsset | null;
  performanceVideoRef: MediaAsset | null;
  useCustomUploadedAsHero: boolean;
  useCustomUploadedPerformance: boolean;
  trendResearch: boolean;
  trendNotes: string;
  context: string;
  styleTone: string;
  imageModel: string;
  videoModel: string;
  outputType: string;
  videoCount: number;
  sceneOptions: MusicVideoScene[];
  selectedSceneIndex: number | null;
  performanceResults: BRollResult[];
}

export interface ThinkingModelState {
  provider: string;
  model: string;
  geminiApiKey: string;
  claudeApiKey: string;
  gptApiKey: string;
}

export interface VFXModuleState {
  lyricOverride: string;
  effectMapperJson: string;
  generatedPrompt: string;
}

export interface BRollCreatorState {
  lyricText: string;
  frameNotes: string;
  generatedPrompt: string;
}

export interface StoryModeState {
  chatInput: string;
  shotPlan: string;
}

export interface TimelineMarker {
  time: number;
  label: string;
}
