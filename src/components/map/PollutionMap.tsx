/**
 * PollutionMap — Leaflet map component (modelled after CURA's DiseaseMap)
 * Renders India map with GeoJSON state boundaries, pollution hotspot markers,
 * state click behaviour, NGO/Admin access restrictions, and a live badge.
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAqiColor } from "@/lib/statePollutionData";
import { toast } from "sonner";

/* ─── Types ─── */
export interface PollutionPoint {
  id: string;
  lat: number;
  lng: number;
  aqi: number;
  pollutant: string;
  severity: "Good" | "Moderate" | "Unhealthy";
  label: string;
  state: string;
  street?: string;
  description?: string;
  cases?: number;
}

interface PollutionMapProps {
  data: PollutionPoint[];
  selectedPollutant: string | null;
  selectedSeverity: string | null;
  onSelectPoint?: (point: PollutionPoint) => void;
  onStateClick?: (stateName: string) => void;
  userState?: string;   // NGO user's registered state
  isPremium?: boolean;  // Premium = access all states
}

/* ─── Marker sizing by severity ─── */
const severitySize: Record<string, number> = {
  Good: 14,
  Moderate: 20,
  Unhealthy: 30,
};

/* ─── India bounds ─── */
const indiaBounds = L.latLngBounds(L.latLng(6.5, 68.0), L.latLng(35.5, 97.5));

/* ─── Create modern pin marker ─── */
const createMarkerIcon = (severity: string, color: string) => {
  const size = severitySize[severity] ?? 20;
  const pinHeight = size + 12;

  return L.divIcon({
    className: "custom-pollution-marker",
    iconSize: [size, pinHeight],
    iconAnchor: [size / 2, pinHeight],
    popupAnchor: [0, -pinHeight + 4],
    html: `
      <div style="position:relative;width:${size}px;height:${pinHeight}px;display:flex;flex-direction:column;align-items:center">
        <div style="
          width:${size}px;height:${size * 0.75}px;
          background:${color};
          border:2px solid rgba(255,255,255,0.95);
          border-radius:${size / 2}px ${size / 2}px ${size * 0.2}px ${size * 0.2}px;
          box-shadow:0 3px 8px rgba(0,0,0,0.3);
          cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="
            width:${size * 0.4}px;height:${size * 0.4}px;
            border-radius:50%;
            background:rgba(255,255,255,0.8);
          "></div>
        </div>
        <div style="
          width:0;height:0;
          border-left:${size * 0.35}px solid transparent;
          border-right:${size * 0.35}px solid transparent;
          border-top:${size * 0.4}px solid ${color};
          margin-top:-1px;
        "></div>
      </div>
    `,
  });
};

/* ─── Component ─── */

