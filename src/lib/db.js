// lib/db.js
import { Pool } from "pg";
// If the deploy environment explicitly opts in to accept self-signed DB certificates
// set ALLOW_SELF_SIGNED_CERTS=1 in that environment (e.g. Netlify env vars).
// WARNING: Disabling TLS verification is unsafe for public production environments.
// Prefer a CA-signed certificate or a secure proxy. This toggle exists only to
// unblock deployments that must connect to a DB with a self-signed cert.
if (process.env.ALLOW_SELF_SIGNED_CERTS === "1") {
  // This disables TLS certificate validation globally for Node's https/ssl sockets.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "DB: ALLOW_SELF_SIGNED_CERTS=1 detected in production — TLS certificate verification is disabled. This is insecure; prefer a CA-signed certificate.",
    );
  } else {
    console.info(
      "DB: ALLOW_SELF_SIGNED_CERTS=1 — TLS certificate verification disabled for local/dev",
    );
  }
}

// Ensure connection string isn't wrapped in quotes from .env editing
const rawConnectionString = process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.replace(/^"|"$/g, "");

// Helper to safely log non-sensitive parts of the connection string.
function parseAndMaskConnectionString(raw) {
  try {
    // new URL works for postgres/postgresql schemes
    const url = new URL(raw);
    return {
      protocol: url.protocol ? url.protocol.replace(":", "") : undefined,
      host: url.hostname,
      port: url.port,
      database: url.pathname ? url.pathname.replace(/^\//, "") : undefined,
      hasCredentials: !!(url.username || url.password),
      sslmode: raw.includes("sslmode=require"),
    };
  } catch (e) {
    return { rawPresent: !!raw };
  }
}

const _connInfo = parseAndMaskConnectionString(rawConnectionString);
console.info("DB: connection string present=", !!rawConnectionString, "info=", {
  protocol: _connInfo.protocol,
  host: _connInfo.host,
  port: _connInfo.port,
  database: _connInfo.database,
  sslmode: _connInfo.sslmode,
  hasCredentials: _connInfo.hasCredentials,
});

// Configure SSL based on environment and explicit ALLOW_SELF_SIGNED_CERTS
let sslOptions = false;
if (
  connectionString.includes("sslmode=require") ||
  process.env.DATABASE_URL?.includes("sslmode=require")
) {
  sslOptions = {
    // If developer explicitly allowed self-signed certs, don't reject unauthorized
    rejectUnauthorized:
      process.env.ALLOW_SELF_SIGNED_CERTS === "1" ? false : true,
  };
}

const pool = new Pool({
  connectionString,
  ssl: sslOptions,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});

// Global error handler for unexpected client errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle DB client", err);
});

// Try a lightweight connection test once at module load to help with deploy debugging.
(async function testConnection() {
  if (!connectionString) {
    console.warn("DB: no connection string provided; skipping connection test");
    return;
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      console.info("DB: connection test succeeded");
    } finally {
      client.release();
    }
  } catch (err) {
    // Do not print the connection string; print the error message which helps debugging
    console.error(
      "DB: connection test failed:",
      err && err.message ? err.message : err,
    );
  }
})();

async function connectDB() {
  return pool;
}

// Dashboard Stats
export async function getDashboardStats() {
  try {
    const dbClient = await connectDB();

    // Active stores
    const activeStoresResult = await dbClient.query(`
      SELECT COUNT(*) as count 
      FROM stores 
      WHERE "isActive" = true
    `);

    // Total discounts
    const totalDiscountsResult = await dbClient.query(`
      SELECT COUNT(*) as count 
      FROM "Discount"
    `);

    // Active discounts
    const activeDiscountsResult = await dbClient.query(`
      SELECT COUNT(*) as count 
      FROM "Discount"
      WHERE "status" = 'ACTIVE'
    `);

    // Total usage
    const totalUsageResult = await dbClient.query(`
      SELECT COUNT(*) as count 
      FROM "DiscountUsage"
    `);

    return {
      activeStores: parseInt(activeStoresResult.rows[0]?.count) || 0,
      totalDiscounts: parseInt(totalDiscountsResult.rows[0]?.count) || 0,
      activeDiscounts: parseInt(activeDiscountsResult.rows[0]?.count) || 0,
      totalUsage: parseInt(totalUsageResult.rows[0]?.count) || 0,
    };
  } catch (error) {
    console.error("Database stats query error:", error);
    return {
      activeStores: 0,
      totalDiscounts: 0,
      activeDiscounts: 0,
      totalUsage: 0,
    };
  }
}

