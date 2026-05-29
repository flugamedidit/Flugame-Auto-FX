import React, { useState } from 'react';
import { CharacterCreatorState, CharacterRef } from '../types';
import { SectionLabel, IconButton } from './UIPrimitives';
import { motion, AnimatePresence } from 'motion/react';
import { shotfxApi } from '../services/shotfxApi';

interface CharacterCreatorProps {
  state: CharacterCreatorState;
  onUpdate: (updates: Partial<CharacterCreatorState>) => void;
  onSave: (ref: CharacterRef) => void;
  imageModel: string;
  globalContext: string;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ state, onUpdate, onSave, imageModel, globalContext }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUploadImages = async () => {
    try {
      const items = await shotfxApi.selectMultipleMedia('image', 10);
      if (items.length > 0) {
        onUpdate({ 
          uploadedImages: [...state.uploadedImages, ...items.map(i => ({ mediaId: i.mediaId, base64: i.base64 }))] 
        });
      }
    } catch (err) { console.error('Upload failed', err); }
  };

  const handleGenerateSheet = async () => {
    if (state.uploadedImages.length === 0) return;
    setIsGenerating(true);
    onUpdate({ isGenerating: true });
    
    try {
      const { name, archetype, description, worldDescription, includeEnvironment, outfitPreference, notes } = state;
      const refIds = state.uploadedImages.map(i => i.mediaId);

      const prompt = `
        OFFICIAL FILM PRODUCTION DOCUMENTATION: Subject Design Reference Sheet.
        CHARACTER: "${name || 'Unnamed Character'}" / ARCHETYPE: "${archetype || 'Central Subject'}".
        DESCRIPTION: ${description || 'Highly detailed cinematic subject'}.
        ${outfitPreference ? `OUTFIT PREFERENCE: ${outfitPreference}.` : ''}
        ${notes ? `ADDITIONAL NOTES: ${notes}.` : ''}
        
        IDENTITY RIGOR: Analyze all ${refIds.length} references. Determine consistent identity including: face structure, skin tone, hairstyle, facial hair, age, and body type. 
        DO NOT average the face. DO NOT cartoonize. Preserve the actual referenced person's photorealistic identity.
        
        LAYOUT: 16:9 Aspect Ratio. Clean white high-end editorial background. Production-ready documentation style.
        
        LEFT COLUMN — TURNAROUND: Show three identical full-body views (FRONT, SIDE, BACK) of the same character. Include a clean vertical height marker.
        RIGHT TOP — EXPRESSIONS: Four close-up portraits showing (1) Neutral, (2) Focused/Intense, (3) Performance energy, (4) Cold/Confident stare. Identity must be identical in all.
        RIGHT MIDDLE — GEAR: Isolated labeled close-ups of relevant wardrobe items (jacket, shoes, jewelry).
        RIGHT SIDE — PALETTE: Vertical color palette with 8-10 swatches from wardrobe, skin, and materials.
        BOTTOM CENTER — OUTFIT: Clean breakdown of clothing pieces with text labels.
        
        ${includeEnvironment ? `ENVIRONMENT: Include a small cinematic thumbnail of "${worldDescription || 'Relevant cinematic world'}" in a clean bottom corner.` : 'NO environment thumbnail.'}
        
        STYLE: Cinematic photorealistic, highly detailed, clean sharp production bible. Professional studio lighting. Consistent subject design.
      `;

      const result = await shotfxApi.generateImage({
        prompt,
        referenceImageMediaIds: refIds,
        modelDisplayName: imageModel,
        aspectRatio: '16:9'
      });

      onUpdate({ 
        generatedSheet: { mediaId: result.mediaId, base64: result.base64 },
        isGenerating: false 
      });
    } catch (err) {
      console.error('Sheet generation failed', err);
    } finally {
      setIsGenerating(false);
      onUpdate({ isGenerating: false });
    }
  };

  const handleSaveToLock = () => {
    if (!state.generatedSheet) return;
    const newRef: CharacterRef = {
      id: Math.random().toString(36).substr(2, 9),
      mediaId: state.generatedSheet.mediaId,
      base64: state.generatedSheet.base64,
      name: state.name || 'Generated Character',
      subject: 'A'
    };
    onSave(newRef);
    onUpdate({ generatedSheet: null, mode: 'EXISTING', uploadedImages: [] });
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] text-white/30 uppercase tracking-widest">Identity References</label>
          {state.uploadedImages.length > 0 && (
            <button onClick={() => onUpdate({ uploadedImages: [] })} className="text-[8px] text-red-400/60 font-black uppercase tracking-widest">Clear All</button>
          )}
        </div>
        
        <div className="grid grid-cols-5 gap-1.5">
          <button 
            onClick={handleUploadImages}
            className="aspect-square border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-all text-white/20"
          >
            <span className="material-symbols-outlined text-[14px]">add_a_photo</span>
          </button>
          {state.uploadedImages.map((img, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group bg-black">
              <img src={`data:image/jpeg;base64,${img.base64}`} className="w-full h-full object-cover grayscale" />
              <button 
                onClick={() => onUpdate({ uploadedImages: state.uploadedImages.filter((_, idx) => idx !== i) })}
                className="absolute inset-0 bg-red-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <span className="material-symbols-outlined text-white text-[14px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[9px] text-white/30 uppercase tracking-widest pl-1">Name</label>
          <input 
            type="text" 
            value={state.name} 
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="E.g. JAX"
            className="w-full bg-black border border-white/10 rounded-lg text-[10px] text-white p-2 outline-none font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] text-white/30 uppercase tracking-widest pl-1">Archetype</label>
          <input 
            type="text" 
            value={state.archetype} 
            onChange={(e) => onUpdate({ archetype: e.target.value })}
            placeholder="E.g. Enforcer"
            className="w-full bg-black border border-white/10 rounded-lg text-[10px] text-white p-2 outline-none font-bold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] text-white/30 uppercase tracking-widest pl-1">Description</label>
        <textarea 
          value={state.description} 
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Age, build, hairstyle, tattoos, energy..."
          className="w-full h-16 bg-black border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white placeholder-white/20 resize-none outline-none"
        />
      </div>

      <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-white/30 uppercase tracking-widest">Environment Hook</span>
          <button 
            onClick={() => onUpdate({ includeEnvironment: !state.includeEnvironment })}
            className={`w-6 h-3 rounded-full transition-all relative ${state.includeEnvironment ? 'bg-blue-500' : 'bg-white/10'}`}
          >
            <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${state.includeEnvironment ? 'left-[14px]' : 'left-0.5'}`} />
          </button>
        </div>
        {state.includeEnvironment && (
          <textarea 
            value={state.worldDescription} 
            onChange={(e) => onUpdate({ worldDescription: e.target.value })}
            placeholder="Luxury penthouse, rain street, club locker room..."
            className="w-full h-12 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[9px] text-white placeholder-white/10 resize-none outline-none"
          />
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {state.generatedSheet && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/30 bg-black group shadow-2xl">
                <img src={`data:image/jpeg;base64,${state.generatedSheet.base64}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-500 rounded text-[8px] font-black text-white uppercase tracking-[2px]">Subject Design Locked</div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <button onClick={() => onUpdate({ generatedSheet: null })} className="p-2 bg-red-500 rounded-full"><span className="material-symbols-outlined text-white text-[16px]">delete</span></button>
                </div>
              </div>
              <button 
                onClick={handleSaveToLock}
                className="w-full h-10 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[2px] flex items-center justify-center gap-2 shadow-lg shadow-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">person_check</span>
                Save to Character Lock
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!state.generatedSheet && (
          <button 
            onClick={handleGenerateSheet}
            disabled={isGenerating || state.uploadedImages.length === 0}
            className="w-full h-11 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[3px] flex items-center justify-center gap-2 hover:bg-blue-400 disabled:opacity-20 transition-all shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">badge</span>}
            {isGenerating ? 'Building Ref Sheet...' : 'Generate Character Ref'}
          </button>
        )}
      </div>
    </div>
  );
};
