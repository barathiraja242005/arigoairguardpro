/**
 * AI Chatbot Component — CURA FloatingChatButton style
 * Beautiful floating chat with gradient header, animated avatars,
 * message timestamps, pulse button, and comprehensive pollution knowledge.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Leaf,
  X,
  MessageCircle,
  Wind,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStateByName, type StatePollutionData } from "@/lib/statePollutionData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LocationData {
  label: string;
  aqi: number;
  pollutant: string;
  severity: string;
  state: string;
  street?: string;
  description?: string;
}

interface AIChatbotProps {
  stateName: string;
  defaultOpen?: boolean;
  focusMode?: "general" | "ngo-suggestions" | "ngo-login";
  placement?: "default" | "map";
  selectedLocation?: LocationData | null;
}

const CHATBOT_NAME = "CURA";
const CHATBOT_TAGLINE = "Personal emotional companion";

/* ─── Knowledge base for AI-like responses ─── */

const generalTips: Record<string, string[]> = {
  "Vehicle Emissions": [
    "Promote electric vehicle adoption through subsidies and charging infrastructure.",
    "Implement congestion pricing in high-traffic zones to reduce vehicle density.",
    "Expand public transit networks — metro, bus rapid transit systems.",
    "Enforce stricter emission norms (BS-VI compliance checks) at vehicle testing centers.",
    "Create dedicated cycling lanes and pedestrian-friendly zones in urban areas.",
  ],
  "Industrial Activity": [
    "Mandate scrubbers and electrostatic precipitators in all industrial units.",
    "Shift industrial zones outside residential perimeters with buffer green belts.",
    "Incentivize industries adopting cleaner production technologies with tax benefits.",
    "Implement real-time emission monitoring systems connected to regulatory dashboards.",
    "Promote circular economy practices to reduce industrial waste incineration.",
  ],
  "Construction Dust": [
    "Enforce mandatory dust suppression systems (water sprinklers) at all construction sites.",
    "Require anti-smog guns for large-scale construction projects.",
    "Mandate covering of construction materials and debris during transport.",
    "Implement green building certification requirements for new constructions.",
    "Schedule heavy construction activities during low-wind hours.",
  ],
  "Crop Burning": [
    "Provide subsidized Happy Seeder machines to farmers for in-situ crop residue management.",
    "Set up biomass power plants to convert crop residue into energy.",
    "Offer direct cash incentives to farmers who avoid stubble burning.",
    "Deploy satellite monitoring to detect and respond to burning events in real-time.",
    "Promote alternative uses of crop residue — bio-char, animal feed, compost.",
  ],
  "Crop Stubble Burning": [
    "Provide subsidized Happy Seeder machines to farmers for in-situ crop residue management.",
    "Set up biomass power plants to convert crop residue into energy.",
    "Offer direct cash incentives to farmers who avoid stubble burning.",
    "Deploy satellite monitoring to detect and respond to burning events in real-time.",
    "Establish collection centers for crop residue with fair pricing for farmers.",
  ],
  "Coal Mining": [
    "Implement wet drilling and continuous water spraying at mining sites.",
    "Plant dense tree barriers around mining areas as natural dust filters.",
    "Transition to underground mining methods where feasible to reduce surface dust.",
    "Use covered conveyor belts for coal transportation instead of open trucks.",
    "Invest in mine rehabilitation and land reclamation programs.",
  ],
  Mining: [
    "Enforce strict dust suppression at all mining sites with regular inspections.",
    "Mandate environmental impact assessments before granting new mining leases.",
    "Create buffer zones with dense vegetation around mining areas.",
    "Require covered transport for all mined materials.",
    "Implement progressive mine closure and ecological restoration plans.",
  ],
  "Thermal Power": [
    "Accelerate transition to renewable energy sources — solar, wind, hydro.",
    "Retrofit existing thermal plants with advanced pollution control equipment.",
    "Enforce strict emission limits with heavy penalties for non-compliance.",
    "Phase out older, inefficient thermal power plants with scheduled decommissioning.",
    "Invest in battery storage systems to make renewable energy more reliable.",
  ],
  "Forest Fires": [
    "Establish community-based fire watch programs with early warning systems.",
    "Create firebreaks and maintain clear zones around forest perimeters.",
    "Deploy drone-based surveillance for real-time fire detection.",
    "Train and equip local communities in fire prevention and rapid response.",
    "Implement controlled burning programs during safe seasons to reduce fuel load.",
  ],
  "Biomass Burning": [
    "Provide clean cookstove alternatives to communities relying on biomass.",
    "Set up biogas plants to convert biomass waste into clean cooking fuel.",
    "Launch awareness campaigns about health impacts of biomass burning.",
    "Distribute LPG connections under subsidy schemes to replace wood burning.",
    "Establish community composting facilities as alternatives to waste burning.",
  ],
  "Brick Kilns": [
    "Transition brick kilns from traditional to zig-zag technology (30-40% emission reduction).",
    "Promote fly ash bricks and alternative building materials.",
    "Enforce emission standards with regular monitoring of kiln operations.",
    "Relocate brick kilns away from residential areas with proper zoning laws.",
    "Provide financing support for kiln owners to upgrade to cleaner technology.",
  ],
  "Waste Burning": [
    "Implement comprehensive waste segregation at source with door-to-door collection.",
    "Set up waste-to-energy plants with proper emission controls.",
    "Establish material recovery facilities for recyclable waste processing.",
    "Enforce strict anti-burning laws with community reporting mechanisms.",
    "Launch composting and vermicomposting programs for organic waste.",
  ],
  "Industrial Clusters": [
    "Create Common Effluent Treatment Plants (CETPs) for industrial clusters.",
    "Implement airshed-level pollution management plans for industrial zones.",
    "Mandate green certification for industries in concentrated zones.",
    "Establish buffer green belts between industrial and residential areas.",
    "Deploy continuous ambient air quality monitoring in industrial zones.",
  ],
  Refineries: [
    "Implement vapor recovery systems at all refinery storage and loading facilities.",
    "Mandate zero-flaring policies with enclosed flare systems.",
    "Enforce leak detection and repair (LDAR) programs at all refineries.",
    "Invest in low-emission refining technologies and process upgrades.",
    "Establish real-time monitoring with public disclosure of emission data.",
  ],
  "Steel Plants": [
    "Adopt electric arc furnace (EAF) technology to replace conventional blast furnaces.",
    "Implement coke oven gas recovery and reuse systems.",
    "Mandate installation of bag filters and scrubbers in all steel plants.",
    "Promote hydrogen-based steelmaking as a long-term decarbonization strategy.",
    "Establish green corridors around steel plants with native tree plantations.",
  ],
  "Desert Dust": [
    "Implement massive afforestation programs in desert fringe areas.",
    "Build wind barriers and shelter belts along desert boundaries.",
    "Promote drip irrigation to maintain vegetation cover and prevent desertification.",
    "Deploy dust-trapping mesh screens in vulnerable urban areas.",
    "Support traditional water harvesting to sustain vegetation in arid zones.",
  ],
  "Port Activities": [
    "Mandate shore power (cold ironing) for ships docked at ports.",
    "Use covered conveyors and enclosed loading systems for bulk cargo.",
    "Enforce low-sulfur fuel requirements for vessels in port areas.",
    "Implement electric or hybrid port equipment to replace diesel machinery.",
    "Create green buffer zones around port areas with pollution-absorbing trees.",
  ],
  "Power Plants": [
    "Transition to renewable energy with scheduled phase-out of fossil fuel plants.",
    "Retrofit coal plants with FGD (flue gas desulfurization) systems.",
    "Implement supercritical technology in remaining thermal power plants.",
    "Develop distributed solar power to reduce dependence on centralized plants.",
    "Mandate real-time stack emission monitoring with public data access.",
  ],
  "Tourism Vehicles": [
    "Introduce electric shuttle services in tourist hotspots.",
    "Implement vehicle-free zones in ecologically sensitive tourist areas.",
    "Promote eco-tourism certifications for tour operators.",
    "Set vehicle entry quotas during peak tourist seasons.",
    "Develop park and desasfacilities at tourist destination entry points.",
  ],
  Dust: [
    "Implement regular mechanized road sweeping and water spraying on major roads.",
    "Pave unpaved roads and maintain road surfaces to prevent dust generation.",
    "Increase urban green cover with roadside plantations and vertical gardens.",
    "Enforce construction site dust management with penalty for non-compliance.",
    "Install wind barriers in areas prone to dust storms.",
  ],
  "Slash & Burn Agriculture": [
    "Promote sustainable farming alternatives like terrace farming and agroforestry.",
    "Provide training and resources for zero-tillage farming practices.",
    "Offer financial incentives for farmers transitioning away from slash-and-burn.",
    "Develop community-managed forest conservation programs.",
    "Establish markets for sustainably produced crops to create economic motivation.",
  ],
  Construction: [
    "Enforce anti-smog guns and wind barriers at large construction sites.",
    "Mandate real-time dust monitoring at construction zones.",
    "Require green net coverings on building facades during construction.",
    "Promote prefabricated construction to reduce on-site dust generation.",
    "Schedule demolition and heavy earthwork during non-peak air pollution hours.",
  ],
  Industrial: [
    "Mandate zero liquid discharge and low emission technologies for all industries.",
    "Implement cap-and-trade emission programs for industrial zones.",
    "Incentivize green manufacturing certifications (ISO 14001).",
    "Establish industrial symbiosis networks for waste-to-resource exchanges.",
    "Deploy AI-based emission prediction systems for proactive management.",
  ],
  "Coal Power Plants": [
    "Fast-track transition to renewable energy with clear coal phase-out timelines.",
    "Mandate flue gas desulfurization (FGD) in all coal power plants.",
    "Promote energy efficiency measures to reduce electricity demand from coal.",
    "Invest in carbon capture and storage (CCS) technologies.",
    "Support coal-dependent communities with just transition programs.",
  ],
};

