import React from 'react';
import { BRollCreatorState } from '../types';
import { SectionLabel } from './UIPrimitives';

interface BRollCreatorProps {
  state: BRollCreatorState;
  onUpdate: (updates: Partial<BRollCreatorState>) => void;
}

export const BRollCreator: React.FC<BRollCreatorProps> = ({ state, onUpdate }) => {
  const generateMockPrompt = () => {
    onUpdate({
      generatedPrompt:
        'Mock B-roll prompt: create a short, cinematic insert idea from the lyric and frame notes. Real image/video calls will be connected later through services/shotfxApi.ts.'
    });
  };

  return (
    <div className="space-y-4">
      <SectionLabel icon="movie">B-Roll Creator</SectionLabel>
      <textarea
        value={state.lyricText}
        onChange={(event) => onUpdate({ lyricText: event.target.value })}
        placeholder="Lyric, word, or prop idea"
        className="h-24 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] p-3 text-[11px] text-white/80 outline-none placeholder-white/20 focus:border-white/20"
      />
      <textarea
        value={state.frameNotes}
        onChange={(event) => onUpdate({ frameNotes: event.target.value })}
        placeholder="Frame notes or visual direction"
        className="h-28 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] p-3 text-[11px] text-white/80 outline-none placeholder-white/20 focus:border-white/20"
      />
      <button onClick={generateMockPrompt} className="h-11 w-full rounded-lg bg-[#f4f4f4] text-[10px] font-semibold uppercase tracking-[1.8px] text-black transition-colors hover:bg-white">
        Build Mock B-Roll Prompt
      </button>
      {state.generatedPrompt && (
        <div className="rounded-lg bg-[#111111] p-3 text-[11px] leading-relaxed text-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          {state.generatedPrompt}
        </div>
      )}
    </div>
  );
};
