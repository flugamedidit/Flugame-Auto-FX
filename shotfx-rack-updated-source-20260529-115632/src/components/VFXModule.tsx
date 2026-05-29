import React from 'react';
import { VFXModuleState } from '../types';
import { SectionLabel } from './UIPrimitives';

interface VFXModuleProps {
  state: VFXModuleState;
  onUpdate: (updates: Partial<VFXModuleState>) => void;
}

export const VFXModule: React.FC<VFXModuleProps> = ({ state, onUpdate }) => {
  const generateMockPrompt = () => {
    onUpdate({
      generatedPrompt:
        'Mock VFX prompt: preserve the active Premiere frame, anchor the effect to the performer gesture, match grain, lens blur, lighting, and depth. Future AI generation will run through services/shotfxApi.ts.'
    });
  };

  return (
    <div className="space-y-4">
      <SectionLabel icon="auto_fix_high">VFX Rack</SectionLabel>
      <textarea
        value={state.lyricOverride}
        onChange={(event) => onUpdate({ lyricOverride: event.target.value })}
        placeholder="Lyric or subject matter override"
        className="h-24 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] p-3 text-[11px] text-white/80 outline-none placeholder-white/20 focus:border-white/20"
      />
      <textarea
        value={state.effectMapperJson}
        onChange={(event) => onUpdate({ effectMapperJson: event.target.value })}
        placeholder="Effect mapper JSON"
        className="h-28 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] p-3 font-mono text-[11px] text-white/80 outline-none placeholder-white/20 focus:border-white/20"
      />
      <button onClick={generateMockPrompt} className="h-11 w-full rounded-lg bg-white/90 text-[10px] font-semibold uppercase tracking-[1.8px] text-black transition-colors hover:bg-white">
        Build Mock VFX Prompt
      </button>
      {state.generatedPrompt && (
        <div className="rounded-lg bg-[#111111] p-3 text-[11px] leading-relaxed text-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          {state.generatedPrompt}
        </div>
      )}
    </div>
  );
};
