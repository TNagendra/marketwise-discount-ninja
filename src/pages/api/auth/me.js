import { getSessionFromReq } from "@/lib/auth";

export default function handler(req, res) {
  const { user, expiresAt } = getSessionFromReq(req);
  return res
    .status(200)
    .json({ user: user || null, expiresAt: expiresAt || null });
}
