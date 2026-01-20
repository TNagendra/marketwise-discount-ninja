// import { getStores } from "@/lib/db";

// export default async function handler(req, res) {
//   try {
//     const { page = 1, limit = 1000 } = req.query;

//     const data = await getStores(Number(page), Number(limit));

//     return res.status(200).json(data.stores);
//   } catch (error) {
//     console.error("STORES API ERROR:", error);
//     return res.status(500).json({ error: "Failed to fetch stores" });
//   }
// }
// import { Pool } from "pg";
// import { connectDB } from "@/lib/db";

// export default async function handler(req, res) {
//   try {
//     const db = await connectDB();

//     const { shop, email, fromDate, toDate } = req.query;

//     let conditions = [];
//     let values = [];
//     let index = 1;

//     if (shop) {
//       conditions.push(`shop ILIKE $${index++}`);
//       values.push(`%${shop}%`);
//     }

//     if (email) {
//       conditions.push(
//         `("email" ILIKE $${index} OR "contactEmail" ILIKE $${index})`
//       );
//       values.push(`%${email}%`);
//       index++;
//     }

//     if (fromDate) {
//       conditions.push(`"createdAt" >= $${index++}`);
//       values.push(fromDate);
//     }

//     if (toDate) {
//       conditions.push(`"createdAt" <= $${index++}`);
//       values.push(toDate);
//     }

//     const whereClause =
//       conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

//     const result = await db.query(
//       `
//       SELECT
//         shop,
//         "planDisplayName",
//         "contactEmail",
//         email,
//         "isActive",
//         "createdAt"
//       FROM stores
//       ${whereClause}
//       ORDER BY "createdAt" DESC
//     `,
//       values
//     );

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("STORES API ERROR:", error);
//     res.status(500).json({ error: "Failed to fetch stores" });
//   }
// }
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

export default async function handler(req, res) {
  try {
    const { shop, email, fromDate, toDate } = req.query;

    let conditions = [];
    let values = [];
    let index = 1;

    if (shop) {
      conditions.push(`shop ILIKE $${index++}`);
      values.push(`%${shop}%`);
    }

    if (email) {
      conditions.push(
        `("email" ILIKE $${index} OR "contactEmail" ILIKE $${index})`
      );
      values.push(`%${email}%`);
      index++;
    }

    if (fromDate) {
      conditions.push(`"createdAt" >= $${index++}`);
      values.push(fromDate);
    }

    if (toDate) {
      conditions.push(`"createdAt" <= $${index++}`);
      values.push(toDate);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `
      SELECT
        shop,
        "planDisplayName",
        "contactEmail",
        email,
        "isActive",
        "createdAt",
        "updatedAt"
      FROM stores
      ${whereClause}
      ORDER BY "createdAt" DESC
      `,
      values
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("STORES API ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch stores" });
  }
}
