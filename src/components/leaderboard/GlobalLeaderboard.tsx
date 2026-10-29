import React, { useState, useMemo } from 'react';
import { LeaderboardEntry, Player } from '../../types/game';
import { LEADERBOARD_PLAYERS } from '../../data/mockData';
import {
  Trophy,
  Crown,
  Sparkles,
  Flame,
  Gift,
  ArrowUpRight,
  Medal,
  ChevronRight,
  X,
  Search
} from 'lucide-react';

interface GlobalLeaderboardProps {
  currentUser: Player;
  onSendGiftToPlayer?: (player: Player) => void;
  onClose?: () => void;
  isModal?: boolean;
}

type MetricType = 'charm' | 'wins' | 'coins';
type TimeframeType = 'weekly' | 'allTime';
type GameFilterType = 'all' | 'ludo' | 'domino';

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUser,
  onSendGiftToPlayer,
  onClose,
  isModal = false
}) => {
  const [metric, setMetric] = useState<MetricType>('charm');
  const [timeframe, setTimeframe] = useState<TimeframeType>('weekly');
  const [gameFilter, setGameFilter] = useState<GameFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic ranking calculation based on selected metric and filters
  const sortedPlayers: LeaderboardEntry[] = useMemo(() => {
    let list = LEADERBOARD_PLAYERS.map((p) => {
      // If player is user, sync live coins and diamonds/charm with currentUser
      if (p.isUser) {
        return {
          ...p,
          charmPoints: currentUser.charmPoints,
          coinsWon: currentUser.coins
        };
      }
      return p;
    });

    if (gameFilter === 'ludo') {
      list = list.filter((p) => p.favoriteGame === 'Ludo' || p.favoriteGame === 'All');
    } else if (gameFilter === 'domino') {
      list = list.filter((p) => p.favoriteGame === 'Dominoes' || p.favoriteGame === 'All');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }

    // Sort by selected metric
    const sorted = [...list].sort((a, b) => {
      if (metric === 'charm') {
        return b.charmPoints - a.charmPoints;
      }
      if (metric === 'wins') {
        return b.totalWins - a.totalWins;
      }
      return b.coinsWon - a.coinsWon;
    });

    // Reassign ranks
    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [metric, gameFilter, searchQuery, currentUser]);

  const top3 = sortedPlayers.slice(0, 3);
  const remainingPlayers = sortedPlayers.slice(3);

  // Find user's position
  const userEntry = sortedPlayers.find((p) => p.isUser);

  const containerContent = (
    <div className="flex flex-col w-full max-w-5xl mx-auto gap-5">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950/80 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>GLOBAL CHAMPIONSHIP STANDINGS</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Updated Real-Time</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Hall of Legends &amp; Top Stars
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Celebrate the highest-ranking board game champions and most gifted voice personalities across the Gulf and worldwide arenas.
          </p>
        </div>

        {/* Modal Close CTA if rendered as modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors self-start md:self-center"
            title="Close Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toolbar (Segmented Controls) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3 shadow-lg">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setMetric('charm')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              metric === 'charm'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Total Charm</span>
          </button>

          <button
            onClick={() => setMetric('wins')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              metric === 'wins'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Match Wins</span>
          </button>

          <button
            onClick={() => setMetric('coins')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              metric === 'coins'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Coin Earnings</span>
          </button>
        </div>

        {/* Secondary Filters: Game & Search */}
        <div className="flex items-center gap-2">
          {/* Game filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setGameFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                gameFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setGameFilter('ludo')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                gameFilter === 'ludo'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎲 Ludo
            </button>
            <button
              onClick={() => setGameFilter('domino')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                gameFilter === 'domino'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🁓 Dominoes
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search star..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM STAGE */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-4 pb-2 px-1">
          {/* #2 Silver (Left) */}
          <div className="flex flex-col items-center bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-700/80 rounded-3xl p-3 sm:p-4 shadow-xl order-1">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-slate-300 shadow-lg overflow-hidden bg-slate-800">
                <img
                  src={top3[1].avatar}
                  alt={top3[1].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2.5 -right-1 bg-slate-300 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                <span>🥈 2nd</span>
              </div>
            </div>

            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-white truncate">
                <span>{top3[1].countryFlag}</span>
                <span className="truncate">{top3[1].name}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {top3[1].title}
              </div>

              {/* Primary Metric Score */}
              <div className="mt-2.5 py-1 px-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {metric === 'charm'
                    ? 'Charm Score'
                    : metric === 'wins'
                    ? 'Total Wins'
                    : 'Coins Won'}
                </div>
                <div className="text-xs sm:text-sm font-black font-mono tabular-nums text-slate-200">
                  {metric === 'charm'
                    ? `✨ ${top3[1].charmPoints.toLocaleString()}`
                    : metric === 'wins'
                    ? `🏆 ${top3[1].totalWins.toLocaleString()}`
                    : `🪙 ${top3[1].coinsWon.toLocaleString()}`}
                </div>
              </div>

              {onSendGiftToPlayer && (
                <button
                  onClick={() =>
                    onSendGiftToPlayer({
                      id: top3[1].id,
                      name: top3[1].name,
                      avatar: top3[1].avatar,
                      vipLevel: top3[1].vipLevel,
                      level: top3[1].level,
                      seatIndex: -1,
                      micActive: false,
                      isSpeaking: false,
                      micLevel: 0,
                      coins: top3[1].coinsWon,
                      diamonds: 1000,
                      charmPoints: top3[1].charmPoints
                    })
                  }
                  className="mt-2.5 w-full py-1.5 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <Gift className="w-3 h-3 text-amber-400" />
                  <span>Send Gift</span>
                </button>
              )}
            </div>
          </div>

          {/* #1 Gold Champion (Center - Elevated) */}
          <div className="flex flex-col items-center bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-2xl order-2 -translate-y-2 ring-4 ring-amber-500/20">
            <div className="relative mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden bg-slate-800 ring-2 ring-amber-300">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>1st Champion</span>
              </div>
            </div>

            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-1 text-sm sm:text-base font-black text-white truncate">
                <span>{top3[0].countryFlag}</span>
                <span className="truncate">{top3[0].name}</span>
              </div>
              <div className="text-[10px] text-amber-400 font-semibold truncate mt-0.5">
                👑 {top3[0].title}
              </div>

              {/* Primary Metric Score */}
              <div className="mt-2.5 py-1.5 px-2 rounded-xl bg-slate-950 border border-amber-500/40">
                <div className="text-[10px] text-amber-300 font-medium">
                  {metric === 'charm'
                    ? 'Total Charm Royalty'
                    : metric === 'wins'
                    ? 'Supreme Match Wins'
                    : 'Tournament Wealth'}
                </div>
                <div className="text-sm sm:text-base font-black font-mono tabular-nums text-amber-400">
                  {metric === 'charm'
                    ? `✨ ${top3[0].charmPoints.toLocaleString()}`
                    : metric === 'wins'
                    ? `🏆 ${top3[0].totalWins.toLocaleString()} (${top3[0].winRate}% WR)`
                    : `🪙 ${top3[0].coinsWon.toLocaleString()}`}
                </div>
              </div>

              {onSendGiftToPlayer && (
                <button
                  onClick={() =>
                    onSendGiftToPlayer({
                      id: top3[0].id,
                      name: top3[0].name,
                      avatar: top3[0].avatar,
                      vipLevel: top3[0].vipLevel,
                      level: top3[0].level,
                      seatIndex: -1,
                      micActive: false,
                      isSpeaking: false,
                      micLevel: 0,
                      coins: top3[0].coinsWon,
                      diamonds: 1000,
                      charmPoints: top3[0].charmPoints
                    })
                  }
                  className="mt-2.5 w-full py-1.5 text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Gift className="w-3.5 h-3.5 text-slate-950" />
                  <span>Send Gift</span>
                </button>
              )}
            </div>
          </div>

          {/* #3 Bronze (Right) */}
          <div className="flex flex-col items-center bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-800/60 rounded-3xl p-3 sm:p-4 shadow-xl order-3">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-amber-700 shadow-lg overflow-hidden bg-slate-800">
                <img
                  src={top3[2].avatar}
                  alt={top3[2].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2.5 -right-1 bg-amber-700 text-amber-100 font-black text-[11px] px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                <span>🥉 3rd</span>
              </div>
            </div>

            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-white truncate">
                <span>{top3[2].countryFlag}</span>
                <span className="truncate">{top3[2].name}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {top3[2].title}
              </div>

              {/* Primary Metric Score */}
              <div className="mt-2.5 py-1 px-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {metric === 'charm'
                    ? 'Charm Score'
                    : metric === 'wins'
                    ? 'Total Wins'
                    : 'Coins Won'}
                </div>
                <div className="text-xs sm:text-sm font-black font-mono tabular-nums text-amber-300">
                  {metric === 'charm'
                    ? `✨ ${top3[2].charmPoints.toLocaleString()}`
                    : metric === 'wins'
                    ? `🏆 ${top3[2].totalWins.toLocaleString()}`
                    : `🪙 ${top3[2].coinsWon.toLocaleString()}`}
                </div>
              </div>

              {onSendGiftToPlayer && (
                <button
                  onClick={() =>
                    onSendGiftToPlayer({
                      id: top3[2].id,
                      name: top3[2].name,
                      avatar: top3[2].avatar,
                      vipLevel: top3[2].vipLevel,
                      level: top3[2].level,
                      seatIndex: -1,
                      micActive: false,
                      isSpeaking: false,
                      micLevel: 0,
                      coins: top3[2].coinsWon,
                      diamonds: 1000,
                      charmPoints: top3[2].charmPoints
                    })
                  }
                  className="mt-2.5 w-full py-1.5 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <Gift className="w-3 h-3 text-amber-400" />
                  <span>Send Gift</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RANKING LIST (Ranks 4+) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800/80 p-3 sm:p-5 shadow-xl flex flex-col gap-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 px-2 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Player</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Stats Breakdown</span>
            <span className="text-right">
              {metric === 'charm'
                ? 'Total Charm'
                : metric === 'wins'
                ? 'Wins (Win Rate)'
                : 'Coins Won'}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/50">
          {remainingPlayers.map((player) => {
            const isMe = player.isUser;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all ${
                  isMe
                    ? 'bg-amber-500/10 border border-amber-500/40 ring-1 ring-amber-500/30'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                {/* Left: Rank & Player identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 text-center font-mono font-bold text-xs sm:text-sm tabular-nums text-slate-400">
                    #{player.rank < 10 ? `0${player.rank}` : player.rank}
                  </span>

                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {player.name}
                      </span>
                      <span className="text-xs" title={player.country}>
                        {player.countryFlag}
                      </span>
                      {player.vipLevel > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                          VIP {player.vipLevel}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5">
                      <span>{player.title}</span>
                      <span aria-hidden="true">·</span>
                      <span>Level {player.level}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Actions */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  {/* Secondary breakdown */}
                  <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-400 font-mono">
                    {metric === 'charm' ? (
                      <>
                        <span>{player.totalWins} Match Wins</span>
                        <span className="text-slate-500">{player.winRate}% Win Rate</span>
                      </>
                    ) : (
                      <>
                        <span>✨ {player.charmPoints.toLocaleString()} Charm</span>
                        <span className="text-slate-500">{player.totalMatches} Matches</span>
                      </>
                    )}
                  </div>

                  {/* Primary Score readout */}
                  <div className="text-right">
                    <div className="font-mono font-black text-xs sm:text-sm tabular-nums text-amber-400">
                      {metric === 'charm'
                        ? `✨ ${player.charmPoints.toLocaleString()}`
                        : metric === 'wins'
                        ? `🏆 ${player.totalWins} (${player.winRate}%)`
                        : `🪙 ${player.coinsWon.toLocaleString()}`}
                    </div>
                  </div>

                  {/* Send gift CTA */}
                  {onSendGiftToPlayer && !isMe && (
                    <button
                      onClick={() =>
                        onSendGiftToPlayer({
                          id: player.id,
                          name: player.name,
                          avatar: player.avatar,
                          vipLevel: player.vipLevel,
                          level: player.level,
                          seatIndex: -1,
                          micActive: false,
                          isSpeaking: false,
                          micLevel: 0,
                          coins: player.coinsWon,
                          diamonds: 1000,
                          charmPoints: player.charmPoints
                        })
                      }
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-amber-300 border border-slate-700 text-xs transition-colors"
                      title="Send Gift"
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PINNED USER PERSONAL STANDING STRIP */}
      {userEntry && (
        <div className="sticky bottom-2 z-20 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-800 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Your Standing:</span>
                <span className="font-mono text-amber-400 font-black">
                  #{userEntry.rank} in {metric === 'charm' ? 'Charm' : 'Wins'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>✨ {currentUser.charmPoints.toLocaleString()} Charm</span>
                <span>·</span>
                <span>🏆 96 Wins (68% WR)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs text-amber-300/90 font-medium">
              +{metric === 'charm' ? '1,400 Charm' : '12 Wins'} to reach Top 10
            </span>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Climb Rank</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
};
