import { getStoreDiscounts } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const { shopId, page = 1, limit = 20 } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: "Missing shopId" });
    }

    const data = await getStoreDiscounts(shopId, Number(page), Number(limit));

    return res.status(200).json(data);
  } catch (error) {
    console.error("DISCOUNTS API ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch discounts" });
  }
}