const PollutionMap = ({
  data,
  selectedPollutant,
  selectedSeverity,
  onSelectPoint,
  onStateClick,
  userState,
  isPremium,
}: PollutionMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const stateLayerRef = useRef<L.GeoJSON | null>(null);
  const legendRef = useRef<L.Control | null>(null);
  const geoJsonDataRef = useRef<any>(null);

  /* Filter points — also exclude restricted states for non-premium NGO users */
  const filtered = data.filter((d) => {
    if (selectedPollutant && d.pollutant !== selectedPollutant) return false;
    if (selectedSeverity && d.severity !== selectedSeverity) return false;
    // If NGO user (userState set) and not premium, only show their state's markers
    if (userState && !isPremium && d.state !== userState) return false;
    return true;
  });

  const renderStateAccess = (geojson: any) => {
    const map = mapRef.current;
    if (!map) return;

    if (stateLayerRef.current) {
      map.removeLayer(stateLayerRef.current);
      stateLayerRef.current = null;
    }

    if (legendRef.current) {
      map.removeControl(legendRef.current);
      legendRef.current = null;
    }

    const stateLayer = L.geoJSON(geojson, {
      style: (feature) => {
        const stateName =
          feature?.properties?.st_nm ||
          feature?.properties?.ST_NM ||
          feature?.properties?.name;
        const isUserState = userState && stateName === userState;
        const isRestricted = userState && !isPremium && stateName !== userState;

        return {
          color: isUserState
            ? "hsl(142,76%,36%)"
            : isRestricted
            ? "hsl(0,0%,60%)"
            : "hsl(25,95%,53%)",
          weight: isUserState ? 4 : 2.5,
          opacity: isRestricted ? 0.3 : isUserState ? 1 : 0.7,
          fillColor: isUserState
            ? "hsl(142,76%,50%)"
            : isRestricted
            ? "hsl(0,0%,60%)"
            : "hsl(25,95%,53%)",
          fillOpacity: isUserState ? 0.35 : isRestricted ? 0.02 : 0.04,
          dashArray: isRestricted ? "5, 5" : "",
        };
      },
      onEachFeature: (feature, layer) => {
        const stateName =
          feature.properties?.st_nm ||
          feature.properties?.ST_NM ||
          feature.properties?.name;
        if (!stateName) return;

        const isUserState = userState && stateName === userState;
        const isRestricted = userState && !isPremium && stateName !== userState;

        layer.on({
          click: () => {
            if (isRestricted) {
              toast.error("Access Restricted", {
                description: `Upgrade to Premium to access all states. Currently limited to ${userState} only.`,
                duration: 4000,
              });
              return;
            }
            onStateClick?.(stateName);
          },
          mouseover: (e) => {
            const hoveredLayer = e.target;
            if (isRestricted) {
              hoveredLayer.setStyle({
                fillOpacity: 0.08,
                weight: 2.5,
                color: "hsl(0,0%,50%)",
                fillColor: "hsl(0,0%,50%)",
              });
            } else {
              hoveredLayer.setStyle({
                fillOpacity: isUserState ? 0.5 : 0.25,
                weight: isUserState ? 5 : 3.5,
                color: isUserState ? "hsl(142,76%,30%)" : "hsl(25,95%,45%)",
                fillColor: isUserState ? "hsl(142,76%,55%)" : "hsl(25,95%,55%)",
              });
            }
            hoveredLayer.bringToFront();
            if (!hoveredLayer.isPopupOpen()) hoveredLayer.openTooltip();
          },
          mouseout: (e) => {
            const hoveredLayer = e.target;
            if (isRestricted) {
              hoveredLayer.setStyle({
                fillOpacity: 0.02,
                weight: 2.5,
                color: "hsl(0,0%,60%)",
                fillColor: "hsl(0,0%,60%)",
              });
            } else {
              hoveredLayer.setStyle({
                fillOpacity: isUserState ? 0.35 : 0.04,
                weight: isUserState ? 4 : 2.5,
                color: isUserState ? "hsl(142,76%,36%)" : "hsl(25,95%,53%)",
                fillColor: isUserState ? "hsl(142,76%,50%)" : "hsl(25,95%,53%)",
              });
            }
            hoveredLayer.closeTooltip();
          },
        });

        const tooltipText = isRestricted
          ? `${stateName} 🔒 Premium`
          : isUserState
          ? `${stateName} ✓ Your State`
          : stateName;
        layer.bindTooltip(tooltipText, {
          permanent: false,
          direction: "center",
          className: isRestricted
            ? "state-label-tooltip-locked"
            : isUserState
            ? "state-label-tooltip-active"
            : "state-label-tooltip",
          sticky: true,
          opacity: 1,
        });
      },
      pane: "tilePane",
    }).addTo(map);

    stateLayerRef.current = stateLayer;

    if (userState) {
      const legend = new L.Control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "map-access-legend");
        if (isPremium) {
          div.innerHTML = `
            <div style="background:rgba(255,255,255,0.98);border-radius:12px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:system-ui,sans-serif;min-width:200px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
                <span style="font-weight:800;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Map Access</span>
                <span style="margin-left:auto;font-size:9px;font-weight:700;color:#0F2854;background:linear-gradient(135deg,#BDE8F5,#e68a45);padding:2px 8px;border-radius:4px;">👑 PREMIUM</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="width:14px;height:14px;border-radius:3px;background:hsl(142,76%,45%);border:2px solid hsl(142,76%,35%);"></div>
                <span style="font-size:12px;font-weight:600;color:#0f172a;">${userState}</span>
                <span style="margin-left:auto;font-size:10px;font-weight:700;color:hsl(142,76%,40%);background:hsl(142,76%,95%);padding:2px 6px;border-radius:4px;">HOME</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:14px;height:14px;border-radius:3px;background:hsl(25,95%,53%);border:2px solid hsl(25,95%,45%);"></div>
                <span style="font-size:12px;font-weight:600;color:#0f172a;">All States</span>
                <span style="margin-left:auto;font-size:10px;font-weight:700;color:#0F2854;background:#BDE8F5;padding:2px 6px;border-radius:4px;">UNLOCKED</span>
              </div>
            </div>`;
        } else {
          div.innerHTML = `
            <div style="background:rgba(255,255,255,0.98);border-radius:12px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:system-ui,sans-serif;min-width:200px;">
              <div style="font-weight:800;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Map Access</div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="width:14px;height:14px;border-radius:3px;background:hsl(142,76%,45%);border:2px solid hsl(142,76%,35%);"></div>
                <span style="font-size:12px;font-weight:600;color:#0f172a;">${userState}</span>
                <span style="margin-left:auto;font-size:10px;font-weight:700;color:hsl(142,76%,40%);background:hsl(142,76%,95%);padding:2px 6px;border-radius:4px;">ACTIVE</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;opacity:0.6;">
                <div style="width:14px;height:14px;border-radius:3px;background:hsl(0,0%,80%);border:2px dashed hsl(0,0%,60%);"></div>
                <span style="font-size:12px;font-weight:600;color:#64748b;">Other States</span>
                <span style="margin-left:auto;font-size:9px;font-weight:700;color:#0F2854;background:#BDE8F5;padding:2px 6px;border-radius:4px;">🔒 PREMIUM</span>
              </div>
            </div>`;
        }
        return div;
      };
      legend.addTo(map);
      legendRef.current = legend;
    }
  };

  /* Initialise map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 4,
      maxZoom: 14,
      boxZoom: false,
    }).setView([22.5, 79], 5);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    /* Base tile — no labels */
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', maxZoom: 18 }
    ).addTo(map);

    /* India state boundaries (GeoJSON) */
    fetch("/india-states.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        geoJsonDataRef.current = geojson;
        renderStateAccess(geojson);
      })
      .catch(console.error);

    /* Labels layer on top */
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      { maxZoom: 18, pane: "shadowPane" }
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      if (legendRef.current) {
        map.removeControl(legendRef.current);
        legendRef.current = null;
      }
      if (stateLayerRef.current) {
        map.removeLayer(stateLayerRef.current);
        stateLayerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!geoJsonDataRef.current || !mapRef.current) return;
    renderStateAccess(geoJsonDataRef.current);
  }, [userState, isPremium, onStateClick]);

  /* Redraw markers when filter changes */
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    filtered.forEach((point) => {
      const color = getAqiColor(point.aqi);
      const icon = createMarkerIcon(point.severity, color);
      const marker = L.marker([point.lat, point.lng], { icon });

      marker.bindPopup(
        `<div style="min-width:240px;font-family:system-ui,sans-serif;padding:2px">
          <h3 style="font-weight:800;font-size:14px;margin:0 0 4px;color:#0f172a;letter-spacing:-0.3px">${point.label}</h3>
          <p style="font-size:11px;color:#94a3b8;margin:0 0 8px;font-weight:500">${point.street || point.state}</p>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
            <span style="font-size:20px;font-weight:900;color:#0f172a">${point.aqi}</span>
            <span style="font-size:10px;color:#64748b;font-weight:600">AQI</span>
            <span style="margin-left:auto;background:${color};color:#fff;padding:3px 10px;border-radius:999px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px">${point.severity}</span>
          </div>
          <p style="font-size:11px;color:#475569;margin:0;line-height:1.5">${point.description || `${point.pollutant} — ${point.severity} zone`}</p>
        </div>`,
        { className: "pollution-popup-custom", maxWidth: 280 }
      );

      marker.on("click", () => onSelectPoint?.(point));
      marker.addTo(markersRef.current!);
    });
  }, [filtered]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {/* Live badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-card/80 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-bold text-foreground tracking-wider uppercase">
            Live
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            · {filtered.length} hotspots
          </span>
        </div>
      </div>
    </div>
  );
};

export default PollutionMap;
