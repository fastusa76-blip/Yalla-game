import React, { useEffect, useState } from 'react';
import { Player } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { Crown, Mic, MicOff, Volume2, VolumeX, Sparkles, Plus, Radio } from 'lucide-react';

interface VoiceStageProps {
  seats: (Player | null)[];
  currentUser: Player;
  onSeatClick: (seatIndex: number, player: Player | null) => void;
  onOpenSoundboard: () => void;
  onToggleUserMic: () => void;
  isUserMicActive: boolean;
}

export const VoiceStage: React.FC<VoiceStageProps> = ({
  seats,
  currentUser,
  onSeatClick,
  onOpenSoundboard,
  onToggleUserMic,
  isUserMicActive
}) => {
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [isMutedAll, setIsMutedAll] = useState<boolean>(false);
  const isUserSeated = seats.some((s) => s?.id === currentUser.id);

  // Poll live microphone level from audio engine if user mic is active
  useEffect(() => {
    if (!isUserMicActive) {
      setLiveVolume(0);
      return;
    }
    const interval = setInterval(() => {
      const level = audioEngine.getLiveMicLevel();
      setLiveVolume(level);
    }, 80);
    return () => clearInterval(interval);
  }, [isUserMicActive]);

  const toggleMuteAll = () => {
    const muted = audioEngine.toggleMute();
    setIsMutedAll(muted);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3 sm:p-4 shadow-xl">
      {/* Top stage header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
            Live Voice Stage
          </span>
          <span className="text-[11px] text-slate-400">
            · {seats.filter(Boolean).length}/8 Active Mics
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSoundboard}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
            title="Open Room Soundboard"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soundboard</span>
          </button>

          <button
            onClick={toggleMuteAll}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 transition-colors"
            title={isMutedAll ? 'Unmute Room Audio' : 'Mute Room Audio'}
          >
            {isMutedAll ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* 8 Voice Podiums Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
        {seats.map((player, index) => {
          const isHostSeat = index === 0;
          const isMe = player?.id === currentUser.id;
          const speaking = isMe
            ? isUserMicActive && liveVolume > 0.08
            : player?.isSpeaking;

          return (
            <div
              key={index}
              onClick={() => onSeatClick(index, player)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                {/* Speaking Wave Glow */}
                {speaking && (
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-500 to-amber-400 opacity-75 blur-xs animate-voice-pulse" />
                )}

                {/* Avatar Box */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 ${
                    player
                      ? speaking
                        ? 'ring-2 ring-amber-400 scale-105'
                        : isMe
                        ? 'ring-2 ring-emerald-400'
                        : 'ring-1 ring-slate-700 bg-slate-800'
                      : 'border-2 border-dashed border-slate-700/80 bg-slate-800/40 hover:border-purple-400/80'
                  }`}
                >
                  {player ? (
                    <img
                      src={player.avatar}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-purple-300 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="text-[9px] font-mono mt-0.5">{index + 1}</span>
                    </div>
                  )}

                  {/* Host Crown Icon */}
                  {isHostSeat && player && (
                    <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-md">
                      <Crown className="w-3 h-3 fill-amber-900" />
                    </div>
                  )}

                  {/* Mic Muted Badge */}
                  {player && !player.micActive && !isMe && (
                    <div className="absolute bottom-0 right-0 bg-rose-600/90 text-white p-0.5 rounded-full shadow">
                      <MicOff className="w-2.5 h-2.5" />
                    </div>
                  )}

                  {/* User Mic status badge */}
                  {isMe && (
                    <div
                      className={`absolute bottom-0 right-0 p-0.5 rounded-full shadow text-white ${
                        isUserMicActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    >
                      {isUserMicActive ? (
                        <Mic className="w-2.5 h-2.5" />
                      ) : (
                        <MicOff className="w-2.5 h-2.5" />
                      )}
                    </div>
                  )}
                </div>

                {/* Equalizer animation when speaking */}
                {speaking && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-2 px-1 bg-slate-950/90 rounded-full border border-purple-500/40">
                    <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              {/* Player Name and VIP Tag */}
              <div className="mt-1.5 text-center w-full px-0.5">
                <p className="text-[11px] font-medium text-slate-300 truncate max-w-[68px]">
                  {player ? (isMe ? 'You' : player.name) : 'Empty'}
                </p>
                {player ? (
                  <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-mono">
                    <span className="px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 font-semibold">
                      VIP {player.vipLevel}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500">Tap to Sit</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Toolbar for Seated User */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isUserSeated ? (
            <button
              onClick={onToggleUserMic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                isUserMicActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white'
              }`}
            >
              {isUserMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isUserMicActive ? 'Mic Live (Mute)' : 'Mic Off (Unmute)'}</span>
            </button>
          ) : (
            <button
              onClick={() => onSeatClick(3, null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Take a Voice Seat</span>
            </button>
          )}

          {isUserMicActive && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Input:</span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-75"
                  style={{ width: `${Math.min(100, liveVolume * 150)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Tap any player to send luxury gifts</span>
        </div>
      </div>
    </div>
  );
};
