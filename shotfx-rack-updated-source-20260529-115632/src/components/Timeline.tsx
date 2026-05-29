import React, { useRef } from 'react';
import { MonoValue } from './UIPrimitives';

interface TimelineProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  markers: Array<{ time: number; label: string; color: string }>;
}

export const Timeline: React.FC<TimelineProps> = ({ currentTime, duration, onSeek, markers }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const update = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      onSeek((x / rect.width) * duration);
    };

    update(e.nativeEvent);

    const up = () => {
      window.removeEventListener('mousemove', update);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', update);
    window.addEventListener('mouseup', up);
  };

  const progress = (currentTime / (duration || 1)) * 100;

  return (
    <div className="h-20 bg-[#0e0e0e] border-t border-white/10 px-6 py-3 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <MonoValue value={currentTime.toFixed(2)} />
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[10px] text-white/30 font-mono">00:00:{Math.floor(duration).toString().padStart(2, '0')}</span>
        </div>
        <div className="flex gap-4">
          {markers.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-[9px] text-white/40 uppercase tracking-tighter">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-8 w-full bg-white/5 rounded-md cursor-crosshair overflow-hidden group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-between px-1 opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`w-px bg-white ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`} />
          ))}
        </div>

        <div 
          className="absolute inset-y-0 left-0 bg-white/10 pointer-events-none transition-all duration-75"
          style={{ width: `${progress}%` }}
        />

        <div 
          className="absolute inset-y-0 w-0.5 bg-white z-10 pointer-events-none"
          style={{ left: `${progress}%` }}
        >
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-white/20" />
        </div>

        {markers.map((m, i) => (
          <div 
            key={i}
            className="absolute inset-y-0 w-px bg-white/50 z-5"
            style={{ left: `${(m.time / duration) * 100}%`, backgroundColor: m.color }}
          >
             <div className="absolute bottom-0 -left-1 w-2 h-2 rotate-45" style={{ backgroundColor: m.color }} />
          </div>
        ))}
      </div>
    </div>
  );
};
