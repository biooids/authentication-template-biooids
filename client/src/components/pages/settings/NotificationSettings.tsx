// FILE: src/components/pages/settings/NotificationSettings.tsx

"use client";

import React from "react";
import { useUpdateSettingsMutation } from "@/lib/features/settings/settingsApiSlice";
import { UserSettings } from "@/lib/features/settings/settingsTypes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface NotificationSettingsProps {
  currentSettings: UserSettings;
}

export default function NotificationSettings({
  currentSettings,
}: NotificationSettingsProps) {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const handleSettingChange = async (
    key: "emailMarketing" | "emailSocial",
    value: boolean
  ) => {
    try {
      await updateSettings({ [key]: value }).unwrap();
      toast.success("Notification settings updated.");
    } catch (error) {
      toast.error("Failed to update settings.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Manage how we communicate with you via email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="emailSocial" className="font-medium">
              Social Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about replies, new followers, and other social
              interactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              id="emailSocial"
              checked={currentSettings.emailSocial}
              onCheckedChange={(checked) =>
                handleSettingChange("emailSocial", checked)
              }
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="emailMarketing" className="font-medium">
              Marketing & Newsletter
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive occasional updates about new features and products.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              id="emailMarketing"
              checked={currentSettings.emailMarketing}
              onCheckedChange={(checked) =>
                handleSettingChange("emailMarketing", checked)
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
