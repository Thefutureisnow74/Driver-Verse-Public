"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Globe,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  TrendingUp,
  Calendar,
  Hash
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailSocialMediaProps {
  businessProfile: BusinessProfile;
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  followers: string;
  isActive: boolean;
  lastPosted: string;
  loginCredentials: string;
  notes: string;
}

interface ContentStrategy {
  id: string;
  platform: string;
  contentType: string;
  frequency: string;
  bestTimes: string;
  hashtags: string;
  notes: string;
}

export function BusinessDetailSocialMedia({ businessProfile }: BusinessDetailSocialMediaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Social Media Accounts
    socialMediaAccounts: businessProfile.socialMediaInfo?.socialMediaAccounts || [] as SocialMediaAccount[],
    
    // Content Strategy
    contentStrategy: businessProfile.socialMediaInfo?.contentStrategy || [] as ContentStrategy[],
    
    // Social Media Goals
    socialMediaGoals: businessProfile.socialMediaInfo?.socialMediaGoals || "",
    
    // Brand Guidelines
    brandGuidelines: businessProfile.socialMediaInfo?.brandGuidelines || "",
    
    // Content Calendar
    contentCalendar: businessProfile.socialMediaInfo?.contentCalendar || "",
    
    // Analytics and Metrics
    analyticsMetrics: businessProfile.socialMediaInfo?.analyticsMetrics || "",
    
    notes: businessProfile.socialMediaInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'social-media',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save social media information');
      }

      const result = await response.json();
      console.log('Social media information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving social media information:', error);
      alert('Failed to save social media information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      socialMediaAccounts: businessProfile.socialMediaInfo?.socialMediaAccounts || [],
      contentStrategy: businessProfile.socialMediaInfo?.contentStrategy || [],
      socialMediaGoals: businessProfile.socialMediaInfo?.socialMediaGoals || "",
      brandGuidelines: businessProfile.socialMediaInfo?.brandGuidelines || "",
      contentCalendar: businessProfile.socialMediaInfo?.contentCalendar || "",
      analyticsMetrics: businessProfile.socialMediaInfo?.analyticsMetrics || "",
      notes: businessProfile.socialMediaInfo?.notes || ""
    });
    setIsEditing(false);
  };

  // Social Media Account functions
  const addSocialMediaAccount = () => {
    const newAccount: SocialMediaAccount = {
      id: Date.now().toString(),
      platform: "",
      username: "",
      profileUrl: "",
      followers: "",
      isActive: true,
      lastPosted: "",
      loginCredentials: "",
      notes: ""
    };
    setFormData({
      ...formData,
      socialMediaAccounts: [...formData.socialMediaAccounts, newAccount]
    });
  };

  const removeSocialMediaAccount = (id: string) => {
    setFormData({
      ...formData,
      socialMediaAccounts: formData.socialMediaAccounts.filter((account: SocialMediaAccount) => account.id !== id)
    });
  };

  const updateSocialMediaAccount = (id: string, field: keyof SocialMediaAccount, value: string | boolean) => {
    setFormData({
      ...formData,
      socialMediaAccounts: formData.socialMediaAccounts.map((account: SocialMediaAccount) =>
        account.id === id ? { ...account, [field]: value } : account
      )
    });
  };

  // Content Strategy functions
  const addContentStrategy = () => {
    const newStrategy: ContentStrategy = {
      id: Date.now().toString(),
      platform: "",
      contentType: "",
      frequency: "",
      bestTimes: "",
      hashtags: "",
      notes: ""
    };
    setFormData({
      ...formData,
      contentStrategy: [...formData.contentStrategy, newStrategy]
    });
  };

  const removeContentStrategy = (id: string) => {
    setFormData({
      ...formData,
      contentStrategy: formData.contentStrategy.filter((strategy: ContentStrategy) => strategy.id !== id)
    });
  };

  const updateContentStrategy = (id: string, field: keyof ContentStrategy, value: string) => {
    setFormData({
      ...formData,
      contentStrategy: formData.contentStrategy.map((strategy: ContentStrategy) =>
        strategy.id === id ? { ...strategy, [field]: value } : strategy
      )
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4 text-black" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'tiktok':
        return <MessageCircle className="w-4 h-4 text-black" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Social Media */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Media Accounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Social Media Accounts
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addSocialMediaAccount}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              )}
            </div>
            
            {formData.socialMediaAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No social media accounts added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.socialMediaAccounts.map((account: SocialMediaAccount, index: number) => (
                  <Card key={account.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getPlatformIcon(account.platform)}
                          {account.platform || `Account #${index + 1}`}
                          <Badge className={getStatusColor(account.isActive)}>
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialMediaAccount(account.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Platform</Label>
                          {isEditing ? (
                            <Select value={account.platform} onValueChange={(value) => updateSocialMediaAccount(account.id, 'platform', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Twitter">Twitter/X</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="Pinterest">Pinterest</SelectItem>
                                <SelectItem value="Snapchat">Snapchat</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {account.platform || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Username/Handle</Label>
                          {isEditing ? (
                            <Input
                              placeholder="@username"
                              value={account.username}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'username', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {account.username || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Profile URL</Label>
                          {isEditing ? (
                            <Input
                              placeholder="https://..."
                              value={account.profileUrl}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'profileUrl', e.target.value)}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded flex-1">
                                {account.profileUrl || "Not provided"}
                              </p>
                              {account.profileUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(account.profileUrl, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Followers/Connections</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Number of followers"
                              value={account.followers}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'followers', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {account.followers || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          {isEditing ? (
                            <Select 
                              value={account.isActive ? "active" : "inactive"} 
                              onValueChange={(value) => updateSocialMediaAccount(account.id, 'isActive', value === "active")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getStatusColor(account.isActive)}>
                              {account.isActive ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Last Posted</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={account.lastPosted}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'lastPosted', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {account.lastPosted ? new Date(account.lastPosted).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                          <Label>Login Credentials</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Username/email for login"
                              value={account.loginCredentials}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'loginCredentials', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {account.loginCredentials || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes about this account"
                            value={account.notes}
                            onChange={(e) => updateSocialMediaAccount(account.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {account.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Content Strategy */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Content Strategy
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addContentStrategy}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Strategy
                </Button>
              )}
            </div>
            
            {formData.contentStrategy.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No content strategies added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.contentStrategy.map((strategy: ContentStrategy, index: number) => (
                  <Card key={strategy.id} className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getPlatformIcon(strategy.platform)}
                          {strategy.platform || `Strategy #${index + 1}`}
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContentStrategy(strategy.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Platform</Label>
                          {isEditing ? (
                            <Select value={strategy.platform} onValueChange={(value) => updateContentStrategy(strategy.id, 'platform', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Twitter">Twitter/X</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="All Platforms">All Platforms</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {strategy.platform || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Content Type</Label>
                          {isEditing ? (
                            <Select value={strategy.contentType} onValueChange={(value) => updateContentStrategy(strategy.id, 'contentType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select content type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Educational">Educational</SelectItem>
                                <SelectItem value="Promotional">Promotional</SelectItem>
                                <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                                <SelectItem value="User Generated">User Generated</SelectItem>
                                <SelectItem value="News/Updates">News/Updates</SelectItem>
                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                <SelectItem value="Mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {strategy.contentType || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Posting Frequency</Label>
                          {isEditing ? (
                            <Select value={strategy.frequency} onValueChange={(value) => updateContentStrategy(strategy.id, 'frequency', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="3x per week">3x per week</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="As needed">As needed</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {strategy.frequency || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Best Posting Times</Label>
                          {isEditing ? (
                            <Input
                              placeholder="e.g., 9 AM, 1 PM, 6 PM"
                              value={strategy.bestTimes}
                              onChange={(e) => updateContentStrategy(strategy.id, 'bestTimes', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {strategy.bestTimes || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Hashtags/Keywords</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="#hashtag1 #hashtag2 #hashtag3"
                            value={strategy.hashtags}
                            onChange={(e) => updateContentStrategy(strategy.id, 'hashtags', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {strategy.hashtags || "No hashtags provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Strategy Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional strategy details"
                            value={strategy.notes}
                            onChange={(e) => updateContentStrategy(strategy.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {strategy.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Social Media Goals and Brand Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="socialMediaGoals">Social Media Goals</Label>
              {isEditing ? (
                <Textarea
                  id="socialMediaGoals"
                  placeholder="What are your social media objectives?"
                  value={formData.socialMediaGoals}
                  onChange={(e) => setFormData({ ...formData, socialMediaGoals: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.socialMediaGoals || "No social media goals defined"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
              {isEditing ? (
                <Textarea
                  id="brandGuidelines"
                  placeholder="Brand voice, tone, visual guidelines"
                  value={formData.brandGuidelines}
                  onChange={(e) => setFormData({ ...formData, brandGuidelines: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.brandGuidelines || "No brand guidelines defined"}
                </p>
              )}
            </div>
          </div>

          {/* Content Calendar */}
          <div className="space-y-2">
            <Label htmlFor="contentCalendar">Content Calendar</Label>
            {isEditing ? (
              <Textarea
                id="contentCalendar"
                placeholder="Content planning and scheduling information"
                value={formData.contentCalendar}
                onChange={(e) => setFormData({ ...formData, contentCalendar: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.contentCalendar || "No content calendar defined"}
              </p>
            )}
          </div>

          {/* Analytics and Metrics */}
          <div className="space-y-2">
            <Label htmlFor="analyticsMetrics">Analytics and Metrics</Label>
            {isEditing ? (
              <Textarea
                id="analyticsMetrics"
                placeholder="Key metrics, tracking methods, and performance data"
                value={formData.analyticsMetrics}
                onChange={(e) => setFormData({ ...formData, analyticsMetrics: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.analyticsMetrics || "No analytics information provided"}
              </p>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about social media..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.notes || "No notes provided"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
