import React, { useState } from 'react';
import { VoiceRoom } from '../../types/game';
import { Radio, Users, Flame, Dices, Sparkles, Plus, Trophy, ChevronRight } from 'lucide-react';

interface RoomBrowserProps {
  rooms: VoiceRoom[];
  onSelectRoom: (room: VoiceRoom) => void;
  onCreateRoomClick: () => void;
  onQuickPlay: (game: 'ludo' | 'domino' | 'wheel') => void;
  onOpenLeaderboard: () => void;
}

export const RoomBrowser: React.FC<RoomBrowserProps> = ({
  rooms,
  onSelectRoom,
  onCreateRoomClick,
  onQuickPlay,
  onOpenLeaderboard
}) => {
  const [filter, setFilter] = useState<'all' | 'ludo' | 'domino' | 'party'>('all');

  const filteredRooms = rooms.filter((r) => {
    if (filter === 'all') return true;
    return r.category === filter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Featured Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950/80 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>SEASON 14 CHAMPIONSHIP IS LIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight">
            Play Board Games with Real-Time Voice Chat
          </h1>

          <p className="text-sm text-slate-300 mt-2 mb-6">
            Hop into live 8-seat voice rooms, roll dice in competitive 4-Player Ludo, match tiles in Royal Dominoes, and exchange luxury 3D virtual gifts with friends.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onQuickPlay('ludo')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95"
            >
              <Dices className="w-4 h-4" />
              <span>Quick Match Ludo</span>
            </button>

            <button
              onClick={() => onQuickPlay('domino')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
            >
              <span>Quick Match Domino</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Leaderboard</span>
            </button>

            <button
              onClick={onCreateRoomClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Room</span>
            </button>
          </div>
        </div>

        {/* Thematic Hero Artwork Preview */}
        <div className="relative w-full md:w-80 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl shrink-0">
          <img
            src="/src/assets/images/ludo_game_banner_1792988499498.jpg"
            alt="Ludo Tournament"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-3">
            <span className="text-xs font-bold text-amber-300">
              🔥 1.4M+ Active Players Across Gulf & Worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Live Rooms
          </button>
          <button
            onClick={() => setFilter('ludo')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
              filter === 'ludo'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎲 Ludo Arenas
          </button>
          <button
            onClick={() => setFilter('domino')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
              filter === 'domino'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🁓 Royal Dominoes
          </button>
          <button
            onClick={() => setFilter('party')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
              filter === 'party'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎤 Voice & Wheel Party
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard Standings</span>
          </button>
          <div className="text-xs text-slate-400">
            Showing <span className="font-mono text-slate-200">{filteredRooms.length}</span> Active Voice Rooms
          </div>
        </div>
      </div>

      {/* Hall of Fame Spotlight Card in Lobby */}
      <div
        onClick={onOpenLeaderboard}
        className="relative bg-gradient-to-r from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-xl hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
                LOBBY SPOTLIGHT
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] text-slate-400">Weekly Season 14</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
              Top Charm &amp; Match Champions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              #1 👑 Sheikh Tariq (194.5K Charm) · #2 Noor Queen (1,280 Wins) · View where you rank!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-800">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq"
                alt="Sheikh Tariq"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 overflow-hidden bg-slate-800">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Noor"
                alt="Noor Queen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-amber-700 overflow-hidden bg-slate-800">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ammar"
                alt="Captain Ammar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-colors">
            <span>View Leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredRooms.map((room) => {
          const seatedCount = room.seats.filter(Boolean).length;
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/60 rounded-3xl p-4 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Room Card Header with Image and Category */}
              <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                <img
                  src={room.bgImageUrl}
                  alt={room.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-bold text-amber-300">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="uppercase">{room.category}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-[11px] text-slate-300 font-mono">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{room.spectatorCount}</span>
                  </div>
                </div>

                {/* Bottom title inside thumbnail */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-md truncate">
                    {room.title}
                  </h3>
                </div>
              </div>

              {/* Announcement text */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {room.announcement}
              </p>

              {/* Seated Mic Preview Strip */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/70">
                <div className="flex items-center -space-x-2">
                  {room.seats.filter(Boolean).map((player, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800"
                      title={player?.name}
                    >
                      <img
                        src={player?.avatar}
                        alt={player?.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <span className="pl-3 text-[11px] text-slate-400">
                    {seatedCount}/8 on Mic
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    🪙 {room.gameBet.toLocaleString()} Bet
                  </span>
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
