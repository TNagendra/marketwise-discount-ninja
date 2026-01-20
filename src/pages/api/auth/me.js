import { getSessionUserFromReq } from "@/lib/auth";

export default function handler(req, res) {
  const user = getSessionUserFromReq(req);
  if (!user) return res.status(200).json({ user: null });
  return res.status(200).json({ user });
}
