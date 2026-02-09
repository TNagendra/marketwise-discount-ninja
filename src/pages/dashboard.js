import { useState, useEffect, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Ticket, Flame } from "lucide-react";
import { getSessionFromReq } from "@/lib/auth";

export async function getServerSideProps({ req }) {
  const { user } = getSessionFromReq(req);

  if (!user) {
    // Session missing or expired: redirect immediately to login
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

function SparkArea({ data = [], stroke, fill }) {
  const width = 320;
  const height = 100;
  const padding = 10;
  const gradientId = useId();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        No data
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);

  const span = Math.max(1, data.length - 1);
  const x = (i) => (i / span) * (width - padding * 2) + padding;
  const y = (v) =>
    height - padding - ((v - min) / (max - min || 1)) * (height - padding * 2);

  const points = data.map((d, i) => [x(i), y(d.value)]);
  const dPath = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`,
    )
    .join(" ");

  const areaPath = `${dPath} L ${width - padding}, ${height - padding} L ${padding}, ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill={`url(#${gradientId})`} opacity="0.9" />

      <path
        d={dPath}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "d 700ms ease, stroke 300ms" }}
      />

      {points.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i === points.length - 1 ? 4.2 : 2.6}
          fill={i === points.length - 1 ? stroke : "#fff"}
          stroke={stroke}
          strokeWidth={1.5}
          style={{ transition: "cx 700ms ease, cy 700ms ease" }}
        />
      ))}
    </svg>
  );
}

