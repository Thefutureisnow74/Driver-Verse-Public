"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Trash2, 
  Download,
  Archive,
  AlertTriangle
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";

interface BusinessDetailSettingsProps {
  businessProfile: BusinessProfile;
}

export function BusinessDetailSettings({ businessProfile }: BusinessDetailSettingsProps) {
  const [notifications, setNotifications] = useState({
    documentUploads: true,
    statusChanges: true,
    reminders: false,
    weeklyReports: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareAnalytics: false,
    allowSearching: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportData = () => {
    // Placeholder for export functionality
    console.log('Exporting business data...');
  };

  const handleArchiveBusiness = () => {
    if (!confirm('Are you sure you want to archive this business? You can restore it later.')) {
      return;
    }
    console.log('Archiving business...');
  };

  const handleDeleteBusiness = () => {
    if (!confirm('Are you sure you want to permanently delete this business? This action cannot be undone.')) {
      return;
    }
    console.log('Deleting business...');
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="document-uploads">Document Upload Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when documents are uploaded to this business
              </p>
            </div>
            <Switch
              id="document-uploads"
              checked={notifications.documentUploads}
              onCheckedChange={() => handleNotificationChange('documentUploads')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status-changes">Status Change Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when business status changes
              </p>
            </div>
            <Switch
              id="status-changes"
              checked={notifications.statusChanges}
              onCheckedChange={() => handleNotificationChange('statusChanges')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Renewal Reminders</Label>
              <p className="text-sm text-gray-500">
                Get reminders for license renewals and important dates
              </p>
            </div>
            <Switch
              id="reminders"
              checked={notifications.reminders}
              onCheckedChange={() => handleNotificationChange('reminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <p className="text-sm text-gray-500">
                Receive weekly analytics reports for this business
              </p>
            </div>
            <Switch
              id="weekly-reports"
              checked={notifications.weeklyReports}
              onCheckedChange={() => handleNotificationChange('weeklyReports')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-gray-500">
                Make this business profile visible to other users
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={privacy.publicProfile}
              onCheckedChange={() => handlePrivacyChange('publicProfile')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="share-analytics">Share Analytics</Label>
              <p className="text-sm text-gray-500">
                Allow anonymous analytics data to be used for insights
              </p>
            </div>
            <Switch
              id="share-analytics"
              checked={privacy.shareAnalytics}
              onCheckedChange={() => handlePrivacyChange('shareAnalytics')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-searching">Allow in Search</Label>
              <p className="text-sm text-gray-500">
                Allow this business to appear in search results
              </p>
            </div>
            <Switch
              id="allow-searching"
              checked={privacy.allowSearching}
              onCheckedChange={() => handlePrivacyChange('allowSearching')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium">Export Data</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Download all business data and documents
              </p>
              <Button onClick={handleExportData} variant="outline" size="sm" className="w-full">
                Export Business Data
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium">Archive Business</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Hide business from active list (can be restored)
              </p>
              <Button onClick={handleArchiveBusiness} variant="outline" size="sm" className="w-full">
                Archive Business
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Business ID</label>
              <p className="font-mono text-gray-900">{businessProfile.id}</p>
            </div>
            
            <div>
              <label className="text-gray-500">Created</label>
              <p className="text-gray-900">
                {new Date(businessProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <label className="text-gray-500">Last Updated</label>
              <p className="text-gray-900">
                {new Date(businessProfile.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <label className="text-gray-500">Total Documents</label>
              <p className="text-gray-900">{businessProfile._count.documents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Delete Business</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete this business and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  onClick={handleDeleteBusiness}
                  variant="destructive"
                  size="sm"
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <strong>Warning:</strong> Deleting this business will permanently remove:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>All business information and details</li>
                <li>All uploaded documents and files</li>
                <li>All analytics and historical data</li>
                <li>All associated settings and preferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