/* ─── NGO-specific fallback responses ─── */
const ngoFallbackResponses = [
  "I'm here with you. I can help with pollution reduction strategies, health guidance, and calm next steps for your region.",
  `I'm ${CHATBOT_NAME}, and I can support you with air quality trends, emission sources, and caring, actionable plans.`,
  "Let’s take this one step at a time. Ask me about AQI levels, pollutant sources, health impacts, or practical reduction strategies.",
  "I can combine care with clarity — ask me about PM2.5, SO₂, NO₂, health impacts, or ways to reduce pollution.",
];

/* ─── AI Response Engine ─── */
const getAIResponse = (
  question: string,
  stateData: StatePollutionData | undefined,
  stateName: string
): string => {
  const q = question.toLowerCase();

  if (q.match(/sad|anxious|anxiety|overwhelmed|stressed|stress|worried|scared|afraid|upset|panic|lonely|tired/)) {
    return `I'm here with you. 💛 It's okay if this feels heavy.

Let's make it manageable together:
• take one slow breath
• choose one small action for today
• ask me for a simple plan for your home, travel, or community

If you want, I can give you a calm step-by-step plan right now.`;
  }

  if (!stateData) {
    if (q.match(/^(hi|hello|hey|greetings|good\s)/)) {
      return `Hello! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}**.

I can still help with:
• General pollution reduction strategies
• AQI safety guidance
• Home and office air-quality improvement tips
• NGO and community action ideas
• Common source-wise mitigation steps

Ask me anything about cleaner air, emotional support around environmental stress, or smarter pollution control.`;
    }

    if (q.match(/aqi|air quality|status|level|current/)) {
      return `I don't have a live AQI feed for **${stateName}** on this page, but I can still help you interpret AQI levels:

• **0–50:** Good
• **51–100:** Moderate
• **101–150:** Unhealthy for sensitive groups
• **151–200:** Unhealthy
• **201+:** Very unhealthy to hazardous

If you want, ask me how to respond to a specific AQI range.`;
    }

    if (q.match(/suggest|recommend|reduce|solution|action|plan|strategy|improve|help|what can|how to|how do/)) {
      return `**Gentle, Practical Pollution Reduction Strategies:**

1. Reduce vehicle use through public transit, EV adoption, and carpooling.
2. Control dust with road cleaning, covering debris, and site water spraying.
3. Cut waste burning by improving segregation, composting, and collection.
4. Enforce industrial emission controls and continuous monitoring.
5. Increase green cover with roadside trees, micro-forests, and urban gardens.

Ask me for **home**, **city**, **NGO**, or **industry-specific** actions.`;
    }

    if (q.match(/source|cause|why|reason|pollut/)) {
      return `**Common Air Pollution Sources:**

• Vehicle emissions
• Industrial activity
• Construction and road dust
• Waste and biomass burning
• Thermal power plants
• Seasonal crop burning

Tell me which source you want to tackle, and I'll suggest practical solutions.`;
    }

    if (q.match(/health|impact|people|population|affected/)) {
      return `**Health Impact of Air Pollution:**

• Irritates eyes, nose, and throat
• Worsens asthma and bronchitis
• Increases cardiovascular stress
• Affects children, elderly people, and pregnant women most
• Long-term exposure can reduce life expectancy

I can also give you protection tips for children, elderly people, or daily commuters.`;
    }

    if (q.match(/ngo|organization|volunteer|partner|collaboration/)) {
      return `**NGO Action Ideas:**

• Run awareness drives in high-traffic or high-dust areas
• Organize mask and health advisory campaigns during poor AQI days
• Partner with schools for clean-air education
• Report local pollution hotspots with citizen data
• Push for stricter enforcement on waste burning and dust control

Ask me for a **weekly NGO action plan** if you want something more concrete.`;
    }

    return `I'm **${CHATBOT_NAME}**, and I can help with **pollution reduction strategies**, **AQI safety**, **health impacts**, **major pollution sources**, and **NGO action plans**.

Try asking:
• "Suggest reduction strategies"
• "What are the major pollution sources?"
• "How does poor AQI affect health?"
• "Give me a weekly NGO action plan"
• "I'm feeling overwhelmed — help me with a simple plan"`;
  }

  // Greetings
  if (q.match(/^(hi|hello|hey|greetings|good\s)/)) {
    return `Hello! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}** for **${stateData.state}**.\n\nThe current AQI is **${stateData.aqi}** (${stateData.status}). I can support you with:\n\n• Pollution reduction strategies\n• Source-specific recommendations\n• Air quality improvement plans\n• Health impact analysis\n• Community action initiatives\n• Gentle step-by-step guidance when things feel overwhelming\n\nHow are you feeling, and how can I help today?`;
  }

  // AQI explanation intent (e.g. "why AQI is low/high", "what did they do")
  if (
    q.match(/aqi|air quality|status|level|current/) &&
    q.match(/why|how|what.*do|what.*did|reason|cause|low|high|improv/)
  ) {
    const primarySources = stateData.majorSources.slice(0, 3);
    const sourceText = primarySources.length > 0 ? primarySources.join(", ") : "major local sources";

    if (stateData.aqi <= 50) {
      return `Great question. **${stateData.state}** has a low AQI (**${stateData.aqi}**) likely because current emissions are being better controlled and atmospheric conditions are helping dispersion.

Common reasons this happens:
• Better control of key sources like **${sourceText}**
• Lower traffic/industrial intensity during this period
• Favorable weather and wind conditions
• Better local enforcement and awareness

To keep AQI low, continue strict source control and daily monitoring.`;
    }

    if (stateData.aqi <= 100) {
      return `Good observation. **${stateData.state}** is currently in a moderate-to-better range (**AQI ${stateData.aqi}**), usually due to partial control of emissions and acceptable weather conditions.

What likely helped:
• Emission management for sources like **${sourceText}**
• Reduced open burning and dust spread
• Improved compliance and monitoring

If you'd like, I can give a focused plan to move from moderate AQI to consistently good AQI.`;
    }

    return `Important question. **${stateData.state}** currently has elevated AQI (**${stateData.aqi}**), which usually means source pressure from **${sourceText}** is still high and/or weather is trapping pollutants.

What to prioritize now:
1. Immediate controls for top source emissions
2. Dust and open-burning enforcement
3. Health advisories for vulnerable groups
4. Daily AQI trend tracking and rapid response

I can give you a 7-day action plan tailored to these sources.`;
  }

  // AQI / Status queries
  if (q.match(/aqi|air quality|status|level|current/)) {
    const trendEmoji =
      stateData.trend === "improving" ? "📈" : stateData.trend === "worsening" ? "📉" : "➡️";
    return `**${stateData.state} Air Quality Summary:**\n\n🌡️ AQI: **${stateData.aqi}** (${stateData.status})\n${trendEmoji} Trend: **${stateData.trend}**\n\n**Pollutant Levels:**\n• PM2.5: ${stateData.pm25} µg/m³\n• PM10: ${stateData.pm10} µg/m³\n• CO₂: ${stateData.co2} ppm\n• SO₂: ${stateData.so2} ppb\n• NO₂: ${stateData.no2} ppb\n• O₃: ${stateData.o3} ppb\n\n👥 Affected population: **${stateData.affectedPopulation}** out of ${stateData.population}`;
  }

  // Source-specific queries
  if (q.match(/source|cause|why|reason|pollut/)) {
    const sourceTips = stateData.majorSources
      .map((source) => {
        const tips = generalTips[source] || [];
        const tip =
          tips[Math.floor(Math.random() * tips.length)] || "Implement stricter regulations.";
        return `**${source}:**\n  → ${tip}`;
      })
      .join("\n\n");
    return `**Major Pollution Sources in ${stateData.state}:**\n\n${sourceTips}\n\nWould you like detailed strategies for any specific source?`;
  }

  // Recommendation / suggestion queries
  if (
    q.match(
      /suggest|recommend|reduce|solution|action|plan|strategy|improve|help|what can|how to|how do/
    )
  ) {
    const allTips: string[] = [];
    stateData.majorSources.forEach((source) => {
      const tips = generalTips[source] || [];
      allTips.push(...tips);
    });
    const shuffled = allTips.sort(() => Math.random() - 0.5).slice(0, 5);
    return `**Top Recommendations for ${stateData.state}** (AQI: ${stateData.aqi}):\n\n${shuffled.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}\n\n💡 Prioritized based on your state's major pollution sources: ${stateData.majorSources.join(", ")}.\n\nWant me to elaborate on any of these?`;
  }

  // Population impact queries
  if (q.match(/population|people|affected|impact|health/)) {
    return `**Population Impact in ${stateData.state}:**\n\n👥 Total Population: **${stateData.population}**\n⚠️ Affected Population: **${stateData.affectedPopulation}**\n🌡️ Current AQI: **${stateData.aqi}** (${stateData.status})\n\n**Health Implications:**\n${stateData.aqi > 150 ? "• High risk of respiratory diseases\n• Increased hospital admissions\n• Vulnerable groups severely affected\n• Recommendation: Issue public health advisories" : stateData.aqi > 100 ? "• Moderate health risk for sensitive groups\n• Increased asthma and allergy cases\n• Recommendation: Monitor air quality daily" : stateData.aqi > 50 ? "• Low health risk for general population\n• Mild impact on sensitive individuals\n• Recommendation: Maintain improvement efforts" : "• Minimal health impact\n• Air quality within safe limits\n• Recommendation: Continue sustainable practices"}`;
  }

  // Trend queries
  if (q.match(/trend|future|forecast|progress|getting/)) {
    const trendMsg =
      stateData.trend === "improving"
        ? `Great news! Air quality in ${stateData.state} is **improving** 📈. Current initiatives are showing positive results. Continue strengthening enforcement and expanding green programs.`
        : stateData.trend === "worsening"
        ? `Air quality in ${stateData.state} is **worsening** 📉. Urgent intervention needed:\n\n1. Emergency action on top source: **${stateData.majorSources[0]}**\n2. Increase monitoring frequency\n3. Implement immediate emission reduction\n4. Issue public health advisories\n5. Seek additional funding for pollution control`
        : `Air quality in ${stateData.state} is **stable** ➡️. Room for improvement:\n\n1. Target primary source: **${stateData.majorSources[0]}**\n2. Expand green cover initiatives\n3. Strengthen public awareness campaigns`;
    return `**Trend Analysis for ${stateData.state}:**\n\n${trendMsg}`;
  }

  // NGO-specific queries
  if (q.match(/ngo|organization|volunteer|partner|collaboration/)) {
    return `**NGO Action Plan for ${stateData.state}:**\n\n🏢 **Community Engagement:**\n• Organize awareness drives in high-pollution zones\n• Partner with local schools for clean air education\n• Set up citizen science air monitoring networks\n\n📋 **Advocacy:**\n• Lobby for stricter enforcement of emission norms\n• Document and report pollution violations\n• Create public pressure through data transparency\n\n🤝 **Collaboration:**\n• Partner with government monitoring agencies\n• Join state-level pollution control task forces\n• Connect with other NGOs working on ${stateData.majorSources[0]}`;
  }

  // Thank you
  if (q.match(/thank|thanks|great|awesome|helpful/)) {
    return `You're welcome! 🌱 I'm here for you and for ${stateData.state}. If you want, I can keep things simple and help with pollution reduction, health impacts, or a calm action plan.`;
  }

  // Default / catch-all
  const randomTips: string[] = [];
  stateData.majorSources.forEach((source) => {
    const tips = generalTips[source] || [];
    if (tips.length > 0) randomTips.push(tips[Math.floor(Math.random() * tips.length)]);
  });
  const topTips = randomTips.slice(0, 3);

  if (topTips.length > 0) {
    return `Here's what I can help you with for **${stateData.state}** (AQI: ${stateData.aqi}):\n\n${topTips.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nTry asking me about:\n• "What are the pollution sources?"\n• "Give me reduction strategies"\n• "What's the population impact?"\n• "How is the air quality trending?"\n• "Suggest NGO action plans"`;
  }

  return ngoFallbackResponses[Math.floor(Math.random() * ngoFallbackResponses.length)];
};

