"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Mail, 
  User, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "@/components/ui/alert-dialog";

interface NetworkingGroup {
  id: string;
  name: string;
  platform: string;
  url?: string | null;
  email?: string | null;
  username?: string | null;
  joinedDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NetworkingCardProps {
  group: NetworkingGroup;
  onEdit: (group: NetworkingGroup) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

const platformColors: Record<string, string> = {
  Facebook: "bg-blue-500",
  LinkedIn: "bg-blue-600",
  Discord: "bg-indigo-500",
  Telegram: "bg-sky-500",
  WhatsApp: "bg-green-500",
  Slack: "bg-purple-500",
  Reddit: "bg-orange-500",
  "Twitter/X": "bg-black",
  Instagram: "bg-pink-500",
  Other: "bg-gray-500",
};

export function NetworkingCard({ group, onEdit, onDelete, isDeleting }: NetworkingCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await onDelete(group.id);
    setShowDeleteDialog(false);
  };

  const openUrl = () => {
    if (group.url) {
      window.open(group.url, '_blank');
    }
  };

  const sendEmail = () => {
    if (group.email) {
      window.open(`mailto:${group.email}`, '_blank');
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${platformColors[group.platform] || platformColors.Other}`} />
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {group.platform}
                </Badge>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(group)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Action buttons */}
          <div className="flex gap-2">
            {group.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={openUrl}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit
              </Button>
            )}
            {group.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={sendEmail}
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {group.username && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{group.username}</span>
              </div>
            )}
            
            {group.joinedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {format(new Date(group.joinedDate), "dd/MM/yyyy")}</span>
              </div>
            )}

            {group.notes && (
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5" />
                <span className="line-clamp-2">{group.notes}</span>
              </div>
            )}
          </div>

          {/* Created date */}
          <div className="pt-2 border-t text-xs text-neutral-500 dark:text-neutral-500">
            Added {format(new Date(group.createdAt), "MMM dd, yyyy")}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Networking Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{group.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
