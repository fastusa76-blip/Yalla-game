import React, { useState, useEffect, useCallback } from 'react';
import { DominoPlacedTile, DominoPlayerState, DominoTile } from '../../types/game';
import {
  createDominoSet,
  canPlayTile,
  getLegalMoves,
  orientTile,
  calculateHandPips
} from '../../utils/dominoRules';
import { audioEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface DominoBoardProps {
  onMoveMade?: (text: string) => void;
  gameBet?: number;
}

export const DominoBoard: React.FC<DominoBoardProps> = ({
  onMoveMade,
  gameBet = 2000
}) => {
  // Initialize Domino Match
  const initGame = () => {
    const fullDeck = createDominoSet();
    const userHand = fullDeck.slice(0, 7);
    const botHand = fullDeck.slice(7, 14);
    const boneyard = fullDeck.slice(14);

    // Find highest double to open
    let highestDouble = -1;
    let starterIdx = 0; // 0 = user, 1 = bot
    let openTile: DominoTile | null = null;

    [...userHand, ...botHand].forEach((t) => {
      if (t.isDouble && t.left > highestDouble) {
        highestDouble = t.left;
        openTile = t;
      }
    });

    if (openTile) {
      // Remove opening tile from the hand
      const inUser = userHand.some((t) => t.id === (openTile as DominoTile).id);
      starterIdx = inUser ? 0 : 1;
    } else {
      openTile = userHand[0];
    }

    const firstPlaced: DominoPlacedTile = {
      ...openTile,
      placedEnd: 'left',
      rotation: 0
    };

    const cleanUserHand = userHand.filter((t) => t.id !== openTile?.id);
    const cleanBotHand = botHand.filter((t) => t.id !== openTile?.id);

    return {
      players: [
        { id: 'user_player', name: 'You (Majid)', hand: cleanUserHand, score: 0, isBot: false, isUser: true },
        { id: 'bot_host', name: 'Sheikh Tariq', hand: cleanBotHand, score: 0, isBot: true, isUser: false }
      ],
      currentTurnIdx: (starterIdx + 1) % 2,
      chain: [firstPlaced],
      leftOpenValue: firstPlaced.left,
      rightOpenValue: firstPlaced.right,
      boneyard,
      winner: null as DominoPlayerState | null,
      statusText: `${starterIdx === 0 ? 'You' : 'Sheikh Tariq'} placed opening tile [${firstPlaced.left}|${firstPlaced.right}]!`
    };
  };

  const [gameState, setGameState] = useState(initGame);
  const [selectedTile, setSelectedTile] = useState<DominoTile | null>(null);

  const currentPlayer = gameState.players[gameState.currentTurnIdx];
  const userPlayer = gameState.players[0];
  const botPlayer = gameState.players[1];

  // Draw tile from boneyard
  const drawFromBoneyard = () => {
    if (gameState.boneyard.length === 0 || gameState.winner) return;

    audioEngine.playDominoSnap();
    const drawnTile = gameState.boneyard[0];
    const newBoneyard = gameState.boneyard.slice(1);

    const updatedPlayers = gameState.players.map((p, idx) => {
      if (idx === gameState.currentTurnIdx) {
        return { ...p, hand: [...p.hand, drawnTile] };
      }
      return p;
    });

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      boneyard: newBoneyard,
      statusText: `${currentPlayer.name} drew a tile from boneyard.`
    }));
  };

  // Play a tile to chain
  const playTile = useCallback((tile: DominoTile, targetEnd: 'left' | 'right') => {
    audioEngine.playDominoSnap();

    const openVal = targetEnd === 'left' ? gameState.leftOpenValue : gameState.rightOpenValue;
    const placed = orientTile(tile, targetEnd, openVal);

    let newLeft = gameState.leftOpenValue;
    let newRight = gameState.rightOpenValue;

    if (targetEnd === 'left') {
      newLeft = placed.left;
    } else {
      newRight = placed.right;
    }

    const updatedChain =
      targetEnd === 'left' ? [placed, ...gameState.chain] : [...gameState.chain, placed];

    const updatedPlayers = gameState.players.map((p, idx) => {
      if (idx === gameState.currentTurnIdx) {
        const nextHand = p.hand.filter((t) => t.id !== tile.id);
        return { ...p, hand: nextHand };
      }
      return p;
    });

    const activePlayer = updatedPlayers[gameState.currentTurnIdx];

    // Check Win
    let roundWinner: DominoPlayerState | null = null;
    if (activePlayer.hand.length === 0) {
      roundWinner = activePlayer;
      audioEngine.playVictoryFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    const moveMsg = `${activePlayer.name} placed [${tile.left}|${tile.right}] on ${targetEnd} end!`;
    onMoveMade?.(moveMsg);

    setSelectedTile(null);
    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      chain: updatedChain,
      leftOpenValue: newLeft,
      rightOpenValue: newRight,
      currentTurnIdx: (prev.currentTurnIdx + 1) % 2,
      winner: roundWinner,
      statusText: roundWinner
        ? `🏆 DOMINO! ${roundWinner.name} wins the match!`
        : `${activePlayer.name} placed [${tile.left}|${tile.right}]. Next turn!`
    }));
  }, [gameState, onMoveMade]);

  // Bot Turn Handler
  useEffect(() => {
    if (gameState.winner) return;

    if (currentPlayer.isBot) {
      const timer = setTimeout(() => {
        const legal = getLegalMoves(
          currentPlayer.hand,
          gameState.leftOpenValue,
          gameState.rightOpenValue
        );

        if (legal.length > 0) {
          const tileToPlay = legal[0];
          const { canPlayLeft } = canPlayTile(
            tileToPlay,
            gameState.leftOpenValue,
            gameState.rightOpenValue
          );
          playTile(tileToPlay, canPlayLeft ? 'left' : 'right');
        } else if (gameState.boneyard.length > 0) {
          drawFromBoneyard();
        } else {
          // Pass
          setGameState((prev) => ({
            ...prev,
            currentTurnIdx: (prev.currentTurnIdx + 1) % 2,
            statusText: `${currentPlayer.name} has no valid moves and passes!`
          }));
        }
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, playTile]);

  // Render individual domino tile with realistic ivory look and dots
  const renderDominoFace = (left: number, right: number, isVertical = false) => {
    return (
      <div
        className={`bg-amber-50 text-slate-900 border border-amber-200/80 shadow-md rounded-md flex ${
          isVertical ? 'flex-col w-7 h-14' : 'flex-row h-7 w-14'
        } items-center justify-between p-1 divide-amber-300 ${
          isVertical ? 'divide-y' : 'divide-x'
        } relative select-none`}
      >
        {/* Left / Top Half */}
        <div className="flex-1 flex items-center justify-center font-bold text-xs font-mono text-slate-900">
          {left}
        </div>
        {/* Right / Bottom Half */}
        <div className="flex-1 flex items-center justify-center font-bold text-xs font-mono text-slate-900">
          {right}
        </div>
      </div>
    );
  };

  const restartMatch = () => {
    setGameState(initGame());
    setSelectedTile(null);
  };

  const userLegalMoves = getLegalMoves(
    userPlayer.hand,
    gameState.leftOpenValue,
    gameState.rightOpenValue
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto gap-4">
      {/* Felt Domino Table Arena */}
      <div className="relative w-full min-h-[380px] bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950/90 rounded-3xl border-4 border-amber-600/50 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* Top Opponent Bar */}
        <div className="flex items-center justify-between bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/50 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq"
                alt="Sheikh Tariq"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{botPlayer.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">VIP 5</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Tiles Remaining: {botPlayer.hand.length}
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-amber-300">
            Boneyard: {gameState.boneyard.length} tiles
          </div>
        </div>

        {/* Center Domino Chain Snake */}
        <div className="my-auto py-4 overflow-x-auto flex items-center justify-center gap-1.5 px-2">
          {gameState.chain.map((tile, idx) => (
            <div
              key={tile.id + idx}
              className="transform hover:scale-105 transition-transform"
            >
              {renderDominoFace(tile.left, tile.right, tile.isDouble)}
            </div>
          ))}
        </div>

        {/* Selected Tile Placement Chooser */}
        {selectedTile && (
          <div className="absolute inset-x-0 bottom-24 flex items-center justify-center gap-3 z-30 animate-in fade-in slide-in-from-bottom-2">
            {canPlayTile(selectedTile, gameState.leftOpenValue, gameState.rightOpenValue).canPlayLeft && (
              <button
                onClick={() => playTile(selectedTile, 'left')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Play on Left ({gameState.leftOpenValue})</span>
              </button>
            )}

            {canPlayTile(selectedTile, gameState.leftOpenValue, gameState.rightOpenValue).canPlayRight && (
              <button
                onClick={() => playTile(selectedTile, 'right')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <span>Play on Right ({gameState.rightOpenValue})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setSelectedTile(null)}
              className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Bottom User Hand Bar */}
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Your Hand</span>
              <span className="text-[10px] text-slate-400">
                ({userPlayer.hand.length} tiles · {calculateHandPips(userPlayer.hand)} pips)
              </span>
            </div>
            <div className="text-[11px] text-amber-300 font-medium">
              {gameState.statusText}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {userPlayer.hand.map((tile) => {
              const { canPlayLeft, canPlayRight } = canPlayTile(
                tile,
                gameState.leftOpenValue,
                gameState.rightOpenValue
              );
              const isPlayable = (canPlayLeft || canPlayRight) && currentPlayer.isUser && !gameState.winner;
              const isSelected = selectedTile?.id === tile.id;

              return (
                <div
                  key={tile.id}
                  onClick={() => {
                    if (isPlayable) {
                      if (canPlayLeft && !canPlayRight) {
                        playTile(tile, 'left');
                      } else if (!canPlayLeft && canPlayRight) {
                        playTile(tile, 'right');
                      } else {
                        setSelectedTile(tile);
                      }
                    }
                  }}
                  className={`transition-all duration-150 ${
                    isPlayable
                      ? 'cursor-pointer hover:-translate-y-1 ring-2 ring-amber-400'
                      : 'opacity-65'
                  } ${isSelected ? 'ring-4 ring-white -translate-y-2' : ''}`}
                >
                  {renderDominoFace(tile.left, tile.right, false)}
                </div>
              );
            })}

            {/* Draw from Boneyard Button if user has no legal moves */}
            {currentPlayer.isUser && userLegalMoves.length === 0 && !gameState.winner && (
              <button
                onClick={drawFromBoneyard}
                disabled={gameState.boneyard.length === 0}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 disabled:opacity-40"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Draw from Boneyard ({gameState.boneyard.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Winner Banner */}
        {gameState.winner && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <Trophy className="w-14 h-14 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-white font-display">
              {gameState.winner.isUser ? '🎉 DOMINO! YOU WON!' : `👑 ${gameState.winner.name} Wins!`}
            </h2>
            <p className="text-xs text-amber-300 font-mono mt-1 mb-4">
              Reward Pool: +{(gameBet * 2).toLocaleString()} Gold Coins!
            </p>
            <button
              onClick={restartMatch}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Control Strip */}
      <div className="w-full flex items-center justify-between px-2 text-xs">
        <button
          onClick={restartMatch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Match</span>
        </button>

        <span className="text-slate-400">
          Match Stake: <strong className="text-amber-400 font-mono">🪙 {gameBet.toLocaleString()} Coins</strong>
        </span>
      </div>
    </div>
  );
};
