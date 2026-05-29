import React, { useState } from 'react';
import { AIMusicVideo } from './components/AIMusicVideo';
import { BRollCreator } from './components/BRollCreator';
import { CharacterLockPanel } from './components/CharacterLockPanel';
import { StoryMode } from './components/StoryMode';
import { VFXModule } from './components/VFXModule';
import { IMAGE_MODELS, MV_OUTPUT_TYPES, MV_STYLE_TONES, THINKING_MODELS, THINKING_PROVIDERS, VIDEO_MODELS } from './constants';
import {
  BRollCreatorState,
  CharacterCreatorState,
  CharacterRef,
  MusicVideoState,
  StoryModeState,
  ThinkingModelState,
  VFXModuleState
} from './types';

type TabId = 'vfx' | 'broll' | 'story' | 'musicVideo' | 'character';

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'vfx', label: 'VFX', icon: 'auto_fix_high' },
  { id: 'broll', label: 'B-Roll', icon: 'movie' },
  { id: 'story', label: 'Story', icon: 'forum' },
  { id: 'musicVideo', label: 'AI MV', icon: 'interpreter_mode' },
  { id: 'character', label: 'Lock', icon: 'person_pin' }
];

const initialCharacterCreator: CharacterCreatorState = {
  mode: 'CREATE',
  uploadedImages: [],
  generatedSheet: null,
  isGenerating: false,
  name: '',
  archetype: '',
  description: '',
  worldDescription: '',
  includeEnvironment: false,
  outfitPreference: '',
  notes: ''
};

const initialMusicVideo: MusicVideoState = {
  sceneRef: null,
  worldRef: null,
  moodRef: null,
  audioRef: null,
  performanceVideoRef: null,
  useCustomUploadedAsHero: false,
  useCustomUploadedPerformance: false,
  trendResearch: false,
  trendNotes: '',
  context: '',
  styleTone: MV_STYLE_TONES[0],
  imageModel: IMAGE_MODELS[0],
  videoModel: VIDEO_MODELS[0],
  outputType: MV_OUTPUT_TYPES[0],
  videoCount: 1,
  sceneOptions: [],
  selectedSceneIndex: null,
  performanceResults: []
};

