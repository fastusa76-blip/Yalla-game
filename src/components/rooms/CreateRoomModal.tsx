import React, { useState } from 'react';
import { GameType, VoiceRoom, Player } from '../../types/game';
import { X, Sparkles, Plus, Dices } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Player;
  onRoomCreated: (newRoom: VoiceRoom) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRoomCreated
}) => {
  const [title, setTitle] = useState<string>('👑 Royal Majlis Party & Ludo');
  const [category, setCategory] = useState<'ludo' | 'domino' | 'party'>('ludo');
  const [gameBet, setGameBet] = useState<number>(2000);
  const [theme, setTheme] = useState<'majlis' | 'cyber'>('majlis');
  const [announcement, setAnnouncement] = useState<string>(
    'Welcome to our room! Relax, take a mic seat, and let the games begin!'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: VoiceRoom = {
      id: `room_${Date.now()}`,
      title,
      category,
      announcement,
      bgTheme: theme,
      bgImageUrl:
        theme === 'majlis'
          ? '/src/assets/images/room_bg_royal_majlis_1792988499294.jpg'
          : '/src/assets/images/room_bg_cyber_neon_1792988499489.jpg',
      hostId: currentUser.id,
      seats: [
        { ...currentUser, isHost: true, seatIndex: 0 },
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      spectatorCount: 1,
      activeGame: category === 'ludo' ? 'ludo' : category === 'domino' ? 'domino' : 'wheel',
      gameBet,
      hotScore: 1000
    };

    onRoomCreated(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Create Voice & Game Room
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Host a 8-seat voice stage with board games and virtual gifting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Room Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Game
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('ludo')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  category === 'ludo'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🎲 Ludo 4P
              </button>
              <button
                type="button"
                onClick={() => setCategory('domino')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  category === 'domino'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🁓 Dominoes
              </button>
              <button
                type="button"
                onClick={() => setCategory('party')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  category === 'party'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🎤 Voice Party
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Match Stakes (Gold Coins)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((bet) => (
                <button
                  key={bet}
                  type="button"
                  onClick={() => setGameBet(bet)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                    gameBet === bet
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  🪙 {bet}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lounge Atmosphere Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('majlis')}
                className={`p-2.5 text-xs font-bold rounded-xl border text-left flex items-center gap-2 ${
                  theme === 'majlis'
                    ? 'bg-purple-950/70 border-amber-400 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <span>🏰</span>
                <div>
                  <div>Royal Majlis</div>
                  <div className="text-[10px] font-normal text-slate-400">Gold & Velvet</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTheme('cyber')}
                className={`p-2.5 text-xs font-bold rounded-xl border text-left flex items-center gap-2 ${
                  theme === 'cyber'
                    ? 'bg-purple-950/70 border-purple-400 text-purple-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <span>⚡</span>
                <div>
                  <div>Cyber Neon</div>
                  <div className="text-[10px] font-normal text-slate-400">Esports Glow</div>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg transition-transform active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Voice Room</span>
          </button>
        </form>
      </div>
    </div>
  );
};
