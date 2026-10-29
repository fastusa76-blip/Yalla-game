import React from 'react';
import { audioEngine } from '../../utils/audioEngine';
import { X, Sparkles } from 'lucide-react';

interface SoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSoundTriggered: (name: string, icon: string) => void;
}

export const SoundboardModal: React.FC<SoundboardModalProps> = ({
  isOpen,
  onClose,
  onSoundTriggered
}) => {
  if (!isOpen) return null;

  const effects = [
    { id: 'applause' as const, name: 'Grand Applause', icon: '👏', desc: 'Warm standing ovation' },
    { id: 'cheer' as const, name: 'Stadium Cheer', icon: '🙌', desc: 'Crowd celebration roar' },
    { id: 'laugh' as const, name: 'Room Laughter', icon: '😂', desc: 'Burst of hearty laughs' },
    { id: 'airhorn' as const, name: 'Party Airhorn', icon: '📢', desc: 'Hype blast fanfare' },
    { id: 'jackpot' as const, name: 'Coin Jackpot', icon: '🎰', desc: 'Golden coin cascade' },
    { id: 'drumroll' as const, name: 'Dramatic Drumroll', icon: '🥁', desc: 'Suspense building beat' }
  ];

  const handlePlay = (id: 'applause' | 'cheer' | 'laugh' | 'airhorn' | 'jackpot' | 'drumroll', name: string, icon: string) => {
    audioEngine.playSoundboard(id);
    onSoundTriggered(name, icon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Voice Party Soundboard
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Tap any button to broadcast atmospheric synthesized crowd effects to the voice room.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {effects.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePlay(item.id, item.name, item.icon)}
              className="flex items-center gap-3 p-3 bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700/60 hover:border-purple-500/50 rounded-xl transition-all text-left group active:scale-95"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
