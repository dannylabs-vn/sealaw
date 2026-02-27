import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot } from '../../context/ChatbotContext';

const TIPS = [
  'Hỏi tôi về biển đảo Việt Nam!',
  'Bấm vào đảo trên bản đồ nhé!',
  'Tôi biết về Hoàng Sa, Trường Sa!',
  'Hỏi tôi về luật biển UNCLOS!',
  'Khám phá chủ quyền biển đảo!',
];

export default function SailorMascot() {
  const { isOpen, openChat, selectedIsland } = useChatbot();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [armAngle, setArmAngle] = useState(-30);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const mascotRef = useRef(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate arm angle toward mouse
  useEffect(() => {
    if (!mascotRef.current) return;
    const rect = mascotRef.current.getBoundingClientRect();
    const mascotX = rect.left + rect.width / 2;
    const mascotY = rect.top + 60;

    const dx = mousePos.x - mascotX;
    const dy = mousePos.y - mascotY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    angle = Math.max(-120, Math.min(60, angle));
    setArmAngle(angle);
  }, [mousePos]);

  // Random blinking
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through tips
  useEffect(() => {
    if (selectedIsland) return; // Don't cycle when island is selected
    const interval = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % TIPS.length);
        setShowBubble(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedIsland]);

  const handleClick = useCallback(() => {
    openChat();
  }, [openChat]);

  if (isOpen) return null;

  const speechText = selectedIsland
    ? `Bấm vào tôi để tìm hiểu về ${selectedIsland.properties?.name}!`
    : TIPS[tipIndex];

  return (
    <div className="fixed bottom-4 right-4 z-40" ref={mascotRef}>
      {/* Speech bubble - always visible */}
      <AnimatePresence mode="wait">
        {(showBubble || isHovered) && (
          <motion.div
            key={speechText}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-20 right-0 w-64"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-2xl border-2 border-blue-200 dark:border-blue-700 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
              {speechText}
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2.5 right-10 w-5 h-5 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-blue-200 dark:border-blue-700 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Island notification badge */}
      {selectedIsland && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -left-3 z-10"
        >
          <span className="flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-500 text-white text-xs font-bold items-center justify-center shadow-lg">!</span>
          </span>
        </motion.div>
      )}

      {/* Sailor character - BIG */}
      <motion.div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="cursor-pointer select-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg width="160" height="208" viewBox="0 0 100 130" className="drop-shadow-2xl">
          {/* === BODY === */}
          {/* Torso - white sailor uniform */}
          <rect x="28" y="58" width="44" height="45" rx="8" fill="white" stroke="#1e3a5f" strokeWidth="1.5" />
          {/* Navy collar */}
          <path d="M28 65 L50 80 L72 65 L72 58 L28 58 Z" fill="#1e3a5f" />
          {/* Collar detail - white stripes */}
          <path d="M32 63 L50 76 L68 63" fill="none" stroke="white" strokeWidth="1.5" />
          <path d="M34 61 L50 73 L66 61" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
          {/* Red neckerchief */}
          <path d="M44 65 L50 82 L56 65" fill="#dc2626" />
          <path d="M46 68 L50 77 L54 68" fill="#ef4444" />
          {/* Neckerchief flutter */}
          <path d="M48 78 Q52 84 50 88" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />

          {/* === LEFT ARM (waving) === */}
          <g
            style={{
              transformOrigin: '28px 65px',
              animation: 'wave 2s ease-in-out infinite',
            }}
          >
            <rect x="6" y="59" width="24" height="13" rx="6.5" fill="white" stroke="#1e3a5f" strokeWidth="1" />
            {/* Hand */}
            <circle cx="9" cy="65.5" r="7" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1" />
            {/* Thumb up */}
            <rect x="5" y="58" width="4" height="7" rx="2" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="0.5" />
          </g>

          {/* === RIGHT ARM (follows mouse) === */}
          <g
            style={{
              transformOrigin: '72px 65px',
              transform: `rotate(${armAngle + 30}deg)`,
              transition: 'transform 0.12s ease-out',
            }}
          >
            <rect x="70" y="59" width="26" height="13" rx="6.5" fill="white" stroke="#1e3a5f" strokeWidth="1" />
            {/* Hand pointing */}
            <circle cx="94" cy="65.5" r="7" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1" />
            {/* Pointing finger */}
            <rect x="98" y="63" width="10" height="5" rx="2.5" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="0.5" />
          </g>

          {/* === HEAD === */}
          {/* Head shape */}
          <circle cx="50" cy="35" r="23" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1.5" />

          {/* Cheeks - blush */}
          <ellipse cx="35" cy="40" rx="5" ry="3" fill="#ffb3b3" opacity="0.4" />
          <ellipse cx="65" cy="40" rx="5" ry="3" fill="#ffb3b3" opacity="0.4" />

          {/* Eyes */}
          {isBlinking ? (
            <>
              <path d="M38 33 Q42 31 46 33" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M54 33 Q58 31 62 33" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="42" cy="32" rx="4" ry="4.5" fill="white" stroke="#1e3a5f" strokeWidth="1" />
              <ellipse cx="58" cy="32" rx="4" ry="4.5" fill="white" stroke="#1e3a5f" strokeWidth="1" />
              {/* Pupils */}
              <ellipse cx="43" cy="33" rx="2.5" ry="3" fill="#1e3a5f" />
              <ellipse cx="59" cy="33" rx="2.5" ry="3" fill="#1e3a5f" />
              {/* Eye shine */}
              <circle cx="44" cy="31" r="1.5" fill="white" />
              <circle cx="60" cy="31" r="1.5" fill="white" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M36 26 Q42 22 48 26" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M52 26 Q58 22 64 26" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />

          {/* Nose */}
          <ellipse cx="50" cy="38" rx="2" ry="1.5" fill="#e8b88a" />

          {/* Big friendly smile */}
          <path d="M40 43 Q50 53 60 43" fill="#c0392b" stroke="#a93226" strokeWidth="1" strokeLinecap="round" />
          {/* Teeth */}
          <path d="M43 43 L57 43" fill="none" stroke="white" strokeWidth="2" />

          {/* Ears */}
          <ellipse cx="27" cy="35" rx="4.5" ry="5.5" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1" />
          <ellipse cx="73" cy="35" rx="4.5" ry="5.5" fill="#f5d0a9" stroke="#e8b88a" strokeWidth="1" />

          {/* === HAT === */}
          {/* Hat brim */}
          <ellipse cx="50" cy="17" rx="30" ry="7" fill="white" stroke="#1e3a5f" strokeWidth="1.5" />
          {/* Hat crown */}
          <rect x="28" y="3" width="44" height="15" rx="5" fill="white" stroke="#1e3a5f" strokeWidth="1.5" />
          {/* Hat band */}
          <rect x="28" y="13" width="44" height="6" fill="#1e3a5f" />
          {/* Hat band text */}
          <text x="50" y="18" textAnchor="middle" fill="#fbbf24" fontSize="4" fontWeight="bold" fontFamily="sans-serif">NAVY</text>
          {/* Gold star on hat */}
          <polygon
            points="50,4 52.5,10 58,10 53.5,13.5 55,19 50,16 45,19 46.5,13.5 42,10 47.5,10"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="0.5"
          />

          {/* === BELT === */}
          <rect x="28" y="95" width="44" height="7" rx="2" fill="#1e3a5f" />
          {/* Belt buckle */}
          <rect x="43" y="94" width="14" height="9" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          {/* Anchor on buckle */}
          <text x="50" y="101" textAnchor="middle" fill="#d97706" fontSize="6" fontWeight="bold">⚓</text>

          {/* === LEGS/PANTS === */}
          <rect x="31" y="101" width="16" height="24" rx="5" fill="#1e3a5f" />
          <rect x="53" y="101" width="16" height="24" rx="5" fill="#1e3a5f" />

          {/* Shoes */}
          <rect x="29" y="122" width="20" height="8" rx="4" fill="#1a1a2e" />
          <rect x="51" y="122" width="20" height="8" rx="4" fill="#1a1a2e" />
          {/* Shoe shine */}
          <ellipse cx="38" cy="124" rx="5" ry="1.5" fill="#2a2a4e" />
          <ellipse cx="60" cy="124" rx="5" ry="1.5" fill="#2a2a4e" />
        </svg>
      </motion.div>

      {/* Glowing ring effect */}
      <div className="absolute -inset-3 rounded-full bg-blue-400/10 dark:bg-blue-500/10 animate-pulse pointer-events-none" />
    </div>
  );
}
