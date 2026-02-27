import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Info } from 'lucide-react'
import MapView from '../components/map/MapView'
import MapSidebar from '../components/map/MapSidebar'
import { useChatbot } from '../context/ChatbotContext'

export default function MapPage() {
  const mapRef = useRef(null)
  const [selectedIsland, setSelectedIsland] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectIsland: selectIslandForChat } = useChatbot()
  const [layerVisibility, setLayerVisibility] = useState({
    eez: true,
    baseline: true,
    territorial: true,
  })

  // Sidebar selects an island -> fly map to it
  const handleSelectIsland = useCallback((feature) => {
    setSelectedIsland(feature)
    // Also fly via ref for precise control
    if (mapRef.current && feature.geometry) {
      const coords = feature.geometry.coordinates
      mapRef.current.flyTo(coords[1], coords[0], 10)
    }
  }, [])

  // Map clicks an island -> update selection + open chatbot
  const handleIslandClick = useCallback((feature) => {
    setSelectedIsland(feature)
    selectIslandForChat(feature)
  }, [selectIslandForChat])

  // Layer toggle
  const handleToggleLayer = useCallback((layerName, visible) => {
    setLayerVisibility((prev) => ({ ...prev, [layerName]: visible }))
  }, [])

  // Sidebar collapse toggle
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* ── Top bar ── */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Map size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Ban do chu quyen bien dao Viet Nam
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                OceanMind - Giao duc ve chu quyen bien dao
              </p>
            </div>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Map size={18} />
          </button>
        </div>
      </div>

      {/* ── Main content: sidebar + map ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar -- desktop: always visible, mobile: overlay */}
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-full">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <MapSidebar
                onSelectIsland={handleSelectIsland}
                onToggleLayer={handleToggleLayer}
                layerVisibility={layerVisibility}
                collapsed={false}
                onToggleCollapse={handleToggleSidebar}
              />
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <MapSidebar
              collapsed
              onToggleCollapse={handleToggleSidebar}
              onSelectIsland={handleSelectIsland}
              onToggleLayer={handleToggleLayer}
              layerVisibility={layerVisibility}
            />
          )}
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleToggleSidebar}
                className="lg:hidden fixed inset-0 bg-black/40 z-[999]"
              />
              {/* Sidebar panel */}
              <div className="lg:hidden fixed inset-y-0 left-0 z-[1000] h-full">
                <MapSidebar
                  onSelectIsland={(feature) => {
                    handleSelectIsland(feature)
                    setSidebarCollapsed(true) // collapse on mobile after selection
                  }}
                  onToggleLayer={handleToggleLayer}
                  layerVisibility={layerVisibility}
                  collapsed={false}
                  onToggleCollapse={handleToggleSidebar}
                />
              </div>
            </>
          )}
        </AnimatePresence>

        {/* ── Map ── */}
        <div className="flex-1 relative">
          <MapView
            ref={mapRef}
            selectedIsland={selectedIsland}
            onIslandClick={handleIslandClick}
            layerVisibility={layerVisibility}
          />
        </div>
      </div>

      {/* ── Disclaimer bar ── */}
      <div className="shrink-0 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800/40 px-4 py-2">
        <p className="text-center text-xs text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1.5">
          <Info size={13} className="shrink-0" />
          Ban do chi mang tinh minh hoa cho muc dich giao duc. Du lieu toa do mang tinh xap xi.
        </p>
      </div>
    </div>
  )
}
