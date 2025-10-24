"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Lightbulb,
  BarChart3,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailBusinessPlanProps {
  businessProfile: BusinessProfile;
}

interface BusinessGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: string;
  status: string;
  progress: string;
  notes: string;
}

interface FinancialProjection {
  id: string;
  year: string;
  revenue: string;
  expenses: string;
  profit: string;
  cashFlow: string;
  assumptions: string;
}

interface MarketAnalysis {
  id: string;
  segment: string;
  size: string;
  growth: string;
  competition: string;
  opportunities: string;
  threats: string;
}

export function BusinessDetailBusinessPlan({ businessProfile }: BusinessDetailBusinessPlanProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Executive Summary
    executiveSummary: businessProfile.businessPlanInfo?.executiveSummary || "",
    
    // Mission and Vision
    missionStatement: businessProfile.businessPlanInfo?.missionStatement || "",
    visionStatement: businessProfile.businessPlanInfo?.visionStatement || "",
    coreValues: businessProfile.businessPlanInfo?.coreValues || "",
    
    // Business Goals
    businessGoals: businessProfile.businessPlanInfo?.businessGoals || [] as BusinessGoal[],
    
    // Market Analysis
    marketAnalysis: businessProfile.businessPlanInfo?.marketAnalysis || [] as MarketAnalysis[],
    
    // Financial Projections
    financialProjections: businessProfile.businessPlanInfo?.financialProjections || [] as FinancialProjection[],
    
    // Marketing Strategy
    marketingStrategy: businessProfile.businessPlanInfo?.marketingStrategy || "",
    
    // Operations Plan
    operationsPlan: businessProfile.businessPlanInfo?.operationsPlan || "",
    
    // Risk Assessment
    riskAssessment: businessProfile.businessPlanInfo?.riskAssessment || "",
    
    // Implementation Timeline
    implementationTimeline: businessProfile.businessPlanInfo?.implementationTimeline || "",
    
    notes: businessProfile.businessPlanInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'business-plan',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business plan information');
      }

      const result = await response.json();
      console.log('Business plan information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving business plan information:', error);
      alert('Failed to save business plan information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      executiveSummary: businessProfile.businessPlanInfo?.executiveSummary || "",
      missionStatement: businessProfile.businessPlanInfo?.missionStatement || "",
      visionStatement: businessProfile.businessPlanInfo?.visionStatement || "",
      coreValues: businessProfile.businessPlanInfo?.coreValues || "",
      businessGoals: businessProfile.businessPlanInfo?.businessGoals || [],
      marketAnalysis: businessProfile.businessPlanInfo?.marketAnalysis || [],
      financialProjections: businessProfile.businessPlanInfo?.financialProjections || [],
      marketingStrategy: businessProfile.businessPlanInfo?.marketingStrategy || "",
      operationsPlan: businessProfile.businessPlanInfo?.operationsPlan || "",
      riskAssessment: businessProfile.businessPlanInfo?.riskAssessment || "",
      implementationTimeline: businessProfile.businessPlanInfo?.implementationTimeline || "",
      notes: businessProfile.businessPlanInfo?.notes || ""
    });
    setIsEditing(false);
  };

  // Business Goals functions
  const addBusinessGoal = () => {
    const newGoal: BusinessGoal = {
      id: Date.now().toString(),
      title: "",
      description: "",
      category: "",
      priority: "Medium",
      targetDate: "",
      status: "Not Started",
      progress: "0",
      notes: ""
    };
    setFormData({
      ...formData,
      businessGoals: [...formData.businessGoals, newGoal]
    });
  };

  const removeBusinessGoal = (id: string) => {
    setFormData({
      ...formData,
      businessGoals: formData.businessGoals.filter((goal: BusinessGoal) => goal.id !== id)
    });
  };

  const updateBusinessGoal = (id: string, field: keyof BusinessGoal, value: string) => {
    setFormData({
      ...formData,
      businessGoals: formData.businessGoals.map((goal: BusinessGoal) =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    });
  };

  // Market Analysis functions
  const addMarketAnalysis = () => {
    const newAnalysis: MarketAnalysis = {
      id: Date.now().toString(),
      segment: "",
      size: "",
      growth: "",
      competition: "",
      opportunities: "",
      threats: ""
    };
    setFormData({
      ...formData,
      marketAnalysis: [...formData.marketAnalysis, newAnalysis]
    });
  };

  const removeMarketAnalysis = (id: string) => {
    setFormData({
      ...formData,
      marketAnalysis: formData.marketAnalysis.filter((analysis: MarketAnalysis) => analysis.id !== id)
    });
  };

  const updateMarketAnalysis = (id: string, field: keyof MarketAnalysis, value: string) => {
    setFormData({
      ...formData,
      marketAnalysis: formData.marketAnalysis.map((analysis: MarketAnalysis) =>
        analysis.id === id ? { ...analysis, [field]: value } : analysis
      )
    });
  };

  // Financial Projections functions
  const addFinancialProjection = () => {
    const newProjection: FinancialProjection = {
      id: Date.now().toString(),
      year: "",
      revenue: "",
      expenses: "",
      profit: "",
      cashFlow: "",
      assumptions: ""
    };
    setFormData({
      ...formData,
      financialProjections: [...formData.financialProjections, newProjection]
    });
  };

  const removeFinancialProjection = (id: string) => {
    setFormData({
      ...formData,
      financialProjections: formData.financialProjections.filter((projection: FinancialProjection) => projection.id !== id)
    });
  };

  const updateFinancialProjection = (id: string, field: keyof FinancialProjection, value: string) => {
    setFormData({
      ...formData,
      financialProjections: formData.financialProjections.map((projection: FinancialProjection) =>
        projection.id === id ? { ...projection, [field]: value } : projection
      )
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return "text-red-600 bg-red-50 border-red-200";
      case 'medium':
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 'low':
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "text-green-600 bg-green-50 border-green-200";
      case 'in progress':
        return "text-blue-600 bg-blue-50 border-blue-200";
      case 'on hold':
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 'not started':
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'on hold':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Plan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Business Plan
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
          {/* Executive Summary */}
          <div className="space-y-2">
            <Label htmlFor="executiveSummary">Executive Summary</Label>
            {isEditing ? (
              <Textarea
                id="executiveSummary"
                placeholder="Brief overview of your business, its mission, and key success factors"
                value={formData.executiveSummary}
                onChange={(e) => setFormData({ ...formData, executiveSummary: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                {formData.executiveSummary || "No executive summary provided"}
              </p>
            )}
          </div>

          {/* Mission, Vision, and Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="missionStatement">Mission Statement</Label>
              {isEditing ? (
                <Textarea
                  id="missionStatement"
                  placeholder="What your business does and why"
                  value={formData.missionStatement}
                  onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                  {formData.missionStatement || "No mission statement defined"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visionStatement">Vision Statement</Label>
              {isEditing ? (
                <Textarea
                  id="visionStatement"
                  placeholder="Where you see your business in the future"
                  value={formData.visionStatement}
                  onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                  {formData.visionStatement || "No vision statement defined"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coreValues">Core Values</Label>
              {isEditing ? (
                <Textarea
                  id="coreValues"
                  placeholder="Fundamental beliefs that guide your business"
                  value={formData.coreValues}
                  onChange={(e) => setFormData({ ...formData, coreValues: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                  {formData.coreValues || "No core values defined"}
                </p>
              )}
            </div>
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about your business plan..."
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
