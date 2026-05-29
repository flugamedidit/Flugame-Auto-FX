# ShotFX Rack UXP

Premiere Pro UXP panel version of the ShotFX Rack tool.

## Included

- `manifest.json` - Adobe Premiere Pro UXP manifest
- `src/App.tsx` - main UXP panel shell and VFX/B-Roll/MV tab layout
- `src/services/shotfxApi.ts` - placeholder service wrapper for future AI/backend calls
- `src/services/premiere.ts` - placeholder service wrapper for future Premiere import/timeline/export actions
- `src/components/VFXModule.tsx` - VFX module UI and mock prompt logic
- `src/components/BRollCreator.tsx` - B-Roll Creator classic mode
- `src/components/StoryMode.tsx` - B-Roll Story Mode workflow
- `src/components/AIMusicVideo.tsx` - AI Music Video scene/performance workflow with mock responses
- `src/components/CharacterLockPanel.tsx` - Character Lock existing/create ref switcher
- `src/components/CharacterCreator.tsx` - Create Ref workflow inside Character Lock
- `src/components/UIPrimitives.tsx` - shared UI pieces
- `src/components/Timeline.tsx` - timeline component

## Notes

The panel intentionally uses mock service responses. Real AI generation and Premiere timeline operations should be wired through `src/services/shotfxApi.ts` and `src/services/premiere.ts`.

## Run locally

```bash
npm install
npm run dev
```

## Build for UXP Developer Tool

```bash
npm run build
```

Build output is written to `dist/`. Add this project in Adobe UXP Developer Tool and load the ShotFX Rack panel for Premiere Pro.
