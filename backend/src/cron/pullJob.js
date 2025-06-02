import cron from "node-cron";
import fetch from "node-fetch";
import MnoStatus from "../models/MnoStatus.js";
import BlockOrder from "../models/BlockOrder.js";

// Define monitor configuration - replace with your actual monitor IDs
export const MONITORS = [
  // Example entries; replace with your actual monitor IDs:
  { monitorId: 111111, domain: "betsite.com", mno: "Globe" },
  { monitorId: 222222, domain: "betsite.com", mno: "Smart" },
  { monitorId: 333333, domain: "betsite.com", mno: "DITO" },
  // Add remaining monitors here (90 total for 30 domains × 3 MNOs)
];

// Helper: fetch monitor status from Site24x7 API
async function getMonitorData(monitorId) {
  const url = `https://www.site24x7.com/api/monitors/${monitorId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-authtoken ${process.env.SITE24X7_API_KEY}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Site24x7 API responded ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Helper: compute "Blocked / Pending / Overdue"
async function determineComputedState(domain, status, lastPolledTime) {
  // status: "0"=Up, anything else = Down
  if (status !== "0") {
    return "Blocked";
  }
  
  // status === "0" → still Up, so see if >24h since blockOrder
  const blockOrder = await BlockOrder.findOne({ domain });
  if (!blockOrder) {
    // No block order exists → treat as Pending as long as it's Up
    return "Pending";
  }
  
  const issuedAt = blockOrder.issuedAt;
  const lastChecked = new Date(lastPolledTime);
  const now = new Date();
  if (now - issuedAt > 24 * 60 * 60 * 1000) {
    return "Overdue";
  }
  return "Pending";
}

// Start the cron job
export function startPullJob() {
  cron.schedule(process.env.CRON_SCHEDULE || "*/5 * * * *", async () => {
    console.log(`[${new Date().toISOString()}] Starting scheduled pull from Site24x7…`);

    const tasks = MONITORS.map(async ({ monitorId, domain, mno }) => {
      try {
        const data = await getMonitorData(monitorId);
        const status = data.status;                // "0"=Up, "1"=Down
        const rawStatus = data.status_message;     // "Up" or "Down"
        const lastPolledTime = data.last_polled_time; // e.g. "2025-06-02T01:23:45Z"
        const responseTime = Number(data.response_time) || undefined;

        const computedState = await determineComputedState(domain, status, lastPolledTime);

        // Upsert into MnoStatus collection
        await MnoStatus.findOneAndUpdate(
          { domain, mno },
          {
            lastChecked: new Date(lastPolledTime),
            rawStatus,
            computedState,
            responseTimeMs: responseTime,
            errorMessage: null
          },
          { upsert: true, new: true }
        );
        
        console.log(`Updated ${domain} / ${mno}: ${computedState}`);
      } catch (err) {
        console.error(`Error fetching monitor ${monitorId} (${domain} / ${mno}):`, err.message);
        
        // If error, mark as Overdue and store errorMessage
        await MnoStatus.findOneAndUpdate(
          { domain, mno },
          {
            lastChecked: new Date(),
            rawStatus: "Error",
            computedState: "Overdue",
            errorMessage: err.message
          },
          { upsert: true, new: true }
        );
      }
    });

    await Promise.all(tasks);
    console.log(`[${new Date().toISOString()}] Scheduled pull complete.`);
  });
  
  console.log("Site24x7 monitoring job scheduled");
}