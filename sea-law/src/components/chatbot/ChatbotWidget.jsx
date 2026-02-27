import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import ChatMessage from './ChatMessage';
import SailorMascot from './SailorMascot';

/* Mini sailor head SVG for the chat header */
function SailorAvatar() {
  return (
    <svg width="44" height="44" viewBox="0 0 50 50" className="drop-shadow-md">
      {/* Head */}
      <circle cx="25" cy="28" r="16" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1" />
      {/* Cheeks */}
      <ellipse cx="16" cy="33" rx="3" ry="2" fill="#ffb3b3" opacity="0.4" />
      <ellipse cx="34" cy="33" rx="3" ry="2" fill="#ffb3b3" opacity="0.4" />
      {/* Eyes */}
      <ellipse cx="20" cy="27" rx="2.5" ry="3" fill="white" stroke="#1e3a5f" strokeWidth="0.8" />
      <ellipse cx="30" cy="27" rx="2.5" ry="3" fill="white" stroke="#1e3a5f" strokeWidth="0.8" />
      <ellipse cx="20.5" cy="27.5" rx="1.5" ry="2" fill="#1e3a5f" />
      <ellipse cx="30.5" cy="27.5" rx="1.5" ry="2" fill="#1e3a5f" />
      <circle cx="21.5" cy="26.5" r="0.8" fill="white" />
      <circle cx="31.5" cy="26.5" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M16 23 Q20 20 24 23" fill="none" stroke="#8B6914" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M26 23 Q30 20 34 23" fill="none" stroke="#8B6914" strokeWidth="1.2" strokeLinecap="round" />
      {/* Smile */}
      <path d="M19 34 Q25 40 31 34" fill="#c0392b" stroke="#a93226" strokeWidth="0.8" />
      <path d="M21 34 L29 34" fill="none" stroke="white" strokeWidth="1.2" />
      {/* Hat brim */}
      <ellipse cx="25" cy="15" rx="20" ry="5" fill="white" stroke="#1e3a5f" strokeWidth="1" />
      {/* Hat crown */}
      <rect x="10" y="4" width="30" height="12" rx="4" fill="white" stroke="#1e3a5f" strokeWidth="1" />
      {/* Hat band */}
      <rect x="10" y="12" width="30" height="4" fill="#1e3a5f" />
      {/* Gold star */}
      <polygon points="25,5 26.5,9 31,9 27.5,11.5 28.5,15.5 25,13 21.5,15.5 22.5,11.5 19,9 23.5,9" fill="#fbbf24" stroke="#d97706" strokeWidth="0.3" />
      {/* Collar at bottom */}
      <path d="M12 42 L25 48 L38 42" fill="#1e3a5f" />
      <path d="M14 41 L25 46 L36 41" fill="none" stroke="white" strokeWidth="0.8" />
      {/* Red neckerchief */}
      <path d="M22 43 L25 48 L28 43" fill="#dc2626" />
    </svg>
  );
}

export default function ChatbotWidget() {
  const {
    isOpen, closeChat,
    selectedIsland, clearIslandContext,
    messages, sendMessage, askAboutIsland,
    isLoading, chatEndRef
  } = useChatbot();

  const [input, setInput] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatEndRef]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <>
      {/* Sailor Mascot (visible when chat is closed) */}
      <SailorMascot />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-white dark:bg-slate-800 w-[370px] sm:w-[420px] h-[600px] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header with sailor avatar */}
              <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 p-3 flex justify-between items-center text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md overflow-hidden border-2 border-white/30">
                    <SailorAvatar />
                  </div>
                  <div>
                    <p className="font-bold text-base leading-none mb-1">Hải quân hướng dẫn viên</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-blue-100 font-medium tracking-wide uppercase">Trực tuyến - Sẵn sàng trợ giúp</span>
                    </div>
                  </div>
                </div>
                <button onClick={closeChat} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Island context banner */}
              {selectedIsland && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 px-4 py-2.5 flex items-center justify-between border-b border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium truncate flex items-center gap-1.5">
                    <span className="text-base">🏝️</span>
                    Đang trò chuyện về: <strong>{selectedIsland.properties?.name}</strong>
                  </p>
                  <button
                    onClick={clearIslandContext}
                    className="text-[10px] text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 font-bold uppercase tracking-wider shrink-0 ml-2 bg-white/60 dark:bg-slate-800/60 px-2 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 shadow-inner">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} onAskAboutIsland={askAboutIsland} />
                ))}
                {isLoading && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <span className="text-xs">⚓</span>
                    </div>
                    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2">
                      <span className="text-xs text-slate-400 mr-1">Đang suy nghĩ</span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl border border-slate-200 dark:border-slate-600 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isLoading ? 'Đang xử lý...' : 'Nhập câu hỏi về biển đảo...'}
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-2.5 outline-none text-sm placeholder:text-slate-400 disabled:opacity-50 dark:text-white"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">Hải quân hướng dẫn viên - UNCLOS 1982 & Luật Biển 2012</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
