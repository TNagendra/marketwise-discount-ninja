"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RouteChangeSpinner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate a short delay for loading effect
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 pointer-events-none">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  );
}
