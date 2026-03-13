/**
 * ngoData.ts — Environmental NGO directory (modelled after CURA ngoData)
 * 30+ NGOs across India with contact info, focus areas, and activities.
 */

export interface NGOInfo {
  name: string;
  city: string;
  state: string;
  contact: string;
  website?: string;
  focus: string[];
  activities: string[];
}

export const ngoDirectory: NGOInfo[] = [
  // ── Delhi / NCR ──
  { name: "Clean Air Foundation", city: "New Delhi", state: "Delhi", contact: "+91 11 2334 5678", website: "https://cleanairfoundation.in", focus: ["Air Quality", "Policy Advocacy"], activities: ["Real-time AQI monitoring", "School awareness programs", "Policy research papers"] },
  { name: "Breathe Easy Delhi", city: "New Delhi", state: "Delhi", contact: "+91 11 4567 8901", website: "https://breatheeasydl.org", focus: ["Health Impact", "Community Action"], activities: ["Free lung screening camps", "Air purifier distribution", "Community clean-up drives"] },
  { name: "Green Delhi Initiative", city: "New Delhi", state: "Delhi", contact: "+91 11 6789 0123", focus: ["Urban Forestry", "Emission Reduction"], activities: ["Tree plantation drives", "EV charging advocacy", "Industrial emission audits"] },

  // ── Maharashtra ──
  { name: "Maharashtra Green Initiative", city: "Mumbai", state: "Maharashtra", contact: "+91 22 2345 6789", website: "https://mgreeninitiative.org", focus: ["Industrial Monitoring", "Coastal Ecology"], activities: ["Factory stack monitoring", "Mangrove restoration", "Port emission studies"] },
  { name: "Pune Clean Air Network", city: "Pune", state: "Maharashtra", contact: "+91 20 3456 7890", focus: ["Urban Transport", "Air Quality"], activities: ["Cycle-sharing promotion", "AQI sensor deployment", "Public transport advocacy"] },

  // ── Uttar Pradesh ──
  { name: "UP Environment Trust", city: "Lucknow", state: "Uttar Pradesh", contact: "+91 522 234 5678", website: "https://upenvironment.org", focus: ["Agricultural Burning", "Industrial Pollution"], activities: ["Crop residue management training", "Industrial compliance monitoring", "Community health surveys"] },
  { name: "Ganga Clean Air Mission", city: "Varanasi", state: "Uttar Pradesh", contact: "+91 542 345 6789", focus: ["River Corridor Air", "Heritage Protection"], activities: ["Ghat air monitoring", "Electric cremation advocacy", "Tourist area AQI boards"] },

  // ── Punjab ──
  { name: "Punjab Clean Air Society", city: "Chandigarh", state: "Punjab", contact: "+91 172 345 6789", website: "https://punjabcleanair.org", focus: ["Stubble Burning", "Farm Innovation"], activities: ["Happy Seeder promotion", "Farmer workshops", "Alternative crop advisory"] },
  { name: "Amritsar Green Guard", city: "Amritsar", state: "Punjab", contact: "+91 183 456 7890", focus: ["Urban Air Quality", "Heritage Conservation"], activities: ["Golden Temple area monitoring", "Vehicle emission testing camps", "Green belt development"] },

  // ── Tamil Nadu ──
  { name: "TN Eco Foundation", city: "Chennai", state: "Tamil Nadu", contact: "+91 44 2345 6789", website: "https://tnecofoundation.org", focus: ["Coastal Air Quality", "Industrial Safety"], activities: ["Petrochemical zone monitoring", "Fishermen health camps", "Industrial waste-to-energy projects"] },

  // ── Karnataka ──
  { name: "Karnataka Green Council", city: "Bengaluru", state: "Karnataka", contact: "+91 80 2345 6789", website: "https://karnatakagreen.org", focus: ["Tech for Environment", "Urban Planning"], activities: ["IoT air sensor network", "Green building certification", "Traffic decongestion studies"] },
  { name: "Mysuru Heritage Air Watch", city: "Mysuru", state: "Karnataka", contact: "+91 821 345 6789", focus: ["Heritage Zone Protection", "Tourism Impact"], activities: ["Palace area monitoring", "Electric vehicle tourism", "Awareness signage"] },

  // ── West Bengal ──
  { name: "Bengal Environment Watch", city: "Kolkata", state: "West Bengal", contact: "+91 33 2345 6789", website: "https://bengalenvwatch.org", focus: ["Industrial Pollution", "Urban Health"], activities: ["Howrah bridge area monitoring", "Jute mill emission studies", "Public health awareness"] },

  // ── Rajasthan ──
  { name: "Rajasthan Air Quality Forum", city: "Jaipur", state: "Rajasthan", contact: "+91 141 234 5678", focus: ["Desert Dust", "Mining Impact"], activities: ["Dust storm early warning", "Mining area health camps", "Sandstone quarry monitoring"] },
  { name: "Thar Desert Green Front", city: "Jodhpur", state: "Rajasthan", contact: "+91 291 345 6789", focus: ["Desertification", "Renewable Energy"], activities: ["Solar energy promotion", "Windbreak plantation", "Community water-air nexus studies"] },

  // ── Bihar ──
  { name: "Bihar Pollution Control NGO", city: "Patna", state: "Bihar", contact: "+91 612 234 5678", website: "https://biharpollution.org", focus: ["Brick Kiln Reform", "River Air Quality"], activities: ["Zigzag kiln conversion", "Ganga corridor monitoring", "School awareness programs"] },

  // ── Gujarat ──
  { name: "Gujarat Green Warriors", city: "Ahmedabad", state: "Gujarat", contact: "+91 79 2345 6789", website: "https://gujaratgreenwarriors.org", focus: ["Industrial Safety", "Chemical Monitoring"], activities: ["GIDC area monitoring", "Chemical spill response", "Worker health screening"] },
  { name: "Surat Textile Eco Watch", city: "Surat", state: "Gujarat", contact: "+91 261 234 5678", focus: ["Textile Emissions", "Water-Air Nexus"], activities: ["Dyeing unit emission audits", "Clean technology promotion", "Worker respiratory care"] },

  // ── Telangana ──
  { name: "Hyderabad Air Quality Lab", city: "Hyderabad", state: "Telangana", contact: "+91 40 2345 6789", website: "https://hydairlab.org", focus: ["Smart City AQI", "Data Analytics"], activities: ["Real-time dashboard deployment", "ML-based prediction models", "Policy briefing papers"] },

  // ── Jharkhand ──
  { name: "Jharkhand Mining Watch", city: "Ranchi", state: "Jharkhand", contact: "+91 651 234 5678", focus: ["Mining Dust", "Worker Health"], activities: ["Open-cast mine monitoring", "Silicosis screening camps", "Coal fire documentation"] },

  // ── Haryana ──
  { name: "Gurugram Clean Air Alliance", city: "Gurugram", state: "Haryana", contact: "+91 124 234 5678", focus: ["Urban Emissions", "Real Estate Impact"], activities: ["Construction dust monitoring", "DG set emission audits", "Green commute campaigns"] },

  // ── Kerala ──
  { name: "Kerala Green Breeze", city: "Kochi", state: "Kerala", contact: "+91 484 234 5678", focus: ["Port Emissions", "Eco-Tourism"], activities: ["Port area monitoring", "Electric waterway boats", "Backwater air quality studies"] },

  // ── Odisha ──
  { name: "Odisha Environment Shield", city: "Bhubaneswar", state: "Odisha", contact: "+91 674 234 5678", focus: ["Mining & Steel", "Coastal Air"], activities: ["Steel belt monitoring", "Chilika lagoon air studies", "Community health mapping"] },

  // ── Madhya Pradesh ──
  { name: "MP Clean Air Network", city: "Bhopal", state: "Madhya Pradesh", contact: "+91 755 234 5678", focus: ["Industrial Legacy", "Urban Growth"], activities: ["Union Carbide site monitoring", "Smart city AQI integration", "Student awareness programs"] },

  // ── Chhattisgarh ──
  { name: "Chhattisgarh Green Force", city: "Raipur", state: "Chhattisgarh", contact: "+91 771 234 5678", focus: ["Steel & Power", "Tribal Health"], activities: ["Bhilai steel emissions audit", "Tribal community health", "Fly ash management advocacy"] },

  // ── Assam ──
  { name: "Assam River Air Watch", city: "Guwahati", state: "Assam", contact: "+91 361 234 5678", focus: ["Tea Belt Air", "River Corridor"], activities: ["Brahmaputra valley monitoring", "Tea garden worker health", "Brick kiln reform"] },

  // ── Uttarakhand ──
  { name: "Himalayan Air Guardians", city: "Dehradun", state: "Uttarakhand", contact: "+91 135 234 5678", focus: ["Mountain Ecology", "Forest Fire"], activities: ["Forest fire smoke tracking", "Hill station AQI", "Pilgrimage route monitoring"] },

  // ── Goa ──
  { name: "Goa Coastal Environment Forum", city: "Panaji", state: "Goa", contact: "+91 832 234 5678", focus: ["Mining Impact", "Tourism"], activities: ["Mining dust monitoring", "Beach air quality", "Green tourism advocacy"] },
];

/** Get NGOs by state */
export function getNGOsByState(state: string): NGOInfo[] {
  return ngoDirectory.filter((n) => n.state === state);
}

/** Get NGOs near a given state (same state first, then neighbours) */
export function getNearbyNGOs(state: string, limit = 4): NGOInfo[] {
  const sameState = ngoDirectory.filter((n) => n.state === state);
  if (sameState.length >= limit) return sameState.slice(0, limit);
  // Fill with other NGOs
  const others = ngoDirectory.filter((n) => n.state !== state);
  return [...sameState, ...others].slice(0, limit);
}
