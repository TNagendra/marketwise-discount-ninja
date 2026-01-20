// import { useState, useEffect } from "react";
// import Link from "next/link";

// export default function AffiliatePage() {
//   const [tracking, setTracking] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch(`/api/affiliate?page=${page}&limit=10`);
//         if (!res.ok) throw new Error(`API error ${res.status}`);
//         const data = await res.json();
//         setTracking(data.tracking || []);
//         setTotal(data.total || 0);
//       } catch (error) {
//         console.error("Error fetching affiliate data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [page]);

//   if (loading) {
//     return <div className="p-6 dark:text-white">Loading...</div>;
//   }

//   return (
//     <div className="p-6 dark:bg-black min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 dark:text-white">
//         Affiliate Tracking
//       </h1>

//       <div className="bg-white dark:bg-neutral-900 rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
//           <thead className="bg-gray-50 dark:bg-neutral-800">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 Affiliate Code
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 Shop
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 First Seen
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                 Last Seen
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
//             {tracking.map((item) => (
//               <tr
//                 key={item.id}
//                 className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <Link
//                     href={`/affiliate/${item.reliable_hash}`}
//                     className="text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     {item.affiliate_code}
//                   </Link>
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                   {item.shop}
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                       ${
//                         item.status === "converted"
//                           ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300"
//                           : item.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
//                           : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
//                       }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                   {new Date(item.first_seen_at).toLocaleDateString()}
//                 </td>

//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                   {new Date(item.last_seen_at).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}

//             {tracking.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   No affiliate tracking data
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-4 flex justify-between items-center dark:text-white">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-200 dark:bg-black dark:text-white
//                      rounded disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>

//         <span>
//           Page {page} of {Math.ceil(total / 10)}
//         </span>

//         <button
//           onClick={() => setPage((p) => p + 1)}
//           disabled={page * 10 >= total}
//           className="px-4 py-2 bg-gray-200 dark:bg-black dark:text-white
//                      rounded disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, Store, ChevronLeft, ChevronRight } from "lucide-react";

export default function AffiliatePage() {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/affiliate?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        setTracking(data.tracking || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Affiliate Tracking
        </h1>
        <p className="text-muted-foreground">
          Monitor affiliate activity and conversions.
        </p>
      </div>

      {/* Affiliate Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Affiliate Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate Code</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tracking.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No affiliate tracking data
                    </TableCell>
                  </TableRow>
                ) : (
                  tracking.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      {/* Affiliate Code */}
                      <TableCell className="font-medium">
                        <Link
                          href={`/affiliate/${item.reliable_hash}`}
                          className="text-primary hover:underline"
                        >
                          {item.affiliate_code}
                        </Link>
                      </TableCell>

                      {/* Shop */}
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Store className="h-4 w-4 mr-2" />
                          {item.shop || "—"}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={
                            item.status === "converted"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      {/* First Seen */}
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(item.first_seen_at).toLocaleDateString()}
                        </div>
                      </TableCell>

                      {/* Last Seen */}
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(item.last_seen_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center px-3 py-2 rounded border text-sm disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === total}
              className="flex items-center px-3 py-2 rounded border text-sm disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
