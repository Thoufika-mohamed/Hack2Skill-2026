import React, { useEffect, useState, useMemo, useRef } from "react"
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMap
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import CitizenMapCard from "./CitizenMapCard"
import OfficialAIInsightPanel from "./OfficialAIInsightPanel"
import MapFilterToolbar from "./MapFilterToolbar"

// Ensure window.L is set for plugins
if (typeof window !== "undefined") {
  window.L = L
}

// Dynamically load leaflet.heat if available in browser
let heatPluginLoaded = false
if (typeof window !== "undefined") {
  try {
    import("leaflet.heat")
      .then(() => {
        heatPluginLoaded = true
      })
      .catch((e) => {
        console.warn("Notice: leaflet.heat dynamic load:", e.message)
      })
  } catch (err) {
    // Ignore in non-browser context
  }
}

// Tile Layer Configurations (OpenStreetMap-based)
const TILE_LAYERS = {
  dark: {
    name: "Dark OSM",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  },
  standard: {
    name: "Standard OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19
  }
}

// AeroShield 4 Risk Categories Palette
const RISK_CONFIG = {
  LOW: {
    color: "#22c55e",
    stroke: "#22c55e",
    fillColor: "#22c55e",
    icon: "🟢",
    label: "Low",
    fillOpacity: 0.22,
    radius: 700
  },
  MODERATE: {
    color: "#eab308",
    stroke: "#eab308",
    fillColor: "#eab308",
    icon: "🟡",
    label: "Moderate",
    fillOpacity: 0.28,
    radius: 900
  },
  HIGH: {
    color: "#f97316",
    stroke: "#f97316",
    fillColor: "#f97316",
    icon: "🟠",
    label: "High",
    fillOpacity: 0.32,
    radius: 1100
  },
  CRITICAL: {
    color: "#ef4444",
    stroke: "#ef4444",
    fillColor: "#ef4444",
    icon: "🔴",
    label: "Critical",
    fillOpacity: 0.38,
    radius: 1350
  }
}

// Helper component to center map dynamically
function MapCenterController({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true })
    }
  }, [center, map])
  return null
}

// Helper component to handle container resize properly
function MapResizeController() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 250)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

// Heatmap Overlay Component using leaflet.heat or Canvas
function HeatmapOverlay({ points, showHeatmap }) {
  const map = useMap()
  const heatLayerRef = useRef(null)

  useEffect(() => {
    if (!map) return

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (!showHeatmap || !points || points.length === 0) return

    try {
      if (typeof window !== "undefined" && window.L && typeof window.L.heatLayer === "function") {
        const heatData = points.map((p) => [
          p.latitude,
          p.longitude,
          Math.min(5.0, Math.max(0.5, p.weight || 1.0))
        ])

        const heatLayer = window.L.heatLayer(heatData, {
          radius: 38,
          blur: 22,
          maxZoom: 16,
          max: 5.0,
          gradient: {
            0.15: "#22c55e", // 🟢 Low (Green)
            0.45: "#eab308", // 🟡 Moderate (Yellow)
            0.7: "#f97316",  // 🟠 High (Orange)
            1.0: "#ef4444"   // 🔴 Critical (Red)
          }
        })

        heatLayer.addTo(map)
        heatLayerRef.current = heatLayer
      }
    } catch (err) {
      console.warn("Notice: Heatmap layer rendering:", err.message)
    }

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
    }
  }, [map, points, showHeatmap])

  return null
}

