import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, MapPin } from 'lucide-react';
import { timelineEvents, eraColors, eraLabels } from '../data/timeline-events';

function TimelineEvent({ event, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const isLeft = index % 2 === 0;
  const colors = eraColors[event.era];

  return (
    <div ref={ref} className="relative flex md:items-center w-full mb-12 last:mb-0">
      {/* Desktop: alternating layout */}
      {/* Left content (even index on desktop) */}
      <div className={`hidden md:block w-1/2 ${isLeft ? 'pr-12 text-right' : ''}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`inline-block text-left ${isLeft ? 'ml-auto text-right' : ''}`}
          >
            <EventContent event={event} colors={colors} align="right" />
          </motion.div>
        )}
      </div>

      {/* Center dot on the timeline line */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`w-5 h-5 rounded-full ${colors.dot} border-4 border-white dark:border-slate-900 shadow-lg`}
        />
      </div>

      {/* Right content (odd index on desktop) */}
      <div className={`hidden md:block w-1/2 ${!isLeft ? 'pl-12' : ''}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <EventContent event={event} colors={colors} align="left" />
          </motion.div>
        )}
      </div>

      {/* Mobile layout: dot on left, content on right */}
      <div className="md:hidden flex w-full">
        {/* Mobile dot */}
        <div className="flex-shrink-0 relative z-10 mr-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`w-4 h-4 rounded-full ${colors.dot} border-4 border-white dark:border-slate-900 shadow-lg mt-1.5`}
          />
        </div>

        {/* Mobile content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1"
        >
          <EventContent event={event} colors={colors} align="left" />
        </motion.div>
      </div>
    </div>
  );
}

function EventContent({ event, colors, align }) {
  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Year badge */}
      <div className={`flex items-center gap-2 mb-3 ${align === 'right' ? 'justify-end' : ''}`}>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.text} bg-white/60 dark:bg-slate-900/40`}
        >
          <Clock size={12} />
          {event.year}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`text-lg font-bold text-slate-900 dark:text-white mb-2 ${
          align === 'right' ? 'text-right' : ''
        }`}
      >
        {event.title}
      </h3>

      {/* Description */}
      <p
        className={`text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed ${
          align === 'right' ? 'text-right' : ''
        }`}
      >
        {event.description}
      </p>

      {/* Source */}
      <p
        className={`text-xs italic text-slate-400 dark:text-slate-500 ${
          align === 'right' ? 'text-right' : ''
        }`}
      >
        <MapPin size={10} className="inline mr-1 -mt-0.5" />
        {event.source}
      </p>
    </div>
  );
}

export default function TimelinePage() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="min-h-screen py-20 px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-4">
            <Clock size={16} />
            Dòng thời gian
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Dòng thời gian chủ quyền biển đảo Việt Nam
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Hành trình hàng trăm năm xác lập, thực thi và bảo vệ chủ quyền biển đảo của dân tộc Việt Nam
          </p>
        </motion.div>

        {/* Era legend */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          {Object.entries(eraLabels).map(([key, label]) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <span className={`w-3 h-3 rounded-full ${eraColors[key].dot}`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop center line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Mobile left line */}
          <div className="md:hidden absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Events */}
          {timelineEvents.map((event, i) => (
            <TimelineEvent key={i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
