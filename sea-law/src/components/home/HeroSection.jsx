import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, ChevronDown, Anchor } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const particlesOptions = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    color: { value: ["#ffffff", "#93c5fd", "#60a5fa"] },
    links: { enable: false },
    move: {
      enable: true,
      speed: 0.5,
      direction: "top",
      outModes: { default: "out" },
      random: true,
      straight: false
    },
    number: { value: 40, density: { enable: true, area: 1200 } },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.5, minimumValue: 0.1 } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 4 } }
  },
  detectRetina: true
};

export default function HeroSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = useCallback(() => {}, []);

  return (
    <section className="relative h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000"
          alt="Biển Việt Nam"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/85 via-cyan-900/75 to-blue-900/90 z-10" />

      {/* Particles */}
      {init && (
        <div className="absolute inset-0 z-20">
          <Particles
            id="hero-particles"
            particlesLoaded={particlesLoaded}
            options={particlesOptions}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-30 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <Anchor size={36} className="text-cyan-300" />
          </div>
          <span className="text-cyan-300 text-sm font-bold uppercase tracking-[0.3em]">OceanMind</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
        >
          Pháp Lý Biển Đảo
          <br />
          <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            & Chủ Quyền Dân Tộc
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-blue-100/80 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Cổng thông tin phổ biến kiến thức Luật Biển và hỗ trợ tra cứu pháp lý trực tuyến.
          Tìm hiểu về chủ quyền biển đảo Việt Nam qua bản đồ, tư liệu lịch sử và trí tuệ nhân tạo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/luat-bien"
            className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          >
            <BookOpen size={20} /> Khám phá Luật Biển
          </Link>
          <Link
            to="/kiem-tra"
            className="bg-cyan-500/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-500/30 transition-all shadow-xl border border-cyan-400/30 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Brain size={20} /> Trắc nghiệm kiến thức
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
