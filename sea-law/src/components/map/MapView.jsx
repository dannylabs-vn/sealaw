import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { MapContainer, TileLayer, GeoJSON, Circle, Tooltip, LayersControl, LayerGroup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { islandsGeo, islandCategories } from '../../data/islands'
import { vietnamEEZ } from '../../data/eez'
import { vietnamBaseline } from '../../data/baseline'

const MAP_CENTER = [14.0, 110.0]
const MAP_ZOOM = 5
const TWELVE_NM_METERS = 12 * 1852 // 12 nautical miles in meters

const CATEGORY_COLORS = {
  hoang_sa: '#dc2626',
  truong_sa: '#ea580c',
  ven_bo: '#16a34a',
}

// ── Vietnamese region labels ──────────────────────────────────────
function VietnameseRegionLabels() {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!map) return

    if (layerRef.current) map.removeLayer(layerRef.current)

    const regionLayer = L.layerGroup()

    const regions = [
      { name: 'Vinh Bac Bo', lat: 20.5, lng: 107.5 },
      { name: 'Vung bien Da Nang', lat: 16.0, lng: 108.5 },
      { name: 'Vung bien Nha Trang', lat: 12.0, lng: 109.0 },
      { name: 'Vung bien Ca Mau', lat: 8.5, lng: 104.5 },
      { name: 'Vinh Thai Lan', lat: 10.0, lng: 100.0 },
    ]

    regions.forEach((region) => {
      const icon = L.divIcon({
        html: `<div style="
          font-size: 11px;
          color: #1e40af;
          font-weight: 600;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
          pointer-events: none;
        ">${region.name}</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
        className: 'leaflet-region-label',
      })

      L.marker([region.lat, region.lng], { icon, interactive: false }).addTo(regionLayer)
    })

    regionLayer.addTo(map)
    layerRef.current = regionLayer

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [map])

  return null
}

// ── Custom island labels coloured by category (clickable) ────────
function IslandLabels({ onIslandClick }) {
  const map = useMap()
  const layerRef = useRef(null)
  const callbackRef = useRef(onIslandClick)
  callbackRef.current = onIslandClick

  useEffect(() => {
    if (!map) return

    if (layerRef.current) map.removeLayer(layerRef.current)

    const labelLayer = L.layerGroup()

    islandsGeo.features.forEach((feature) => {
      const coords = feature.geometry.coordinates
      const name = feature.properties?.name || 'Dia diem'
      const cat = feature.properties?.category || 'ven_bo'
      const color = CATEGORY_COLORS[cat] || '#dc2626'

      const customIcon = L.divIcon({
        html: `<div style="
          background: #fefce8;
          border: 2px solid ${color};
          border-radius: 6px;
          padding: 4px 10px;
          font-weight: 700;
          font-size: 12px;
          color: ${color};
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transform: translate(-50%, -100%);
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        ">${name}</div>`,
        iconSize: [160, 34],
        iconAnchor: [80, 40],
        className: 'leaflet-island-label',
      })

      const marker = L.marker([coords[1], coords[0]], { icon: customIcon, interactive: true })
      marker.on('click', () => {
        if (callbackRef.current) callbackRef.current(feature)
      })
      marker.addTo(labelLayer)
    })

    labelLayer.addTo(map)
    layerRef.current = labelLayer

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [map])

  return null
}

// ── Fly-to controller that reacts to selectedIsland prop ─────────
function FlyToIsland({ selectedIsland }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedIsland) return
    const coords = selectedIsland.geometry.coordinates
    map.flyTo([coords[1], coords[0]], 10, { duration: 1.5 })
  }, [selectedIsland, map])

  return null
}

// ── Event bridge: exposes flyTo via custom DOM events ────────────
function MapEventBridge({ mapRef }) {
  const map = useMap()

  useEffect(() => {
    if (mapRef) mapRef.current = map
  }, [map, mapRef])

  return null
}

