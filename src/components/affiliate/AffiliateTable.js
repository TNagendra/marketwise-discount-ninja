import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertCircle } from "lucide-react";

export default function AffiliateTable({ tracking }) {
  return (
    <Card className="bg-card border rounded-xl shadow-sm dark:bg-black dark:border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-semibold dark:text-white">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Affiliate Tracking
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table className="dark:bg-black dark:text-white">
          <TableHeader>
            <TableRow className="bg-muted/30 dark:bg-neutral-900">
              <TableHead className="text-muted-foreground dark:text-gray-300">
                Affiliate Code
              </TableHead>
              <TableHead className="text-muted-foreground dark:text-gray-300">
                Shop
              </TableHead>
              <TableHead className="text-muted-foreground dark:text-gray-300">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground dark:text-gray-300">
                First Seen
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tracking.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="py-12 text-center">
                  <div className="flex flex-col items-center text-muted-foreground dark:text-gray-400">
                    <AlertCircle className="h-12 w-12 opacity-30 mb-2" />
                    <p className="text-sm">No tracking data available</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tracking.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {/* Affiliate Code */}
                  <TableCell className="font-medium dark:text-white">
                    <Link
                      href={`/affiliate/${item.reliable_hash}`}
                      className="text-primary hover:underline dark:text-blue-400"
                    >
                      {item.affiliate_code}
                    </Link>
                  </TableCell>

                  {/* Shop */}
                  <TableCell className="dark:text-gray-300">
                    {item.shop}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={
                        item.status === "converted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>

                  {/* First Seen */}
                  <TableCell>
                    <div className="flex items-center text-muted-foreground dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      <span className="text-sm">
                        {new Date(item.first_seen_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