// Create custom SVG Leaflet Marker Icon
function createRiskMarkerIcon(risk) {
  const config = RISK_CONFIG[risk?.toUpperCase()] || RISK_CONFIG.LOW
  const isCritical = risk === "CRITICAL"
  const isHigh = risk === "HIGH"

  const html = `
    <div style="position: relative; width: 34px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      ${(isCritical || isHigh) ? `
        <div style="position: absolute; top: 0; left: -3px; width: 40px; height: 40px; border-radius: 50%; background: ${config.color}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      ` : ""}
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.7));">
        <path d="M17 0 C7.6 0 0 7.6 0 17 C0 29.8 17 42 17 42 C17 42 34 29.8 34 17 C34 7.6 26.4 0 17 0 Z"
              fill="#0d1726" stroke="${config.color}" stroke-width="2.5"/>
        <circle cx="17" cy="16" r="9" fill="${config.color}" />
        <circle cx="17" cy="16" r="3.5" fill="#ffffff" />
      </svg>
    </div>
  `

  return L.divIcon({
    html: html,
    className: "aeroshield-custom-marker",
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38]
  })
}

// Create custom "You are here" user marker
function createUserMarkerIcon() {
  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(32, 224, 192, 0.3); border: 2px solid #20e0c0; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: #20e0c0; border: 3px solid #08121f; box-shadow: 0 0 12px #20e0c0; z-index: 2;"></div>
    </div>
  `

  return L.divIcon({
    html: html,
    className: "aeroshield-user-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })
}

export default function PollutionLeafletMap({
  variant = "public", // "public" or "official"
  zones = [],
  heatmapPoints = [],
  onReportClick,
  onUpdateStatus,
  height = "540px"
}) {
  const [userLocation, setUserLocation] = useState(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [activeTileStyle, setActiveTileStyle] = useState("dark") // "dark" or "standard"

  // Official view filters
  const [selectedRisk, setSelectedRisk] = useState("ALL")
  const [selectedTimeRange, setSelectedTimeRange] = useState("all")
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showHeatmap, setShowHeatmap] = useState(true)

  // Default coordinate center (Coimbatore environmental basin)
  const defaultCenter = { lat: 11.0168, lng: 76.9558 }

  // 1. Geolocation detection
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationDenied(false)
      },
      (error) => {
        console.warn("Geolocation denied or unavailable:", error.message)
        setLocationDenied(true)
      },
      { timeout: 8000 }
    )
  }, [])

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      // Risk filter
      if (selectedRisk !== "ALL" && z.risk?.toUpperCase() !== selectedRisk) {
        return false
      }
      // Classification filter
      if (selectedClassification !== "all" && z.classification !== selectedClassification) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const loc = (z.location || "").toLowerCase()
        const pt = (z.pollution_type || "").toLowerCase()
        if (!loc.includes(q) && !pt.includes(q)) {
          return false
        }
      }
      return true
    })
  }, [zones, selectedRisk, selectedClassification, searchQuery])

  // Center coordinate
  const currentCenter = userLocation || defaultCenter

  // Active tile layer definition
  const currentTile = TILE_LAYERS[activeTileStyle] || TILE_LAYERS.dark

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[#1e3445] bg-[#08121f] shadow-2xl">
      {/* Official Toolbar */}
      {variant === "official" && (
        <div className="p-4 border-b border-[#1e3445] bg-[#0a1421]">
          <MapFilterToolbar
            selectedRisk={selectedRisk}
            onSelectRisk={setSelectedRisk}
            selectedTimeRange={selectedTimeRange}
            onSelectTimeRange={setSelectedTimeRange}
            selectedClassification={selectedClassification}
            onSelectClassification={setSelectedClassification}
            showHeatmap={showHeatmap}
            onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      {/* Location Denied Banner */}
      {locationDenied && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between rounded-xl border border-yellow-500/30 bg-[#0d1726]/95 px-4 py-2.5 text-xs text-yellow-300 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Location access is unavailable. Showing pollution zones in the selected area.</span>
          </div>
          <button
            onClick={() => setLocationDenied(false)}
            className="text-yellow-400 hover:text-white ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Map Legend */}
      <div className="absolute top-4 left-4 z-[990] flex items-center gap-3 rounded-xl border border-[#1e3445] bg-[#0d1726]/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
        <span className="text-[11px] text-[#64748b] uppercase tracking-wider">Risk:</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span>🟢</span> Low
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400">
          <span>🟡</span> Moderate
        </div>
        <div className="flex items-center gap-1.5 text-orange-400">
          <span>🟠</span> High
        </div>
        <div className="flex items-center gap-1.5 text-red-400">
          <span>🔴</span> Critical
        </div>
      </div>

      {/* Tile Style Toggle (Dark OSM vs Standard OSM) */}
      <div className="absolute bottom-4 right-4 z-[990] flex items-center rounded-xl border border-[#1e3445] bg-[#0d1726]/90 p-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md">
        <button
          onClick={() => setActiveTileStyle("dark")}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeTileStyle === "dark"
              ? "bg-[#1e3445] text-[#20e0c0]"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          Dark OSM
        </button>
        <button
          onClick={() => setActiveTileStyle("standard")}
          className={`px-2.5 py-1 rounded-lg transition ${
            activeTileStyle === "standard"
              ? "bg-[#1e3445] text-[#20e0c0]"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          Standard OSM
        </button>
      </div>

      {/* Citizen "Report Pollution" Fast Action Button */}
      {variant === "public" && onReportClick && (
        <button
          onClick={onReportClick}
          className="absolute top-4 right-4 z-[990] flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00bfa6] to-[#20e0c0] px-4 py-2.5 text-xs font-bold text-[#06101e] shadow-lg shadow-[#00bfa6]/25 hover:brightness-110 active:scale-95 transition"
        >
          <span>📢</span>
          <span>Report Pollution</span>
        </button>
      )}

      {/* Leaflet + OpenStreetMap Map Container */}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={[currentCenter.lat, currentCenter.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", background: "#08121f" }}
          attributionControl={true}
        >
          <MapCenterController center={currentCenter} />
          <MapResizeController />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            key={activeTileStyle}
            url={currentTile.url}
            attribution={currentTile.attribution}
            subdomains={currentTile.subdomains}
            maxZoom={currentTile.maxZoom}
          />

          {/* Heatmap Layer */}
          <HeatmapOverlay
            points={heatmapPoints}
            showHeatmap={showHeatmap}
          />

          {/* 4 AeroShield Risk Category Overlays (Circles) */}
          {filteredZones.map((zone) => {
            const config = RISK_CONFIG[zone.risk?.toUpperCase()] || RISK_CONFIG.LOW
            const lat = Number(zone.latitude)
            const lng = Number(zone.longitude)

            return (
              <Circle
                key={`circle-${zone.id}`}
                center={[lat, lng]}
                radius={config.radius}
                pathOptions={{
                  color: config.stroke,
                  fillColor: config.fillColor,
                  fillOpacity: config.fillOpacity,
                  weight: 2
                }}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              />
            )
          })}

          {/* Incident Markers */}
          {filteredZones.map((zone) => {
            const lat = Number(zone.latitude)
            const lng = Number(zone.longitude)
            const markerIcon = createRiskMarkerIcon(zone.risk)

            return (
              <Marker
                key={`marker-${zone.id}`}
                position={[lat, lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              />
            )
          })}

          {/* "You are here" User Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserMarkerIcon()}
            />
          )}
        </MapContainer>
      </div>

      {/* Public Safe Citizen Info Card */}
      {variant === "public" && selectedZone && (
        <CitizenMapCard
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          onReportClick={onReportClick}
        />
      )}

      {/* Official AI Insight Panel */}
      {variant === "official" && selectedZone && (
        <OfficialAIInsightPanel
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          onUpdateStatus={(zoneId, newStatus) => {
            if (onUpdateStatus) {
              onUpdateStatus(zoneId, newStatus)
            }
            setSelectedZone((prev) => (prev ? { ...prev, status: newStatus } : null))
          }}
        />
      )}
    </div>
  )
}
