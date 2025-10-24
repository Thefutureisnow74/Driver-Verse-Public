"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Hash,
  Briefcase,
  FileText
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";

interface BusinessDetailOverviewProps {
  businessProfile: BusinessProfile;
}

export function BusinessDetailOverview({ businessProfile }: BusinessDetailOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Company Name</label>
              <p className="text-gray-900">{businessProfile.companyName}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Business Type</label>
              <p className="text-gray-900">
                {businessProfile.businessType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">State</label>
              <p className="text-gray-900">{businessProfile.state}</p>
            </div>
            
            {businessProfile.ein && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">EIN</label>
                <p className="text-gray-900 font-mono">{businessProfile.ein}</p>
              </div>
            )}
            
            {businessProfile.formationDate && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Formation Date</label>
                <p className="text-gray-900">
                  {new Date(businessProfile.formationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            
            {businessProfile.employeeCount && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Employee Count</label>
                <p className="text-gray-900">{businessProfile.employeeCount}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businessProfile.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{businessProfile.phoneNumber}</p>
                </div>
              </div>
            )}
            
            {businessProfile.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-900 break-all">{businessProfile.email}</p>
                </div>
              </div>
            )}
            
            {businessProfile.website && (
              <div className="flex items-center gap-3 sm:col-span-2">
                <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <p className="text-gray-900">
                    <a
                      href={businessProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {businessProfile.website}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {!businessProfile.phoneNumber && !businessProfile.email && !businessProfile.website && (
            <div className="text-center py-6 text-gray-500">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No contact information provided</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      {(businessProfile.streetAddress || businessProfile.city) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {businessProfile.streetAddress && (
                  <p className="text-gray-900">{businessProfile.streetAddress}</p>
                )}
                {businessProfile.city && (
                  <p className="text-gray-900">
                    {businessProfile.city}
                    {businessProfile.state && `, ${businessProfile.state}`}
                    {businessProfile.zipCode && ` ${businessProfile.zipCode}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(businessProfile.industry || businessProfile.description) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessProfile.industry && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Industry</label>
                <p className="text-gray-900">{businessProfile.industry}</p>
              </div>
            )}
            
            {businessProfile.description && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 leading-relaxed">{businessProfile.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Document Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {businessProfile._count.documents} Documents
                </p>
                <p className="text-sm text-gray-500">
                  {businessProfile._count.documents === 0 
                    ? "No documents uploaded yet"
                    : `${businessProfile._count.documents} document${businessProfile._count.documents !== 1 ? 's' : ''} available`
                  }
                </p>
              </div>
            </div>
            {businessProfile._count.documents > 0 && (
              <div className="text-sm text-gray-500">
                View in Documents tab
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(businessProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(businessProfile.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
