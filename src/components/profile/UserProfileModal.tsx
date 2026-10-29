import React, { useState } from 'react';
import { Player } from '../../types/game';
import { X, Crown, Shield, Award, Gift, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Player;
  onCollectDailyReward: (coins: number, diamonds: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCollectDailyReward
}) => {
  const [claimedReward, setClaimedReward] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (claimedReward) return;
    setClaimedReward(true);
    audioEngine.playSoundboard('jackpot');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onCollectDailyReward(5000, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden bg-slate-800 ring-4 ring-amber-400/20">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black text-[10px] shadow">
              VIP {currentUser.vipLevel}
            </div>
          </div>

          <h3 className="mt-3 text-lg font-black text-white font-display">
            {currentUser.name}
          </h3>
          <p className="text-xs text-slate-400">
            Player ID: 884-9201 · Level {currentUser.level} Elite
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Gold Coins</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              🪙 {currentUser.coins.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Diamonds</div>
            <div className="text-sm font-bold text-cyan-400 font-mono">
              💎 {currentUser.diamonds.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Charm Score</div>
            <div className="text-sm font-bold text-purple-400 font-mono">
              ✨ {currentUser.charmPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Game Record Badge */}
        <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <div className="font-bold text-white">Board Game Win Rate</div>
              <div className="text-[10px] text-slate-400">68% Wins in 142 Matches</div>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Rank #14
          </span>
        </div>

        {/* Daily Reward Box */}
        <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-amber-500/15 rounded-2xl border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gift className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">Daily Majlis Bonus</div>
              <div className="text-[10px] text-amber-300">
                +5,000 Coins & +50 Diamonds
              </div>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={claimedReward}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              claimedReward
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
            }`}
          >
            {claimedReward ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Claimed
              </span>
            ) : (
              'Claim Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
