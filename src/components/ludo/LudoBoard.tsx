import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerColor, LudoPlayerState, LudoToken } from '../../types/game';
import {
  COLOR_CONFIG,
  GLOBAL_TRACK,
  HOME_STRETCHES,
  SAFE_TRACK_INDICES,
  MAX_STEPS,
  getTokenCoord,
  canTokenMove,
  getMovableTokens
} from '../../utils/ludoRules';
import { audioEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { Dices, RotateCcw, Trophy, Zap, Shield, Sparkles } from 'lucide-react';

interface LudoBoardProps {
  onMoveMade?: (text: string) => void;
  userColor?: PlayerColor;
  gameBet?: number;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  onMoveMade,
  userColor = 'yellow',
  gameBet = 5000
}) => {
  // Initial players setup
  const createInitialPlayers = (): LudoPlayerState[] => [
    {
      id: 'bot_red',
      name: 'Sheikh Tariq',
      color: 'red',
      tokens: [
        { id: 0, color: 'red', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 1, color: 'red', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 2, color: 'red', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 3, color: 'red', state: 'YARD', stepCount: 0, trackPosition: 0 }
      ],
      isBot: true,
      isUser: false,
      hasWon: false
    },
    {
      id: 'bot_blue',
      name: 'Karim Pro',
      color: 'blue',
      tokens: [
        { id: 0, color: 'blue', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 1, color: 'blue', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 2, color: 'blue', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 3, color: 'blue', state: 'YARD', stepCount: 0, trackPosition: 0 }
      ],
      isBot: true,
      isUser: false,
      hasWon: false
    },
    {
      id: 'user_player',
      name: 'You (Majid)',
      color: userColor,
      tokens: [
        { id: 0, color: userColor, state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 1, color: userColor, state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 2, color: userColor, state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 3, color: userColor, state: 'YARD', stepCount: 0, trackPosition: 0 }
      ],
      isBot: false,
      isUser: true,
      hasWon: false
    },
    {
      id: 'bot_green',
      name: 'Yasmin Star',
      color: 'green',
      tokens: [
        { id: 0, color: 'green', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 1, color: 'green', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 2, color: 'green', state: 'YARD', stepCount: 0, trackPosition: 0 },
        { id: 3, color: 'green', state: 'YARD', stepCount: 0, trackPosition: 0 }
      ],
      isBot: true,
      isUser: false,
      hasWon: false
    }
  ];

  const [players, setPlayers] = useState<LudoPlayerState[]>(createInitialPlayers);
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(2); // Start with user
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [movableTokenIds, setMovableTokenIds] = useState<number[]>([]);
  const [winner, setWinner] = useState<LudoPlayerState | null>(null);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [quickMode, setQuickMode] = useState<boolean>(false); // Quick mode requires only 2 tokens home to win!
  const [statusText, setStatusText] = useState<string>('Your Turn! Roll the dice to begin.');
  const [lastCaptureNote, setLastCaptureNote] = useState<string | null>(null);

  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const botActionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPlayer = players[currentTurnIdx];

  // Pass turn to next active player
  const nextTurn = useCallback(() => {
    setHasRolled(false);
    setMovableTokenIds([]);
    setConsecutiveSixes(0);
    setCurrentTurnIdx((prev) => (prev + 1) % 4);
  }, []);

  // Handle Token Move execution
  const executeMoveToken = useCallback((tokenId: number) => {
    if (!hasRolled) return;

    const player = players[currentTurnIdx];
    const token = player.tokens.find((t) => t.id === tokenId);
    if (!token || !canTokenMove(token, diceValue)) return;

    audioEngine.playPawnStep();

    let newStep = token.stepCount;
    let newState = token.state;

    if (token.state === 'YARD') {
      newState = 'TRACK';
      newStep = 0;
    } else {
      newStep = token.stepCount + diceValue;
      if (newStep === MAX_STEPS) {
        newState = 'HOME';
      } else if (newStep > 50) {
        newState = 'HOME_STRETCH';
      }
    }

    const updatedToken: LudoToken = {
      ...token,
      state: newState,
      stepCount: newStep,
      trackPosition: (COLOR_CONFIG[player.color].startIndex + newStep) % 52
    };

    // Check Capture on global track
    let capturedOpponentNote: string | null = null;
    let gotExtraTurn = diceValue === 6 || newState === 'HOME';

    const updatedPlayers = players.map((p, pIdx) => {
      if (pIdx === currentTurnIdx) {
        const nextTokens = p.tokens.map((t) => (t.id === tokenId ? updatedToken : t));
        // Check win condition
        const tokensHome = nextTokens.filter((t) => t.state === 'HOME').length;
        const targetTokensToWin = quickMode ? 2 : 4;
        const won = tokensHome >= targetTokensToWin;
        if (won && !winner) {
          setWinner(p);
          audioEngine.playVictoryFanfare();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        return { ...p, tokens: nextTokens, hasWon: won };
      }

      // Check if any opponent token is captured
      if (newState === 'TRACK' && !SAFE_TRACK_INDICES.has(updatedToken.trackPosition)) {
        let captured = false;
        const nextTokens = p.tokens.map((oppToken) => {
          if (
            oppToken.state === 'TRACK' &&
            oppToken.trackPosition === updatedToken.trackPosition
          ) {
            captured = true;
            capturedOpponentNote = `💥 ${player.name} knocked ${p.name}'s pawn back to home yard!`;
            audioEngine.playPawnCapture();
            gotExtraTurn = true; // Extra roll on capture!
            return {
              ...oppToken,
              state: 'YARD' as const,
              stepCount: 0,
              trackPosition: 0
            };
          }
          return oppToken;
        });
        if (captured) {
          return { ...p, tokens: nextTokens };
        }
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setMovableTokenIds([]);
    setHasRolled(false);

    if (capturedOpponentNote) {
      setLastCaptureNote(capturedOpponentNote);
      onMoveMade?.(capturedOpponentNote);
    } else {
      const moveMsg = `${player.name} moved a ${player.color} pawn by ${diceValue} steps`;
      onMoveMade?.(moveMsg);
    }

    if (gotExtraTurn && !winner) {
      setStatusText(`${player.name} earned an EXTRA ROLL! 🎲`);
      // If bot, trigger extra roll
      if (player.isBot) {
        botActionTimerRef.current = setTimeout(() => {
          rollDice();
        }, 800);
      }
    } else {
      nextTurn();
    }
  }, [hasRolled, players, currentTurnIdx, diceValue, quickMode, winner, nextTurn, onMoveMade]);

  // Dice Roll logic
  const rollDice = useCallback(() => {
    if (isRolling || hasRolled || winner) return;

    setIsRolling(true);
    audioEngine.playDiceRoll();

    setTimeout(() => {
      // Generate fair dice roll (1 to 6)
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      setIsRolling(false);
      setHasRolled(true);

      const player = players[currentTurnIdx];
      const validTokenIds = getMovableTokens(player.tokens, roll);
      setMovableTokenIds(validTokenIds);

      // Check triple-6 limit
      if (roll === 6) {
        const nextSixes = consecutiveSixes + 1;
        setConsecutiveSixes(nextSixes);
        if (nextSixes >= 3) {
          setStatusText(`Three 6s in a row! Turn forfeited for ${player.name}.`);
          setTimeout(nextTurn, 1000);
          return;
        }
      } else {
        setConsecutiveSixes(0);
      }

      if (validTokenIds.length === 0) {
        setStatusText(`${player.name} rolled a ${roll}. No moves possible! Passing turn...`);
        turnTimerRef.current = setTimeout(() => {
          nextTurn();
        }, 1100);
      } else if (validTokenIds.length === 1 && player.isBot) {
        // Auto execute for bot
        setStatusText(`${player.name} rolled a ${roll} and moves!`);
        botActionTimerRef.current = setTimeout(() => {
          executeMoveToken(validTokenIds[0]);
        }, 700);
      } else if (player.isBot) {
        // Smart bot heuristic:
        // 1. Move to capture opponent
        // 2. Move token into safe star
        // 3. Move token from yard (if roll is 6)
        // 4. Move furthest token
        let chosenId = validTokenIds[0];
        const yardToken = validTokenIds.find(
          (id) => player.tokens.find((t) => t.id === id)?.state === 'YARD'
        );
        if (roll === 6 && yardToken !== undefined) {
          chosenId = yardToken;
        } else {
          // Find token with max stepCount
          let maxSteps = -1;
          for (const id of validTokenIds) {
            const t = player.tokens.find((tok) => tok.id === id);
            if (t && t.stepCount > maxSteps) {
              maxSteps = t.stepCount;
              chosenId = id;
            }
          }
        }
        setStatusText(`${player.name} rolled a ${roll}! Moving...`);
        botActionTimerRef.current = setTimeout(() => {
          executeMoveToken(chosenId);
        }, 800);
      } else {
        // User turn
        setStatusText(`You rolled a ${roll}! Click a flashing pawn to move.`);
        // If only 1 move possible for user, can also auto-suggest or let user click
      }
    }, 450);
  }, [isRolling, hasRolled, winner, players, currentTurnIdx, consecutiveSixes, nextTurn, executeMoveToken]);

  // Bot Turn Automated Driver
  useEffect(() => {
    if (winner) return;
    const player = players[currentTurnIdx];
    if (player.isBot && !hasRolled && !isRolling) {
      setStatusText(`${player.name}'s turn... rolling dice`);
      botActionTimerRef.current = setTimeout(() => {
        rollDice();
      }, 900);
    } else if (!player.isBot && !hasRolled && !isRolling) {
      setStatusText('Your Turn! Click "Roll Dice" or spacebar.');
    }
    return () => {
      if (botActionTimerRef.current) clearTimeout(botActionTimerRef.current);
      if (turnTimerRef.current) clearTimeout(turnTimerRef.current);
    };
  }, [currentTurnIdx, hasRolled, isRolling, winner, players, rollDice]);

  // Reset Game
  const resetGame = () => {
    setPlayers(createInitialPlayers());
    setCurrentTurnIdx(2);
    setDiceValue(6);
    setIsRolling(false);
    setHasRolled(false);
    setMovableTokenIds([]);
    setWinner(null);
    setLastCaptureNote(null);
    setStatusText('New Match Started! You play as Yellow.');
  };

  // Render individual 15x15 board cell
  const renderCell = (r: number, c: number) => {
    // 1. Check if Yard quadrant
    // Top-left: Green Yard (r: 0..5, c: 0..5)
    if (r <= 5 && c <= 5) return null;
    // Top-right: Red Yard (r: 0..5, c: 9..14)
    if (r <= 5 && c >= 9) return null;
    // Bottom-left: Yellow Yard (r: 9..14, c: 0..5)
    if (r >= 9 && c <= 5) return null;
    // Bottom-right: Blue Yard (r: 9..14, c: 9..14)
    if (r >= 9 && c >= 9) return null;

    // 2. Check Center Home Triangle (r: 6..8, c: 6..8)
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      // Center Home zone rendered separately in overlay
      return null;
    }

    // 3. Find track cell or home stretch
    const globalIdx = GLOBAL_TRACK.findIndex((coord) => coord.r === r && coord.c === c);
    const isSafeStar = globalIdx !== -1 && SAFE_TRACK_INDICES.has(globalIdx);

    // Color starting cell tints
    let cellBg = 'bg-slate-800/90 border-slate-700/60';
    if (globalIdx === 0) cellBg = 'bg-red-500/25 border-red-500/50';
    else if (globalIdx === 13) cellBg = 'bg-blue-500/25 border-blue-500/50';
    else if (globalIdx === 26) cellBg = 'bg-yellow-500/25 border-yellow-500/50';
    else if (globalIdx === 39) cellBg = 'bg-emerald-500/25 border-emerald-500/50';

    // Home stretches
    if (c === 7 && r >= 1 && r <= 5) cellBg = 'bg-red-500/40 border-red-400/60';
    if (r === 7 && c >= 9 && c <= 13) cellBg = 'bg-blue-500/40 border-blue-400/60';
    if (c === 7 && r >= 9 && r <= 13) cellBg = 'bg-yellow-500/40 border-yellow-400/60';
    if (r === 7 && c >= 1 && c <= 5) cellBg = 'bg-emerald-500/40 border-emerald-400/60';

    return (
      <div
        key={`cell_${r}_${c}`}
        style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
        className={`relative flex items-center justify-center border ${cellBg} rounded-xs`}
      >
        {isSafeStar && (
          <span className="text-[10px] text-amber-300 drop-shadow-sm select-none">
            ★
          </span>
        )}
      </div>
    );
  };

  // Collect all tokens currently on board to position them
  const allTokens = players.flatMap((p) => p.tokens);

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-4 lg:gap-6 w-full max-w-5xl mx-auto">
      {/* LEFT / CENTER: The Ludo Board Canvas */}
      <div className="relative w-full max-w-[430px] sm:max-w-[480px] aspect-square p-2.5 sm:p-3.5 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/70 rounded-3xl border-2 border-amber-500/40 shadow-2xl purple-gradient-glow">
        {/* Outer 15x15 Grid Container */}
        <div className="relative w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-slate-950/90 rounded-2xl p-1 overflow-hidden">
          {/* Background cells */}
          {Array.from({ length: 15 }).map((_, r) =>
            Array.from({ length: 15 }).map((_, c) => renderCell(r, c))
          )}

          {/* 4 CORNER YARDS */}
          {/* Green Yard (Top-Left) */}
          <div
            style={{ gridRow: '1 / span 6', gridColumn: '1 / span 6' }}
            className="relative bg-emerald-950/60 border-2 border-emerald-500/60 rounded-xl m-0.5 p-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 px-1">
              <span>GREEN YARD</span>
              <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200">
                Yasmin
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/60 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-emerald-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-emerald-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-emerald-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-emerald-500/50 mx-auto" />
            </div>
          </div>

          {/* Red Yard (Top-Right) */}
          <div
            style={{ gridRow: '1 / span 6', gridColumn: '10 / span 6' }}
            className="relative bg-rose-950/60 border-2 border-rose-500/60 rounded-xl m-0.5 p-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-300 px-1">
              <span>RED YARD</span>
              <span className="text-[9px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-200">
                Sheikh Tariq
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/60 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-rose-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-rose-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-rose-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-rose-500/50 mx-auto" />
            </div>
          </div>

          {/* Yellow Yard (Bottom-Left - User) */}
          <div
            style={{ gridRow: '10 / span 6', gridColumn: '1 / span 6' }}
            className="relative bg-amber-950/60 border-2 border-amber-500/70 rounded-xl m-0.5 p-2 flex flex-col justify-between ring-2 ring-amber-500/30"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 px-1">
              <span>YELLOW (YOU)</span>
              <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-bold">
                Majid
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/60 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-amber-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-amber-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-amber-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-amber-500/50 mx-auto" />
            </div>
          </div>

          {/* Blue Yard (Bottom-Right) */}
          <div
            style={{ gridRow: '10 / span 6', gridColumn: '10 / span 6' }}
            className="relative bg-blue-950/60 border-2 border-blue-500/60 rounded-xl m-0.5 p-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-300 px-1">
              <span>BLUE YARD</span>
              <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-200">
                Karim
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/60 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-blue-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-blue-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-blue-500/50 mx-auto" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-blue-500/50 mx-auto" />
            </div>
          </div>

          {/* CENTER HOME TRIANGLES */}
          <div
            style={{ gridRow: '7 / span 3', gridColumn: '7 / span 3' }}
            className="relative bg-slate-900 border-2 border-amber-400/80 rounded-lg m-0.5 overflow-hidden flex items-center justify-center shadow-inner"
          >
            {/* 4 Colored Home Quadrant triangles via SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
              <polygon points="0,0 100,0 50,50" fill="#ef4444" opacity="0.8" />
              <polygon points="100,0 100,100 50,50" fill="#3b82f6" opacity="0.8" />
              <polygon points="100,100 0,100 50,50" fill="#eab308" opacity="0.8" />
              <polygon points="0,100 0,0 50,50" fill="#10b981" opacity="0.8" />
              <circle cx="50" cy="50" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
            </svg>
            <div className="relative z-10 text-amber-400">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow" />
            </div>
          </div>

          {/* INTERACTIVE TOKENS LAYER */}
          {allTokens.map((token) => {
            const coord = getTokenCoord(token);
            const isCurrentPlayerToken = token.color === currentPlayer.color;
            const isMovable =
              isCurrentPlayerToken &&
              hasRolled &&
              movableTokenIds.includes(token.id) &&
              !winner;
            const isUserToken = token.color === userColor;

            const colorBg =
              token.color === 'red'
                ? 'bg-rose-500 border-rose-300 ring-rose-400'
                : token.color === 'blue'
                ? 'bg-blue-500 border-blue-300 ring-blue-400'
                : token.color === 'yellow'
                ? 'bg-amber-400 border-amber-200 ring-amber-300 text-slate-950'
                : 'bg-emerald-500 border-emerald-300 ring-emerald-400';

            return (
              <div
                key={`token_${token.color}_${token.id}`}
                style={{
                  gridRowStart: coord.r + 1,
                  gridColumnStart: coord.c + 1
                }}
                onClick={() => {
                  if (isMovable && (!currentPlayer.isBot || isUserToken)) {
                    executeMoveToken(token.id);
                  }
                }}
                className={`relative z-20 flex items-center justify-center p-0.5 transition-all duration-300 ${
                  isMovable ? 'cursor-pointer hover:scale-125' : ''
                }`}
              >
                <div
                  className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-[10px] select-none ${colorBg} ${
                    isMovable ? 'animate-bounce ring-4 ring-white' : ''
                  }`}
                >
                  {token.state === 'HOME' ? (
                    '★'
                  ) : (
                    token.id + 1
                  )}
                  {/* Token shine highlight */}
                  <span className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Winner Banner Overlay */}
        {winner && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-90 duration-200">
            <Trophy className="w-14 h-14 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-white font-display">
              {winner.isUser ? '🎉 VICTORY! YOU WON!' : `👑 ${winner.name} Wins!`}
            </h2>
            <p className="text-xs text-amber-300 font-mono mt-1 mb-4">
              Reward Pool: +{(gameBet * 3.8).toLocaleString()} Gold Coins!
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Play Next Match
            </button>
          </div>
        )}
      </div>

      {/* RIGHT / CONTROLS & GAME PANEL */}
      <div className="w-full xl:w-72 flex flex-col gap-3">
        {/* Status Callout */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLOR_CONFIG[currentPlayer.color].primary }}
              />
              <span>{currentPlayer.name}</span>
            </div>
            <span className="font-mono text-[11px] text-amber-400">
              Turn {currentTurnIdx + 1}/4
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 min-h-[36px]">
            {statusText}
          </p>

          {lastCaptureNote && (
            <div className="mt-2 p-2 bg-rose-500/15 border border-rose-500/30 rounded-lg text-[11px] text-rose-300">
              {lastCaptureNote}
            </div>
          )}

          {/* 3D Dice Display Box */}
          <div className="mt-4 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl transition-transform ${
                isRolling
                  ? 'animate-dice-roll bg-gradient-to-tr from-purple-600 to-amber-500 text-white'
                  : 'bg-white text-slate-900 border-2 border-amber-400'
              }`}
            >
              {isRolling ? <Dices className="w-8 h-8 animate-spin" /> : diceValue}
            </div>

            {/* Roll Dice Button */}
            <div className="mt-3 w-full">
              {!currentPlayer.isBot && !hasRolled ? (
                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-xs"
                >
                  <Dices className="w-4 h-4" />
                  <span>Roll Dice</span>
                </button>
              ) : (
                <div className="text-center py-2 text-[11px] text-slate-500 font-mono">
                  {currentPlayer.isBot
                    ? isRolling
                      ? 'Rolling...'
                      : 'Bot thinking...'
                    : 'Select a highlighted pawn'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Mode and Quick Match Toggles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Match Mode:</span>
            <button
              onClick={() => setQuickMode(!quickMode)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-amber-300 hover:bg-slate-700 transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{quickMode ? 'Quick (2 Pawns)' : 'Classic (4 Pawns)'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <span className="text-slate-400">Stakes:</span>
            <span className="font-mono text-amber-400 font-bold">
              🪙 {gameBet.toLocaleString()} Coins
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex gap-2">
            <button
              onClick={resetGame}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Match</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
