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

export const calculateAQI = (pm25?: number, pm10?: number): number => {
  if (!pm25 && !pm10) return 0;
  
  // Simplified AQI calculation based on PM2.5
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

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<AQILocation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          setUserLocation({
            lat: userLat,
            lng: userLng,
          });

          // Fetch real AQI data from OpenAQ API
          try {
            const response = await fetch(
              `https://api.openaq.org/v2/latest?limit=10&radius=25000&coordinates=${userLat},${userLng}&order_by=distance`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const locations: AQILocation[] = data.results.map((result: any) => {
                const pm25 = result.measurements?.find((m: any) => m.parameter === 'pm25')?.value;
                const pm10 = result.measurements?.find((m: any) => m.parameter === 'pm10')?.value;
                const aqi = calculateAQI(pm25, pm10);
                
                return {
                  name: result.location,
                  lat: result.coordinates.latitude,
                  lng: result.coordinates.longitude,
                  aqi,
                  pm25,
                  pm10,
                };
              });
              
              setNearbyLocations(locations.filter(loc => loc.aqi > 0));
              toast({
                title: "Real AQI Data Loaded",
                description: `Found ${locations.length} monitoring stations nearby`,
              });
            } else {
              toast({
                title: "No AQI Data Available",
                description: "No monitoring stations found in your area",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Error fetching AQI data:", error);
            toast({
              title: "Could Not Load AQI Data",
              description: "Failed to fetch real-time air quality data",
              variant: "destructive",
            });
          }
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

    // Add real AQI location markers
    nearbyLocations.forEach((location) => {
      if (!map.current) return;

      // Create custom icon based on AQI
      const markerColor = location.aqi <= 50 ? "#22c55e" : location.aqi <= 100 ? "#eab308" : location.aqi <= 150 ? "#f97316" : "#ef4444";
      const status = getAQIStatus(location.aqi);
      
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 11px;
          ">
            ${location.aqi}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map.current);

      // Add popup with detailed info
      marker.bindPopup(`
        <div style="text-align: center; padding: 6px; min-width: 180px;">
          <strong style="font-size: 14px;">${location.name}</strong><br/>
          <span style="color: ${markerColor}; font-weight: bold; font-size: 18px;">AQI: ${location.aqi}</span><br/>
          <span style="color: #666; font-size: 12px; font-weight: 500;">${status}</span>
          ${location.pm25 ? `<br/><span style="font-size: 11px; color: #888;">PM2.5: ${location.pm25.toFixed(1)} µg/m³</span>` : ''}
          ${location.pm10 ? `<br/><span style="font-size: 11px; color: #888;">PM10: ${location.pm10.toFixed(1)} µg/m³</span>` : ''}
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
  }, [userLocation, nearbyLocations]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default InteractiveMap;
