/**
 * State-level pollution data for all Indian states.
 * Used by both NGO Dashboard (single state) and Admin Dashboard (all states).
 */

export interface StatePollutionData {
  state: string;
  code: string;
  aqi: number;
  pm25: number;
  pm10: number;
  co2: number;
  so2: number;
  no2: number;
  o3: number;
  status: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  majorSources: string[];
  population: string;
  affectedPopulation: string;
  trend: "improving" | "worsening" | "stable";
  lastUpdated: string;
  lat: number;
  lng: number;
}

export const indianStates: StatePollutionData[] = [
  { state: "Andhra Pradesh", code: "AP", aqi: 72, pm25: 28, pm10: 55, co2: 420, so2: 6, no2: 18, o3: 35, status: "Moderate", majorSources: ["Vehicle Emissions", "Industrial Activity", "Construction Dust"], population: "5.3 Cr", affectedPopulation: "1.8 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 15.9129, lng: 79.74 },
  { state: "Arunachal Pradesh", code: "AR", aqi: 32, pm25: 10, pm10: 22, co2: 340, so2: 2, no2: 6, o3: 28, status: "Good", majorSources: ["Forest Fires", "Vehicular Emissions"], population: "16 L", affectedPopulation: "1.2 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 28.218, lng: 94.7278 },
  { state: "Assam", code: "AS", aqi: 68, pm25: 32, pm10: 48, co2: 390, so2: 5, no2: 15, o3: 32, status: "Moderate", majorSources: ["Brick Kilns", "Biomass Burning", "Vehicle Emissions"], population: "3.5 Cr", affectedPopulation: "1.4 Cr", trend: "worsening", lastUpdated: new Date().toISOString(), lat: 26.2006, lng: 92.9376 },
  { state: "Bihar", code: "BR", aqi: 145, pm25: 72, pm10: 120, co2: 510, so2: 12, no2: 35, o3: 45, status: "Unhealthy", majorSources: ["Crop Burning", "Industrial Pollution", "Brick Kilns", "Vehicle Emissions"], population: "12.4 Cr", affectedPopulation: "8.5 Cr", trend: "worsening", lastUpdated: new Date().toISOString(), lat: 25.0961, lng: 85.3131 },
  { state: "Chhattisgarh", code: "CG", aqi: 95, pm25: 45, pm10: 78, co2: 460, so2: 10, no2: 22, o3: 38, status: "Moderate", majorSources: ["Coal Mining", "Steel Plants", "Thermal Power"], population: "2.9 Cr", affectedPopulation: "1.5 Cr", trend: "stable", lastUpdated: new Date().toISOString(), lat: 21.2787, lng: 81.8661 },
  { state: "Delhi", code: "DL", aqi: 185, pm25: 95, pm10: 165, co2: 580, so2: 18, no2: 55, o3: 52, status: "Very Unhealthy", majorSources: ["Vehicle Emissions", "Construction", "Industrial", "Crop Burning", "Dust"], population: "2.1 Cr", affectedPopulation: "2.0 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 28.7041, lng: 77.1025 },
  { state: "Goa", code: "GA", aqi: 42, pm25: 15, pm10: 30, co2: 360, so2: 3, no2: 10, o3: 30, status: "Good", majorSources: ["Mining", "Tourism Vehicles", "Port Activities"], population: "15.5 L", affectedPopulation: "2.1 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 15.2993, lng: 74.124 },
  { state: "Gujarat", code: "GJ", aqi: 110, pm25: 55, pm10: 90, co2: 490, so2: 14, no2: 28, o3: 40, status: "Unhealthy", majorSources: ["Industrial Clusters", "Refineries", "Thermal Power", "Vehicle Emissions"], population: "6.4 Cr", affectedPopulation: "3.8 Cr", trend: "stable", lastUpdated: new Date().toISOString(), lat: 22.2587, lng: 71.1924 },
  { state: "Haryana", code: "HR", aqi: 155, pm25: 78, pm10: 135, co2: 520, so2: 13, no2: 40, o3: 48, status: "Unhealthy", majorSources: ["Crop Stubble Burning", "Industrial", "Vehicle Emissions", "Brick Kilns"], population: "2.8 Cr", affectedPopulation: "2.1 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 29.0588, lng: 76.0856 },
  { state: "Himachal Pradesh", code: "HP", aqi: 45, pm25: 18, pm10: 32, co2: 350, so2: 3, no2: 8, o3: 30, status: "Good", majorSources: ["Vehicle Emissions", "Forest Fires", "Construction"], population: "73 L", affectedPopulation: "8 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 31.1048, lng: 77.1734 },
  { state: "Jharkhand", code: "JH", aqi: 120, pm25: 60, pm10: 98, co2: 480, so2: 11, no2: 30, o3: 42, status: "Unhealthy", majorSources: ["Mining", "Coal Power Plants", "Industrial", "Vehicle Emissions"], population: "3.9 Cr", affectedPopulation: "2.5 Cr", trend: "worsening", lastUpdated: new Date().toISOString(), lat: 23.6102, lng: 85.2799 },
  { state: "Karnataka", code: "KA", aqi: 65, pm25: 25, pm10: 48, co2: 410, so2: 5, no2: 16, o3: 34, status: "Moderate", majorSources: ["Vehicle Emissions", "Construction", "Industrial"], population: "6.7 Cr", affectedPopulation: "2.2 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 15.3173, lng: 75.7139 },
  { state: "Kerala", code: "KL", aqi: 48, pm25: 18, pm10: 35, co2: 370, so2: 4, no2: 12, o3: 32, status: "Good", majorSources: ["Vehicle Emissions", "Waste Burning", "Construction"], population: "3.5 Cr", affectedPopulation: "0.6 Cr", trend: "stable", lastUpdated: new Date().toISOString(), lat: 10.8505, lng: 76.2711 },
  { state: "Madhya Pradesh", code: "MP", aqi: 98, pm25: 48, pm10: 82, co2: 450, so2: 9, no2: 24, o3: 38, status: "Moderate", majorSources: ["Industrial", "Vehicle Emissions", "Coal Mining", "Construction"], population: "8.5 Cr", affectedPopulation: "4.2 Cr", trend: "stable", lastUpdated: new Date().toISOString(), lat: 22.9734, lng: 78.6569 },
  { state: "Maharashtra", code: "MH", aqi: 88, pm25: 42, pm10: 72, co2: 440, so2: 8, no2: 22, o3: 36, status: "Moderate", majorSources: ["Vehicle Emissions", "Industrial", "Construction Dust", "Power Plants"], population: "12.5 Cr", affectedPopulation: "5.8 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 19.7515, lng: 75.7139 },
  { state: "Manipur", code: "MN", aqi: 38, pm25: 12, pm10: 25, co2: 345, so2: 2, no2: 7, o3: 28, status: "Good", majorSources: ["Forest Fires", "Vehicle Emissions", "Biomass Burning"], population: "30 L", affectedPopulation: "2 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 24.6637, lng: 93.9063 },
  { state: "Meghalaya", code: "ML", aqi: 35, pm25: 11, pm10: 24, co2: 342, so2: 2, no2: 6, o3: 27, status: "Good", majorSources: ["Mining", "Vehicle Emissions", "Forest Fires"], population: "33 L", affectedPopulation: "1.5 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 25.467, lng: 91.3662 },
  { state: "Mizoram", code: "MZ", aqi: 30, pm25: 9, pm10: 20, co2: 335, so2: 1, no2: 5, o3: 25, status: "Good", majorSources: ["Slash & Burn Agriculture", "Vehicle Emissions"], population: "12 L", affectedPopulation: "0.5 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 23.1645, lng: 92.9376 },
  { state: "Nagaland", code: "NL", aqi: 34, pm25: 11, pm10: 23, co2: 340, so2: 2, no2: 6, o3: 27, status: "Good", majorSources: ["Biomass Burning", "Vehicle Emissions", "Forest Fires"], population: "22 L", affectedPopulation: "1 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 26.1584, lng: 94.5624 },
  { state: "Odisha", code: "OD", aqi: 85, pm25: 40, pm10: 68, co2: 430, so2: 8, no2: 20, o3: 36, status: "Moderate", majorSources: ["Mining", "Steel Plants", "Thermal Power", "Vehicle Emissions"], population: "4.6 Cr", affectedPopulation: "2.3 Cr", trend: "stable", lastUpdated: new Date().toISOString(), lat: 20.9517, lng: 85.0985 },
  { state: "Punjab", code: "PB", aqi: 160, pm25: 82, pm10: 140, co2: 530, so2: 14, no2: 42, o3: 50, status: "Unhealthy", majorSources: ["Crop Stubble Burning", "Industrial", "Vehicle Emissions", "Brick Kilns"], population: "3.1 Cr", affectedPopulation: "2.4 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 31.1471, lng: 75.3412 },
  { state: "Rajasthan", code: "RJ", aqi: 130, pm25: 65, pm10: 110, co2: 470, so2: 10, no2: 28, o3: 42, status: "Unhealthy", majorSources: ["Desert Dust", "Industrial", "Mining", "Vehicle Emissions"], population: "7.9 Cr", affectedPopulation: "5.2 Cr", trend: "worsening", lastUpdated: new Date().toISOString(), lat: 27.0238, lng: 74.2179 },
  { state: "Sikkim", code: "SK", aqi: 28, pm25: 8, pm10: 18, co2: 330, so2: 1, no2: 4, o3: 24, status: "Good", majorSources: ["Vehicle Emissions", "Construction"], population: "6.8 L", affectedPopulation: "0.3 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 27.533, lng: 88.5122 },
  { state: "Tamil Nadu", code: "TN", aqi: 78, pm25: 35, pm10: 58, co2: 420, so2: 7, no2: 18, o3: 35, status: "Moderate", majorSources: ["Vehicle Emissions", "Industrial", "Power Plants", "Construction"], population: "7.7 Cr", affectedPopulation: "3.2 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 11.1271, lng: 78.6569 },
  { state: "Telangana", code: "TS", aqi: 80, pm25: 38, pm10: 62, co2: 425, so2: 7, no2: 19, o3: 36, status: "Moderate", majorSources: ["Vehicle Emissions", "Construction", "Industrial"], population: "3.9 Cr", affectedPopulation: "1.6 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 18.1124, lng: 79.0193 },
  { state: "Tripura", code: "TR", aqi: 52, pm25: 22, pm10: 38, co2: 380, so2: 4, no2: 10, o3: 30, status: "Moderate", majorSources: ["Brick Kilns", "Vehicle Emissions", "Biomass Burning"], population: "41 L", affectedPopulation: "8 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 23.9408, lng: 91.9882 },
  { state: "Uttar Pradesh", code: "UP", aqi: 170, pm25: 88, pm10: 150, co2: 540, so2: 15, no2: 45, o3: 52, status: "Unhealthy", majorSources: ["Crop Burning", "Industrial", "Vehicle Emissions", "Brick Kilns", "Power Plants"], population: "23.5 Cr", affectedPopulation: "18 Cr", trend: "improving", lastUpdated: new Date().toISOString(), lat: 26.8467, lng: 80.9462 },
  { state: "Uttarakhand", code: "UK", aqi: 62, pm25: 24, pm10: 45, co2: 400, so2: 4, no2: 14, o3: 33, status: "Moderate", majorSources: ["Forest Fires", "Vehicle Emissions", "Industrial"], population: "1.1 Cr", affectedPopulation: "3.5 L", trend: "stable", lastUpdated: new Date().toISOString(), lat: 30.0668, lng: 79.0193 },
  { state: "West Bengal", code: "WB", aqi: 105, pm25: 52, pm10: 88, co2: 470, so2: 9, no2: 26, o3: 40, status: "Unhealthy", majorSources: ["Industrial", "Vehicle Emissions", "Brick Kilns", "Thermal Power"], population: "10.0 Cr", affectedPopulation: "5.8 Cr", trend: "worsening", lastUpdated: new Date().toISOString(), lat: 22.9868, lng: 87.855 },
];

/** Credentials for NGO logins — each NGO is mapped to a specific state */
export interface NGOCredentials {
  username: string;
  password: string;
  ngoName: string;
  state: string;
}

export const ngoCredentialsList: NGOCredentials[] = [
  { username: "ngo_delhi", password: "ngo@123", ngoName: "Clean Air Foundation", state: "Delhi" },
  { username: "ngo_mumbai", password: "ngo@123", ngoName: "Maharashtra Green Initiative", state: "Maharashtra" },
  { username: "ngo_up", password: "ngo@123", ngoName: "UP Environment Trust", state: "Uttar Pradesh" },
  { username: "ngo_punjab", password: "ngo@123", ngoName: "Punjab Clean Air Society", state: "Punjab" },
  { username: "ngo_tn", password: "ngo@123", ngoName: "TN Eco Foundation", state: "Tamil Nadu" },
  { username: "ngo_karnataka", password: "ngo@123", ngoName: "Karnataka Green Council", state: "Karnataka" },
  { username: "ngo_wb", password: "ngo@123", ngoName: "Bengal Environment Watch", state: "West Bengal" },
  { username: "ngo_rajasthan", password: "ngo@123", ngoName: "Rajasthan Air Quality Forum", state: "Rajasthan" },
  { username: "ngo_bihar", password: "ngo@123", ngoName: "Bihar Pollution Control NGO", state: "Bihar" },
  { username: "ngo_gujarat", password: "ngo@123", ngoName: "Gujarat Green Warriors", state: "Gujarat" },
];

export function getStateByName(name: string): StatePollutionData | undefined {
  return indianStates.find(s => s.state === name);
}

export function getAqiStatus(aqi: number): StatePollutionData["status"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy";
  if (aqi <= 200) return "Very Unhealthy";
  return "Hazardous";
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "hsl(152, 56%, 40%)";
  if (aqi <= 100) return "hsl(42, 90%, 50%)";
  if (aqi <= 150) return "hsl(25, 95%, 53%)";
  if (aqi <= 200) return "hsl(12, 85%, 50%)";
  return "hsl(355, 75%, 50%)";
}

export function getAqiTextClass(aqi: number): string {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 150) return "text-aqi-unhealthy";
  if (aqi <= 200) return "text-aqi-hazardous";
  return "text-destructive";
}

export function getAqiBgClass(aqi: number): string {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 150) return "bg-aqi-unhealthy";
  if (aqi <= 200) return "bg-aqi-hazardous";
  return "bg-destructive";
}