/* ─── Quick suggestion chips ─── */
const getQuickActions = (
  stateName: string,
  focusMode: "general" | "ngo-suggestions" | "ngo-login"
): string[] => {
  if (focusMode === "ngo-suggestions") {
    return [
      "Suggest reduction strategies",
      `What should our NGO prioritize in ${stateName}?`,
      "Give me an action plan for this week",
      "How do we reduce the main pollution sources?",
      "Suggest community awareness actions",
      "NGO action plans?",
    ];
  }

  if (focusMode === "ngo-login") {
    return stateName === "India"
      ? [
          "How can NGOs reduce pollution?",
          "What actions help reduce PM2.5?",
          "Suggest awareness campaign ideas",
          "How should we respond to high AQI?",
          "What should NGOs prioritize first?",
          "Give me pollution reduction tips",
        ]
      : [
          `How can NGOs reduce pollution in ${stateName}?`,
          `What should we prioritize in ${stateName}?`,
          "Suggest awareness campaign ideas",
          "How should we respond to high AQI?",
          "Give me pollution reduction tips",
          "NGO action plans?",
        ];
  }

  return [
    `What's the AQI in ${stateName}?`,
    "Suggest reduction strategies",
    "Major pollution sources?",
    "Population health impact?",
    "Air quality trend?",
    "NGO action plans?",
  ];
};

