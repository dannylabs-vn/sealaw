import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronRight, MapPin, Layers, PanelLeftClose, PanelLeftOpen, Eye, EyeOff } from 'lucide-react'
import { islandsGeo, islandCategories } from '../../data/islands'

const CATEGORY_ORDER = ['hoang_sa', 'truong_sa', 'ven_bo']

export default function MapSidebar({ onSelectIsland, onToggleLayer, layerVisibility = {}, collapsed, onToggleCollapse }) {
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({
    hoang_sa: true,
    truong_sa: true,
    ven_bo: true,
  })

  // Group and filter islands
  const groupedIslands = useMemo(() => {
    const query = search.toLowerCase().trim()
    const groups = {}

    CATEGORY_ORDER.forEach((cat) => {
      groups[cat] = []
    })

    islandsGeo.features.forEach((feature) => {
      const p = feature.properties || {}
      const cat = p.category || 'ven_bo'
      const name = (p.name || '').toLowerCase()

      if (!query || name.includes(query)) {
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(feature)
      }
    })

    return groups
  }, [search])

  const totalResults = useMemo(() => {
    return Object.values(groupedIslands).reduce((sum, arr) => sum + arr.length, 0)
  }, [groupedIslands])

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const handleLayerToggle = (layerName) => {
    if (onToggleLayer) {
      onToggleLayer(layerName, !layerVisibility[layerName])
    }
  }

  // Status badge color
  const getStatusStyle = (feature) => {
    const cat = feature.properties?.category
    if (cat === 'hoang_sa') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  }

  // Layer definitions for toggle section
  const layers = [
    { key: 'eez', label: 'Vung EEZ', icon: '---' },
    { key: 'baseline', label: 'Duong co so', icon: '---' },
    { key: 'territorial', label: 'Vung 12 hai ly', icon: 'O' },
  ]

  // ── Collapsed state: show toggle button only ──
  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="absolute top-3 left-3 z-[1000] p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        title="Mo thanh ben"
      >
        <PanelLeftOpen size={20} />
      </button>
    )
  }

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-80 shrink-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            Dao & Quan dao
          </h2>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Thu gon"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim kiem dao..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          />
        </div>
        {search && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Tim thay {totalResults} ket qua
          </p>
        )}
      </div>

      {/* ── Island list (scrollable) ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {CATEGORY_ORDER.map((cat) => {
          const catInfo = islandCategories[cat] || {}
          const islands = groupedIslands[cat] || []
          const isExpanded = expandedCategories[cat]

          if (search && islands.length === 0) return null

          return (
            <div key={cat} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: catInfo.color }}
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {catInfo.label}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">({islands.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-slate-400" />
                ) : (
                  <ChevronRight size={16} className="text-slate-400" />
                )}
              </button>

              {/* Island items */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {islands.length === 0 ? (
                      <p className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 italic">
                        Khong tim thay dao nao
                      </p>
                    ) : (
                      islands.map((feature, idx) => {
                        const p = feature.properties || {}
                        return (
                          <button
                            key={`${cat}-${idx}`}
                            onClick={() => onSelectIsland && onSelectIsland(feature)}
                            className="w-full text-left px-4 py-2.5 pl-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                          >
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {p.area && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {p.area}
                                </span>
                              )}
                              {p.status && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusStyle(feature)}`}
                                >
                                  {p.status.length > 30 ? p.status.slice(0, 28) + '...' : p.status}
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* ── Layer toggles ── */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Layers size={14} />
          Lop ban do
        </h3>
        <div className="space-y-2">
          {layers.map((layer) => {
            const isVisible = layerVisibility[layer.key] !== false
            return (
              <label
                key={layer.key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <button
                  onClick={() => handleLayerToggle(layer.key)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    isVisible
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <span
                  className={`text-sm transition-colors ${
                    isVisible
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {layer.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </motion.aside>
  )
}
