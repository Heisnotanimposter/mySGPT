/**
 * Real-world data integration layer for Employment Pulse.
 * Fetches data from OECD (Statistics), Arbeitnow (Jobs), and News (Layoff signals).
 */

const OECD_BASE_URL = "https://sdmx.oecd.org/public/rest/data";
const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";
const NEWS_PROXY_URL = "https://api.rss2json.com/v1/api.json?rss_url=";

// TechCrunch Search RSS for layoffs as a signal
const LAYOFF_RSS = "https://techcrunch.com/tag/layoffs/feed/";

/**
 * Fetches Unemployment rates for OECD countries.
 * This powers the Global Heatmap.
 */
/**
 * Fetches Unemployment rates from World Bank API for OECD countries.
 * Indicator: SL.UEM.TOTL.ZS (Unemployment, total % of labor force)
 */
export const fetchWorldBankStats = async () => {
  try {
    // Fetch latest data for all countries (page 1, 500 records to cover all)
    const url = "https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1&per_page=500";
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`World Bank API Error: ${response.status}`);
    const json = await response.json();
    
    // World Bank returns [metadata, data]
    const data = json[1];
    
    // List of OECD ISO-3 codes to filter
    const OECD_ISO = [
      "AUS", "AUT", "BEL", "CAN", "CHL", "COL", "CRI", "CZE", "DNK",
      "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ISR",
      "ITA", "JPN", "KOR", "LVA", "LTU", "LUX", "MEX", "NLD", "NZL",
      "NOR", "POL", "PRT", "SVK", "SVN", "ESP", "SWE", "CHE", "TUR",
      "GBR", "USA"
    ];

    return data
      .filter(entry => OECD_ISO.includes(entry.countryiso3code) && entry.value !== null)
      .map(entry => ({
        countryCode: entry.countryiso3code,
        name: entry.country.value,
        value: entry.value.toFixed(1),
        // Map unemployment value to an intensity 0-1 (2% to 12% scale)
        intensity: Math.min(Math.max((entry.value - 2) / 10, 0), 1),
        dominant: entry.value > 6 ? 'layoff' : 'hiring',
      }));
  } catch (error) {
    console.error("Failed to fetch World Bank data:", error);
    return null;
  }
};

/**
 * Fetches historical unemployment data for a specific country.
 * Returns the last 10 years of data.
 */
export const fetchCountryHistory = async (isoCode) => {
  try {
    // Fetch last 12 years to be safe
    const url = `https://api.worldbank.org/v2/country/${isoCode}/indicator/SL.UEM.TOTL.ZS?format=json&mrv=12`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`World Bank API Error: ${response.status}`);
    const json = await response.json();
    
    if (!json[1]) return [];

    return json[1]
      .filter(entry => entry.value !== null)
      .map(entry => ({
        year: entry.date,
        value: parseFloat(entry.value.toFixed(1))
      }))
      .reverse(); // Chronological order
  } catch (error) {
    console.error(`Failed to fetch history for ${isoCode}:`, error);
    return [];
  }
};

/**
 * Fetches live job listings from Arbeitnow.
 * This powers the Recruitment Action Cards and Ticker.
 */
export const fetchLiveJobs = async () => {
  try {
    const response = await fetch(ARBEITNOW_URL);
    if (!response.ok) throw new Error("Arbeitnow API Error");
    const json = await response.json();
    
    return json.data.map(job => ({
      id: job.slug,
      company: job.company_name,
      type: 'hiring',
      count: 1, // Individual listing
      time: 'Just now',
      role: job.title,
      link: job.url,
      location: job.location,
      tags: job.tags
    }));
  } catch (error) {
    console.error("Failed to fetch live jobs:", error);
    return [];
  }
};

/**
 * Fetches layoff news as a proxy for "real-time" layoff signals.
 */
export const fetchLayoffSignals = async () => {
  try {
    const response = await fetch(`${NEWS_PROXY_URL}${encodeURIComponent(LAYOFF_RSS)}`);
    if (!response.ok) throw new Error("News Proxy Error");
    const json = await response.json();
    
    return json.items.slice(0, 5).map(item => {
      // Extract company name from title "Amazon layoffs...", "Google cuts..."
      const title = item.title;
      const companyMatch = title.match(/([A-Z][a-z]+)/); // Simple heuristic
      const company = companyMatch ? companyMatch[1] : "Multiple Tech Cos";
      
      return {
        id: item.guid,
        company: company,
        type: 'layoff',
        count: 'N/A', // News doesn't always have counts
        time: 'Recent',
        role: 'News Update',
        link: item.link,
        headline: title
      };
    });
  } catch (error) {
    console.error("Failed to fetch layoff signals:", error);
    return [];
  }
};
