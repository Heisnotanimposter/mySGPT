// A dictionary to translate country ISO codes or names into coordinates if needed, 
// though react-simple-maps uses ISO to render directly.
// We will generate random metrics for OECD countries.
export const OECD_COUNTRIES = [
  "AUS", "AUT", "BEL", "CAN", "CHL", "COL", "CRI", "CZE", "DNK",
  "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ISR",
  "ITA", "JPN", "KOR", "LVA", "LTU", "LUX", "MEX", "NLD", "NZL",
  "NOR", "POL", "PRT", "SVK", "SVN", "ESP", "SWE", "CHE", "TUR",
  "GBR", "USA"
];

// Pre-defined company names for realistic tech/corporate scenarios
const TECH_COMPANIES = ["TechFlow", "GlobalCorp", "InnovateAI", "QuantumSys", "CloudNet", "DataStream", "CyberShield", "AuraTech", "Nexus", "Pinnacle"];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const generateMapData = () => {
  return OECD_COUNTRIES.map(code => {
    // Generate a status skewed somewhat towards normal but dynamic
    const layoffCount = randomInt(10, 5000);
    const hiringCount = randomInt(10, 5000);
    const net = hiringCount - layoffCount;
    
    return {
      countryCode: code,
      layoffs: layoffCount,
      hirings: hiringCount,
      net: net,
      dominant: net > 0 ? 'hiring' : 'layoff',
      intensity: (Math.abs(net) / 5000) // 0 to 1 scale for color opacity
    };
  });
};

export const generateRecentEvents = () => {
  const events = [];
  for (let i = 0; i < 6; i++) {
    const isHiring = Math.random() > 0.4;
    events.push({
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      company: TECH_COMPANIES[randomInt(0, TECH_COMPANIES.length - 1)],
      type: isHiring ? 'hiring' : 'layoff',
      count: randomInt(50, 1500),
      time: `${randomInt(1, 59)} mins ago`,
      role: isHiring ? 'Engineers & Product' : 'Various Roles',
      link: isHiring ? 'https://example.com/careers' : null
    });
  }
  return events;
};
