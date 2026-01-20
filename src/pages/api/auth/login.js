import { validateAdminLogin } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await validateAdminLogin(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Set auth cookie with an expiry timestamp (1 hour)
    const maxAgeMs = 1000 * 60 * 60; // 1 hour
    const expiresAt = Date.now() + maxAgeMs;
    const cookieValue = encodeURIComponent(`${user.email}|${expiresAt}`);
    const expires = new Date(expiresAt).toUTCString();
    res.setHeader(
      "Set-Cookie",
      `admin_session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`,
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login error" });
  }
}
