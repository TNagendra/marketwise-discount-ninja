import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function RecentActivity({ tracking }) {
  return (
    <Card className="shadow-sm border rounded-xl bg-white">
      <CardHeader>
        <CardTitle>Recent Affiliate Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {tracking.length === 0 && (
          <p className="text-center py-10 text-gray-500">No recent activity</p>
        )}

        {tracking.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <p className="font-medium text-gray-900">{item.affiliate_code}</p>
              <p className="text-sm text-gray-500">{item.shop}</p>
            </div>

            <div className="text-right">
              <Badge
                className={
                  item.status === "converted"
                    ? "bg-green-100 text-green-700"
                    : item.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {item.status}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.first_seen_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        <Link
          href="/affiliate"
          className="text-primary hover:underline text-sm block text-right mt-4"
        >
          View all →
        </Link>
      </CardContent>
    </Card>
  );
}
