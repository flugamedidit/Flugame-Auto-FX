import React from 'react';
import { CharacterCreatorState, CharacterRef } from '../types';
import { SectionLabel } from './UIPrimitives';
import { CharacterCreator } from './CharacterCreator';

interface CharacterLockPanelProps {
  creatorState: CharacterCreatorState;
  onCreatorUpdate: (updates: Partial<CharacterCreatorState>) => void;
  characterRefs: CharacterRef[];
  onSave: (ref: CharacterRef) => void;
  imageModel: string;
  globalContext: string;
}

export const CharacterLockPanel: React.FC<CharacterLockPanelProps> = ({
  creatorState,
  onCreatorUpdate,
  characterRefs,
  onSave,
  imageModel,
  globalContext
}) => (
  <div className="space-y-4">
    <SectionLabel icon="person_pin">Character Lock</SectionLabel>
    {characterRefs.length > 0 && (
      <div className="grid grid-cols-3 gap-2">
        {characterRefs.map((ref) => (
          <div key={ref.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            <img src={`data:${ref.mimeType || 'image/png'};base64,${ref.base64}`} className="aspect-square w-full object-cover" />
            <div className="p-2 text-[9px] font-black uppercase tracking-widest text-white/60">{ref.name}</div>
          </div>
        ))}
      </div>
    )}
    <CharacterCreator
      state={creatorState}
      onUpdate={onCreatorUpdate}
      onSave={onSave}
      imageModel={imageModel}
      globalContext={globalContext}
    />
  </div>
);
