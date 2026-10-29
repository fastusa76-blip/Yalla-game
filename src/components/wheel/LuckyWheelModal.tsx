import React, { useState } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { X, Sparkles, Trophy } from 'lucide-react';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
  userDiamonds: number;
  onPrizeWon: (prize: string, rewardCoins: number, rewardDiamonds: number) => void;
}

interface Segment {
  label: string;
  sub: string;
  coins: number;
  diamonds: number;
  color: string;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  userCoins,
  userDiamonds,
  onPrizeWon
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<Segment | null>(null);

  if (!isOpen) return null;

  const segments: Segment[] = [
    { label: '10,000', sub: 'Coins', coins: 10000, diamonds: 0, color: '#f59e0b' },
    { label: '50', sub: 'Diamonds', coins: 0, diamonds: 50, color: '#06b6d4' },
    { label: '2,500', sub: 'Coins', coins: 2500, diamonds: 0, color: '#8b5cf6' },
    { label: '🏎️ Supercar', sub: 'Gift', coins: 0, diamonds: 150, color: '#ec4899' },
    { label: '1,000', sub: 'Coins', coins: 1000, diamonds: 0, color: '#10b981' },
    { label: '👑 Crown', sub: 'Gift', coins: 0, diamonds: 100, color: '#eab308' },
    { label: '5,000', sub: 'Coins', coins: 5000, diamonds: 0, color: '#3b82f6' },
    { label: '100', sub: 'Diamonds', coins: 0, diamonds: 100, color: '#14b8a6' }
  ];

  const spinCost = 500; // in coins

  const handleSpin = () => {
    if (isSpinning || userCoins < spinCost) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Play spinning ticks
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      audioEngine.playWheelTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    const winningIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    // Calculate final degrees
    const extraTurns = 5 * 360; // 5 full rotations
    const targetDeg = extraTurns + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    const nextRotation = rotation + targetDeg;

    setRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = segments[winningIndex];
      setWonPrize(prize);
      audioEngine.playVictoryFanfare();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } });
      onPrizeWon(`${prize.label} ${prize.sub}`, prize.coins, prize.diamonds);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-black text-white font-display">
            Lucky Prize Wheel
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 text-center">
          Spin for high-value coins, diamonds, and luxury gift cards!
        </p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Wheel Pointer Pin at Top */}
          <div className="absolute -top-3 z-30 transform -translate-x-1/2 left-1/2">
            <div className="w-5 h-6 bg-gradient-to-b from-amber-300 to-amber-500 clip-triangle shadow-lg border border-amber-200" />
          </div>

          {/* Rotating Wheel Disk */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.8s cubic-bezier(0.12, 0.8, 0.32, 1)' : 'none'
            }}
          >
            {/* SVG Wheel segments */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {segments.map((seg, idx) => {
                const angle = 360 / segments.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;

                const x1 = 100 + 100 * Math.cos(startRad);
                const y1 = 100 + 100 * Math.sin(startRad);
                const x2 = 100 + 100 * Math.cos(endRad);
                const y2 = 100 + 100 * Math.sin(endRad);

                const midAngle = (startAngle + endAngle) / 2;
                const textRad = ((midAngle - 90) * Math.PI) / 180;
                const tx = 100 + 65 * Math.cos(textRad);
                const ty = 100 + 65 * Math.sin(textRad);

                return (
                  <g key={idx}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs shadow-inner">
              ★
            </div>
          </div>
        </div>

        {/* Won Prize Notice */}
        {wonPrize && (
          <div className="mt-3 p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-center w-full animate-in zoom-in-95">
            <span className="text-xs text-amber-200">Congratulations! You won:</span>
            <div className="text-sm font-black text-amber-300">
              {wonPrize.label} {wonPrize.sub}
            </div>
          </div>
        )}

        {/* Spin CTA Button */}
        <div className="mt-4 w-full flex flex-col gap-2">
          <button
            onClick={handleSpin}
            disabled={isSpinning || userCoins < spinCost}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>{isSpinning ? 'Spinning...' : `Spin Now (${spinCost} Coins)`}</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Your Balance: 🪙 {userCoins.toLocaleString()}</span>
            <span>💎 {userDiamonds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