function DonutGauge({ value, total, accent }) {
  const radius = 36;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const gradientId = useId();

  return (
    <div className="flex items-center gap-4">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={accent.from} />
            <stop offset="100%" stopColor={accent.to} />
          </linearGradient>
        </defs>
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${pct * circumference} ${circumference}`}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dasharray 700ms ease" }}
        />
        <text
          x="48"
          y="52"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="currentColor"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="text-xs text-muted-foreground">
        Active share of total discounts
      </div>
    </div>
  );
}

function StackedBar({ active, total, accent }) {
  const inactive = Math.max(total - active, 0);
  const pct = total > 0 ? (active / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full bg-slate-200/70 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
            transition: "width 700ms ease",
          }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {active} active • {inactive} inactive
      </div>
    </div>
  );
}

function GraphCard({ title, value, subtitle, icon, accent, children }) {
  return (
    <Card
      className="
        relative overflow-hidden
        border border-slate-200/70
        bg-white/80 dark:bg-slate-900/70
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      <div
        className={`absolute inset-0 ${accent.bg} opacity-70`}
        aria-hidden="true"
      />
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className="p-2 rounded-full shadow-sm"
            style={{ background: accent.badgeBg, color: accent.badgeText }}
          >
            {icon}
          </div>
        </div>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {subtitle ? (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
      </CardHeader>
      <CardContent className="relative pt-0">{children}</CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeStores: 0,
    totalDiscounts: 0,
    activeDiscounts: 0,
    totalUsage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [storeStatusTimeseries, setStoreStatusTimeseries] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.status === 401) {
          // Session expired/unauthorized — redirect immediately
          window.location.href = "/login";
          return;
        }
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (!mounted) return;
        setStats(data.stats || {});
        setStoreStatusTimeseries(data.storeStatusTimeseries || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  const latestStoreStatus =
    storeStatusTimeseries[storeStatusTimeseries.length - 1] || {};
  const inactiveStores =
    typeof latestStoreStatus.inactive === "number"
      ? latestStoreStatus.inactive
      : 0;

  const activeSeries = storeStatusTimeseries.map((d) => ({
    day: d.day,
    value: d.active,
  }));
  const inactiveSeries = storeStatusTimeseries.map((d) => ({
    day: d.day,
    value: d.inactive,
  }));

  return (
    <div className="space-y-8">
      <div
        className="
    relative rounded-xl p-6
    bg-gradient-to-r from-primary/15 via-blue-500/15 to-purple-500/15
    bg-animated-gradient
    overflow-hidden
  "
      >
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <p className="mt-4 md:mt-0 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphCard
          title="Active Stores"
          value={stats.activeStores}
          subtitle="Stores currently live"
          icon={<Store className="h-5 w-5" />}
          accent={{
            bg: "bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-cyan-500/15",
            badgeBg: "rgba(16,185,129,0.15)",
            badgeText: "#0f766e",
            from: "#10b981",
            to: "#06b6d4",
          }}
        >
          <div className="h-24">
            <SparkArea data={activeSeries} stroke="#10b981" fill="#10b981" />
          </div>
        </GraphCard>

        <GraphCard
          title="Inactive Stores"
          value={inactiveStores}
          subtitle="Stores currently offline"
          icon={<Store className="h-5 w-5" />}
          accent={{
            bg: "bg-gradient-to-br from-rose-500/15 via-orange-500/10 to-amber-500/15",
            badgeBg: "rgba(244,63,94,0.15)",
            badgeText: "#be123c",
            from: "#f43f5e",
            to: "#f59e0b",
          }}
        >
          <div className="h-24">
            <SparkArea data={inactiveSeries} stroke="#f43f5e" fill="#f59e0b" />
          </div>
        </GraphCard>

        <GraphCard
          title="Total Discounts"
          value={stats.totalDiscounts}
          subtitle="All discount definitions"
          icon={<Ticket className="h-5 w-5" />}
          accent={{
            bg: "bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-orange-500/15",
            badgeBg: "rgba(245,158,11,0.15)",
            badgeText: "#b45309",
            from: "#f59e0b",
            to: "#f43f5e",
          }}
        >
          <StackedBar
            active={stats.activeDiscounts}
            total={stats.totalDiscounts}
            accent={{ from: "#f59e0b", to: "#f43f5e" }}
          />
        </GraphCard>

        <GraphCard
          title="Active Discounts"
          value={stats.activeDiscounts}
          subtitle="Discounts currently running"
          icon={<Flame className="h-5 w-5" />}
          accent={{
            bg: "bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-cyan-500/15",
            badgeBg: "rgba(79,70,229,0.15)",
            badgeText: "#4338ca",
            from: "#6366f1",
            to: "#22d3ee",
          }}
        >
          <DonutGauge
            value={stats.activeDiscounts}
            total={stats.totalDiscounts}
            accent={{ from: "#6366f1", to: "#22d3ee" }}
          />
        </GraphCard>
      </div>

      {/* Activities Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity tracking={tracking} />
        
      </div> */}
    </div>
  );
}

// function RecentActivity({ tracking }) {
//   return (
//     <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="flex items-center">
//           <Clock className="h-5 w-5 mr-2 text-primary" />
//           Recent Affiliate Activity
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {tracking.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             <Users className="h-12 w-12 mx-auto text-muted-foreground/20" />
//             <p className="mt-2">No recent activity</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {tracking.slice(0, 5).map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 rounded-full bg-primary/10">
//                     <Users className="h-4 w-4 text-primary" />
//                   </div>
//                   <div>
//                     <p className="font-medium">{item.affiliate_code}</p>
//                     <p className="text-sm text-muted-foreground">{item.shop}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <Badge
//                     className={
//                       item.status === "converted"
//                         ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
//                         : item.status === "pending"
//                           ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
//                           : "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
//                     }
//                   >
//                     {item.status}
//                   </Badge>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {new Date(item.first_seen_at).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         <Link
//           href="/affiliate"
//           className="text-primary hover:underline text-sm block text-center mt-4"
//         >
//           View all activity →
//         </Link>
//       </CardContent>
//     </Card>
//   );
// }

// function AffiliateTable({ tracking }) {
//   return (
//     <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="flex items-center">
//           <Users className="h-5 w-5 mr-2 text-primary" />
//           Affiliate Tracking
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {tracking.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/20" />
//             <p className="mt-2">No tracking data</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {tracking.slice(0, 5).map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
//               >
//                 <div>
//                   <Link
//                     href={`/affiliate/${item.reliable_hash}`}
//                     className="font-medium hover:text-primary transition-colors"
//                   >
//                     {item.affiliate_code}
//                   </Link>
//                   <p className="text-sm text-muted-foreground">{item.shop}</p>
//                 </div>
//                 <div className="text-right">
//                   <Badge
//                     className={
//                       item.status === "converted"
//                         ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
//                         : item.status === "pending"
//                           ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
//                           : "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
//                     }
//                   >
//                     {item.status}
//                   </Badge>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {new Date(item.first_seen_at).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         <Link
//           href="/affiliate"
//           className="text-primary hover:underline text-sm block text-center mt-4"
//         >
//           View all affiliates →
//         </Link>
//       </CardContent>
//     </Card>
//   );
// }