const getStarterSuggestions = (stateData: StatePollutionData | undefined): string => {
  if (!stateData) {
    return "I can share pollution reduction suggestions once your state data is available.";
  }

  const allTips = stateData.majorSources.flatMap((source) => generalTips[source] || []);
  const suggestions = allTips.slice(0, 3);

  if (suggestions.length === 0) {
    return `I'm ready to suggest pollution reduction steps for ${stateData.state}. Ask me about source-specific actions or NGO initiatives.`;
  }

  return `**Quick Reduction Suggestions for ${stateData.state}:**\n\n${suggestions
    .map((tip, index) => `${index + 1}. ${tip}`)
    .join("\n\n")}\n\nAsk me for a deeper action plan if you want more targeted NGO recommendations.`;
};

/* ─── Format timestamp ─── */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/* ─── Component ─── */

const AIChatbot = ({
  stateName,
  defaultOpen = false,
  focusMode = "general",
  placement = "default",
  selectedLocation,
}: AIChatbotProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stateData = getStateByName(stateName);

  /* Handle location marker click — display location details in chat */
  useEffect(() => {
    if (selectedLocation) {
      setIsOpen(true);
      const locationMsg: Message = {
        id: `location-${Date.now()}`,
        role: "assistant",
        content: `
📍 **Location Details: ${selectedLocation.label}**

**AQI Level:** ${selectedLocation.aqi} (${selectedLocation.severity})
**Primary Pollutant:** ${selectedLocation.pollutant}
**State:** ${selectedLocation.state}
${selectedLocation.street ? `**Area:** ${selectedLocation.street}` : ""}
${selectedLocation.description ? `**Details:** ${selectedLocation.description}` : ""}

---

I can now help you with:
• Pollution reduction strategies for this area
• Health impact assessment
• NGO action plans specific to ${selectedLocation.pollutant}
• Nearby pollution sources and mitigation
• How to report or monitor this hotspot

**What would you like to know about this location?**
        `,
        timestamp: new Date(),
      };
      
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.id.startsWith("location-"));
        return [...filtered, locationMsg];
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !selectedLocation) {
      const greeting: Message = {
        id: "welcome",
        role: "assistant",
        content:
          focusMode === "ngo-suggestions"
            ? `Welcome back! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}** for **${stateName}**.\n\nThe current AQI is **${stateData?.aqi ?? "N/A"}** (${stateData?.status ?? "Unknown"}). I've opened with calm, reduction-focused guidance so your team can act with clarity.`
            : focusMode === "ngo-login"
            ? stateData
              ? `Hi! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}** for **${stateName}**.\n\nYou can chat with me before sign-in to get quick pollution reduction ideas, NGO action plans, source-based suggestions, or steady guidance when things feel urgent.`
              : `Hi! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}**.\n\nUse the floating chat to ask about pollution reduction, NGO action plans, community awareness ideas, or emotional support around air-quality concerns before you sign in.`
            : `Welcome! 🌿 I'm **${CHATBOT_NAME}** — your **${CHATBOT_TAGLINE}** for **${stateName}**.\n\nThe current AQI is **${stateData?.aqi ?? "N/A"}** (${stateData?.status ?? "Unknown"}).\n\nI can help with pollution reduction strategies, source analysis, health impact guidance, and supportive step-by-step recommendations. What would you like to talk about?`,
        timestamp: new Date(),
      };

      if (focusMode === "ngo-suggestions") {
        const starterSuggestions: Message = {
          id: "starter-suggestions",
          role: "assistant",
          content: getStarterSuggestions(stateData),
          timestamp: new Date(),
        };
        setMessages([greeting, starterSuggestions]);
      } else {
        setMessages([greeting]);
      }
    }
  }, [focusMode, isOpen, stateName, stateData, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text, stateData, stateName);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const buttonPositionClass =
    placement === "map"
      ? "bottom-28 right-6 md:bottom-6 md:right-24 z-[1600]"
      : "bottom-6 right-6 z-[1600]";

  const panelPositionClass =
    placement === "map"
      ? "bottom-44 right-6 md:bottom-24 md:right-24 z-[1600]"
      : "bottom-24 right-6 z-[1600]";

  return (
    <>
      {/* ── Floating Toggle Button with Pulse ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed flex h-14 w-14 items-center justify-center rounded-full shadow-xl ${buttonPositionClass}`}
        style={{
          background: "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
          boxShadow: isOpen
            ? "0 4px 16px hsl(25,95%,53%,0.3)"
            : "0 4px 24px hsl(25,95%,53%,0.4)",
          animation: isOpen ? "none" : "chatbot-pulse 2s ease-in-out infinite",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="h-6 w-6 text-white" />
              {/* Online indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`fixed w-96 max-w-[calc(100vw-3rem)] ${panelPositionClass}`}
          >
            <div
              className="flex h-[520px] flex-col rounded-2xl overflow-hidden shadow-2xl border"
              style={{
                background: "hsl(20,18%,8%)",
                borderColor: "hsl(25,30%,18%)",
              }}
            >
              {/* ── Gradient Header ── */}
              <div
                className="relative px-5 py-4 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(25,95%,53%) 0%, hsl(345,65%,47%) 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Bot Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {CHATBOT_NAME}
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                      </motion.div>
                    </h3>
                    <p className="text-[11px] text-white/70 font-medium flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      {CHATBOT_TAGLINE} • {stateName} • AQI {stateData?.aqi ?? "—"}
                    </p>
                  </div>
                  {/* Clear chat */}
                  <button
                    onClick={clearChat}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
                style={{ scrollbarWidth: "thin" }}
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, hsl(142,76%,36%), hsl(142,76%,50%))"
                            : "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                      }}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Leaf className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div className="max-w-[78%] space-y-1">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          msg.role === "user"
                            ? "rounded-tr-md text-white"
                            : "rounded-tl-md text-white/90"
                        }`}
                        style={{
                          background:
                            msg.role === "user"
                              ? "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))"
                              : "rgba(255,255,255,0.06)",
                        }}
                      >
                        {msg.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line.replace(/\*\*(.*?)\*\*/g, "").length !== line.length
                              ? line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                                  part.startsWith("**") && part.endsWith("**") ? (
                                    <strong key={j} className="font-extrabold">
                                      {part.slice(2, -2)}
                                    </strong>
                                  ) : (
                                    <span key={j}>{part}</span>
                                  )
                                )
                              : line}
                            {i < msg.content.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                      {/* Timestamp */}
                      <p
                        className={`text-[9px] font-medium px-1 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                      }}
                    >
                      <Leaf className="h-4 w-4 text-white" />
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-md px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex gap-1.5 items-center">
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          className="h-2 w-2 rounded-full"
                          style={{ background: "hsl(25,95%,53%)" }}
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                          className="h-2 w-2 rounded-full"
                          style={{ background: "hsl(25,95%,60%)" }}
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                          className="h-2 w-2 rounded-full"
                          style={{ background: "hsl(345,65%,47%)" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── Quick Actions ── */}
              {messages.length <= (focusMode === "ngo-suggestions" ? 2 : 1) && (
                <div className="px-4 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p
                    className="mb-2 text-[9px] font-extrabold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Conversation Starters
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {getQuickActions(stateName, focusMode).map((action, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => sendMessage(action)}
                        className="rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 hover:!bg-[hsl(25,95%,53%,0.15)] hover:!text-[hsl(25,95%,65%)] hover:!border-[hsl(25,95%,53%,0.3)]"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Input ── */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Talk to CURA..."
                  className="flex-1 border-none text-sm text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-[hsl(25,95%,53%,0.3)]"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="h-9 w-9 shrink-0 rounded-full border-none disabled:opacity-30"
                  style={{
                    background: "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                  }}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes chatbot-pulse {
          0%, 100% { box-shadow: 0 4px 24px hsl(25,95%,53%,0.4), 0 0 0 0 hsl(25,95%,53%,0.3); }
          50% { box-shadow: 0 4px 24px hsl(25,95%,53%,0.4), 0 0 0 12px hsl(25,95%,53%,0); }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
