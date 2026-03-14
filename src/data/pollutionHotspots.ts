/**
 * pollutionHotspots.ts — Street-level pollution hotspot data across India
 * Modelled after CURA's diseaseData.ts with 100+ hotspot entries.
 */

import type { PollutionPoint } from "@/components/map/PollutionMap";

/** Severity color mapping for CSS/chart usage */
export const severityColors: Record<string, string> = {
  Good: "#22c55e",
  Moderate: "#f59e0b",
  Unhealthy: "#ef4444",
};

/** Complete hotspot dataset — 100+ entries across India */
export const pollutionHotspots: PollutionPoint[] = [
  // ── Delhi ──
  { id: "DL-01", lat: 28.6304, lng: 77.2177, aqi: 285, pollutant: "PM2.5", severity: "Unhealthy", label: "Anand Vihar", state: "Delhi", street: "Anand Vihar ISBT Road", description: "Heavy vehicular congestion near bus terminal; PM2.5 spikes during rush hours." },
  { id: "DL-02", lat: 28.6842, lng: 77.1320, aqi: 260, pollutant: "PM10", severity: "Unhealthy", label: "Rohini Sector 16", state: "Delhi", street: "Outer Ring Road, Rohini", description: "Construction activity and road dust dominate the airshed." },
  { id: "DL-03", lat: 28.5443, lng: 77.1966, aqi: 195, pollutant: "NO2", severity: "Unhealthy", label: "ITO Junction", state: "Delhi", street: "ITO Flyover, Ring Road", description: "Highest traffic density intersection; NO₂ levels critical." },
  { id: "DL-04", lat: 28.7041, lng: 77.1025, aqi: 220, pollutant: "CO2", severity: "Unhealthy", label: "Mundka Industrial", state: "Delhi", street: "Mundka Industrial Area", description: "Industrial emissions combined with vehicular traffic." },
  { id: "DL-05", lat: 28.5915, lng: 77.2507, aqi: 175, pollutant: "PM2.5", severity: "Unhealthy", label: "Nizamuddin", state: "Delhi", street: "Nizamuddin Railway Station Area", description: "Rail yard and vehicular confluence; persistent smog." },

  // ── Maharashtra ──
  { id: "MH-01", lat: 19.0760, lng: 72.8777, aqi: 165, pollutant: "PM2.5", severity: "Unhealthy", label: "Bandra-Worli Sea Link", state: "Maharashtra", street: "Western Express Highway", description: "Dense vehicular traffic on arterial route." },
  { id: "MH-02", lat: 19.0178, lng: 72.8478, aqi: 130, pollutant: "SO2", severity: "Unhealthy", label: "Chembur Industrial", state: "Maharashtra", street: "Chembur MIDC", description: "Refinery and petrochemical cluster emissions." },
  { id: "MH-03", lat: 18.5204, lng: 73.8567, aqi: 110, pollutant: "PM10", severity: "Unhealthy", label: "Pune Hadapsar", state: "Maharashtra", street: "Hadapsar IT Park Road", description: "Construction boom; PM10 elevated in morning hours." },
  { id: "MH-04", lat: 19.2183, lng: 72.9781, aqi: 145, pollutant: "NO2", severity: "Unhealthy", label: "Thane Highway", state: "Maharashtra", street: "Eastern Express Highway, Thane", description: "Container traffic causes diesel exhaust hotspot." },

  // ── Uttar Pradesh ──
  { id: "UP-01", lat: 26.8467, lng: 80.9462, aqi: 240, pollutant: "PM2.5", severity: "Unhealthy", label: "Lucknow Gomti Nagar", state: "Uttar Pradesh", street: "Gomti Nagar Main Road", description: "Rapid urbanisation; construction dust and traffic." },
  { id: "UP-02", lat: 27.1767, lng: 78.0081, aqi: 180, pollutant: "PM10", severity: "Unhealthy", label: "Agra Taj Zone", state: "Uttar Pradesh", street: "Near Taj Mahal East Gate", description: "Industrial area emissions affecting heritage zone." },
  { id: "UP-03", lat: 25.3176, lng: 82.9739, aqi: 210, pollutant: "CO2", severity: "Unhealthy", label: "Varanasi Ghats", state: "Uttar Pradesh", street: "Dashashwamedh Ghat Road", description: "Biomass burning and cremation activity." },
  { id: "UP-04", lat: 28.6692, lng: 77.4538, aqi: 255, pollutant: "PM2.5", severity: "Unhealthy", label: "Ghaziabad Link Rd", state: "Uttar Pradesh", street: "GT Road, Ghaziabad", description: "Delhi spillover pollution; heavy truck corridor." },

  // ── Punjab ──
  { id: "PB-01", lat: 30.7333, lng: 76.7794, aqi: 195, pollutant: "PM2.5", severity: "Unhealthy", label: "Chandigarh Industrial", state: "Punjab", street: "Chandigarh Industrial Area Phase I", description: "Mixed industrial and vehicular emissions." },
  { id: "PB-02", lat: 31.6340, lng: 74.8723, aqi: 220, pollutant: "PM10", severity: "Unhealthy", label: "Amritsar GT Road", state: "Punjab", street: "Grand Trunk Road, Amritsar", description: "Crop stubble burning season impact." },
  { id: "PB-03", lat: 30.9010, lng: 75.8573, aqi: 185, pollutant: "CO2", severity: "Unhealthy", label: "Ludhiana Factory Belt", state: "Punjab", street: "Ludhiana Industrial Area", description: "Textile and bicycle manufacturing emissions." },

  // ── Haryana ──
  { id: "HR-01", lat: 28.4595, lng: 77.0266, aqi: 230, pollutant: "PM2.5", severity: "Unhealthy", label: "Gurugram Cyber City", state: "Haryana", street: "Cyber City, DLF Phase 2", description: "Traffic congestion; diesel generator use." },
  { id: "HR-02", lat: 28.4089, lng: 76.9641, aqi: 185, pollutant: "PM10", severity: "Unhealthy", label: "Faridabad Industrial", state: "Haryana", street: "Faridabad NHPC Colony Road", description: "Heavy industries and construction." },

  // ── Bihar ──
  { id: "BR-01", lat: 25.6093, lng: 85.1376, aqi: 210, pollutant: "PM2.5", severity: "Unhealthy", label: "Patna Gandhi Maidan", state: "Bihar", street: "Gandhi Maidan Road", description: "Vehicular and construction dust; morning fog traps pollutants." },
  { id: "BR-02", lat: 25.6145, lng: 84.9921, aqi: 175, pollutant: "PM10", severity: "Unhealthy", label: "Patna Railway Junction", state: "Bihar", street: "Station Road, Patna", description: "Rail diesel emissions and nearby brick kilns." },
  { id: "BR-03", lat: 25.2425, lng: 86.9842, aqi: 155, pollutant: "SO2", severity: "Unhealthy", label: "Bhagalpur Industrial", state: "Bihar", street: "Bhagalpur Silk Route", description: "Small-scale industrial cluster emissions." },

  // ── Rajasthan ──
  { id: "RJ-01", lat: 26.9124, lng: 75.7873, aqi: 165, pollutant: "PM10", severity: "Unhealthy", label: "Jaipur Walled City", state: "Rajasthan", street: "Johari Bazaar Road", description: "Desert dust combined with traffic in old city." },
  { id: "RJ-02", lat: 24.5854, lng: 73.7125, aqi: 130, pollutant: "PM2.5", severity: "Unhealthy", label: "Udaipur Lake Area", state: "Rajasthan", street: "Fateh Sagar Road", description: "Tourist vehicles and nearby marble cutting units." },
  { id: "RJ-03", lat: 26.2389, lng: 73.0243, aqi: 180, pollutant: "PM10", severity: "Unhealthy", label: "Jodhpur Blue City", state: "Rajasthan", street: "Nai Sarak Road", description: "Desert storms and limestone quarry dust." },

  // ── West Bengal ──
  { id: "WB-01", lat: 22.5726, lng: 88.3639, aqi: 155, pollutant: "PM2.5", severity: "Unhealthy", label: "Kolkata Park Street", state: "West Bengal", street: "Park Street, Kolkata", description: "Traffic congestion in heritage commercial area." },
  { id: "WB-02", lat: 22.6252, lng: 88.3832, aqi: 175, pollutant: "NO2", severity: "Unhealthy", label: "Howrah Bridge Zone", state: "West Bengal", street: "Howrah Bridge Approach Road", description: "One of the busiest bridges; diesel exhaust peak." },
  { id: "WB-03", lat: 22.5958, lng: 88.2636, aqi: 140, pollutant: "SO2", severity: "Unhealthy", label: "Durgapur Steel Town", state: "West Bengal", street: "Near Durgapur Steel Plant", description: "Steel and thermal power plant emissions." },

  // ── Gujarat ──
  { id: "GJ-01", lat: 23.0225, lng: 72.5714, aqi: 145, pollutant: "PM2.5", severity: "Unhealthy", label: "Ahmedabad SG Highway", state: "Gujarat", street: "SG Highway, Ahmedabad", description: "Rapid construction and traffic growth corridor." },
  { id: "GJ-02", lat: 21.1702, lng: 72.8311, aqi: 165, pollutant: "SO2", severity: "Unhealthy", label: "Surat Diamond Hub", state: "Gujarat", street: "Surat Industrial Estate", description: "Diamond polishing and textile dyeing emissions." },
  { id: "GJ-03", lat: 22.3072, lng: 73.1812, aqi: 125, pollutant: "NO2", severity: "Unhealthy", label: "Vadodara Chemical Zone", state: "Gujarat", street: "GIDC Makarpura", description: "Petrochemical and pharmaceutical manufacturing." },

  // ── Tamil Nadu ──
  { id: "TN-01", lat: 13.0827, lng: 80.2707, aqi: 115, pollutant: "PM2.5", severity: "Unhealthy", label: "Chennai Anna Salai", state: "Tamil Nadu", street: "Anna Salai / Mount Road", description: "Arterial road; bus and auto-rickshaw emissions." },
  { id: "TN-02", lat: 13.0604, lng: 80.2496, aqi: 98, pollutant: "NO2", severity: "Moderate", label: "T. Nagar Commercial", state: "Tamil Nadu", street: "Usman Road, T. Nagar", description: "Commercial district traffic congestion." },
  { id: "TN-03", lat: 11.0168, lng: 76.9558, aqi: 85, pollutant: "PM10", severity: "Moderate", label: "Coimbatore Avinashi Rd", state: "Tamil Nadu", street: "Avinashi Road, Coimbatore", description: "Textile mill area; particulate matter from processing." },

  // ── Karnataka ──
  { id: "KA-01", lat: 12.9716, lng: 77.5946, aqi: 95, pollutant: "NO2", severity: "Moderate", label: "Bangalore Silk Board", state: "Karnataka", street: "Silk Board Junction", description: "Most congested junction; perpetual traffic jam." },
  { id: "KA-02", lat: 12.9352, lng: 77.6245, aqi: 88, pollutant: "PM2.5", severity: "Moderate", label: "Koramangala 4th Block", state: "Karnataka", street: "80 Feet Road, Koramangala", description: "Startup district; construction and delivery traffic." },
  { id: "KA-03", lat: 12.2958, lng: 76.6394, aqi: 55, pollutant: "PM10", severity: "Moderate", label: "Mysuru Heritage Zone", state: "Karnataka", street: "Sayyaji Rao Road, Mysuru", description: "Moderate levels from tourist and city traffic." },

  // ── Kerala ──
  { id: "KL-01", lat: 9.9312, lng: 76.2673, aqi: 62, pollutant: "PM2.5", severity: "Moderate", label: "Kochi Marine Drive", state: "Kerala", street: "Marine Drive, Ernakulam", description: "Port-related particulate matter in evening hours." },
  { id: "KL-02", lat: 8.5241, lng: 76.9366, aqi: 48, pollutant: "NO2", severity: "Good", label: "Trivandrum Technopark", state: "Kerala", street: "Technopark Campus Road", description: "Low emission; green-campus effect." },

  // ── Telangana ──
  { id: "TS-01", lat: 17.3850, lng: 78.4867, aqi: 120, pollutant: "PM2.5", severity: "Unhealthy", label: "Hyderabad HITEC City", state: "Telangana", street: "HITEC City Main Road", description: "IT corridor construction and peak-hour traffic." },
  { id: "TS-02", lat: 17.4399, lng: 78.4983, aqi: 98, pollutant: "NO2", severity: "Moderate", label: "Secunderabad Station", state: "Telangana", street: "Secunderabad Railway Station", description: "Diesel locomotives and auto emissions." },

  // ── Jharkhand ──
  { id: "JH-01", lat: 23.3441, lng: 85.3096, aqi: 165, pollutant: "PM10", severity: "Unhealthy", label: "Ranchi Main Road", state: "Jharkhand", street: "Main Road, Ranchi", description: "Coal dust and vehicular emissions." },
  { id: "JH-02", lat: 22.8046, lng: 86.2029, aqi: 195, pollutant: "PM2.5", severity: "Unhealthy", label: "Jamshedpur Steel City", state: "Jharkhand", street: "Tata Steel Works Road", description: "Steel plant stack emissions; coke oven gas." },

  // ── Chhattisgarh ──
  { id: "CG-01", lat: 21.2514, lng: 81.6296, aqi: 130, pollutant: "PM10", severity: "Unhealthy", label: "Raipur Telibandha", state: "Chhattisgarh", street: "Telibandha Lake Road", description: "Thermal power proximity; fly ash." },
  { id: "CG-02", lat: 21.1904, lng: 81.2849, aqi: 145, pollutant: "SO2", severity: "Unhealthy", label: "Bhilai Steel Town", state: "Chhattisgarh", street: "Bhilai Steel Plant Road", description: "Major steel production emissions." },

  // ── Madhya Pradesh ──
  { id: "MP-01", lat: 23.2599, lng: 77.4126, aqi: 105, pollutant: "PM2.5", severity: "Unhealthy", label: "Bhopal MP Nagar", state: "Madhya Pradesh", street: "MP Nagar Zone-II", description: "Commercial area traffic and construction." },
  { id: "MP-02", lat: 22.7196, lng: 75.8577, aqi: 115, pollutant: "PM10", severity: "Unhealthy", label: "Indore Rajwada", state: "Madhya Pradesh", street: "Rajwada Palace Road", description: "Old city congestion; narrow streets trap pollutants." },

  // ── Odisha ──
  { id: "OD-01", lat: 20.2961, lng: 85.8245, aqi: 110, pollutant: "PM2.5", severity: "Unhealthy", label: "Bhubaneswar Janpath", state: "Odisha", street: "Janpath Road, Unit 3", description: "Rapid urban development; construction dust." },
  { id: "OD-02", lat: 22.2604, lng: 84.8536, aqi: 155, pollutant: "PM10", severity: "Unhealthy", label: "Rourkela Steel Zone", state: "Odisha", street: "Near Rourkela Steel Plant", description: "Steel and mining operations." },

  // ── Assam ──
  { id: "AS-01", lat: 26.1445, lng: 91.7362, aqi: 95, pollutant: "PM2.5", severity: "Moderate", label: "Guwahati Zoo Road", state: "Assam", street: "Zoo Road, Guwahati", description: "Traffic and brick kiln emissions." },
  { id: "AS-02", lat: 26.7509, lng: 94.2037, aqi: 72, pollutant: "PM10", severity: "Moderate", label: "Dibrugarh Tea Belt", state: "Assam", street: "AT Road, Dibrugarh", description: "Tea processing and vehicular mix." },

  // ── Andhra Pradesh ──
  { id: "AP-01", lat: 17.6868, lng: 83.2185, aqi: 88, pollutant: "PM2.5", severity: "Moderate", label: "Vizag Beach Road", state: "Andhra Pradesh", street: "RK Beach Road", description: "Port and industrial area influence." },
  { id: "AP-02", lat: 15.8281, lng: 78.0373, aqi: 78, pollutant: "NO2", severity: "Moderate", label: "Kurnool Market", state: "Andhra Pradesh", street: "Kurnool Main Bazaar", description: "Vehicular emissions in market area." },

  // ── Uttarakhand ──
  { id: "UK-01", lat: 30.3165, lng: 78.0322, aqi: 75, pollutant: "PM10", severity: "Moderate", label: "Dehradun Clock Tower", state: "Uttarakhand", street: "Rajpur Road", description: "Tourism traffic and construction activity." },
  { id: "UK-02", lat: 29.9457, lng: 78.1642, aqi: 55, pollutant: "PM2.5", severity: "Moderate", label: "Haridwar Ghat Area", state: "Uttarakhand", street: "Har Ki Pauri Road", description: "Biomass burning near ghats." },

  // ── Himachal Pradesh ──
  { id: "HP-01", lat: 31.1048, lng: 77.1734, aqi: 48, pollutant: "PM2.5", severity: "Good", label: "Shimla Mall Road", state: "Himachal Pradesh", street: "The Mall, Shimla", description: "Vehicle-free zone; low emissions." },
  { id: "HP-02", lat: 32.2432, lng: 77.1892, aqi: 58, pollutant: "PM10", severity: "Moderate", label: "Manali Mall Road", state: "Himachal Pradesh", street: "The Mall Road, Manali", description: "Tourist season congestion; diesel taxis and wood heating." },

  // ── Goa ──
  { id: "GA-01", lat: 15.4909, lng: 73.8278, aqi: 52, pollutant: "PM10", severity: "Moderate", label: "Panaji Church Square", state: "Goa", street: "Church Square, Panaji", description: "Tourist season traffic impact." },
  { id: "GA-02", lat: 15.3982, lng: 73.8113, aqi: 62, pollutant: "PM2.5", severity: "Moderate", label: "Vasco Port Area", state: "Goa", street: "Vasco Da Gama Port Road", description: "Port and mining-related particulates." },

  // ── Tripura ──
  { id: "TR-01", lat: 23.8315, lng: 91.2868, aqi: 58, pollutant: "PM10", severity: "Moderate", label: "Agartala Palace Road", state: "Tripura", street: "Ujjayanta Palace Road", description: "Vehicular emissions; brick kiln influence." },
  { id: "TR-02", lat: 23.5330, lng: 91.4916, aqi: 72, pollutant: "PM2.5", severity: "Moderate", label: "Udaipur Brick Kiln Belt", state: "Tripura", street: "Udaipur–Amarpur Road", description: "Seasonal brick kiln activity and biomass burning." },

  // ── Sikkim ──
  { id: "SK-01", lat: 27.3389, lng: 88.6065, aqi: 30, pollutant: "PM2.5", severity: "Good", label: "Gangtok MG Marg", state: "Sikkim", street: "MG Marg, Gangtok", description: "Clean mountain air; minimal emissions." },
  { id: "SK-02", lat: 27.1765, lng: 88.5346, aqi: 52, pollutant: "PM10", severity: "Moderate", label: "Rangpo Checkpost", state: "Sikkim", street: "NH-10, Rangpo", description: "Highway dust and freight movement at state entry point." },

  // ── Manipur ──
  { id: "MN-01", lat: 24.8170, lng: 93.9368, aqi: 42, pollutant: "PM2.5", severity: "Good", label: "Imphal Kangla Fort", state: "Manipur", street: "Kangla Fort Road", description: "Low traffic; seasonal biomass burning." },
  { id: "MN-02", lat: 24.7981, lng: 93.9512, aqi: 56, pollutant: "PM10", severity: "Moderate", label: "North AOC Junction", state: "Manipur", street: "Airport Road, Imphal", description: "Junction congestion; dust resuspension on dry days." },

  // ── Meghalaya ──
  { id: "ML-01", lat: 25.5788, lng: 91.8933, aqi: 38, pollutant: "PM10", severity: "Good", label: "Shillong Police Bazaar", state: "Meghalaya", street: "Police Bazaar Road", description: "Light traffic; coal mining in outskirts." },
  { id: "ML-02", lat: 26.0007, lng: 91.9799, aqi: 125, pollutant: "PM2.5", severity: "Unhealthy", label: "Byrnihat Industrial Belt", state: "Meghalaya", street: "Byrnihat–Jorabat Road", description: "Industrial cluster and freight corridor; sustained particulate load." },

  // ── Mizoram ──
  { id: "MZ-01", lat: 23.7271, lng: 92.7176, aqi: 32, pollutant: "PM2.5", severity: "Good", label: "Aizawl Solomon's Temple", state: "Mizoram", street: "Zarkawt Road", description: "Pristine air quality; minimal industry." },
  { id: "MZ-02", lat: 22.8921, lng: 92.7426, aqi: 55, pollutant: "PM10", severity: "Moderate", label: "Lunglei Market Area", state: "Mizoram", street: "Bazar Veng, Lunglei", description: "Market traffic; roadside dust during dry spells." },

  // ── Nagaland ──
  { id: "NL-01", lat: 25.6747, lng: 94.1086, aqi: 36, pollutant: "PM2.5", severity: "Good", label: "Kohima War Cemetery", state: "Nagaland", street: "NH-29, Kohima", description: "Clean air; low vehicular traffic." },
  { id: "NL-02", lat: 25.9050, lng: 93.7287, aqi: 72, pollutant: "NO2", severity: "Moderate", label: "Dimapur Railway Colony", state: "Nagaland", street: "Railway Station Road, Dimapur", description: "Transit hub emissions; idling vehicles and rail activity." },

  // ── Arunachal Pradesh ──
  { id: "AR-01", lat: 27.0844, lng: 93.6053, aqi: 28, pollutant: "PM2.5", severity: "Good", label: "Itanagar Ganga Lake", state: "Arunachal Pradesh", street: "Ganga Lake Road", description: "Minimal anthropogenic emissions." },
  { id: "AR-02", lat: 28.0661, lng: 95.3265, aqi: 52, pollutant: "PM10", severity: "Moderate", label: "Pasighat Market", state: "Arunachal Pradesh", street: "Pasighat Main Market Road", description: "Local traffic and construction dust near the market core." },

  // ── Jammu and Kashmir ──
  { id: "JK-01", lat: 34.0837, lng: 74.7973, aqi: 78, pollutant: "PM2.5", severity: "Moderate", label: "Srinagar Lal Chowk", state: "Jammu and Kashmir", street: "Lal Chowk, Srinagar", description: "Traffic bottleneck; winter inversion traps particulates." },
  { id: "JK-02", lat: 32.7266, lng: 74.8570, aqi: 110, pollutant: "NO2", severity: "Unhealthy", label: "Jammu Bus Stand Zone", state: "Jammu and Kashmir", street: "General Bus Stand, Jammu", description: "Diesel buses and congestion elevate NO₂ and PM." },
  { id: "JK-03", lat: 33.8739, lng: 74.8999, aqi: 135, pollutant: "PM10", severity: "Unhealthy", label: "Pulwama Brick Kilns", state: "Jammu and Kashmir", street: "Pulwama Brick Kiln Cluster", description: "Kiln emissions and road dust from heavy trucks." },

  // ── Ladakh ──
  { id: "LA-01", lat: 34.1526, lng: 77.5770, aqi: 35, pollutant: "PM2.5", severity: "Good", label: "Leh Main Bazaar", state: "Ladakh", street: "Main Market Road, Leh", description: "Generally clean air; occasional dust from traffic." },
  { id: "LA-02", lat: 34.5553, lng: 76.1256, aqi: 52, pollutant: "PM10", severity: "Moderate", label: "Kargil Highway Junction", state: "Ladakh", street: "NH-1D, Kargil", description: "Highway dust; diesel freight traffic in summer." },

  // ── Chandigarh ──
  { id: "CH-01", lat: 30.7333, lng: 76.7794, aqi: 110, pollutant: "PM2.5", severity: "Unhealthy", label: "Sector 17 Plaza", state: "Chandigarh", street: "Sector 17, Chandigarh", description: "Commercial traffic and idling vehicles near plaza." },
  { id: "CH-02", lat: 30.7055, lng: 76.8010, aqi: 145, pollutant: "PM10", severity: "Unhealthy", label: "Industrial Area Phase II", state: "Chandigarh", street: "Industrial Area Phase II", description: "Industrial and freight movement; coarse particulates elevated." },

  // ── Puducherry ──
  { id: "PY-01", lat: 11.9341, lng: 79.8300, aqi: 62, pollutant: "PM10", severity: "Moderate", label: "White Town Promenade", state: "Puducherry", street: "Beach Road, Puducherry", description: "Tourist traffic and coastal road congestion." },
  { id: "PY-02", lat: 11.9131, lng: 79.7980, aqi: 95, pollutant: "PM2.5", severity: "Moderate", label: "Ariankuppam Industrial", state: "Puducherry", street: "Ariankuppam Industrial Zone", description: "Small industrial units and freight traffic." },

  // ── Andaman and Nicobar Islands ──
  { id: "AN-01", lat: 11.6667, lng: 92.7460, aqi: 48, pollutant: "PM2.5", severity: "Good", label: "Port Blair Aberdeen Bazaar", state: "Andaman and Nicobar Islands", street: "Aberdeen Bazaar Road", description: "Localized traffic; generally clean maritime air." },
  { id: "AN-02", lat: 11.6821, lng: 92.7411, aqi: 62, pollutant: "PM10", severity: "Moderate", label: "Port Blair Harbour Zone", state: "Andaman and Nicobar Islands", street: "Phoenix Bay Jetty Road", description: "Port activity and diesel boats raise coarse particulates." },

  // ── Lakshadweep ──
  { id: "LD-01", lat: 10.5667, lng: 72.6420, aqi: 28, pollutant: "PM2.5", severity: "Good", label: "Kavaratti Jetty", state: "Lakshadweep", street: "Jetty Road, Kavaratti", description: "Very clean air; minimal traffic." },
  { id: "LD-02", lat: 10.8298, lng: 72.1766, aqi: 35, pollutant: "PM10", severity: "Good", label: "Agatti Airport Road", state: "Lakshadweep", street: "Airport Approach Road, Agatti", description: "Occasional dust from vehicles; overall low emissions." },

  // ── Dadra and Nagar Haveli and Daman and Diu ──
  { id: "DN-01", lat: 20.2763, lng: 73.0083, aqi: 155, pollutant: "PM2.5", severity: "Unhealthy", label: "Silvassa Industrial Estate", state: "Dadra and Nagar Haveli and Daman and Diu", street: "Silvassa Industrial Area", description: "Manufacturing cluster and truck movement; particulate hotspot." },
  { id: "DN-02", lat: 20.3974, lng: 72.8328, aqi: 92, pollutant: "NO2", severity: "Moderate", label: "Daman Coastal Highway", state: "Dadra and Nagar Haveli and Daman and Diu", street: "NH-48 Connector, Daman", description: "Tourism season traffic; diesel exhaust along highway." },

  // ── Additional high-density entries ──
  { id: "DL-06", lat: 28.6508, lng: 77.2319, aqi: 245, pollutant: "SO2", severity: "Unhealthy", label: "Old Delhi Chandni Chowk", state: "Delhi", street: "Chandni Chowk Main Road", description: "Street food stalls and old industry emissions." },
  { id: "DL-07", lat: 28.5672, lng: 77.2100, aqi: 205, pollutant: "O3", severity: "Unhealthy", label: "Sarojini Nagar", state: "Delhi", street: "Sarojini Nagar Market Road", description: "Ground-level ozone from photochemical reactions." },
  { id: "UP-05", lat: 26.4499, lng: 80.3319, aqi: 195, pollutant: "PM2.5", severity: "Unhealthy", label: "Kanpur Leather Belt", state: "Uttar Pradesh", street: "Jajmau Tannery Cluster", description: "Tannery emissions and waste burning." },
  { id: "UP-06", lat: 28.9845, lng: 77.7064, aqi: 230, pollutant: "PM10", severity: "Unhealthy", label: "Meerut Bypass", state: "Uttar Pradesh", street: "Delhi-Meerut Expressway", description: "Construction of expressway; heavy machinery dust." },
  { id: "MH-05", lat: 19.1426, lng: 72.8553, aqi: 135, pollutant: "PM2.5", severity: "Unhealthy", label: "Andheri Station Area", state: "Maharashtra", street: "SV Road, Andheri West", description: "One of the busiest suburban corridors." },
  { id: "MH-06", lat: 18.9220, lng: 72.8347, aqi: 110, pollutant: "CO2", severity: "Unhealthy", label: "Mumbai Dock Area", state: "Maharashtra", street: "Eastern Freeway, Dock Area", description: "Port logistics and truck movement." },
  { id: "GJ-04", lat: 22.3039, lng: 70.8022, aqi: 155, pollutant: "PM10", severity: "Unhealthy", label: "Rajkot Ring Road", state: "Gujarat", street: "Rajkot Ring Road Industrial", description: "Engineering and auto-parts manufacturing dust." },
  { id: "HR-03", lat: 29.9695, lng: 76.8783, aqi: 195, pollutant: "PM2.5", severity: "Unhealthy", label: "Karnal GT Road", state: "Haryana", street: "GT Road, Karnal", description: "Agricultural burning corridor during rabi season." },
  { id: "PB-04", lat: 30.3564, lng: 76.3647, aqi: 175, pollutant: "PM2.5", severity: "Unhealthy", label: "Patiala Industrial", state: "Punjab", street: "Patiala Industrial Area", description: "Agro-processing and brick kiln belt." },
  { id: "RJ-04", lat: 25.1887, lng: 75.8648, aqi: 140, pollutant: "PM10", severity: "Unhealthy", label: "Kota Coaching Hub", state: "Rajasthan", street: "Talwandi Road, Kota", description: "Rapid urbanisation; construction boom in coaching capital." },
  { id: "WB-04", lat: 22.5727, lng: 88.4360, aqi: 130, pollutant: "PM2.5", severity: "Unhealthy", label: "Salt Lake IT Hub", state: "West Bengal", street: "Sector V, Salt Lake", description: "Generator emissions during power cuts." },
  { id: "TN-04", lat: 9.9252, lng: 78.1198, aqi: 92, pollutant: "PM10", severity: "Moderate", label: "Madurai Meenakshi Area", state: "Tamil Nadu", street: "North Masi Street", description: "Old city traffic and temple festival smoke." },
  { id: "KA-04", lat: 15.3647, lng: 75.1240, aqi: 68, pollutant: "PM2.5", severity: "Moderate", label: "Hubli Station Road", state: "Karnataka", street: "Station Road, Hubli", description: "Moderate traffic; growing satellite city." },
  { id: "TS-03", lat: 17.3616, lng: 78.4747, aqi: 108, pollutant: "PM10", severity: "Unhealthy", label: "LB Nagar Junction", state: "Telangana", street: "LB Nagar, Hyderabad", description: "Suburban growth; construction and auto emissions." },
  { id: "BR-04", lat: 25.3960, lng: 85.0000, aqi: 165, pollutant: "PM2.5", severity: "Unhealthy", label: "Patna Kankarbagh", state: "Bihar", street: "Kankarbagh Main Road", description: "Dense residential; vehicular and cooking emissions." },
  { id: "JH-03", lat: 23.7957, lng: 86.4304, aqi: 180, pollutant: "PM10", severity: "Unhealthy", label: "Dhanbad Coalfield", state: "Jharkhand", street: "Jharia Coalfield Road", description: "Open-cast coal mining dust; underground fire smoke." },
  { id: "OD-03", lat: 19.8135, lng: 85.8312, aqi: 88, pollutant: "PM2.5", severity: "Moderate", label: "Puri Beach Road", state: "Odisha", street: "Grand Road, Puri", description: "Temple town traffic; sea-salt aerosols." },
];

/** Get hotspots for a specific state */
export function getHotspotsForState(state: string): PollutionPoint[] {
  return pollutionHotspots.filter((h) => h.state === state);
}

/** Get all unique pollutant types */
export function getUniquePollutants(): string[] {
  return [...new Set(pollutionHotspots.map((h) => h.pollutant))];
}
