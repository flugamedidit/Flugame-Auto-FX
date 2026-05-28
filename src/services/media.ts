import { MediaAsset, MediaKind } from '../types';
export const uid = () => Math.random().toString(36).slice(2,10);
export function fileToAsset(file: File): MediaAsset { const type: MediaKind = file.type.startsWith('video') ? 'video' : 'image'; return { id: uid(), name: file.name, type, url: URL.createObjectURL(file), file, mimeType: file.type }; }
export function timecode(seconds:number){ const m=Math.floor(seconds/60).toString().padStart(2,'0'); const s=Math.floor(seconds%60).toString().padStart(2,'0'); const cs=Math.floor((seconds%1)*100).toString().padStart(2,'0'); return `${m}:${s}.${cs}`; }
export async function captureVideoFrame(video: HTMLVideoElement | null): Promise<string | null>{ if(!video || !video.videoWidth) return null; const canvas=document.createElement('canvas'); canvas.width=video.videoWidth; canvas.height=video.videoHeight; const ctx=canvas.getContext('2d'); if(!ctx) return null; ctx.drawImage(video,0,0); return canvas.toDataURL('image/jpeg',.88); }
