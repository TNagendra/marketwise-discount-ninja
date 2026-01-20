import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Calendar, Clock, Tag, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DiscountsPage() {
  const [stores, setStores] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Failed to load stores:", err));
  }, []);

  useEffect(() => {
    if (!selectedShop) {
      setDiscounts([]);
      return;
    }

    setLoading(true);
    fetch(`/api/discounts?shopId=${selectedShop}`)
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(data.discounts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching store discounts:", err);
        setLoading(false);
      });
  }, [selectedShop]);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
        <p className="text-muted-foreground">
          Manage and view discounts for your stores.
        </p>
      </div>

      {/* Store Selection - Fixed with proper z-index */}
      <Card className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filter Discounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md w-full">
            <Select
              onValueChange={(value) => setSelectedShop(value)}
              value={selectedShop}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.shop} value={store.shop}>
                    <div className="flex items-center">
                      <span>{store.shop}</span>
                      {store.isActive && (
                        <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-primary" />
            {selectedShop ? `${selectedShop} Discounts` : "Discounts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : selectedShop ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <Tag className="h-12 w-12 mx-auto text-muted-foreground/20" />
                        <p className="mt-2">
                          No discounts found for this store
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    discounts.map((d) => (
                      <TableRow key={d.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                            {d.title || "Untitled"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{d.code || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              d.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                : d.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                            }
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {d.startsAt
                              ? new Date(d.startsAt).toLocaleDateString()
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {d.endsAt
                              ? new Date(d.endsAt).toLocaleDateString()
                              : "No End Date"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground/20" />
              <p className="mt-4">Please select a store to view discounts</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
