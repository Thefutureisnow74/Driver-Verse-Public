"use client";

import { useState } from "react";
import { Plus, Building, Edit, Trash2, FileText, Eye, Download, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBusinessProfiles } from "@/hooks/use-business";
import { BusinessProfileForm } from "./_components/business-profile-form";
import { DocumentUploadDialog } from "./_components/document-upload-dialog";
import { BusinessStatus, BusinessType } from "@/generated/prisma";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BusinessPage() {
  const { businessProfiles, isLoading, createBusinessProfile, updateBusinessProfile, deleteBusinessProfile } = useBusinessProfiles();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const handleCreateProfile = async (profileData: any) => {
    try {
      await createBusinessProfile(profileData);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Failed to create business profile:', error);
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    if (!editingProfile) return;

    try {
      await updateBusinessProfile(editingProfile.id, profileData);
      setShowProfileForm(false);
      setEditingProfile(null);
    } catch (error) {
      console.error('Failed to update business profile:', error);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this business profile? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBusinessProfile(profileId);
    } catch (error) {
      console.error('Failed to delete business profile:', error);
    }
  };

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile);
    setShowProfileForm(true);
  };

  const handleAddDocument = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowDocumentUpload(true);
  };

  const getBusinessTypeLabel = (type: BusinessType) => {
    switch (type) {
      case BusinessType.LLC:
        return "LLC";
      case BusinessType.CORPORATION:
        return "Corporation";
      case BusinessType.S_CORP:
        return "S-Corp";
      case BusinessType.C_CORP:
        return "C-Corp";
      case BusinessType.PARTNERSHIP:
        return "Partnership";
      case BusinessType.SOLE_PROPRIETORSHIP:
        return "Sole Proprietorship";
      case BusinessType.NON_PROFIT:
        return "Non-Profit";
      case BusinessType.OTHER:
        return "Other";
      default:
        return type;
    }
  };

  const getStatusColor = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return "default";
      case BusinessStatus.INACTIVE:
        return "secondary";
      case BusinessStatus.DISSOLVED:
        return "destructive";
      case BusinessStatus.PENDING:
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return "Active";
      case BusinessStatus.INACTIVE:
        return "Inactive";
      case BusinessStatus.DISSOLVED:
        return "Dissolved";
      case BusinessStatus.PENDING:
        return "Pending";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Profiles</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your business entities and documents
          </p>
        </div>
        <Button onClick={() => setShowProfileForm(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="sm:inline">Create New Business Profile</span>

        </Button>
      </div>

      {/* Business Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {businessProfiles.map((profile) => (
          <Card key={profile.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg truncate">{profile.companyName}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/business/${profile.id}`}
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                      title="View Business Profile"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getBusinessTypeLabel(profile.businessType)} • {profile.state}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant={getStatusColor(profile.status)}>
                    {getStatusLabel(profile.status)}
                  </Badge>
                  <div className="flex gap-1">

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Business Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {profile.ein && (
                  <div>
                    <span className="text-muted-foreground">EIN:</span>
                    <div className="font-medium">{profile.ein}</div>
                  </div>
                )}
                {profile.formationDate && (
                  <div>
                    <span className="text-muted-foreground">Formation:</span>
                    <div className="font-medium">
                      {new Date(profile.formationDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <div className="font-medium">{profile.phoneNumber}</div>
                  </div>
                )}
                {profile.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="font-medium truncate">{profile.email}</div>
                  </div>
                )}
              </div>

              {/* Address */}
              {(profile.streetAddress || profile.city) && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <div className="font-medium">
                    {profile.streetAddress && <div>{profile.streetAddress}</div>}
                    {profile.city && (
                      <div>
                        {profile.city}{profile.zipCode && `, ${profile.zipCode}`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Website */}
              {profile.website && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Website:</span>
                  <div className="font-medium">
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 truncate block"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      Documents ({profile._count.documents})
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddDocument(profile.id)}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>

                {profile.documents.length > 0 ? (
                  <div className="space-y-2">
                    {profile.documents.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doc.documentName}</div>
                          <div className="text-muted-foreground">
                            {doc.documentType.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {profile.documents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{profile.documents.length - 3} more documents
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    No documents uploaded
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created {new Date(profile.createdAt).toLocaleDateString()}
                </div>

              </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-between ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProfile(profile)}
                    className="text-xs w-full sm:w-1/2"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.location.href = `/dashboard/business/${profile.id}`}
                    className="text-xs w-full sm:w-1/2"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {businessProfiles.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <Building className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No business profiles yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Create your first business profile to start managing your entities
          </p>
          <Button onClick={() => setShowProfileForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Business Profile
          </Button>
        </div>
      )}

      {/* Business Profile Form Dialog */}
      {showProfileForm && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[210]">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingProfile ? 'Edit Business Profile' : 'Create New Business Profile'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowProfileForm(false);
                    setEditingProfile(null);
                  }}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <BusinessProfileForm
                profile={editingProfile}
                onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}
                onCancel={() => {
                  setShowProfileForm(false);
                  setEditingProfile(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Dialog */}
      {showDocumentUpload && selectedBusinessId && (
        <DocumentUploadDialog
          businessId={selectedBusinessId}
          onClose={() => {
            setShowDocumentUpload(false);
            setSelectedBusinessId(null);
          }}
        />
      )}
    </div>
  );
}
