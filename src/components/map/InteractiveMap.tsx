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

interface DeviceLocation {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  status: string;
}

const devices: DeviceLocation[] = [
  { name: "City Park", lat: 40.7829, lng: -73.9654, aqi: 45, status: "Good" },
  { name: "Main Street", lat: 40.7589, lng: -73.9851, aqi: 62, status: "Moderate" },
  { name: "Shopping Mall", lat: 40.7489, lng: -73.9680, aqi: 38, status: "Good" },
];

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Found",
            description: "Map centered on your current location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Access Denied",
            description: "Using default location. Please enable location permissions.",
            variant: "destructive",
          });
          // Fallback to default location (New York)
          setUserLocation({ lat: 40.7589, lng: -73.9851 });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setUserLocation({ lat: 40.7589, lng: -73.9851 });
    }
  }, [toast]);

  useEffect(() => {
    if (!mapContainer.current || map.current || !userLocation) return;

    // Initialize map centered on user's location
    map.current = L.map(mapContainer.current).setView([userLocation.lat, userLocation.lng], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add user location marker
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `
        <div style="
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
        </style>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    userMarker.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map.current)
      .bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong style="font-size: 14px;">Your Location</strong><br/>
          <span style="color: #3b82f6; font-size: 12px;">📍 Current Position</span>
        </div>
      `);

    // Add device markers (nearby)
    devices.forEach((device) => {
      if (!map.current) return;

      // Create custom icon based on AQI
      const markerColor = device.aqi <= 50 ? "#22c55e" : device.aqi <= 100 ? "#eab308" : "#ef4444";
      
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${markerColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
          ">
            ${device.aqi}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([device.lat, device.lng], { icon: customIcon }).addTo(map.current);

      // Add popup with device info
      marker.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong style="font-size: 14px;">${device.name}</strong><br/>
          <span style="color: ${markerColor}; font-weight: bold; font-size: 16px;">AQI: ${device.aqi}</span><br/>
          <span style="color: #666; font-size: 12px;">${device.status}</span>
        </div>
      `);
    });

    // Add legend
    const Legend = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `
          <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
            <h4 style="margin: 0 0 8px 0; font-weight: bold;">AQI Levels</h4>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; margin-right: 8px;"></div>
              <span style="font-size: 12px;">Good (0-50)</span>
            </div>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 20px; height: 20px; background: #eab308; border-radius: 50%; margin-right: 8px;"></div>
              <span style="font-size: 12px;">Moderate (51-100)</span>
            </div>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></div>
              <span style="font-size: 12px;">Unhealthy (101+)</span>
            </div>
          </div>
        `;
        return div;
      },
      options: { position: "bottomright" }
    });
    
    new Legend().addTo(map.current);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default InteractiveMap;
