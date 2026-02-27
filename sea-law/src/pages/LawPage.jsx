import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileText, ExternalLink, Download, Search, Filter } from 'lucide-react';
import { lawDocuments } from '../data/law-documents';

const categories = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Trong nước', label: 'Trong nước' },
  { key: 'Quốc tế', label: 'Quốc tế' },
];

function LawCard({ doc, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isInternational = doc.type === 'Quốc tế';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isInternational
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}
        >
          <FileText size={12} />
          {doc.type}
        </span>
        {doc.highlight && (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
            Quan trọng
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {doc.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
        {doc.desc}
      </p>

      {/* Date and link */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {doc.date}
        </span>
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          Xem chi tiết
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}

export default function LawPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredDocs = useMemo(() => {
    return lawDocuments.filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || doc.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section className="min-h-screen py-20 px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <FileText size={16} />
            Văn bản pháp luật
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Hệ thống văn bản pháp luật biển đảo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Tổng hợp các văn bản pháp luật trong nước và quốc tế liên quan đến chủ quyền biển đảo Việt Nam
          </p>
        </motion.div>

        {/* Search and Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          {/* Search input */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm văn bản pháp luật..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center justify-center gap-2">
            <Filter size={16} className="text-slate-400 dark:text-slate-500 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredDocs.length}</span> văn bản
          </p>
        </div>

        {/* Documents grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, i) => (
              <LawCard key={doc.title} doc={doc} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Không tìm thấy văn bản nào phù hợp
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Thử thay đổi từ khóa hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
