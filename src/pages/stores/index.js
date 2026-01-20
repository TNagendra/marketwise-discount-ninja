import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Store, Calendar, Mail, Filter, Search, Layers, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FILTER_OPTIONS = [
  { value: "store", label: "Store" },
  { value: "email", label: "Contact Email" },
  { value: "plan", label: "Plan" },
  { value: "installed", label: "Installed At" },
  { value: "activity", label: "Last Activity" },
];

export default function StoresPage() {
  const [allActive, setAllActive] = useState([]);
  const [allInactive, setAllInactive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [newFilter, setNewFilter] = useState({ type: "", value: "" });

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function fetchStores() {
      const res = await fetch("/api/stores/status");
      const data = await res.json();
      setAllActive(data.active || []);
      setAllInactive(data.inactive || []);
      setLoading(false);
    }
    fetchStores();
  }, []);

  /* ---------------- FILTERED DATA ---------------- */
  const activeStores = useMemo(
    () => applyFilters(allActive, activeFilters),
    [allActive, activeFilters],
  );

  const inactiveStores = useMemo(
    () => applyFilters(allInactive, activeFilters),
    [allInactive, activeFilters],
  );

  const addFilter = () => {
    if (!newFilter.type || !newFilter.value) return;
    const filterOption = FILTER_OPTIONS.find((f) => f.value === newFilter.type);
    setActiveFilters([
      ...activeFilters,
      {
        id: Date.now(),
        type: newFilter.type,
        value: newFilter.value,
        label: `${filterOption.label}: ${newFilter.value}`,
      },
    ]);
    setNewFilter({ type: "", value: "" });
  };

  const removeFilter = (id) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
        <p className="text-muted-foreground">
          Manage and monitor all connected stores
        </p>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Active Filters Tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter.id} variant="secondary" className="pr-1">
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters([])}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Filter Input */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select
              value={newFilter.type}
              onValueChange={(v) => setNewFilter({ ...newFilter, type: v })}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {newFilter.type && (
              <>
                {newFilter.type === "installed" ||
                newFilter.type === "activity" ? (
                  <div className="flex gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-8 w-40"
                        value={newFilter.value.from || ""}
                        onChange={(e) =>
                          setNewFilter({
                            ...newFilter,
                            value: { ...newFilter.value, from: e.target.value },
                          })
                        }
                      />
                    </div>
                    <span className="self-center">to</span>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-8 w-40"
                        value={newFilter.value.to || ""}
                        onChange={(e) =>
                          setNewFilter({
                            ...newFilter,
                            value: { ...newFilter.value, to: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <Input
                    placeholder="Enter value"
                    value={newFilter.value}
                    onChange={(e) =>
                      setNewFilter({ ...newFilter, value: e.target.value })
                    }
                    className="w-56"
                    onKeyDown={(e) => e.key === "Enter" && addFilter()}
                  />
                )}
                <Button onClick={addFilter}>Add Filter</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <StoreSection
        title="Active Stores"
        icon={<Store className="h-5 w-5 text-green-500" />}
        stores={activeStores}
      />
      <StoreSection
        title="Inactive Stores"
        icon={<Store className="h-5 w-5 text-red-500" />}
        stores={inactiveStores}
      />
    </div>
  );
}

/* ---------------- TABLE ---------------- */

function StoreSection({ title, icon, stores }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {icon}
            {title}
          </div>
          <Badge variant="secondary">{stores.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StoreTable stores={stores} />
      </CardContent>
    </Card>
  );
}

function StoreTable({ stores }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Installed</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No stores found
              </TableCell>
            </TableRow>
          ) : (
            stores.map((s) => (
              <TableRow key={s.shop}>
                <TableCell className="font-medium">
                  <Link
                    href={`/stores/${s.shop}`}
                    className="flex items-center gap-2 text-primary"
                  >
                    <Store className="h-4 w-4" />
                    {s.shop}
                  </Link>
                </TableCell>
                <TableCell>{s.planDisplayName || "—"}</TableCell>
                <TableCell>{s.contactEmail || s.email || "—"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      s.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{format(s.createdAt)}</TableCell>
                <TableCell>{format(s.updatedAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------------- FILTER LOGIC ---------------- */

function applyFilters(stores, filters) {
  return stores.filter((store) => {
    return filters.every((filter) => {
      switch (filter.type) {
        case "store":
          return store.shop?.toLowerCase().includes(filter.value.toLowerCase());
        case "email":
          const email = store.contactEmail || store.email || "";
          return email.toLowerCase().includes(filter.value.toLowerCase());
        case "plan":
          return store.planDisplayName
            ?.toLowerCase()
            .includes(filter.value.toLowerCase());
        case "installed":
          const createdAt = new Date(store.createdAt);
          return (
            (!filter.value.from || createdAt >= new Date(filter.value.from)) &&
            (!filter.value.to || createdAt <= new Date(filter.value.to))
          );
        case "activity":
          const updatedAt = new Date(store.updatedAt);
          return (
            (!filter.value.from || updatedAt >= new Date(filter.value.from)) &&
            (!filter.value.to || updatedAt <= new Date(filter.value.to))
          );
        default:
          return true;
      }
    });
  });
}

function format(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}
