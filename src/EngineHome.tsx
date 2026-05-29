import { useState } from 'react';
import App from './App';

function EngineCard({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button className="engine-card" onClick={onClick}>
      <span className="engine-icon material-symbols-outlined">{icon}</span>
      <span className="engine-label">{label}</span>
    </button>
  );
}

export default function EngineHome() {
  const [open, setOpen] = useState<null | 'video' | 'music'>(null);
  return (
    <div className="engine-home-bg">
      <div className="engine-home-center">
        <h1 className="engine-home-title">Choose Generation Engine</h1>
        <div className="engine-card-row">
          <EngineCard label="Video Generation" icon="movie" onClick={() => setOpen('video')} />
          <EngineCard label="Music Generation" icon="music_note" onClick={() => setOpen('music')} />
        </div>
      </div>
      {open === 'video' && (
        <div className="engine-modal-back" onClick={() => setOpen(null)}>
          <div className="engine-modal" onClick={e => e.stopPropagation()}>
            <App />
          </div>
        </div>
      )}
      {open === 'music' && (
        <div className="engine-modal-back" onClick={() => setOpen(null)}>
          <div className="engine-modal" onClick={e => e.stopPropagation()}>
            <div className="music-placeholder">
              <h2>Music Generation Engine</h2>
              <p>Coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
