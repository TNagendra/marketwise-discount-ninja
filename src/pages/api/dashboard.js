// pages/api/dashboard.js
import {
  getDashboardStats,
  getRecentAffiliateTracking,
  getUsageTimeseries,
  getStoreStatusTimeseries,
} from "../../lib/db";
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
    const timeseries = await getUsageTimeseries(14);
    const storeStatusTimeseries = await getStoreStatusTimeseries(14);

    // compute simple percentage growth: compare last 7 days vs previous 7 days
    const last7 = timeseries.slice(-7).reduce((s, r) => s + r.count, 0);
    const prev7 = timeseries.slice(-14, -7).reduce((s, r) => s + r.count, 0);
    const growth =
      prev7 === 0 ? (last7 === 0 ? 0 : 100) : ((last7 - prev7) / prev7) * 100;

    res
      .status(200)
      .json({
        stats,
        tracking: trackingData.tracking || [],
        timeseries,
        growth,
        storeStatusTimeseries,
      });
  } catch (error) {
    console.error("API /api/dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
