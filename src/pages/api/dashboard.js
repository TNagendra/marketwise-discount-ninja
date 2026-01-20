// pages/api/dashboard.js
import { getDashboardStats, getRecentAffiliateTracking } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const stats = await getDashboardStats();
    const trackingData = await getRecentAffiliateTracking(1, 10);

    res.status(200).json({ stats, tracking: trackingData.tracking || [] });
  } catch (error) {
    console.error("API /api/dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
