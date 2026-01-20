// pages/api/affiliate/[hash].js
import { getAffiliateTrackingDetails } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { hash } = req.query;
    if (!hash) return res.status(400).json({ error: "Missing hash" });

    const data = await getAffiliateTrackingDetails(hash);
    res.status(200).json(data || null);
  } catch (error) {
    console.error("API /api/affiliate/[hash] error:", error);
    res.status(500).json({ error: "Failed to load affiliate detail" });
  }
}
