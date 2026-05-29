export type Tab = 'VFX' | 'BROLL' | 'AIMV';
export type ModuleType = 'TEXT_SLAM' | 'VFX_ANCHOR' | 'PARTICLE_STORM' | 'CHROME_GLINT' | 'MOTION_ECHO' | 'PUNCH_ZOOM' | 'OVERLAY_TEXTURE' | 'BACKGROUND_REPLACE' | 'RESTYLIZE';
export type MediaKind = 'image' | 'video';

export interface MediaAsset { id: string; name: string; type: MediaKind; url: string; file?: File; mimeType?: string; }
export interface CharacterRef extends MediaAsset { subject: 'A'|'B'|'C'|'D'; }
export interface SemanticChip { id: string; value: string; family?: string; }
export interface VFXConcept { id: string; url: string; name: string; promptUsed: string; sourceTimeSeconds?: number; sourceTimecode?: string; }
export interface VFXModuleState { id: ModuleType; enabled: boolean; directive: string; chips: SemanticChip[]; expanded: boolean; autoBusy?: boolean; renderText?: string; textInteraction?: string; foregroundOverride?: boolean; effectMix: number; activeConcept?: VFXConcept; heroHistory: VFXConcept[]; heroIndex: number; }
export interface QueueItem extends MediaAsset { status: 'IDLE'|'PROCESSING'|'COMPLETED'|'ERROR'; context: string; modules: Record<ModuleType,VFXModuleState>; }
export interface DiscoveryState { isOpen: boolean; term: string; target?: { kind: 'chip'|'prompt'|'style'; id?: string; index?: number }; mode: 'BASIC'|'WORLD'; results: string[]; }
export interface PromptReviewItem { id: string; title: string; model: string; outputMode: 'IMAGE'|'VIDEO'; originalCompiledPrompt: string; editedPrompt: string; source?: MediaAsset; refs: VFXConcept[]; moduleId?: ModuleType; }
export interface BrollState { mode: 'IMAGE'|'VIDEO'; subtab: 'CLASSIC'|'STORY'; shotType: string; styleTerms: SemanticChip[]; sceneRef?: MediaAsset; worldRef?: MediaAsset; results: MediaAsset[]; storyChat: {role:'assistant'|'user'; content:string}[]; }
export interface AIMVState { sceneRef?: MediaAsset; worldRef?: MediaAsset; perf?: MediaAsset; antiFake: boolean; motionSource: string; worldRefs: MediaAsset[]; styleTerms: SemanticChip[]; history: MediaAsset[]; }
export interface RuntimeProviderConfig { imageProvider: string; videoProvider: string; imageApiKey: string; videoApiKey: string; imageEndpoint: string; videoEndpoint: string; customImageModel: string; customVideoModel: string; }
export interface AppState extends RuntimeProviderConfig { activeTab: Tab; queue: QueueItem[]; queueIndex: number; currentTime: number; duration: number; isPlaying: boolean; isMuted: boolean; imageModel: string; videoModel: string; characterRefs: CharacterRef[]; broll: BrollState; aimv: AIMVState; }
