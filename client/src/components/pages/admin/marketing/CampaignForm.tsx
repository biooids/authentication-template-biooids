"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateMarketingEmailMutation,
  useUpdateMarketingEmailMutation,
} from "@/lib/features/marketing/marketingApiSlice";
import { MarketingEmail } from "@/lib/features/marketing/marketingTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import toast from "react-hot-toast";

// Zod schema for form validation
const campaignSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  appVersion: z.string().optional(),
  htmlContent: z.string().min(20, "Content is too short."),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  campaign?: MarketingEmail; // Optional: for editing existing campaigns
}

export default function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const [createCampaign, { isLoading: isCreating }] =
    useCreateMarketingEmailMutation();
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateMarketingEmailMutation();

  const isEditMode = !!campaign;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      subject: campaign?.subject || "",
      appVersion: campaign?.appVersion || "",
      htmlContent: campaign?.htmlContent || "",
    },
  });

  const onSubmit: SubmitHandler<CampaignFormValues> = async (data) => {
    try {
      if (isEditMode) {
        await updateCampaign({ id: campaign.id, data }).unwrap();
        toast.success("Campaign draft updated successfully!");
      } else {
        await createCampaign(data).unwrap();
        toast.success("Campaign draft created successfully!");
      }
      router.push("/admin/marketing");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                {...register("subject")}
                disabled={isLoading}
              />
              {errors.subject && (
                <p className="text-destructive text-xs mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="appVersion">App Version (Optional)</Label>
              <Input
                id="appVersion"
                placeholder="e.g., 1.2.3"
                {...register("appVersion")}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label>Email Content</Label>
            <TiptapEditor
              name="htmlContent"
              control={control}
              disabled={isLoading}
            />
            {errors.htmlContent && (
              <p className="text-destructive text-xs mt-1">
                {errors.htmlContent.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Save Draft"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
