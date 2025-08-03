"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CampaignForm from "@/components/pages/admin/marketing/CampaignForm";
import { Button } from "@/components/ui/button";

export default function NewCampaignPage() {
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
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Compose your email and save it as a draft.
          </p>
        </div>
      </div>
      <CampaignForm />
    </div>
  );
}
