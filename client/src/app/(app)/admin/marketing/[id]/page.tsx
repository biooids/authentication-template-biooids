"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetMarketingEmailByIdQuery } from "@/lib/features/marketing/marketingApiSlice";
import { ChevronLeft, AlertCircle } from "lucide-react";
import CampaignForm from "@/components/pages/admin/marketing/CampaignForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditCampaignPageSkeleton = () => (
  <div>
    <div className="flex items-center mb-6">
      <Skeleton className="h-10 w-10 rounded-md" />
      <div className="ml-2 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
    </div>
    <Skeleton className="h-[600px] w-full" />
  </div>
);

export default function EditCampaignPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: campaign,
    isLoading,
    isError,
  } = useGetMarketingEmailByIdQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <EditCampaignPageSkeleton />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not find the requested campaign.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/marketing">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="ml-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Campaign Draft
          </h1>
          <p className="text-muted-foreground">
            Make changes to your email content below.
          </p>
        </div>
      </div>
      <CampaignForm campaign={campaign} />
    </div>
  );
}