// ── Main MapView component ───────────────────────────────────────
const MapView = forwardRef(function MapView({ selectedIsland, onIslandClick, layerVisibility = {} }, ref) {
  const mapInstanceRef = useRef(null)

  // Expose flyTo through ref
  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom = 10) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.5 })
      }
    },
    getMap() {
      return mapInstanceRef.current
    },
  }))

  // Determine layer visibility with defaults
  const showEEZ = layerVisibility.eez !== false
  const showBaseline = layerVisibility.baseline !== false
  const showTerritorial = layerVisibility.territorial !== false

  // GeoJSON style for islands by category
  const islandPointToLayer = useCallback((feature, latlng) => {
    const cat = feature.properties?.category || 'ven_bo'
    const color = CATEGORY_COLORS[cat] || '#16a34a'
    return L.circleMarker(latlng, {
      radius: 12,
      fillColor: color,
      color: '#ffffff',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    })
  }, [])

  const islandOnEachFeature = useCallback(
    (feature, layer) => {
      const p = feature.properties || {}
      const cat = p.category || 'ven_bo'
      const catInfo = islandCategories[cat] || {}

      layer.bindPopup(`
        <div style="min-width:200px">
          <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:${CATEGORY_COLORS[cat] || '#333'}">${p.name || 'Dia diem'}</h3>
          <p style="margin:0 0 4px; font-size:12px; color:#64748b">${catInfo.label || ''}</p>
          ${p.note ? `<p style="margin:0 0 4px; font-size:13px">${p.note}</p>` : ''}
          ${p.area ? `<p style="margin:0 0 4px; font-size:13px"><strong>Dien tich:</strong> ${p.area}</p>` : ''}
          ${p.status ? `<p style="margin:0; font-size:12px; padding:3px 8px; border-radius:4px; background:${cat === 'hoang_sa' ? '#fef2f2' : '#f0fdf4'}; color:${cat === 'hoang_sa' ? '#991b1b' : '#166534'}">${p.status}</p>` : ''}
        </div>
      `)

      layer.on('click', () => {
        if (onIslandClick) onIslandClick(feature)
      })
    },
    [onIslandClick]
  )

  // EEZ style
  const eezStyle = {
    color: '#2563eb',
    weight: 2,
    dashArray: '8 6',
    fillColor: '#3b82f6',
    fillOpacity: 0.06,
  }

  // Baseline style
  const baselineStyle = {
    color: '#dc2626',
    weight: 3,
    opacity: 0.85,
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom
        preferCanvas
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Expose map instance */}
        <MapEventBridge mapRef={mapInstanceRef} />

        {/* Fly to selected island */}
        <FlyToIsland selectedIsland={selectedIsland} />

        {/* Vietnamese region labels */}
        <VietnameseRegionLabels />

        {/* Island labels (clickable) */}
        <IslandLabels onIslandClick={onIslandClick} />

        <LayersControl position="topright">
          {/* ── Base Layers ── */}
          <LayersControl.BaseLayer checked name="Ve tinh Esri">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OSM Streets">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Esri Ocean">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
              maxZoom={13}
            />
          </LayersControl.BaseLayer>

          {/* ── Overlay: Islands ── */}
          <LayersControl.Overlay checked name="Dao & Diem danh dau">
            <LayerGroup>
              <GeoJSON
                data={islandsGeo}
                pointToLayer={islandPointToLayer}
                onEachFeature={islandOnEachFeature}
              />
            </LayerGroup>
          </LayersControl.Overlay>

          {/* ── Overlay: EEZ ── */}
          <LayersControl.Overlay checked={showEEZ} name="Vung EEZ">
            <LayerGroup>
              <GeoJSON data={vietnamEEZ} style={() => eezStyle} />
            </LayerGroup>
          </LayersControl.Overlay>

          {/* ── Overlay: Baseline ── */}
          <LayersControl.Overlay checked={showBaseline} name="Duong co so">
            <LayerGroup>
              <GeoJSON data={vietnamBaseline} style={() => baselineStyle} />
            </LayerGroup>
          </LayersControl.Overlay>

          {/* ── Overlay: 12nm territorial waters ── */}
          <LayersControl.Overlay checked={showTerritorial} name="Vung 12 hai ly">
            <LayerGroup>
              {islandsGeo.features.map((f, idx) => {
                const coords = f.geometry.coordinates
                const cat = f.properties?.category || 'ven_bo'
                return (
                  <Circle
                    key={`territorial-${idx}`}
                    center={[coords[1], coords[0]]}
                    radius={TWELVE_NM_METERS}
                    pathOptions={{
                      color: CATEGORY_COLORS[cat] || '#2563eb',
                      fillOpacity: 0.04,
                      weight: 1.5,
                      dashArray: '4 4',
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      {`${f.properties?.name || 'Dao'} — Vung lanh hai 12 hai ly`}
                    </Tooltip>
                  </Circle>
                )
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* ── Legend overlay ── */}
      <div className="absolute left-3 bottom-3 z-[1000] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs w-52 border border-slate-200 dark:border-slate-700">
        <div className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-sm">Chu giai ban do</div>
        {Object.entries(islandCategories).map(([key, cat]) => (
          <div key={key} className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
          </div>
        ))}
        <div className="border-t border-slate-200 dark:border-slate-600 my-2" />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-0.5 rounded" style={{ background: '#2563eb', borderTop: '2px dashed #2563eb' }} />
          <span className="text-slate-700 dark:text-slate-300">Vung EEZ</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-0.5 rounded bg-red-600" />
          <span className="text-slate-700 dark:text-slate-300">Duong co so</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-100/30" />
          <span className="text-slate-700 dark:text-slate-300">Lanh hai 12 hai ly</span>
        </div>
      </div>
    </div>
  )
})

export default MapView
