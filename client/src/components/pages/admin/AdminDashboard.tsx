// FILE: src/components/pages/admin/AdminDashboard.tsx (Cleaned Version)
"use client";

import React from "react";
import { useGetDashboardStatsQuery } from "@/lib/features/admin/adminApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// --- FIX: Removed unused icons ---
import { Users, AlertCircle } from "lucide-react";

// This is a great, reusable component for displaying a single statistic.
const AdminStatsCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const { data: response, isLoading, isError } = useGetDashboardStatsQuery();
  const stats = response?.data;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load dashboard statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your platform's activity.
        </p>
      </div>

      {/* --- FIX: Simplified the stats grid to only show relevant information --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AdminStatsCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
      </div>

      {/* These placeholders are great for future expansion */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Activity feed coming soon...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Health charts coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
