import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, LayersControl, LayerGroup, Circle, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const defaultCenter = [16.0, 109.0]
const defaultZoom = 5

// Vietnamese maritime region labels
function VietnameseRegionLabels() {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!map) return

    if (layerRef.current) map.removeLayer(layerRef.current)

    const regionLayer = L.layerGroup()

    // Vietnamese region labels
    const regions = [
      { name: 'Vịnh Bắc Bộ', lat: 20.5, lng: 107.5 },
      { name: 'Vùng biển Đà Nẵng', lat: 16.0, lng: 108.5 },
      { name: 'Vùng biển Nha Trang', lat: 12.0, lng: 109.0 },
      { name: 'Vùng biển Cà Mau', lat: 8.5, lng: 104.5 },
      { name: 'Vịnh Thái Lan', lat: 10.0, lng: 100.0 }
    ]

    regions.forEach(region => {
      const icon = L.divIcon({
        html: `<div style="
          font-size: 11px;
          color: #1e40af;
          font-weight: 600;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
          pointer-events: none;
        ">${region.name}</div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
        className: 'leaflet-region-label'
      })

      L.marker([region.lat, region.lng], { icon: icon, interactive: false }).addTo(regionLayer)
    })

    regionLayer.addTo(map)
    layerRef.current = regionLayer

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [map])

  return null
}

// Custom Vietnamese labels for islands
function VietnameseLabels({ geojson }) {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    if (!map || !geojson) return

    // Remove old layer
    if (layerRef.current) map.removeLayer(layerRef.current)

    const labelLayer = L.layerGroup()

    // Add Vietnamese labels for each feature
    geojson.features?.forEach((feature) => {
      const coords = feature.geometry.coordinates
      const name = feature.properties?.name || 'Địa điểm'
      
      // Create custom div icon with Vietnamese text
      const customIcon = L.divIcon({
        html: `<div style="
          background: #fef3c7;
          border: 3px solid #dc2626;
          border-radius: 6px;
          padding: 4px 8px;
          font-weight: bold;
          font-size: 13px;
          color: #991b1b;
          white-space: nowrap;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
        ">${name}</div>`,
        iconSize: [120, 35],
        iconAnchor: [60, 17],
        className: 'leaflet-custom-label'
      })

      L.marker([coords[1], coords[0]], { icon: customIcon, interactive: false }).addTo(labelLayer)
    })

    labelLayer.addTo(map)
    layerRef.current = labelLayer

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [map, geojson])

  return null
}

function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) map.fitBounds(bounds)
  }, [map, bounds])
  return null
}

export default function MapView({ geojson }) {
  // optional bounds to show SE Asia region
  const bounds = [[-20, 90], [30, 160]]
  const twelveNmMeters = 12 * 1852 // 12 nautical miles in meters (~22224)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ height: '520px' }}>
      <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add Vietnamese region labels */}
        <VietnameseRegionLabels />

        {/* Add Vietnamese labels layer */}
        <VietnameseLabels geojson={geojson} />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Bản đồ Việt Nam">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Bản đồ Streets">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Đảo & Marker">
            <LayerGroup>
              {geojson && (
                <GeoJSON
                  data={geojson}
                  style={() => ({ color: '#0ea5e9', weight: 2, fillOpacity: 0.05 })}
                  pointToLayer={(feature, latlng) => {
                    return L.circleMarker(latlng, {
                      radius: 7,
                      fillColor: '#e11d48',
                      color: '#9f1239',
                      weight: 1,
                      opacity: 1,
                      fillOpacity: 0.9
                    })
                  }}
                  onEachFeature={(feature, layer) => {
                    const name = feature.properties?.name || 'Địa điểm'
                    const note = feature.properties?.note || ''
                    layer.bindPopup(`<strong>${name}</strong><br/>${note}<br/><em>Thuộc lãnh thổ Việt Nam</em>`)
                  }}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Vùng 12 hải lý">
            <LayerGroup>
              {geojson && geojson.features && geojson.features.map((f, idx) => (
                <Circle
                  key={`c-${idx}`}
                  center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
                  radius={twelveNmMeters}
                  pathOptions={{ color: '#2563eb', fillOpacity: 0.05, weight: 2 }}
                >
                  <Tooltip direction="top" offset={[0, -10]}>
                    {`${f.properties?.name || 'Đảo'} — Vùng lãnh hải 12 hải lý`}
                  </Tooltip>
                </Circle>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Legend overlay */}
        <div className="absolute right-4 bottom-4 z-50 bg-white/90 p-4 rounded-lg shadow-lg text-sm text-slate-800 w-48">
          <div className="font-bold mb-2">Chú giải bản đồ</div>
          <div className="flex items-center gap-2 mb-2"><span className="w-4 h-1 bg-red-600 rounded"></span> Đảo/Điểm</div>
          <div className="flex items-center gap-2 mb-2"><span className="w-4 h-1 bg-blue-400 rounded"></span> Vùng lãnh hải (12 hải lý)</div>
          <div className="flex items-center gap-2 mb-2"><span className="w-4 h-1 bg-cyan-400 rounded"></span> Vùng EEZ (ví dụ)</div>
        </div>

        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  )
}
