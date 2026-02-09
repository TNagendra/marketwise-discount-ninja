// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useTheme } from "next-themes";
// import { Moon, Sun, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Router from "next/router";

// export default function Layout({ children }) {
//   const router = useRouter();
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     setMounted(true);

//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/auth/me");
//         const json = await res.json();
//         setUser(json.user);
//       } catch (e) {
//         setUser(null);
//       }
//     };

//     // initial fetch
//     fetchUser();

//     // listen for auth changes (login/logout) so the UI updates immediately
//     const onAuthChange = () => fetchUser();
//     window.addEventListener("auth:change", onAuthChange);

//     return () => {
//       window.removeEventListener("auth:change", onAuthChange);
//     };
//   }, []);

//   const navigation = [
//     { name: "Dashboard", href: "/dashboard" },
//     { name: "Stores", href: "/stores" },
//     { name: "Discounts", href: "/discounts" },
//     { name: "Affiliate Tracking", href: "/affiliate" },
//   ];

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark");
//   };

//   const isActive = (href) => router.pathname === href;

//   // SSR placeholder (prevents hydration mismatch)
//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-background app-gradient-bg">
//         <nav className="border-b bg-card h-16" />
//         <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background app-page-bg">
//       {/* NAVBAR */}
//       <nav
//         className="
//     relative border-b
//     bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10
//     bg-animated-gradient
//     backdrop-blur
//   "
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* LEFT */}
//             <div className="flex items-center">
//               {/* <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
//                 MarketWise Admin
//               </h1> */}
//               {/* <div className="flex items-center gap-2">
//                 <Image
//                   src="/discount-ninja.png" // or /logo.png
//                   alt="MarketWise Logo"
//                   width={36}
//                   height={36}
//                   priority
//                 />
//                 <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
//                   MarketWise Admin
//                 </span>
//               </div> */}

//               <Link
//                 href="/dashboard"
//                 className="
//     flex items-center gap-2 group
//     rounded-md px-2 py-1
//     hover:bg-primary/5
//     transition
//   "
//               >
//                 <Image
//                   src="/discount-ninja.png"
//                   alt="MarketWise Logo"
//                   width={36}
//                   height={36}
//                   priority
//                   className="
//       rounded
//       transition-all duration-300 ease-out
//       group-hover:scale-110
//       group-hover:rotate-3
//     "
//                 />

//                 <span
//                   className="
//     text-lg font-bold
//     bg-gradient-to-r from-primary to-blue-600
//     bg-clip-text text-transparent
//     hidden sm:inline
//   "
//                 >
//                   MarketWise Admin
//                 </span>
//               </Link>

//               {/* DESKTOP NAV - show only when user is present */}
//               {user && (
//                 <div className="hidden sm:flex sm:ml-10 sm:space-x-8">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors
//                       ${
//                         isActive(item.href)
//                           ? "border-primary text-foreground"
//                           : "border-transparent text-muted-foreground hover:text-foreground"
//                       }`}
//                     >
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-2">
//               {/* Theme Toggle */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleTheme}
//                 aria-label="Toggle theme"
//               >
//                 {theme === "dark" ? (
//                   <Sun className="h-5 w-5" />
//                 ) : (
//                   <Moon className="h-5 w-5" />
//                 )}
//               </Button>
//               {/* Login / Logout */}
//               {!user ? (
//                 <Link
//                   href="/login"
//                   className="text-sm font-medium text-foreground hover:underline"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={async () => {
//                     await fetch("/api/auth/logout");
//                     setUser(null);
//                     try {
//                       window.dispatchEvent(new Event("auth:change"));
//                     } catch (e) {}
//                     Router.push("/login");
//                   }}
//                   className="text-sm font-medium text-foreground hover:underline"
//                 >
//                   Logout
//                 </button>
//               )}

