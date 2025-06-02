import MnoStatus from "../models/MnoStatus.js";

export async function getMnoStatuses(req, res) {
  try {
    // Fetch all statuses
    const allStatuses = await MnoStatus.find({}).lean();

    // Group by domain
    const grouped = {};
    allStatuses.forEach((doc) => {
      const { domain, mno, lastChecked, rawStatus, computedState } = doc;
      if (!grouped[domain]) {
        grouped[domain] = { 
          domain, 
          website_name: domain.replace(/\.\w+$/, '').charAt(0).toUpperCase() + domain.replace(/\.\w+$/, '').slice(1),
          category: "Gambling", // Default category, update with real logic if available
          globe: null, 
          smart: null, 
          dito: null, 
          last_updated: null 
        };
      }
      
      const entry = {
        status: computedState.toLowerCase(),
        rawStatus,
        timeCreated: lastChecked,
        lastChecked
      };
      
      grouped[domain][mno.toLowerCase()] = entry;

      // Keep track of the newest lastChecked across MNOs
      const timestamp = new Date(lastChecked).getTime();
      if (!grouped[domain].last_updated || timestamp > new Date(grouped[domain].last_updated).getTime()) {
        grouped[domain].last_updated = lastChecked;
      }
    });

    // Format output as array
    const domainsArray = Object.values(grouped);
    res.json(domainsArray);
  } catch (err) {
    console.error("Error in /api/mno-statuses:", err);
    res.status(500).json({ error: "Server error retrieving MNO statuses" });
  }
}

export async function getStatusStats(req, res) {
  try {
    const stats = {
      blocked: 0,
      pending: 0,
      overdue: 0,
      total: 0,
      categories: {},
      providers: {
        globe: { blocked: 0, pending: 0, overdue: 0 },
        smart: { blocked: 0, pending: 0, overdue: 0 },
        dito: { blocked: 0, pending: 0, overdue: 0 }
      }
    };
    
    // Get all statuses
    const allStatuses = await MnoStatus.find({}).lean();
    
    // Count unique domains
    const uniqueDomains = new Set(allStatuses.map(status => status.domain));
    stats.total = uniqueDomains.size;
    
    // Count statuses by domain and provider
    allStatuses.forEach(status => {
      const provider = status.mno.toLowerCase();
      const state = status.computedState.toLowerCase();
      
      // Update provider stats
      if (state === "blocked") {
        stats.blocked++;
        stats.providers[provider].blocked++;
      } else if (state === "pending") {
        stats.pending++;
        stats.providers[provider].pending++;
      } else if (state === "overdue") {
        stats.overdue++;
        stats.providers[provider].overdue++;
      }
    });
    
    res.json(stats);
  } catch (err) {
    console.error("Error getting stats:", err);
    res.status(500).json({ error: "Server error retrieving statistics" });
  }
}

export async function refreshDomainStatus(req, res) {
  try {
    // For now, just return a success message
    const timestamp = new Date().toISOString();
    
    // In a real implementation, you would trigger your Site24x7 pull job here
    // For demo, we'll just return a success message
    
    res.json({
      message: 'Domain status refresh initiated',
      timestamp: timestamp
    });
    
    // Later you could implement actually triggering the pull job:
    // import { MONITORS } from "../cron/pullJob.js";
    // Run the pull job code manually for immediate feedback
    
  } catch (err) {
    console.error("Error refreshing domains:", err);
    res.status(500).json({ error: "Server error while refreshing domain status" });
  }
}