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

    // Set simple auth cookie
    res.setHeader(
      "Set-Cookie",
      `admin_session=${encodeURIComponent(user.email)}; Path=/; HttpOnly; SameSite=Lax`,
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login error" });
  }
}
