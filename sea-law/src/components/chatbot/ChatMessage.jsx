import { motion } from 'framer-motion';
import { MapPin, Info, Navigation } from 'lucide-react';
import { islandCategories } from '../../data/islands';

function formatBotMessage(text) {
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>');

  html = html.replace(/((?:<li>.*?<\/li><br\/>?)+)/g, (match) => {
    const cleaned = match.replace(/<br\/>/g, '');
    return `<ul class="list-disc pl-4 my-1.5 space-y-1">${cleaned}</ul>`;
  });

  return html;
}

function IslandInfoCard({ island, onAskMore }) {
  const category = islandCategories[island.category];
  const categoryColors = {
    hoang_sa: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
    truong_sa: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    ven_bo: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[90%]"
    >
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 rounded-2xl rounded-tl-none overflow-hidden border border-blue-200 dark:border-slate-600 shadow-sm">
        <div className="px-4 pt-4 pb-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryColors[island.category] || categoryColors.ven_bo}`}>
            <MapPin size={10} />
            {category?.label || island.category}
          </span>
        </div>

        <div className="px-4 pb-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Navigation size={16} className="text-blue-500" />
            {island.name}
          </h3>
        </div>

        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {island.coordinates && (
            <div className="text-xs">
              <span className="text-slate-400 dark:text-slate-500">Tọa độ:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{island.coordinates[1].toFixed(2)}°N, {island.coordinates[0].toFixed(2)}°E</p>
            </div>
          )}
          {island.area && (
            <div className="text-xs">
              <span className="text-slate-400 dark:text-slate-500">Diện tích:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{island.area}</p>
            </div>
          )}
        </div>

        {island.status && (
          <div className="px-4 pb-3">
            <div className={`text-xs px-3 py-1.5 rounded-lg ${
              island.status.includes('trái phép')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
            }`}>
              {island.status}
            </div>
          </div>
        )}

        {island.note && (
          <div className="px-4 pb-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-1.5">
              <Info size={12} className="flex-shrink-0 mt-0.5 text-blue-400" />
              {island.note}
            </p>
          </div>
        )}

        <button
          onClick={() => onAskMore(island.name)}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          Hỏi thêm về đảo này
        </button>
      </div>
    </motion.div>
  );
}

export default function ChatMessage({ message, onAskAboutIsland }) {
  const isUser = message.role === 'user';
  const isIslandInfo = message.role === 'island-info';

  if (isIslandInfo && message.island) {
    return (
      <div className="flex justify-start">
        <IslandInfoCard island={message.island} onAskMore={onAskAboutIsland || (() => {})} />
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-blue-600 text-white rounded-tr-none'
          : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-none'
      }`}>
        {isUser ? (
          message.content
        ) : (
          <div
            className="bot-message [&_strong]:font-bold [&_strong]:text-blue-700 dark:[&_strong]:text-blue-300 [&_ul]:my-2 [&_li]:ml-1"
            dangerouslySetInnerHTML={{ __html: formatBotMessage(message.content) }}
          />
        )}
      </div>
    </div>
  );
}
