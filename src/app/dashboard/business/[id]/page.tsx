"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  FileText, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Globe,
  CreditCard,
  Share2,
  Target,
  Award,
  Calculator,
  FolderOpen
} from "lucide-react";
import { BusinessProfile, useBusinessProfiles } from "@/hooks/use-business";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BusinessDetailCompany } from "../_components/business-detail-company";
import { BusinessDetailRegisteredAgent } from "../_components/business-detail-registered-agent";
import { BusinessDetailContact } from "../_components/business-detail-contact";
import { BusinessDetailMailWeb } from "../_components/business-detail-mail-web";
import { BusinessDetailBankingFinance } from "../_components/business-detail-banking-finance";
import { BusinessDetailBusinessCredit } from "../_components/business-detail-business-credit";
import { BusinessDetailSocialMedia } from "../_components/business-detail-social-media";
import { BusinessDetailBusinessPlan } from "../_components/business-detail-business-plan";
import { BusinessDetailCodesCertifications } from "../_components/business-detail-codes-certifications";
import { BusinessDetailTax } from "../_components/business-detail-tax";
import { BusinessDetailDocuments } from "../_components/business-detail-documents";
import { BusinessProfileForm } from "../_components/business-profile-form";
import Link from "next/link";

type TabValue = "company" | "registered-agent" | "contact" | "mail-web" | "banking-finance" | "business-credit" | "social-media" | "business-plan" | "codes-certifications" | "tax" | "documents";

export default function IndividualBusinessProfilePage() {
  const params = useParams();
  const businessId = params.id as string;
  
  const { businessProfiles, isLoading, updateBusinessProfile, deleteBusinessProfile } = useBusinessProfiles();
  const [activeTab, setActiveTab] = useState<TabValue>("company");
  const [showEditForm, setShowEditForm] = useState(false);
  
  const businessProfile = businessProfiles.find(p => p.id === businessId);

  useEffect(() => {
    if (!isLoading && !businessProfile) {
      // Redirect to business list if profile not found
      window.location.href = '/dashboard/business';
    }
  }, [isLoading, businessProfile]);

  const handleUpdateProfile = async (profileData: any) => {
    try {
      await updateBusinessProfile(businessId, profileData);
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update business profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete this business profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteBusinessProfile(businessId);
      window.location.href = '/dashboard/business';
    } catch (error) {
      console.error('Failed to delete business profile:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      DISSOLVED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      ACTIVE: "Active",
      INACTIVE: "Inactive",
      DISSOLVED: "Dissolved",
      PENDING: "Pending",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      LLC: "LLC",
      CORPORATION: "Corporation",
      S_CORP: "S-Corp",
      C_CORP: "C-Corp",
      PARTNERSHIP: "Partnership",
      SOLE_PROPRIETORSHIP: "Sole Proprietorship",
      NON_PROFIT: "Non-Profit",
      OTHER: "Other",
    };
    return labels[type as keyof typeof labels] || type;
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

  if (!businessProfile) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12 px-4">
          <Building className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Business not found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            The business profile you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/business">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Business List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard/business">
            <Button variant="ghost" size="sm" className="p-2 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Building className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                {businessProfile.companyName}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(businessProfile.status)} variant="secondary">
                {getStatusLabel(businessProfile.status)}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">
                {getBusinessTypeLabel(businessProfile.businessType)} • {businessProfile.state}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditForm(true)}
            className="hidden sm:flex"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditForm(true)}
            className="sm:hidden p-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteProfile}
            className="hidden sm:flex text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteProfile}
            className="sm:hidden p-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Documents</p>
            <p className="text-lg sm:text-2xl font-bold text-purple-600">
              {businessProfile._count.documents}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Status</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
              {getStatusLabel(businessProfile.status)}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Type</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 truncate">
              {getBusinessTypeLabel(businessProfile.businessType)}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-Compatible Tabs */}
      <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          {/* Tab List - Mobile Responsive with Horizontal Scroll */}
          <div className="w-full overflow-x-auto">
            <TabsList className="flex w-max min-w-full h-auto p-1 gap-1">
              <TabsTrigger value="company" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Building className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Company</span>
              </TabsTrigger>
              
              <TabsTrigger value="registered-agent" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <User className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Agent</span>
              </TabsTrigger>
              
              <TabsTrigger value="contact" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Phone className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Contact</span>
              </TabsTrigger>
              
              <TabsTrigger value="mail-web" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Globe className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Mail/Web</span>
              </TabsTrigger>
              
              <TabsTrigger value="banking-finance" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Banking</span>
              </TabsTrigger>
              
              <TabsTrigger value="business-credit" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Credit</span>
              </TabsTrigger>
              
              <TabsTrigger value="social-media" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Share2 className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Social</span>
              </TabsTrigger>
              
              <TabsTrigger value="business-plan" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Target className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Plan</span>
              </TabsTrigger>
              
              <TabsTrigger value="codes-certifications" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Award className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Codes</span>
              </TabsTrigger>
              
              <TabsTrigger value="tax" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <Calculator className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Tax</span>
              </TabsTrigger>
              
              <TabsTrigger value="documents" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  {businessProfile._count.documents > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4 min-w-4">
                      {businessProfile._count.documents}
                    </Badge>
                  )}
                </div>
                <span className="text-xs sm:text-sm">Documents</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="company">
            <BusinessDetailCompany businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="registered-agent">
            <BusinessDetailRegisteredAgent businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="contact">
            <BusinessDetailContact businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="mail-web">
            <BusinessDetailMailWeb businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="banking-finance">
            <BusinessDetailBankingFinance businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="business-credit">
            <BusinessDetailBusinessCredit businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="social-media">
            <BusinessDetailSocialMedia businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="business-plan">
            <BusinessDetailBusinessPlan businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="codes-certifications">
            <BusinessDetailCodesCertifications businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="tax">
            <BusinessDetailTax businessProfile={businessProfile} />
          </TabsContent>

          <TabsContent value="documents">
            <BusinessDetailDocuments businessProfile={businessProfile} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[210]">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Edit Business Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditForm(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <BusinessProfileForm
                profile={businessProfile}
                onSubmit={handleUpdateProfile}
                onCancel={() => setShowEditForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
