// pages/api/stores/[id].js
import { getStoreDetails, getStoreDiscounts } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    if (req.method === "GET") {
      const [store, discounts] = await Promise.all([
        getStoreDetails(id),
        getStoreDiscounts(
          id,
          Number(req.query.page) || 1,
          Number(req.query.limit) || 10
        ),
      ]);
      return res
        .status(200)
        .json({
          store,
          discounts: discounts.discounts || [],
          total: discounts.total || 0,
        });
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method Not Allowed");
  } catch (error) {
    console.error("API /api/stores/[id] error:", error);
    res.status(500).json({ error: "Failed to load store" });
  }
}
