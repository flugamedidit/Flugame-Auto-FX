import { ModuleType, VFXModuleState } from './types';

export const IMAGE_PROVIDERS = ['Google Gemini','OpenAI ChatGPT','Recraft','Kling','Custom Provider'];
export const VIDEO_PROVIDERS = ['Google Gemini','OpenAI ChatGPT','C-dance 2.0','Kling','Custom Provider'];
export const THINKING_PROVIDERS = ['Google Gemini','Anthropic Claude','OpenAI GPT'];

export const IMAGE_MODELS = ['🍌 Nano Banana Pro','Nano Banana 2','Recraft','Recraft V3','Kling Image','Custom Image Model'];
export const VIDEO_MODELS = ['Omni Flash','Veo 3.1 Quality','C-dance 2.0','Kling','Kling Video','Custom Video Model'];
export const THINKING_MODELS = ['Gemini 2.5 Pro','Gemini 2.5 Flash','Claude Sonnet 4.5','GPT-5','Custom Thinking Model'];

export const MODULE_DISPLAY_NAMES: Record<ModuleType,string> = {TEXT_SLAM:'3D TEXT',VFX_ANCHOR:'VFX MODULE',PARTICLE_STORM:'PARTICLES',CHROME_GLINT:'GLOW',MOTION_ECHO:'MOTION FX',PUNCH_ZOOM:'IMPACT FX',OVERLAY_TEXTURE:'OVERLAYS',BACKGROUND_REPLACE:'BG RECONSTRUCTION',RESTYLIZE:'RESTYLIZE'};
export const MODULE_ACCENTS: Record<ModuleType,string> = {TEXT_SLAM:'#4a82ff',VFX_ANCHOR:'#9a5cff',PARTICLE_STORM:'#ff7a2f',CHROME_GLINT:'#f9d84a',MOTION_ECHO:'#47d78a',PUNCH_ZOOM:'#ef4444',OVERLAY_TEXTURE:'#7c6cff',BACKGROUND_REPLACE:'#a855f7',RESTYLIZE:'#ec4899'};
export const TEXT_INTERACTIONS = ['Auto','Foreground Title Object','Grounded Surface Text','Suspended Tracked Text','Smoke-Backed Title','Chained / Restrained Text','Structural Signage','Portal / Backdrop Text'];
export const MODULE_GRAMMAR: Record<ModuleType,string[]> = {TEXT_SLAM:['FORM','MATERIAL','TEXTURE','TYPOGRAPHY STYLE','INTEGRATION','RELATIONSHIP','SUPPORT SYSTEM','FORCE','LIGHT RESPONSE','MOTION BEHAVIOR'],VFX_ANCHOR:['FORM','MATERIAL','PHYSICS','MOTION','LIGHT RESPONSE'],PARTICLE_STORM:['PARTICLE TYPE','SPAWN BEHAVIOR','DENSITY','FORCE','GRAVITY'],CHROME_GLINT:['LIGHT SOURCE','REFLECTION','BLOOM','EDGE RESPONSE'],MOTION_ECHO:['ECHO TYPE','TRAIL','TIME OFFSET','SMEAR'],PUNCH_ZOOM:['IMPACT','CAMERA FORCE','DISTORTION','RECOVERY'],OVERLAY_TEXTURE:['TEXTURE','BLEND','SURFACE','GRAIN'],BACKGROUND_REPLACE:['LOCATION','LIGHT MATCH','COLOR MATCH','DEPTH'],RESTYLIZE:['MEDIUM','SURFACE','PALETTE','CONTRAST']};
const moduleDefault = (id: ModuleType): VFXModuleState => ({id, enabled:false, directive:'', chips:[], expanded:false, renderText:'', textInteraction:'Auto', foregroundOverride:false, effectMix:100, heroHistory:[], heroIndex:-1});
export const MODULE_DEFAULTS = Object.fromEntries((Object.keys(MODULE_DISPLAY_NAMES) as ModuleType[]).map(id=>[id,moduleDefault(id)])) as Record<ModuleType,VFXModuleState>;
export const BROLL_SHOT_TYPES = ['AUTO SELECT','DETAIL INSERT','OBJECT HERO','ATMOSPHERE / MOOD','ENVIRONMENT / LOCATION','TRANSITION SHOT','TEXTURE MACRO'];
export const STYLE_PRESETS: Record<string,string[]> = { 'Oneiric Interior':['ONEIRIC INTERIOR','DREAMLIKE INTERIOR','ONE MAJOR SURREAL ANOMALY','PHYSICALLY INTEGRATED','CALM SURREALISM','REALISTIC LIGHTING','SPATIAL WARPING'], 'Psychological Isolation':['PSYCHOLOGICAL ISOLATION','NEGATIVE SPACE','OPPRESSIVE ARCHITECTURE','COLD SHAFT OF LIGHT','DEEP BLACK SHADOWS','EMOTIONAL DISTANCE','QUIET INTROSPECTION'], 'Luxury Street Noir':['LUXURY STREET NOIR','HIGH-END STREETWEAR PRESENCE','DARK HOSTILE ENVIRONMENT','STRONG DIRECTIONAL LIGHT','DEEP SHADOWS','GLOSSY REFLECTIONS','EDITORIAL COMPOSITION'], 'Absurd Realism':['ABSURD REALISM','ONE DOMINANT ABSURD CONDITION','PHYSICALLY GROUNDED','NO REACTION','REALISTIC SHADOWS','EDITORIAL PHOTOGRAPHY']};
export const MODEL_COSTS: Record<string,string> = {'Omni Flash':'25 CR','Veo 3.1 Quality':'80 CR','🍌 Nano Banana Pro':'8 CR','Nano Banana 2':'5 CR'};