//               {/* MOBILE MENU BUTTON */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="sm:hidden"
//                 onClick={() => setMobileOpen(!mobileOpen)}
//                 aria-label="Toggle menu"
//               >
//                 {mobileOpen ? (
//                   <X className="h-5 w-5" />
//                 ) : (
//                   <Menu className="h-5 w-5" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         {mobileOpen && (
//           <div className="sm:hidden border-t bg-card">
//             <div className="px-4 py-3 space-y-2">
//               {user ? (
//                 navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     onClick={() => setMobileOpen(false)}
//                     className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors
//                     ${
//                       isActive(item.href)
//                         ? "bg-primary/10 text-primary"
//                         : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                     }`}
//                   >
//                     {item.name}
//                   </Link>
//                 ))
//               ) : (
//                 <Link
//                   href="/login"
//                   onClick={() => setMobileOpen(false)}
//                   className="block rounded-md px-3 py-2 text-sm font-medium text-foreground"
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* MAIN CONTENT */}
//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        setUser(json.user);
        return json;
      } catch (e) {
        setUser(null);
        return { user: null, expiresAt: null };
      }
    };

    // initial fetch
    let logoutTimer = null;
    const scheduleLogoutFromExpires = (expiresAt) => {
      try {
        if (!expiresAt) return;
        const msUntil = Number(expiresAt) - Date.now();
        if (msUntil <= 0) {
          // already expired - redirect now
          setUser(null);
          try {
            window.dispatchEvent(new Event("auth:change"));
          } catch (e) {}
          Router.push("/login");
          return;
        }
        if (logoutTimer) clearTimeout(logoutTimer);
        logoutTimer = setTimeout(async () => {
          try {
            await fetch("/api/auth/logout");
          } catch (e) {}
          setUser(null);
          try {
            window.dispatchEvent(new Event("auth:change"));
          } catch (e) {}
          Router.push("/login");
        }, msUntil + 50);
      } catch (e) {
        // ignore
      }
    };

    (async () => {
      const initial = await fetchUser();
      // If initial fetch shows no user, redirect immediately to prevent briefly showing protected UI
      if (!initial?.user) {
        setUser(null);
        try {
          window.dispatchEvent(new Event("auth:change"));
        } catch (e) {}
        if (router.pathname !== "/login") Router.push("/login");
        return;
      }
      scheduleLogoutFromExpires(initial?.expiresAt || null);
    })();

    const onAuthChange = async () => {
      const j = await fetchUser();
      scheduleLogoutFromExpires(j?.expiresAt || null);
    };
    window.addEventListener("auth:change", onAuthChange);

    // Poll /api/auth/me periodically to catch session expiry that might be missed
    const pollAuthInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("auth check failed");
        const json = await res.json();
        if (!json.user) {
          try {
            if (logoutTimer) {
              clearTimeout(logoutTimer);
              logoutTimer = null;
            }
          } catch (e) {}
          clearInterval(pollAuthInterval);
          setUser(null);
          try {
            window.dispatchEvent(new Event("auth:change"));
          } catch (e) {}
          if (router.pathname !== "/login") Router.push("/login");
          return;
        }
        // if server supplies an expiresAt, reschedule the logout
        if (json.expiresAt) scheduleLogoutFromExpires(json.expiresAt);
      } catch (e) {
        // ignore
      }
    }, 10000);

    return () => {
      window.removeEventListener("auth:change", onAuthChange);
      try {
        if (logoutTimer) clearTimeout(logoutTimer);
      } catch (e) {}
      try {
        clearInterval(pollAuthInterval);
      } catch (e) {}
    };
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Stores", href: "/stores" },
    // Discounts and Affiliate links removed per request
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href) => router.pathname === href;

  // SSR placeholder (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background app-gradient-bg w-full">
        <nav className="border-b bg-card h-16 w-full" />
        <main className="w-full py-6 px-4">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background app-page-bg">
      {/* NAVBAR */}
      <nav
        className="
    relative border-b
    bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10
    bg-animated-gradient
    backdrop-blur
  "
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LEFT */}
            <div className="flex items-center">
              {/* <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MarketWise Admin
              </h1> */}
              {/* <div className="flex items-center gap-2">
                <Image
                  src="/discount-ninja.png" // or /logo.png
                  alt="MarketWise Logo"
                  width={36}
                  height={36}
                  priority
                />
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  MarketWise Admin
                </span>
              </div> */}

              <Link
                href="/dashboard"
                className="
    flex items-center gap-2 group
    rounded-md px-2 py-1
    hover:bg-primary/5
    transition
  "
              >
                <Image
                  src="/discount-ninja.png"
                  alt="MarketWise Logo"
                  width={36}
                  height={36}
                  priority
                  className="
      rounded
      transition-all duration-300 ease-out
      group-hover:scale-110
      group-hover:rotate-3
    "
                />

                <span
                  className="
    text-lg font-bold
    bg-gradient-to-r from-primary to-blue-600
    bg-clip-text text-transparent
    hidden sm:inline
  "
                >
                  MarketWise Admin
                </span>
              </Link>

              {/* DESKTOP NAV - show only when user is present */}
              {user && (
                <div className="hidden sm:flex sm:ml-10 sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors
                      ${
                        isActive(item.href)
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {/* Login / Logout */}
              {!user ? (
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout");
                    setUser(null);
                    try {
                      window.dispatchEvent(new Event("auth:change"));
                    } catch (e) {}
                    Router.push("/login");
                  }}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Logout
                </button>
              )}

              {/* MOBILE MENU BUTTON */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="sm:hidden border-t bg-card">
            <div className="px-4 py-3 space-y-2">
              {user ? (
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main>
        <div className="w-full py-6 sm:px-6 lg:px-8 px-4">{children}</div>
      </main>
    </div>
  );
}
