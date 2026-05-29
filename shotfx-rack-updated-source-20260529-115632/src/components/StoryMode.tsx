import React from 'react';
import { StoryModeState } from '../types';
import { SectionLabel } from './UIPrimitives';

interface StoryModeProps {
  state: StoryModeState;
  onUpdate: (updates: Partial<StoryModeState>) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({ state, onUpdate }) => {
  const buildMockPlan = () => {
    onUpdate({
      shotPlan:
        'Mock shot plan: 1. Establish the active Premiere frame. 2. Choose the strongest beat moment. 3. Place one VFX or text asset. 4. Send future media requests through the ShotFX API wrapper.'
    });
  };

  return (
    <div className="space-y-4">
      <SectionLabel icon="forum">Story Mode</SectionLabel>
      <textarea
        value={state.chatInput}
        onChange={(event) => onUpdate({ chatInput: event.target.value })}
        placeholder="Describe the sequence you want to build"
        className="h-32 w-full resize-none rounded-lg border border-white/[0.06] bg-[#0b0b0b] p-3 text-[11px] text-white/80 outline-none placeholder-white/20 focus:border-white/20"
      />
      <button onClick={buildMockPlan} className="h-11 w-full rounded-lg bg-[#f4f4f4] text-[10px] font-semibold uppercase tracking-[1.8px] text-black transition-colors hover:bg-white">
        Build Mock Shot Plan
      </button>
      {state.shotPlan && (
        <div className="rounded-lg bg-[#111111] p-3 text-[11px] leading-relaxed text-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          {state.shotPlan}
        </div>
      )}
    </div>
  );
};
