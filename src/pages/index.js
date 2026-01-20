import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json?.user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (e) {
        router.replace("/login");
      }
    })();
  }, [router]);

  return (
    <div className="p-6">
      <p>Checking session...</p>
      <noscript>
        <a href="/login">Go to Login</a>
      </noscript>
    </div>
  );
}
