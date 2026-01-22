import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Ticket,
  Flame,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";
export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || "";

  if (!cookie.includes("admin_session")) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeStores: 0,
    totalDiscounts: 0,
    activeDiscounts: 0,
    totalUsage: 0,
  });

  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (!mounted) return;
        setStats(data.stats || {});
        setTracking(data.tracking || []);
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Stores"
          value={stats.activeStores}
          icon={<Store className="h-5 w-5" />}
          change="+12% from last month"
          trend="up"
        />
        <StatCard
          title="Total Discounts"
          value={stats.totalDiscounts}
          icon={<Ticket className="h-5 w-5" />}
          change="+8% from last month"
          trend="up"
        />
        <StatCard
          title="Active Discounts"
          value={stats.activeDiscounts}
          icon={<Flame className="h-5 w-5" />}
          change="+3% from last month"
          trend="up"
        />
        <StatCard
          title="Total Usage"
          value={stats.totalUsage}
          icon={<BarChart3 className="h-5 w-5" />}
          change="+18% from last month"
          trend="up"
        />
      </div>

      {/* Activities Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity tracking={tracking} />
        
      </div> */}
    </div>
  );
}

// function StatCard({ title, value, icon, change, trend }) {
//   return (
//     <Card className="transition-all hover:shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">
//           {title}
//         </CardTitle>
//         <div className="p-2 rounded-full bg-primary/10 text-primary">
//           {icon}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         <p className="text-xs text-muted-foreground mt-1 flex items-center">
//           {trend === "up" ? (
//             <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
//           ) : (
//             <TrendingUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
//           )}
//           {change}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
function StatCard({ title, value, icon, change, trend }) {
  return (
    <Card
      className="
        relative overflow-hidden
        transition-all duration-300
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      {/* Gradient overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10
          bg-animated-gradient
          opacity-60
        "
      />

      <div className="relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-primary/15 text-primary">
            {icon}
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
            )}
            {change}
          </p>
        </CardContent>
      </div>
    </Card>
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
