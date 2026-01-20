import { getActiveStores, getInactiveStores } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const active = await getActiveStores();
    const inactive = await getInactiveStores();

    return res.status(200).json({ active, inactive });
  } catch (error) {
    console.error("STORE STATUS API ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch stores" });
  }
}
