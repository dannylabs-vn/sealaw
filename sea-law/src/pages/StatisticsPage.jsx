import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Waves, Ruler, Mountain, Shield, Map, Scale, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { keyStats, seaZones, islandsByRegion, comparisonData } from '../data/sea-statistics';

const iconMap = {
  waves: Waves,
  ruler: Ruler,
  mountain: Mountain,
  shield: Shield,
  map: Map,
  scale: Scale,
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, region, count }) => {
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-[11px] fill-slate-600 dark:fill-slate-300"
    >
      {region} ({count})
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{label || payload[0]?.name}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-slate-600 dark:text-slate-300">
          {entry.name || 'Diện tích'}: <span className="font-semibold">{Number(entry.value).toLocaleString()} km²</span>
        </p>
      ))}
    </div>
  );
};

function StatCard({ stat, index, inView }) {
  const Icon = iconMap[stat.icon] || Waves;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
    >
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-4">
        <Icon size={24} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
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
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
    </motion.div>
  );
}

export default function StatisticsPage() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [chartsRef, chartsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [barRef, barInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BarChart3 size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Thống kê biển đảo Việt Nam
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Tổng hợp các số liệu quan trọng về vùng biển, bờ biển, đảo và các vùng biển thuộc chủ quyền và quyền chủ quyền của Việt Nam
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {keyStats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} inView={statsInView} />
          ))}
        </div>

        {/* Charts Row */}
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Area Chart - Sea Zones */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={chartsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Các vùng biển Việt Nam</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Diện tích theo vùng biển (km²)</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seaZones} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="area"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#areaGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart - Islands by Region */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={chartsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Phân bố đảo theo vùng</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Số lượng đảo theo khu vực</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={islandsByRegion}
                    dataKey="count"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={45}
                    paddingAngle={2}
                    label={renderCustomLabel}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {islandsByRegion.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{data.region}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{data.count} đảo</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bar Chart - Comparison */}
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 30 }}
          animate={barInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">So sánh diện tích đất liền và vùng biển</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Vùng biển Việt Nam rộng gấp khoảng 3 lần diện tích đất liền
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
                <Bar dataKey="value" name="Diện tích (km²)" radius={[8, 8, 0, 0]} barSize={80}>
                  {comparisonData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sea zones detail cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={barInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Chi tiết các vùng biển
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seaZones.map((zone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={barInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: zone.color }}
                  />
                  <h4 className="font-bold text-slate-900 dark:text-white">{zone.name}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Phạm vi:</span> {zone.width}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Diện tích:</span> ~{zone.area.toLocaleString()} km²
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{zone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
