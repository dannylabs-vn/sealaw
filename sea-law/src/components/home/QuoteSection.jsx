import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

export default function QuoteSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
          alt="Biển đảo Việt Nam"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 70%' }}
        />
      </div>
      <div className="absolute inset-0 bg-blue-950/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Quote size={48} className="mx-auto text-cyan-400/50 mb-6" />
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed mb-8">
            "Hoàng Sa, Trường Sa là bộ phận
            <span className="text-cyan-300"> không thể tách rời </span>
            của lãnh thổ Việt Nam."
          </blockquote>
          <div className="w-16 h-1 bg-cyan-400 mx-auto mb-4 rounded-full" />
          <p className="text-blue-200/60 text-sm uppercase tracking-widest">
            Luật Biển Việt Nam 2012 — Điều 1
          </p>
        </motion.div>
      </div>
    </section>
  );
}