const initialThinkingModel: ThinkingModelState = {
  provider: THINKING_PROVIDERS[0],
  model: THINKING_MODELS[0],
  geminiApiKey: '',
  claudeApiKey: '',
  gptApiKey: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('vfx');
  const [globalContext, setGlobalContext] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [thinkingModel, setThinkingModel] = useState<ThinkingModelState>(initialThinkingModel);
  const [characterCreator, setCharacterCreator] = useState<CharacterCreatorState>(initialCharacterCreator);
  const [characterRefs, setCharacterRefs] = useState<CharacterRef[]>([]);
  const [musicVideo, setMusicVideo] = useState<MusicVideoState>(initialMusicVideo);
  const [vfx, setVfx] = useState<VFXModuleState>({ lyricOverride: '', effectMapperJson: '', generatedPrompt: '' });
  const [broll, setBroll] = useState<BRollCreatorState>({ lyricText: '', frameNotes: '', generatedPrompt: '' });
  const [story, setStory] = useState<StoryModeState>({ chatInput: '', shotPlan: '' });

  return (
    <div className="h-screen overflow-y-auto bg-[#060606] text-white font-sans app-scroll">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#080808]/92 backdrop-blur-xl">
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-sm font-semibold uppercase tracking-[2.5px] text-white/90">ShotFX Rack</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[1.8px]">Premiere Pro UXP Panel</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-emerald-400/[0.08] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[1.8px] text-emerald-200/80">
                Mock API Mode
              </div>
              <button
                onClick={() => setSettingsOpen((open) => !open)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${settingsOpen ? 'bg-white text-black' : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.09] hover:text-white/80'}`}
                aria-label="API settings"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
              </button>
            </div>
          </div>
          <textarea
            value={globalContext}
            onChange={(event) => setGlobalContext(event.target.value)}
            placeholder="Global song, artist, client, or project context"
            className="h-14 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] px-3 py-2 text-[10px] text-white/80 outline-none placeholder-white/20 transition-colors focus:border-white/20"
          />
          {settingsOpen && (
            <section className="rounded-lg bg-[#101010] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[2px] text-white/60">Thinking Model</div>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/40">
                    Brain for chat, Discovery word-finding, prompt densifying, and module auto buttons. Gemini is the main lane, with Claude or GPT keys available when you want them.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[20px] text-white/28">psychology</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[8px] font-medium uppercase tracking-[1.6px] text-white/30">Provider</span>
                  <select
                    value={thinkingModel.provider}
                    onChange={(event) => setThinkingModel((current) => ({ ...current, provider: event.target.value }))}
                    className="h-9 w-full rounded-md border border-white/[0.06] bg-[#060606] px-2 text-[10px] font-medium text-white/70 outline-none focus:border-white/20"
                  >
                    {THINKING_PROVIDERS.map((provider) => <option key={provider} value={provider}>{provider}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[8px] font-medium uppercase tracking-[1.6px] text-white/30">Model</span>
                  <select
                    value={thinkingModel.model}
                    onChange={(event) => setThinkingModel((current) => ({ ...current, model: event.target.value }))}
                    className="h-9 w-full rounded-md border border-white/[0.06] bg-[#060606] px-2 text-[10px] font-medium text-white/70 outline-none focus:border-white/20"
                  >
                    {THINKING_MODELS.map((model) => <option key={model} value={model}>{model}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[8px] font-medium uppercase tracking-[1.6px] text-white/30">Gemini API Key</span>
                  <input
                    type="password"
                    value={thinkingModel.geminiApiKey}
                    onChange={(event) => setThinkingModel((current) => ({ ...current, geminiApiKey: event.target.value }))}
                    placeholder="Primary thinking key"
                    className="h-9 w-full rounded-md border border-white/[0.06] bg-[#060606] px-2 text-[10px] text-white/70 outline-none placeholder-white/20 focus:border-white/20"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[8px] font-medium uppercase tracking-[1.6px] text-white/30">Claude API Key</span>
                  <input
                    type="password"
                    value={thinkingModel.claudeApiKey}
                    onChange={(event) => setThinkingModel((current) => ({ ...current, claudeApiKey: event.target.value }))}
                    placeholder="Optional"
                    className="h-9 w-full rounded-md border border-white/[0.06] bg-[#060606] px-2 text-[10px] text-white/70 outline-none placeholder-white/20 focus:border-white/20"
                  />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[8px] font-medium uppercase tracking-[1.6px] text-white/30">GPT API Key</span>
                  <input
                    type="password"
                    value={thinkingModel.gptApiKey}
                    onChange={(event) => setThinkingModel((current) => ({ ...current, gptApiKey: event.target.value }))}
                    placeholder="Optional"
                    className="h-9 w-full rounded-md border border-white/[0.06] bg-[#060606] px-2 text-[10px] text-white/70 outline-none placeholder-white/20 focus:border-white/20"
                  />
                </label>
              </div>
            </section>
          )}
        </div>
        <nav className="grid grid-cols-5 border-t border-white/[0.04] bg-[#070707]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-[52px] flex-col items-center justify-center gap-1 py-2 text-[8px] font-semibold uppercase tracking-[1.3px] transition-colors ${
                activeTab === tab.id ? 'bg-white/[0.92] text-black' : 'text-white/40 hover:bg-white/[0.045] hover:text-white/80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl p-4 pb-12">
        {activeTab === 'vfx' && <VFXModule state={vfx} onUpdate={(updates) => setVfx((current) => ({ ...current, ...updates }))} />}
        {activeTab === 'broll' && <BRollCreator state={broll} onUpdate={(updates) => setBroll((current) => ({ ...current, ...updates }))} />}
        {activeTab === 'story' && <StoryMode state={story} onUpdate={(updates) => setStory((current) => ({ ...current, ...updates }))} />}
        {activeTab === 'musicVideo' && (
          <AIMusicVideo
            state={musicVideo}
            onUpdate={(updates) => setMusicVideo((current) => ({ ...current, ...updates }))}
            imageModel={musicVideo.imageModel}
            videoModel={musicVideo.videoModel}
            characterRefs={characterRefs}
            globalContext={globalContext}
          />
        )}
        {activeTab === 'character' && (
          <CharacterLockPanel
            creatorState={characterCreator}
            onCreatorUpdate={(updates) => setCharacterCreator((current) => ({ ...current, ...updates }))}
            characterRefs={characterRefs}
            onSave={(ref) => setCharacterRefs((current) => [ref, ...current])}
            imageModel={musicVideo.imageModel}
            globalContext={globalContext}
          />
        )}
      </main>
    </div>
  );
}
