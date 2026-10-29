/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveGiftAnimation,
  ChatMessage,
  GameType,
  GiftItem,
  Player,
  VoiceRoom
} from './types/game';
import { INITIAL_ROOMS, INITIAL_USER } from './data/mockData';
import { VoiceStage } from './components/voice/VoiceStage';
import { SoundboardModal } from './components/voice/SoundboardModal';
import { LudoBoard } from './components/ludo/LudoBoard';
import { DominoBoard } from './components/domino/DominoBoard';
import { LuckyWheelModal } from './components/wheel/LuckyWheelModal';
import { GiftShopModal } from './components/gifts/GiftShopModal';
import { GiftAnimationOverlay } from './components/gifts/GiftAnimationOverlay';
import { RoomChatStream } from './components/chat/RoomChatStream';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { RoomBrowser } from './components/rooms/RoomBrowser';
import { CreateRoomModal } from './components/rooms/CreateRoomModal';
import { GlobalLeaderboard } from './components/leaderboard/GlobalLeaderboard';
import { audioEngine } from './utils/audioEngine';
import {
  Radio,
  Dices,
  Sparkles,
  Trophy,
  ArrowLeft,
  Coins,
  Gem,
  Plus
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Player>(INITIAL_USER);
  const [rooms, setRooms] = useState<VoiceRoom[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(INITIAL_ROOMS[0]);
  const [activeTab, setActiveTab] = useState<'lobby' | 'room' | 'leaderboard'>('room');

  // Interactive Modals State
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState<boolean>(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState<boolean>(false);
  const [isGiftShopOpen, setIsGiftShopOpen] = useState<boolean>(false);
  const [giftTargetPlayer, setGiftTargetPlayer] = useState<Player | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false);

  // Active Gift Explosion
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<ActiveGiftAnimation | null>(null);

  // Live Microphone State for User
  const [isUserMicActive, setIsUserMicActive] = useState<boolean>(false);

  // Active Room Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      senderName: '👑 Sheikh Tariq',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq',
      vipLevel: 5,
      type: 'chat',
      text: 'Marhaban bikum! Welcome to the Gulf Ludo championship. May the best roller win!',
      timestamp: '21:05'
    },
    {
      id: 'msg_2',
      senderName: 'Yasmin Star',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin',
      vipLevel: 4,
      type: 'chat',
      text: 'Good luck everyone! Let us roll some sixes 🎲',
      timestamp: '21:07'
    }
  ]);

  // Periodic simulated voice activity & ambient chatter from bot room participants
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      // Pick random bot in room seats to speak or quiet down
      setActiveRoom((prevRoom) => {
        if (!prevRoom) return null;
        const updatedSeats = prevRoom.seats.map((player) => {
          if (!player || player.isUser) return player;
          // 40% chance to toggle speaking state
          const shouldSpeak = Math.random() > 0.6;
          return {
            ...player,
            isSpeaking: shouldSpeak,
            micLevel: shouldSpeak ? 0.4 + Math.random() * 0.5 : 0
          };
        });
        return { ...prevRoom, seats: updatedSeats };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [activeRoom?.id]);

  // Handle User Mic Toggle
  const handleToggleUserMic = async () => {
    if (isUserMicActive) {
      audioEngine.stopMicrophone();
      setIsUserMicActive(false);
    } else {
      const granted = await audioEngine.startMicrophone();
      if (granted) {
        setIsUserMicActive(true);
      } else {
        // Fallback simulation if browser blocks mic permission
        setIsUserMicActive(true);
      }
    }
  };

  // Seat Click Handler
  const handleSeatClick = (seatIndex: number, player: Player | null) => {
    if (player) {
      // Clicked on a player -> open direct gift shop
      setGiftTargetPlayer(player);
      setIsGiftShopOpen(true);
    } else {
      // Empty seat -> user sits here!
      if (!activeRoom) return;
      const updatedSeats = [...activeRoom.seats];
      // Remove user from any existing seat first
      updatedSeats.forEach((p, idx) => {
        if (p?.id === currentUser.id) updatedSeats[idx] = null;
      });
      updatedSeats[seatIndex] = {
        ...currentUser,
        seatIndex,
        micActive: isUserMicActive
      };

      setActiveRoom({
        ...activeRoom,
        seats: updatedSeats
      });

      addChatMessage({
        id: `sys_${Date.now()}`,
        senderName: 'System',
        senderAvatar: '',
        vipLevel: 0,
        type: 'system',
        text: `${currentUser.name} took Seat #${seatIndex + 1} on the voice stage!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  // Chat message helper
  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      vipLevel: currentUser.vipLevel,
      type: 'chat',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    addChatMessage(newMsg);
  };

  // Soundboard Trigger
  const handleSoundTriggered = (name: string, icon: string) => {
    addChatMessage({
      id: `sb_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      vipLevel: currentUser.vipLevel,
      type: 'chat',
      text: `${icon} played ${name} into the voice room!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Send Gift Execution
  const handleSendGift = (gift: GiftItem, target: Player) => {
    // Deduct diamonds, add charm
    setCurrentUser((prev) => ({
      ...prev,
      diamonds: prev.diamonds - gift.price
    }));

    // Trigger full screen animation
    setActiveGiftAnimation({
      id: `gift_anim_${Date.now()}`,
      gift,
      sender: currentUser,
      recipient: target,
      timestamp: Date.now()
    });

    // Post to chat
    addChatMessage({
      id: `gift_msg_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      vipLevel: currentUser.vipLevel,
      type: 'gift',
      text: '',
      giftIcon: gift.icon,
      giftName: gift.name,
      targetName: target.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Prize won from Lucky Wheel
  const handlePrizeWon = (prizeText: string, rewardCoins: number, rewardDiamonds: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      diamonds: prev.diamonds + rewardDiamonds
    }));

    addChatMessage({
      id: `prize_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      vipLevel: currentUser.vipLevel,
      type: 'game',
      text: `🎉 ${currentUser.name} won ${prizeText} on the Lucky Wheel!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Switch active game inside room
  const handleSwitchRoomGame = (game: GameType) => {
    if (!activeRoom) return;
    setActiveRoom({
      ...activeRoom,
      activeGame: game
    });
  };

  // Room creation callback
  const handleRoomCreated = (newRoom: VoiceRoom) => {
    setRooms([newRoom, ...rooms]);
    setActiveRoom(newRoom);
    setActiveTab('room');
  };

  // Quick Play jump
  const handleQuickPlay = (game: 'ludo' | 'domino' | 'wheel') => {
    const matchingRoom = rooms.find((r) => r.category === game) || rooms[0];
    setActiveRoom({
      ...matchingRoom,
      activeGame: game
    });
    setActiveTab('room');
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* =========================================================================
          TOP BAR CONTRACT (Mandatory 3-zone architecture: Brand - Links - Action)
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element, no taglines) */}
        <button
          onClick={() => setActiveTab('lobby')}
          className="text-xl sm:text-2xl font-black tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md">
            <Dices className="w-5 h-5" />
          </div>
          <span>Yalla Games</span>
        </button>

        {/* Zone 2: 4-5 Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('lobby')}
            className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'lobby' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Explore Rooms
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => {
              handleQuickPlay('ludo');
            }}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Ludo Arenas
          </button>
          <button
            onClick={() => {
              handleQuickPlay('domino');
            }}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Royal Dominoes
          </button>
          <button
            onClick={() => setIsLuckyWheelOpen(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Lucky Wheel</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (User Profile and Balances Strip) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* User Currency Badges */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{currentUser.coins.toLocaleString()}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-400">
              <Gem className="w-3.5 h-3.5" />
              <span>{currentUser.diamonds}</span>
            </div>
          </div>

          {/* User Avatar button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="relative w-9 h-9 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-800 hover:scale-105 transition-transform"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTENT AREA: ROOM VIEW or LOBBY BROWSER
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col">
        {activeTab === 'room' && activeRoom ? (
          <div className="flex flex-col gap-4">
            {/* Room Breadcrumb / Header Strip */}
            <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('lobby')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit Room</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                    {activeRoom.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[240px] sm:max-w-md">
                    {activeRoom.title}
                  </h2>
                </div>
              </div>

              {/* Game Mode Switcher inside the room */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleSwitchRoomGame('ludo')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    activeRoom.activeGame === 'ludo'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎲 Ludo
                </button>
                <button
                  onClick={() => handleSwitchRoomGame('domino')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    activeRoom.activeGame === 'domino'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🁓 Dominoes
                </button>
                <button
                  onClick={() => setIsLuckyWheelOpen(true)}
                  className="px-3 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  🎡 Wheel
                </button>
              </div>
            </div>

            {/* 1. Real-time 8-Seat Voice Stage */}
            <VoiceStage
              seats={activeRoom.seats}
              currentUser={currentUser}
              onSeatClick={handleSeatClick}
              onOpenSoundboard={() => setIsSoundboardOpen(true)}
              onToggleUserMic={handleToggleUserMic}
              isUserMicActive={isUserMicActive}
            />

            {/* 2. Main Arena Split: Active Game Playfield + Live Room Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Game Viewport (8 Columns on desktop) */}
              <div className="lg:col-span-8 flex flex-col items-center">
                {activeRoom.activeGame === 'ludo' ? (
                  <LudoBoard
                    userColor="yellow"
                    gameBet={activeRoom.gameBet}
                    onMoveMade={(note) => {
                      addChatMessage({
                        id: `ludo_${Date.now()}`,
                        senderName: 'Ludo Arena',
                        senderAvatar: '',
                        vipLevel: 0,
                        type: 'game',
                        text: note,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      });
                    }}
                  />
                ) : (
                  <DominoBoard
                    gameBet={activeRoom.gameBet}
                    onMoveMade={(note) => {
                      addChatMessage({
                        id: `dom_${Date.now()}`,
                        senderName: 'Domino Table',
                        senderAvatar: '',
                        vipLevel: 0,
                        type: 'game',
                        text: note,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      });
                    }}
                  />
                )}
              </div>

              {/* Side Live Room Chat Stream (4 Columns on desktop) */}
              <div className="lg:col-span-4 w-full">
                <RoomChatStream
                  messages={chatMessages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'leaderboard' ? (
          /* Global Leaderboard Dedicated View */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('lobby')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Lobby</span>
              </button>
            </div>
            <GlobalLeaderboard
              currentUser={currentUser}
              onSendGiftToPlayer={(player) => {
                setGiftTargetPlayer(player);
                setIsGiftShopOpen(true);
              }}
            />
          </div>
        ) : (
          /* Lobby / Room Browser View */
          <RoomBrowser
            rooms={rooms}
            onSelectRoom={(room) => {
              setActiveRoom(room);
              setActiveTab('room');
            }}
            onCreateRoomClick={() => setIsCreateRoomOpen(true)}
            onQuickPlay={handleQuickPlay}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* =========================================================================
          INTERACTIVE MODALS & FULL-SCREEN OVERLAYS
          ========================================================================= */}
      {/* Soundboard Modal */}
      <SoundboardModal
        isOpen={isSoundboardOpen}
        onClose={() => setIsSoundboardOpen(false)}
        onSoundTriggered={handleSoundTriggered}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        userCoins={currentUser.coins}
        userDiamonds={currentUser.diamonds}
        onPrizeWon={handlePrizeWon}
      />

      {/* Virtual Gift Shop Modal */}
      <GiftShopModal
        isOpen={isGiftShopOpen}
        onClose={() => setIsGiftShopOpen(false)}
        targetPlayer={giftTargetPlayer}
        currentUserDiamonds={currentUser.diamonds}
        onSendGift={handleSendGift}
      />

      {/* Full-Screen Animated Gift Explosion Overlay */}
      <GiftAnimationOverlay
        activeGift={activeGiftAnimation}
        onAnimationComplete={() => setActiveGiftAnimation(null)}
      />

      {/* User Profile & VIP Status Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onCollectDailyReward={(coins, diamonds) => {
          setCurrentUser((prev) => ({
            ...prev,
            coins: prev.coins + coins,
            diamonds: prev.diamonds + diamonds
          }));
        }}
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        currentUser={currentUser}
        onRoomCreated={handleRoomCreated}
      />

      {/* Global Leaderboard Modal Overlay */}
      {isLeaderboardOpen && (
        <GlobalLeaderboard
          isModal={true}
          currentUser={currentUser}
          onClose={() => setIsLeaderboardOpen(false)}
          onSendGiftToPlayer={(player) => {
            setIsLeaderboardOpen(false);
            setGiftTargetPlayer(player);
            setIsGiftShopOpen(true);
          }}
        />
      )}
    </div>
  );
}
