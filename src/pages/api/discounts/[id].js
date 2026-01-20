// pages/api/discounts/[id].js
import { getDiscountDetails, getDiscountUsage } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    if (req.method === "GET") {
      const [discount, usage] = await Promise.all([
        getDiscountDetails(id),
        getDiscountUsage(
          id,
          Number(req.query.page) || 1,
          Number(req.query.limit) || 10
        ),
      ]);
      return res
        .status(200)
        .json({ discount, usage: usage.usage || [], total: usage.total || 0 });
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method Not Allowed");
  } catch (error) {
    console.error("API /api/discounts/[id] error:", error);
    res.status(500).json({ error: "Failed to load discount" });
  }
}