// Get all stores
export async function getStores(page = 1, limit = 10) {
  try {
    const dbClient = await connectDB();
    const offset = (page - 1) * limit;

    const result = await dbClient.query(
      `
      SELECT 
        shop,
        "isActive",
        "hasActivePayment",
    "planName",
    "planDisplayName",
        "shopOwnerName",
        "email",
        "contactEmail",
        "currencyCode",
        "billingCountry",
        "createdAt",
        "updatedAt"
      FROM stores
      ORDER BY "createdAt" DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await dbClient.query(
      `SELECT COUNT(*) AS count FROM stores`,
    );

    return {
      stores: result.rows || [],
      total: parseInt(countResult.rows[0]?.count) || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Database stores query error:", error);
    return { stores: [], total: 0, page: 1, limit: 10 };
  }
}

// Get store details
export async function getStoreDetails(shopId) {
  try {
    const dbClient = await connectDB();

    const result = await dbClient.query(
      `
      SELECT 
        shop,
        "isActive",
        "hasActivePayment",
        "planName",
        "planDisplayName",
        "shopOwnerName",
        "email",
        "contactEmail",
        "currencyCode",
        "billingCountry",
        "billingCity",
        "createdAt",
        "updatedAt"
      FROM stores
      WHERE shop = $1
      LIMIT 1
    `,
      [shopId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Store details query error:", error);
    return null;
  }
}
export async function getActiveStores() {
  const dbClient = await connectDB();

  const result = await dbClient.query(`
    SELECT 
      shop,
      "isActive",
      "planDisplayName",
      "shopOwnerName",
      email,
      "contactEmail",
      "currencyCode",
      "billingCountry",
      "billingCity",
      "createdAt",
      "updatedAt"
    FROM stores
    WHERE "isActive" = true
    ORDER BY "createdAt" DESC
  `);

  return result.rows || [];
}
export async function getInactiveStores() {
  const dbClient = await connectDB();

  const result = await dbClient.query(`
    SELECT 
      shop,
      "isActive",
      "planDisplayName",
      "shopOwnerName",
      email,
      "contactEmail",
      "currencyCode",
      "billingCountry",
      "billingCity",
      "createdAt",
      "updatedAt"
    FROM stores
    WHERE "isActive" = false
    ORDER BY "createdAt" DESC
  `);

  return result.rows || [];
}

// Get discounts for a store
export async function getStoreDiscounts(shopId, page = 1, limit = 10) {
  try {
    const dbClient = await connectDB();
    const offset = (page - 1) * limit;

    const result = await dbClient.query(
      `
      SELECT 
        id,
        "shopId",
        "title",
        "code",
        "category",
        "method",
        "status",
        "valueType",
        "discountAmount",
        "startsAt",
        "endsAt",
        "createdAt",
        "updatedAt"
      FROM "Discount"
      WHERE "shopId" = $1
      ORDER BY "createdAt" DESC
      LIMIT $2 OFFSET $3
      `,
      [shopId, limit, offset],
    );

    const countResult = await dbClient.query(
      `SELECT COUNT(*) AS count FROM "Discount" WHERE "shopId" = $1`,
      [shopId],
    );

    return {
      discounts: result.rows || [],
      total: parseInt(countResult.rows[0]?.count) || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Store discounts query error:", error);
    return { discounts: [], total: 0, page: 1, limit: 10 };
  }
}

// Get discount details
export async function getDiscountDetails(discountId) {
  try {
    const dbClient = await connectDB();

    const result = await dbClient.query(
      `
      SELECT 
        id,
        "shopId",
        "title",
        "code",
        "category",
        "method",
        "status",
        "valueType",
        "discountAmount",
        "startsAt",
        "endsAt",
        "priority",
        "description",
        "createdAt",
        "updatedAt"
      FROM "Discount"
      WHERE id = $1
      LIMIT 1
    `,
      [discountId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Discount details query error:", error);
    return null;
  }
}

// Get discount usage
export async function getDiscountUsage(discountId, page = 1, limit = 10) {
  try {
    const dbClient = await connectDB();
    const offset = (page - 1) * limit;

    const result = await dbClient.query(
      `
      SELECT 
        id,
        "orderId",
        "orderNumber",
        "customerId",
        "customerEmail",
        "amountSaved",
        "itemsDiscounted",
        "usedAt"
      FROM "DiscountUsage"
      WHERE "discountId" = $1
      ORDER BY "usedAt" DESC
      LIMIT $2 OFFSET $3
      `,
      [discountId, limit, offset],
    );

    const countResult = await dbClient.query(
      `SELECT COUNT(*) AS count FROM "DiscountUsage" WHERE "discountId" = $1`,
      [discountId],
    );

    return {
      usage: result.rows || [],
      total: parseInt(countResult.rows[0]?.count) || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Discount usage query error:", error);
    return { usage: [], total: 0, page: 1, limit: 10 };
  }
}

// Get recent affiliate tracking entries
export async function getRecentAffiliateTracking(page = 1, limit = 10) {
  try {
    const dbClient = await connectDB();
    const offset = (page - 1) * limit;

    const result = await dbClient.query(
      `
      SELECT 
        id,
        "reliable_hash",
        "affiliate_code",
        shop,
        status,
        "first_seen_at",
        "last_seen_at",
        "expires_at",
        "attributed_at"
      FROM "affiliate_tracking"
      ORDER BY "first_seen_at" DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await dbClient.query(
      `SELECT COUNT(*) AS count FROM "affiliate_tracking"`,
    );

    return {
      tracking: result.rows || [],
      total: parseInt(countResult.rows[0]?.count) || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Affiliate tracking query error:", error);
    return { tracking: [], total: 0, page: 1, limit: 10 };
  }
}

// Get affiliate tracking details
export async function getAffiliateTrackingDetails(hash) {
  try {
    const dbClient = await connectDB();

    const result = await dbClient.query(
      `
      SELECT 
        id,
        "reliable_hash",
        "affiliate_code",
        shop,
        status,
        "first_seen_at",
        "last_seen_at",
        "expires_at",
        "attributed_at",
        "exported",
        "exported_at",
        "created_at",
        "updated_at"
      FROM "affiliate_tracking"
      WHERE "reliable_hash" = $1
      LIMIT 1
    `,
      [hash],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Affiliate tracking details query error:", error);
    return null;
  }
}
