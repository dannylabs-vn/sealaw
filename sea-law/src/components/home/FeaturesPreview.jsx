import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, Map as MapIcon, History, Brain } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: "Pháp lý chính thống",
    desc: "Cập nhật đầy đủ các văn bản quy phạm pháp luật về biển đảo mới nhất.",
    path: "/luat-bien",
    color: "blue"
  },
  {
    icon: MapIcon,
    title: "Bản đồ số hóa",
    desc: "Trải nghiệm trực quan về các vùng biển thuộc chủ quyền Việt Nam với 20+ đảo.",
    path: "/ban-do",
    color: "cyan"
  },
  {
    icon: History,
    title: "Tư liệu lịch sử",
    desc: "Kho tàng bằng chứng thép về chủ quyền đối với Hoàng Sa và Trường Sa.",
    path: "/lich-su",
    color: "indigo"
  },
  {
    icon: Brain,
    title: "Trắc nghiệm",
    desc: "Kiểm tra kiến thức về luật biển, lịch sử và địa lý biển đảo Việt Nam.",
    path: "/kiem-tra",
    color: "emerald"
  }
];

const colorMap = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", hover: "group-hover:bg-blue-600 group-hover:text-white" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", hover: "group-hover:bg-cyan-600 group-hover:text-white" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", hover: "group-hover:bg-indigo-600 group-hover:text-white" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", hover: "group-hover:bg-emerald-600 group-hover:text-white" }
};

export default function FeaturesPreview() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Khám phá OceanMind</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Nền tảng giáo dục toàn diện về Luật Biển và chủ quyền biển đảo Việt Nam</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, i) => {
          const colors = colorMap[feat.color];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(feat.path)}
              className="p-8 bg-white dark:bg-slate-800 rounded-2xl transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
            >
              <div className={`w-16 h-16 ${colors.bg} ${colors.text} ${colors.hover} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all transform group-hover:rotate-6 group-hover:scale-110`}>
                <feat.icon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center dark:text-white">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center">{feat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
