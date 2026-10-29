import React, { useState } from 'react';
import { GiftItem, Player } from '../../types/game';
import { GIFTS_CATALOGUE } from '../../data/mockData';
import { X, Sparkles, Send } from 'lucide-react';

interface GiftShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlayer: Player | null;
  currentUserDiamonds: number;
  onSendGift: (gift: GiftItem, target: Player) => void;
}

export const GiftShopModal: React.FC<GiftShopModalProps> = ({
  isOpen,
  onClose,
  targetPlayer,
  currentUserDiamonds,
  onSendGift
}) => {
  const [selectedGift, setSelectedGift] = useState<GiftItem>(GIFTS_CATALOGUE[0]);

  if (!isOpen || !targetPlayer) return null;

  const handleSend = () => {
    if (currentUserDiamonds < selectedGift.price) return;
    onSendGift(selectedGift, targetPlayer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-md w-full p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 border border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Recipient Profile Info */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
            <img
              src={targetPlayer.avatar}
              alt={targetPlayer.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs text-slate-400">Send Gift to:</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{targetPlayer.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                VIP {targetPlayer.vipLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Gifts Grid */}
        <div className="my-4 grid grid-cols-3 gap-2.5">
          {GIFTS_CATALOGUE.map((gift) => {
            const isSelected = selectedGift.id === gift.id;
            return (
              <div
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-950/60 border-amber-400 ring-2 ring-amber-400/50 scale-102'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="text-3xl my-1 transform group-hover:scale-110 transition-transform">
                  {gift.icon}
                </div>
                <div className="text-xs font-semibold text-slate-200 text-center truncate w-full">
                  {gift.name}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <span>💎</span>
                  <span>{gift.price}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gift Description & Charm Points */}
        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span className="truncate max-w-[240px]">{selectedGift.description}</span>
          <span className="text-amber-400 font-mono shrink-0">
            +{selectedGift.charmValue} Charm
          </span>
        </div>

        {/* Bottom Bar: Diamond Balance & Send Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>Your Diamonds:</span>
            <span className="font-mono text-cyan-400 font-bold">
              💎 {currentUserDiamonds}
            </span>
          </div>

          <button
            onClick={handleSend}
            disabled={currentUserDiamonds < selectedGift.price}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Gift ({selectedGift.price} 💎)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
