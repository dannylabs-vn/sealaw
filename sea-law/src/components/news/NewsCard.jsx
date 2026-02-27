import { ExternalLink } from 'lucide-react';

export default function NewsCard({ article }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group hover:-translate-y-1"
    >
      <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
            <ExternalLink size={40} />
          </div>
        )}
        {article.source?.name && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {article.source.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">{article.description}</p>
        )}
        {date && (
          <p className="text-slate-400 dark:text-slate-500 text-xs">{date}</p>
        )}
      </div>
    </a>
  );
}
