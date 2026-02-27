import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNewsAPI } from '../../hooks/useNewsAPI';
import NewsCard from '../news/NewsCard';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewsCarousel() {
  const { articles, loading } = useNewsAPI();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Newspaper size={28} className="text-blue-600" /> Tin tức biển đảo
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Cập nhật mới nhất về tình hình Biển Đông và chủ quyền biển đảo</p>
        </div>
        <Link to="/tin-tuc" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-pulse">
              <div className="h-48 bg-slate-200 dark:bg-slate-700" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <NewsCard article={article} />
            </motion.div>
          ))}
        </div>
      )}

      <Link to="/tin-tuc" className="sm:hidden flex items-center justify-center gap-2 text-blue-600 font-bold text-sm mt-8 hover:gap-3 transition-all">
        Xem tất cả tin tức <ArrowRight size={16} />
      </Link>
    </section>
  );
}
