"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  Calendar,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  Folder
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";

interface BusinessDetailAnalyticsProps {
  businessProfile: BusinessProfile;
}

export function BusinessDetailAnalytics({ businessProfile }: BusinessDetailAnalyticsProps) {
  const documents = businessProfile.documents;
  
  // Document analytics
  const totalDocuments = documents.length;
  const totalFileSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
  const averageFileSize = totalDocuments > 0 ? totalFileSize / totalDocuments : 0;
  
  // Document type distribution
  const documentTypeDistribution = documents.reduce((acc, doc) => {
    acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent uploads (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUploads = documents.filter(doc => 
    new Date(doc.createdAt) > thirtyDaysAgo
  ).length;

  // Document timeline (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyUploads = documents
    .filter(doc => new Date(doc.createdAt) > sixMonthsAgo)
    .reduce((acc, doc) => {
      const month = new Date(doc.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // File size distribution
  const sizeRanges = {
    'Small (< 1MB)': documents.filter(doc => doc.fileSize < 1024 * 1024).length,
    'Medium (1-10MB)': documents.filter(doc => doc.fileSize >= 1024 * 1024 && doc.fileSize < 10 * 1024 * 1024).length,
    'Large (10MB+)': documents.filter(doc => doc.fileSize >= 10 * 1024 * 1024).length,
  };

  const getDocumentTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      ARTICLES_OF_INCORPORATION: "bg-blue-100 text-blue-800",
      OPERATING_AGREEMENT: "bg-green-100 text-green-800",
      EIN_LETTER: "bg-purple-100 text-purple-800",
      BUSINESS_LICENSE: "bg-orange-100 text-orange-800",
      TAX_DOCUMENT: "bg-red-100 text-red-800",
      FINANCIAL_STATEMENT: "bg-yellow-100 text-yellow-800",
      CONTRACT: "bg-indigo-100 text-indigo-800",
      INSURANCE_POLICY: "bg-pink-100 text-pink-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const businessAge = Math.floor((new Date().getTime() - new Date(businessProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Docs</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalDocuments}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Size</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">
                  {formatFileSize(totalFileSize).split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(totalFileSize).split(' ')[1]}</p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Recent (30d)</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{recentUploads}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Business Age</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">{businessAge}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {totalDocuments > 0 ? (
        <>
          {/* Document Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Document Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(documentTypeDistribution).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className={getDocumentTypeColor(type)} variant="secondary">
                        {getDocumentTypeLabel(type)}
                      </Badge>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Size Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                File Size Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(sizeRanges).map(([range, count]) => (
                  <div key={range} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-xl text-gray-900 mb-1">
                      {count}
                    </div>
                    <div className="text-xs text-gray-600">{range}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {totalDocuments > 0 ? Math.round((count / totalDocuments) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Timeline */}
          {Object.keys(monthlyUploads).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upload Timeline (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(monthlyUploads)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{month}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500">uploads</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {doc.documentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getDocumentTypeLabel(doc.documentType)} • {formatFileSize(doc.fileSize)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Storage Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Storage Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatFileSize(totalFileSize)}
                  </div>
                  <div className="text-sm text-blue-800">Total Storage Used</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatFileSize(averageFileSize)}
                  </div>
                  <div className="text-sm text-green-800">Average File Size</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {Object.keys(documentTypeDistribution).length}
                  </div>
                  <div className="text-sm text-purple-800">Document Types</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No data to analyze</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Upload some documents to see analytics and insights for {businessProfile.companyName}
          </p>
        </div>
      )}
    </div>
  );
}
