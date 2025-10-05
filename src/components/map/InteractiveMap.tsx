import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AQILocation {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25?: number;
  pm10?: number;
}

interface InteractiveMapProps {
  onLocationSelect?: (location: AQILocation) => void;
}

export const calculateAQI = (pm25?: number, pm10?: number): number => {
  if (!pm25 && !pm10) return 0;
  
  if (pm25) {
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  }
  return 50;
};

const getAQIStatus = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
};

// Helper function to check if dark mode is enabled
const isDarkMode = () => document.documentElement.classList.contains('dark');

const InteractiveMap = ({ onLocationSelect }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const markers = useRef<Map<string, L.Marker>>(new Map());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<AQILocation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (onLocationSelect && nearbyLocations.length > 0) {
      (window as any).selectMapLocation = (locationName: string) => {
        const location = nearbyLocations.find(loc => loc.name === locationName);
        if (location && map.current) {
          map.current.setView([location.lat, location.lng], 15, { animate: true, duration: 1 });
          const marker = markers.current.get(locationName);
          if (marker) {
            marker.openPopup();
          }
        }
      };
    }
  }, [nearbyLocations, onLocationSelect]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          setUserLocation({ lat: userLat, lng: userLng });

          const generateNearbyLocations = (lat: number, lng: number): AQILocation[] => {
            const types = ["City Center", "Industrial Area", "Residential District", "Park Zone", "Commercial Hub", "Suburban Area", "Highway Junction", "School District", "Hospital Area"];
            const locations: AQILocation[] = [];
            for (let i = 0; i < 8; i++) {
              const offsetLat = (Math.random() - 0.5) * 0.1;
              const offsetLng = (Math.random() - 0.5) * 0.1;
              const pm25 = Math.random() * 80 + 10;
              const pm10 = pm25 * (1.5 + Math.random() * 0.5);
              locations.push({ name: types[i % types.length] + ` ${i + 1}`, lat: lat + offsetLat, lng: lng + offsetLng, aqi: calculateAQI(pm25, pm10), pm25, pm10 });
            }
            return locations.sort((a, b) => a.aqi - b.aqi);
          };

          try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`https://api.openaq.org/v2/latest?limit=10&radius=25000&coordinates=${userLat},${userLng}&order_by=distance`, { signal: controller.signal, mode: 'cors' });
            
            if (!response.ok) throw new Error('API response not ok');
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const locations: AQILocation[] = data.results.map((r: any) => ({
                name: r.location,
                lat: r.coordinates.latitude,
                lng: r.coordinates.longitude,
                aqi: calculateAQI(r.measurements?.find((m: any) => m.parameter === 'pm25')?.value, r.measurements?.find((m: any) => m.parameter === 'pm10')?.value),
                pm25: r.measurements?.find((m: any) => m.parameter === 'pm25')?.value,
                pm10: r.measurements?.find((m: any) => m.parameter === 'pm10')?.value,
              })).filter((l: AQILocation) => l.aqi > 0);
              
              if (locations.length > 0) {
                setNearbyLocations(locations);
                toast({ title: "Live AQI Data Loaded", description: `${locations.length} real monitoring stations found` });
                return;
              }
            }
            throw new Error('No results from API');
          } catch (error) {
            console.log("Using simulated AQI data (API unavailable):", error);
            const generated = generateNearbyLocations(userLat, userLng);
            setNearbyLocations(generated);
            toast({ title: "Simulated AQI Data", description: `Showing ${generated.length} monitoring points near you` });
          }
        },
        () => {
          toast({ title: "Location Access Denied", description: "Using default location. Please enable location permissions.", variant: "destructive" });
          setUserLocation({ lat: 40.7589, lng: -73.9851 });
        }
      );
    } else {
      toast({ title: "Geolocation Not Supported", description: "Your browser doesn\'t support geolocation", variant: "destructive" });
      setUserLocation({ lat: 40.7589, lng: -73.9851 });
    }
  }, [toast]);

  useEffect(() => {
    if (!mapContainer.current || map.current || !userLocation) return;

    map.current = L.map(mapContainer.current, { zoomControl: false }).setView([userLocation.lat, userLocation.lng], 13);
    
    const updateTileLayer = () => {
        const dark = isDarkMode();
        const tileUrl = dark 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        const attribution = dark
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            
        L.tileLayer(tileUrl, { attribution, maxZoom: 19, subdomains: 'abcd' }).addTo(map.current as L.Map);
    };

    updateTileLayer();

    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `<div class="p-1" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; border: 4px solid hsl(var(--card)); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);"><div style="width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 2s ease-in-out infinite;"></div></div><style>@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}</style>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    userMarker.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map.current)
      .bindPopup(`<div class="themed-popup"><strong>Your Location</strong><br/><span style="color: #3b82f6;">📍 Current Position</span></div>`);

    nearbyLocations.forEach((location) => {
      if (!map.current) return;
      
      const colors:  Record<string, {bg: string, text: string}> = {
          good: { bg: 'hsl(var(--aqi-good))', text: 'hsl(var(--earth-brown))' },
          moderate: { bg: 'hsl(var(--aqi-moderate))', text: 'hsl(var(--earth-brown))' },
          unhealthy: { bg: 'hsl(var(--aqi-unhealthy))', text: 'white' },
          hazardous: { bg: 'hsl(var(--aqi-hazardous))', text: 'white' },
      };

      const level = location.aqi <= 50 ? 'good' : location.aqi <= 100 ? 'moderate' : location.aqi <= 150 ? 'unhealthy' : 'hazardous';
      const { bg, text } = colors[level] || colors.hazardous;

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${bg}; color: ${text}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid hsl(var(--card)); box-shadow: 0 2px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${location.aqi}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map.current);
      markers.current.set(location.name, marker);

      marker.bindPopup(`<div class="themed-popup"><strong>${location.name}</strong><br/><span style="color: ${bg}; font-weight: bold; font-size: 1.1rem;">AQI: ${location.aqi}</span><br/><span class="text-muted-foreground">${getAQIStatus(location.aqi)}</span>${location.pm25 ? `<br/><span class="text-xs text-muted-foreground/80">PM2.5: ${location.pm25.toFixed(1)} µg/m³</span>` : ''}${location.pm10 ? `<br/><span class="text-xs text-muted-foreground/80">PM10: ${location.pm10.toFixed(1)} µg/m³</span>` : ''}<br/><br/><span class="text-xs text-muted-foreground/60">📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</span></div>`);
    });

    const Legend = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `<div class="themed-legend"><h4>AQI Levels</h4><div class="legend-item"><i style="background:hsl(var(--aqi-good))"></i> Good (0-50)</div><div class="legend-item"><i style="background:hsl(var(--aqi-moderate))"></i> Moderate (51-100)</div><div class="legend-item"><i style="background:hsl(var(--aqi-unhealthy))"></i> Unhealthy (101+)</div></div>`;
        return div;
      },
      options: { position: "bottomright" }
    });
    
    new Legend().addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation, nearbyLocations]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <style>{`
        .themed-popup .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 0.75rem;
          box-shadow: 0 4px 16px hsl(0 0% 0% / 0.12);
        }
        .themed-popup .leaflet-popup-tip {
            background: hsl(var(--card));
        }
        .themed-legend {
          padding: 12px;
          background: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .themed-legend h4 {
          margin: 0 0 8px 0;
          font-weight: bold;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        .themed-legend i {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-right: 8px;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
};

export default InteractiveMap;
