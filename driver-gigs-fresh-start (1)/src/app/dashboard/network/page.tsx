"use client";

import { useState } from "react";
import { Plus, Users, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkingForm } from "./_components/networking-form";
import { NetworkingCard } from "./_components/networking-card";
import { useNetworking } from "@/hooks/use-networking";
import { toast } from "sonner";

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

export default function NetworkPage() {
  const { groups, isLoading, error, createGroup, updateGroup, deleteGroup } = useNetworking();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<NetworkingGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  // Get unique platforms for filter
  const platforms = Array.from(new Set(groups.map(group => group.platform))).sort();

  // Filter groups based on search and platform
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || group.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      if (editingGroup) {
        await updateGroup(editingGroup.id, data);
        toast.success("Networking group updated successfully");
      } else {
        await createGroup(data);
        toast.success("Networking group added successfully");
      }
      
      setShowForm(false);
      setEditingGroup(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (group: NetworkingGroup) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingGroupId(id);
      await deleteGroup(id);
      toast.success("Networking group deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete group");
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  const handleAddNew = () => {
    setEditingGroup(null);
    setShowForm(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Error Loading Networking Groups
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {error}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Networking Groups
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your professional networking communities
                </p>
              </div>
            </div>

            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-neutral-700/60"
              />
            </div>

            {platforms.length > 0 && (
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-48 bg-white/60 dark:bg-neutral-700/60">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-neutral-400 dark:text-neutral-500 mb-6">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {groups.length === 0 ? "No networking groups yet" : "No groups found"}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
                {groups.length === 0 
                  ? "Start building your professional network by adding your first networking group."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {groups.length === 0 && (
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Group
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <NetworkingCard
                key={group.id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingGroupId === group.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Edit Networking Group" : "Add Networking Group"}
            </DialogTitle>
          </DialogHeader>
          
          <NetworkingForm
            group={editingGroup}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}