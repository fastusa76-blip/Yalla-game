import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Player } from '../../types/game';
import { Send, Smile, Zap } from 'lucide-react';

interface RoomChatStreamProps {
  messages: ChatMessage[];
  currentUser: Player;
  onSendMessage: (text: string) => void;
}

export const RoomChatStream: React.FC<RoomChatStreamProps> = ({
  messages,
  currentUser,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const quickPhrases = [
    'Roll a 6! 🎲',
    'Good luck all! ✨',
    'Nice move! 👏',
    'GG! 👑',
    'Yalla! 🔥',
    'Domino! 🁓'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 mb-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Room Live Chat
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {messages.length} messages
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs min-h-[160px] max-h-[240px] sm:max-h-[300px]">
        {messages.map((msg) => {
          if (msg.type === 'gift') {
            return (
              <div
                key={msg.id}
                className="p-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-[11px] text-amber-300 flex items-center gap-1.5"
              >
                <span className="text-base">{msg.giftIcon}</span>
                <span className="font-semibold text-white">{msg.senderName}</span>
                <span className="text-purple-300">sent {msg.giftName} to</span>
                <span className="font-semibold text-amber-300">{msg.targetName}</span>
              </div>
            );
          }

          if (msg.type === 'game') {
            return (
              <div
                key={msg.id}
                className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 font-mono"
              >
                {msg.text}
              </div>
            );
          }

          const isMe = msg.senderName === currentUser.name;

          return (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[11px] font-semibold truncate ${isMe ? 'text-amber-400' : 'text-slate-200'}`}>
                    {msg.senderName}
                  </span>
                  {msg.vipLevel > 0 && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                      V{msg.vipLevel}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500 ml-auto font-mono">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-slate-300 break-words leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Phrases */}
      <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/60 mt-2">
        {quickPhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(phrase)}
            className="px-2 py-1 text-[10px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap shrink-0 border border-slate-700/50 transition-colors"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send message to room..."
          className="flex-1 px-3 py-1.5 text-xs bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
