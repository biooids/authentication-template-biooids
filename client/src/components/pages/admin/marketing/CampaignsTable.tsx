"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  useDeleteMarketingEmailMutation,
  useSendCampaignMutation,
} from "@/lib/features/marketing/marketingApiSlice";
import {
  MarketingEmail,
  MarketingEmailStatus,
} from "@/lib/features/marketing/marketingTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface CampaignsTableProps {
  campaigns: MarketingEmail[];
}

export default function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const router = useRouter();
  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteMarketingEmailMutation();
  const [sendCampaign, { isLoading: isSending }] = useSendCampaignMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign draft deleted.");
    } catch (error) {
      toast.error("Failed to delete draft.");
    }
  };

  const handleSend = async (id: string) => {
    try {
      const result = await sendCampaign(id).unwrap();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send campaign.");
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No campaigns found.
              </TableCell>
            </TableRow>
          )}
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.subject}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    campaign.status === MarketingEmailStatus.SENT
                      ? "default"
                      : "secondary"
                  }
                  className={cn(
                    campaign.status === MarketingEmailStatus.SENT &&
                      "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
                    campaign.status === MarketingEmailStatus.DRAFT &&
                      "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"
                  )}
                >
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>{campaign.appVersion || "N/A"}</TableCell>
              <TableCell>
                {format(new Date(campaign.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {campaign.status === MarketingEmailStatus.DRAFT && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/marketing/${campaign.id}`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        {/* --- FIX: Send Action has its own AlertDialog --- */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-green-600 focus:text-green-600"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send Campaign
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Ready to send this campaign?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will email all opted-in users. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleSend(campaign.id)}
                                disabled={isSending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isSending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Yes, Send Now
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <DropdownMenuSeparator />

                        {/* --- FIX: Delete Action has its own AlertDialog --- */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this draft?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone and the draft will
                                be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(campaign.id)}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isDeleting && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Yes, Delete Draft
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {campaign.status === MarketingEmailStatus.SENT && (
                      <DropdownMenuItem disabled>
                        Sent on{" "}
                        {format(new Date(campaign.sentAt!), "MMM d, h:mm a")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
