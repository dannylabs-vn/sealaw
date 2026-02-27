import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Waves, Ruler, Mountain, Shield } from 'lucide-react';

const stats = [
  { icon: Waves, value: 1000000, suffix: " km²", label: "Diện tích vùng biển" },
  { icon: Ruler, value: 3260, suffix: " km", label: "Chiều dài bờ biển" },
  { icon: Mountain, value: 3000, suffix: "+", label: "Hòn đảo lớn nhỏ" },
  { icon: Shield, value: 200, suffix: " hải lý", label: "Vùng đặc quyền KT" }
];

export default function StatsPreview() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-16 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon size={32} className="mx-auto text-cyan-300 mb-3" />
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <p className="text-blue-200/70 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
