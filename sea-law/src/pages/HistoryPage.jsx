import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import daiNamImg from '../assets/dai_nam.jpg';
import anNamImg from '../assets/an_nam.jpg';
import banDoImg from '../assets/ban_do.jpg';

const evidenceCards = [
  {
    image: daiNamImg,
    period: 'Thế kỷ 19',
    title: 'Đại Nam Thực Lục',
    description:
      'Bộ chính sử lớn nhất của nhà Nguyễn, ghi chép chi tiết các hoạt động xác lập và thực thi chủ quyền tại Hoàng Sa và Trường Sa qua nhiều đời vua.',
    url: 'https://www.thuvienhoasen.org/a37128/dai-nam-thuc-luc-toan-tap',
  },
  {
    image: anNamImg,
    period: 'Năm 1838',
    title: 'Bản đồ An Nam Đại Quốc Họa Đồ',
    description:
      'Bản đồ do Giám mục Jean-Louis Taberd vẽ năm 1838, thể hiện rõ ràng "Paracel seu Cát Vàng" (Hoàng Sa) thuộc lãnh thổ Việt Nam.',
    url: 'https://nghiencuulichsu.com/2014/09/29/nhan-xet-ve-an-nam-dai-quoc-hoa-do/',
  },
  {
    image: banDoImg,
    period: 'Thế kỷ 16-18',
    title: 'Bộ sưu tập bản đồ phương Tây',
    description:
      'Hàng chục bản đồ cổ do các nhà hàng hải và địa lý phương Tây vẽ từ thế kỷ 16 đến 18, đều ghi nhận Hoàng Sa thuộc chủ quyền Việt Nam.',
    url: 'https://infonet.vietnamnet.vn/phat-hien-56-ban-do-co-phuong-tay-ve-hoang-sa-cua-viet-nam-122373.html',
  },
];

function EvidenceCard({ card, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
    >
      {/* Image with hover zoom */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200">
          <History size={12} />
          {card.period}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {card.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-3">
          {card.description}
        </p>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Khám phá tư liệu
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="min-h-screen py-20 px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
            <History size={16} />
            Tư liệu lịch sử
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Bằng chứng lịch sử chủ quyền biển đảo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Những tư liệu lịch sử quý giá khẳng định chủ quyền không thể tranh cãi của Việt Nam đối với quần đảo Hoàng Sa và Trường Sa
          </p>
        </motion.div>

        {/* Evidence cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {evidenceCards.map((card, i) => (
            <EvidenceCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* CTA Section - Link to Timeline */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 p-10 sm:p-14 text-center"
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Khám phá dòng thời gian chủ quyền
            </h2>
            <p className="text-blue-200/80 max-w-xl mx-auto mb-8">
              Hành trình hàng trăm năm gìn giữ và bảo vệ chủ quyền biển đảo Việt Nam qua các mốc lịch sử quan trọng
            </p>
            <Link
              to="/dong-thoi-gian"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
            >
              Xem dòng thời gian
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
