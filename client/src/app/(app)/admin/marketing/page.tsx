"use client";

import React from "react";
import Link from "next/link";
import { useGetAllMarketingEmailsQuery } from "@/lib/features/marketing/marketingApiSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, AlertCircle } from "lucide-react";
import CampaignsTable from "@/components/pages/admin/marketing/CampaignsTable";

// Skeleton loader for the main page
const MarketingPageSkeleton = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-36" />
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

export default function MarketingPage() {
  const { data: emails, isLoading, isError } = useGetAllMarketingEmailsQuery();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Marketing Campaigns
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and send newsletters and updates to your users.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/marketing/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {isLoading && <MarketingPageSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load marketing campaigns. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {emails && <CampaignsTable campaigns={emails} />}
    </div>
  );
}
