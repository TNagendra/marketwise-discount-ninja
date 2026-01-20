// pages/api/affiliate/index.js
import { getRecentAffiliateTracking } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getRecentAffiliateTracking(Number(page), Number(limit));
    res.status(200).json(data);
  } catch (error) {
    console.error("API /api/affiliate error:", error);
    res.status(500).json({ error: "Failed to load affiliate tracking" });
  }
}
