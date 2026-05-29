# SHOTFX Rack Web Rebuild

This is a standalone React/Vite rebuild generated from the copied SHOTFX components, screenshots, and master manifest supplied in the chat. It is a working web-app prototype, not the exact original Flow runtime source export.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## What works in this rebuild

- VFX Rack tab with module stack, semantic chips, 3D Text controls, Design Hero review/direct paths, Review Prompt and Export Now.
- B-Roll Classic/Story UI with Reference DNA, Style Directive, Image/Still vs Motion Clip mode, Generate B-Roll, story chat area.
- AI MV tab with Production Assets, Anti-Fake toggle, Motion Transfer Source, World Visual References, style hyperlinks, Build Scene, Export AI MV.
- Final Command Center with editable prompt, Animate Effect Logic, Optimize Prompt, source preview, and Final Export.
- Discovery Window with Basic/World modes and clickable replacement terms.
- Settings modal with manifest export.
- Local browser file uploads and mock generation output so the UI can be used without paid APIs.

## Important production note

The original Google Flow SDK generation calls were replaced with safe local/mock behavior. Real generation is now routed through serverless endpoints under `api/` so API keys stay off the client.

### Runtime setup

Create a Vercel environment with:

- `GOOGLE_API_KEY`
- optional `GOOGLE_IMAGE_MODEL`
- optional `GOOGLE_VIDEO_MODEL`
- optional `GOOGLE_IMAGE_API_URL` / `GOOGLE_VIDEO_API_URL`

The app now posts generation requests to `/api/generate-image` and `/api/generate-video`.

## Project structure

```text
src/
  App.tsx
  types.ts
  constants.ts
  style.css
  components/
  services/
```
