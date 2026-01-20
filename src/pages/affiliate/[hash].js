// // pages/affiliate/[hash].js
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// export default function AffiliateDetailsPage() {
//   const router = useRouter();
//   const { hash } = router.query;
//   const [tracking, setTracking] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!hash) return;

//     async function fetchData() {
//       try {
//         const res = await fetch(`/api/affiliate/${hash}`);
//         if (!res.ok) throw new Error(`API error ${res.status}`);
//         const data = await res.json();
//         setTracking(data);
//       } catch (error) {
//         console.error("Error fetching affiliate data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [hash]);

//   if (loading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   if (!tracking) {
//     return <div className="p-6">Affiliate tracking not found</div>;
//   }

//   return (
//     <div className="p-6">
//       <Link
//         href="/affiliate"
//         className="text-blue-500 hover:underline mb-4 inline-block"
//       >
//         ← Back to Affiliate Tracking
//       </Link>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold mb-4">Affiliate Tracking Details</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p className="text-gray-600">
//               <strong>Affiliate Code:</strong> {tracking.affiliate_code}
//             </p>
//             <p className="text-gray-600">
//               <strong>Shop:</strong> {tracking.shop}
//             </p>
//             <p className="text-gray-600">
//               <strong>Status:</strong>
//               <span
//                 className={`ml-2 px-2 py-1 rounded text-xs ${
//                   tracking.status === "converted"
//                     ? "bg-green-100 text-green-800"
//                     : tracking.status === "pending"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 {tracking.status}
//               </span>
//             </p>
//             <p className="text-gray-600">
//               <strong>First Seen:</strong>{" "}
//               {new Date(tracking.first_seen_at).toLocaleString()}
//             </p>
//             <p className="text-gray-600">
//               <strong>Last Seen:</strong>{" "}
//               {new Date(tracking.last_seen_at).toLocaleString()}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-600">
//               <strong>Expires:</strong>{" "}
//               {new Date(tracking.expires_at).toLocaleString()}
//             </p>
//             <p className="text-gray-600">
//               <strong>Attributed:</strong>{" "}
//               {tracking.attributed_at
//                 ? new Date(tracking.attributed_at).toLocaleString()
//                 : "Not yet"}
//             </p>
//             <p className="text-gray-600">
//               <strong>Exported:</strong>
//               <span
//                 className={`ml-2 px-2 py-1 rounded text-xs ${
//                   tracking.exported
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 {tracking.exported ? "Yes" : "No"}
//               </span>
//             </p>
//             <p className="text-gray-600">
//               <strong>Exported At:</strong>{" "}
//               {tracking.exported_at
//                 ? new Date(tracking.exported_at).toLocaleString()
//                 : "N/A"}
//             </p>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Technical Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-600">
//                 <strong>Timezone:</strong> {tracking.timezone || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Screen Resolution:</strong>{" "}
//                 {tracking.screen_resolution || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Platform:</strong> {tracking.platform || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Language:</strong> {tracking.language || "N/A"}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600">
//                 <strong>Hardware Concurrency:</strong>{" "}
//                 {tracking.hardware_concurrency || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Color Depth:</strong> {tracking.color_depth || "N/A"}
//               </p>
//               <p className="text-gray-600">
//                 <strong>User Agent:</strong>{" "}
//                 {tracking.user_agent_stable || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AffiliateDetailsPage() {
  const router = useRouter();
  const { hash } = router.query;
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/affiliate/${hash}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        setTracking(data);
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [hash]);

  if (loading) {
    return <div className="p-6 dark:text-white">Loading...</div>;
  }

  if (!tracking) {
    return (
      <div className="p-6 dark:text-white">Affiliate tracking not found</div>
    );
  }

  return (
    <div className="p-6 dark:bg-black min-h-screen">
      <Link
        href="/affiliate"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
      >
        ← Back to Affiliate Tracking
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Affiliate Tracking Details
        </h1>

        {/* MAIN DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Affiliate Code:</strong> {tracking.affiliate_code}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Shop:</strong> {tracking.shop}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  tracking.status === "converted"
                    ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300"
                    : tracking.status === "pending"
                    ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {tracking.status}
              </span>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>First Seen:</strong>{" "}
              {new Date(tracking.first_seen_at).toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Last Seen:</strong>{" "}
              {new Date(tracking.last_seen_at).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Expires:</strong>{" "}
              {new Date(tracking.expires_at).toLocaleString()}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              <strong>Attributed:</strong>{" "}
              {tracking.attributed_at
                ? new Date(tracking.attributed_at).toLocaleString()
                : "Not yet"}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              <strong>Exported:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  tracking.exported
                    ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-gray-300"
                }`}
              >
                {tracking.exported ? "Yes" : "No"}
              </span>
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              <strong>Exported At:</strong>{" "}
              {tracking.exported_at
                ? new Date(tracking.exported_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* TECHNICAL DETAILS */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            Technical Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Timezone:</strong> {tracking.timezone || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Screen Resolution:</strong>{" "}
                {tracking.screen_resolution || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Platform:</strong> {tracking.platform || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Language:</strong> {tracking.language || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Hardware Concurrency:</strong>{" "}
                {tracking.hardware_concurrency || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Color Depth:</strong> {tracking.color_depth || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 break-words">
                <strong>User Agent:</strong>{" "}
                {tracking.user_agent_stable || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
