import React from 'react';

export const SectionLabel: React.FC<{ children: React.ReactNode; icon?: string }> = ({ children, icon }) => (
  <div className="mb-2 flex items-center gap-1.5 px-1">
    {icon && <span className="material-symbols-outlined text-[14px] text-white/30">{icon}</span>}
    <span className="text-[9px] font-medium uppercase tracking-[1.4px] text-white/50">
      {children}
    </span>
  </div>
);

export const GlassPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-lg bg-[#111111] shadow-[0_16px_42px_rgba(0,0,0,0.22)] ${className}`}>
    {children}
  </div>
);

export const IconButton: React.FC<{ icon: string; onClick?: () => void; active?: boolean; tooltip?: string; disabled?: boolean; size?: 'sm' | 'md' }> = ({ icon, onClick, active, disabled, size = 'md' }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center rounded-md transition-colors ${size === 'sm' ? 'p-1.5' : 'p-2'} ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/[0.055] hover:text-white/80'} disabled:opacity-20`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

export const MonoValue: React.FC<{ value: string | number }> = ({ value }) => (
  <span className="rounded bg-white/[0.055] px-1.5 py-0.5 font-mono text-[10px] text-white/40">
    {value}
  </span>
);

export const NumberCounter: React.FC<{ 
  value: number; 
  onChange: (v: number) => void; 
  min?: number; 
  max?: number; 
  label?: string;
  className?: string;
}> = ({ value, onChange, min = 1, max = 20, label, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-[8px] text-white/20 uppercase tracking-widest pl-1">{label}</label>}
    <div className="flex h-8 items-center overflow-hidden rounded-md bg-[#070707]">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))} 
        className="w-8 h-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>
      <div className="flex flex-1 items-center justify-center border-x border-white/[0.04] font-mono text-[11px] text-white/80">
        {value}
      </div>
      <button 
        onClick={() => onChange(Math.min(max, value + 1))} 
        className="w-8 h-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  </div>
);
