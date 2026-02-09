// pages/api/dashboard.js
import { getDashboardStats, getRecentAffiliateTracking } from "../../lib/db";
import { getSessionFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  // Check session; return 401 if not authenticated or expired
  const { user } = getSessionFromReq(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const stats = await getDashboardStats();
    const trackingData = await getRecentAffiliateTracking(1, 10);

    res.status(200).json({ stats, tracking: trackingData.tracking || [] });
  } catch (error) {
    console.error("API /api/dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
