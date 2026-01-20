// Lightweight auth helpers for development/demo purposes.
// Replace with real DB + secure session handling for production.

const ADMIN_USERS = [
  // Example admin user. Update or replace with DB lookup as needed.
  { email: "admin@example.com", password: "password123", name: "Admin" },
];

export async function validateAdminLogin(email, password) {
  const user = ADMIN_USERS.find(
    (u) => u.email === email && u.password === password,
  );

  // Return a copy without the password
  return user ? { email: user.email, name: user.name } : null;
}

export function getSessionUserFromReq(req) {
  const cookie = req.headers?.cookie || "";
  const match = cookie.match(/(?:^|; )admin_session=([^;]+)/);
  if (!match) return null;
  const email = decodeURIComponent(match[1]);
  const user = ADMIN_USERS.find((u) => u.email === email);
  return user ? { email: user.email, name: user.name } : null;
}

export function clearSessionCookie(res) {
  // Expire cookie immediately
  res.setHeader(
    "Set-Cookie",
    `admin_session=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  );
}

// Only named exports - don't export a default to avoid build issues.
// No default export here — auth helpers only.
