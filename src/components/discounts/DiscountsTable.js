import { useEffect, useState } from "react";
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

export default function DiscountsTable({ shopId }) {
  const [data, setData] = useState({
    discounts: [],
    total: 0,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    if (!shopId) return;

    fetch(`/api/discounts?shopId=${shopId}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Error fetching store discounts:", err));
  }, [shopId]);

  const { discounts } = data;

  return (
    <Card className="shadow-sm border rounded-xl bg-white mt-4">
      <CardHeader>
        <CardTitle>Discounts for {shopId}</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Starts At</TableHead>
              <TableHead>Ends At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {discounts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="text-center py-8 text-gray-500"
                >
                  No discounts found for this store
                </TableCell>
              </TableRow>
            )}

            {discounts.map((d) => (
              <TableRow key={d.id} className="hover:bg-gray-50">
                <TableCell>{d.title || "Untitled"}</TableCell>
                <TableCell>{d.code || "—"}</TableCell>

                <TableCell>
                  <Badge
                    className={
                      d.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : d.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {d.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {d.startsAt ? new Date(d.startsAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  {d.endsAt
                    ? new Date(d.endsAt).toLocaleDateString()
                    : "No End Date"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
