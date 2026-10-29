import React, { useEffect, useState } from 'react';
import { ActiveGiftAnimation } from '../../types/game';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';

interface GiftAnimationOverlayProps {
  activeGift: ActiveGiftAnimation | null;
  onAnimationComplete: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({
  activeGift,
  onAnimationComplete
}) => {
  const [animStage, setAnimStage] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    if (!activeGift) return;

    setAnimStage('enter');
    audioEngine.playSoundboard('jackpot');

    if (activeGift.gift.id === 'fireworks' || activeGift.gift.id === 'rocket') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 }
      });
    }

    const timer1 = setTimeout(() => {
      setAnimStage('active');
    }, 400);

    const timer2 = setTimeout(() => {
      setAnimStage('exit');
    }, 3200);

    const timer3 = setTimeout(() => {
      onAnimationComplete();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeGift, onAnimationComplete]);

  if (!activeGift) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* Top High-Roller Gold Banner */}
      <div
        className={`absolute top-16 z-50 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-2xl border-2 border-yellow-200 flex items-center gap-3 transition-all duration-500 ${
          animStage === 'enter'
            ? 'opacity-0 -translate-y-8 scale-90'
            : animStage === 'exit'
            ? 'opacity-0 -translate-y-4'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <span className="text-2xl">{activeGift.gift.icon}</span>
        <div className="flex flex-col text-left">
          <div className="text-xs uppercase tracking-wider text-slate-900 font-extrabold">
            Luxury Gift Broadcast
          </div>
          <div className="text-sm">
            <span className="text-purple-950">{activeGift.sender.name}</span> gifted{' '}
            <span className="underline decoration-purple-900">{activeGift.gift.name}</span> to{' '}
            <span className="text-purple-950">{activeGift.recipient.name}</span>!
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-mono">
          +{activeGift.gift.charmValue} Charm
        </span>
      </div>

      {/* Center 3D Thematic Icon Animation */}
      <div
        className={`transform transition-all duration-700 flex flex-col items-center justify-center ${
          animStage === 'enter'
            ? 'scale-0 rotate-12 opacity-0'
            : animStage === 'exit'
            ? 'scale-150 opacity-0 -translate-y-24'
            : 'scale-125 rotate-0 opacity-100'
        }`}
      >
        {/* Glowing backdrop halo */}
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/40 via-purple-500/30 to-pink-500/40 blur-2xl absolute -z-10 animate-pulse" />

        {/* Animated Item Icon */}
        <div
          className={`text-8xl sm:text-9xl drop-shadow-2xl ${
            activeGift.gift.id === 'rocket'
              ? 'animate-bounce'
              : activeGift.gift.id === 'supercar'
              ? 'animate-float'
              : 'animate-pulse'
          }`}
        >
          {activeGift.gift.icon}
        </div>

        <div className="mt-4 px-4 py-1.5 rounded-2xl bg-slate-950/90 border border-amber-400 text-amber-300 font-black text-sm tracking-wide shadow-xl">
          {activeGift.gift.name}
        </div>
      </div>
    </div>
  );
};
