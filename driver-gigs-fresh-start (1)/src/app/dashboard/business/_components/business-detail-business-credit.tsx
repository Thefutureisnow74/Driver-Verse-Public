"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Share2, 
  TrendingUp,
  TrendingDown,
  Minus,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface CreditScore {
  id: string;
  bureau: string;
  score: string;
  scoreRange: string;
  dateChecked: string;
  trend: 'up' | 'down' | 'stable';
  notes: string;
}

interface CreditMonitoring {
  id: string;
  serviceName: string;
  cost: string;
  renewalDate: string;
  features: string;
  loginInfo: string;
  loginCredentials: string;
  subscriptionCost: string;
  notes: string;
}

interface CreditTradeline {
  id: string;
  creditorName: string;
  accountType: string;
  creditLimit: string;
  currentBalance: string;
  paymentHistory: string;
  accountStatus: string;
  openDate: string;
  reportedDate: string;
  dateOpened: string;
  lastReported: string;
  notes: string;
}

interface BusinessDetailBusinessCreditProps {
  businessProfile: BusinessProfile;
}

export function BusinessDetailBusinessCredit({ businessProfile }: BusinessDetailBusinessCreditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Business Credit Scores
    creditScores: businessProfile.businessCreditInfo?.creditScores || [] as CreditScore[],
    
    // Credit Monitoring Services
    creditMonitoring: businessProfile.businessCreditInfo?.creditMonitoring || [] as CreditMonitoring[],
    
    // Credit Tradelines
    creditTradelines: businessProfile.businessCreditInfo?.creditTradelines || [] as CreditTradeline[],
    
    // Credit Goals and Strategy
    creditGoals: businessProfile.businessCreditInfo?.creditGoals || "",
    creditStrategy: businessProfile.businessCreditInfo?.creditStrategy || "",
    
    // Credit Building Timeline
    creditBuildingTimeline: businessProfile.businessCreditInfo?.creditBuildingTimeline || "",
    
    notes: businessProfile.businessCreditInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'business-credit',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business credit information');
      }

      const result = await response.json();
      console.log('Business credit information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving business credit information:', error);
      alert('Failed to save business credit information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      creditScores: businessProfile.businessCreditInfo?.creditScores || [],
      creditMonitoring: businessProfile.businessCreditInfo?.creditMonitoring || [],
      creditTradelines: businessProfile.businessCreditInfo?.creditTradelines || [],
      creditGoals: businessProfile.businessCreditInfo?.creditGoals || "",
      creditStrategy: businessProfile.businessCreditInfo?.creditStrategy || "",
      creditBuildingTimeline: businessProfile.businessCreditInfo?.creditBuildingTimeline || "",
      notes: businessProfile.businessCreditInfo?.notes || ""
    });
    setIsEditing(false);
  };

  // Credit Score functions
  const addCreditScore = () => {
    const newScore: CreditScore = {
      id: Date.now().toString(),
      bureau: "",
      score: "",
      scoreRange: "",
      dateChecked: "",
      trend: 'stable',
      notes: ""
    };
    setFormData({
      ...formData,
      creditScores: [...formData.creditScores, newScore]
    });
  };

  const removeCreditScore = (id: string) => {
    setFormData({
      ...formData,
      creditScores: formData.creditScores.filter((score: CreditScore) => score.id !== id)
    });
  };

  const updateCreditScore = (id: string, field: keyof CreditScore, value: string) => {
    setFormData({
      ...formData,
      creditScores: formData.creditScores.map((score: CreditScore) =>
        score.id === id ? { ...score, [field]: value } : score
      )
    });
  };

  // Credit Monitoring functions
  const addCreditMonitoring = () => {
    const newMonitoring: CreditMonitoring = {
      id: Date.now().toString(),
      serviceName: "",
      cost: "",
      renewalDate: "",
      features: "",
      loginInfo: "",
      loginCredentials: "",
      subscriptionCost: "",
      notes: ""
    };
    setFormData({
      ...formData,
      creditMonitoring: [...formData.creditMonitoring, newMonitoring]
    });
  };

  const removeCreditMonitoring = (id: string) => {
    setFormData({
      ...formData,
      creditMonitoring: formData.creditMonitoring.filter((monitoring: CreditMonitoring) => monitoring.id !== id)
    });
  };

  const updateCreditMonitoring = (id: string, field: keyof CreditMonitoring, value: string) => {
    setFormData({
      ...formData,
      creditMonitoring: formData.creditMonitoring.map((monitoring: CreditMonitoring) =>
        monitoring.id === id ? { ...monitoring, [field]: value } : monitoring
      )
    });
  };

  // Credit Tradeline functions
  const addCreditTradeline = () => {
    const newTradeline: CreditTradeline = {
      id: Date.now().toString(),
      creditorName: "",
      accountType: "",
      creditLimit: "",
      currentBalance: "",
      paymentHistory: "",
      accountStatus: "Active",
      openDate: "",
      reportedDate: "",
      dateOpened: "",
      lastReported: "",
      notes: ""
    };
    setFormData({
      ...formData,
      creditTradelines: [...formData.creditTradelines, newTradeline]
    });
  };

  const removeCreditTradeline = (id: string) => {
    setFormData({
      ...formData,
      creditTradelines: formData.creditTradelines.filter((tradeline: CreditTradeline) => tradeline.id !== id)
    });
  };

  const updateCreditTradeline = (id: string, field: keyof CreditTradeline, value: string) => {
    setFormData({
      ...formData,
      creditTradelines: formData.creditTradelines.map((tradeline: CreditTradeline) =>
        tradeline.id === id ? { ...tradeline, [field]: value } : tradeline
      )
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (numScore >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getAccountStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return "text-green-600 bg-green-50 border-green-200";
      case 'closed':
        return "text-gray-600 bg-gray-50 border-gray-200";
      case 'delinquent':
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  // Helper functions for specific credit scores
  const getExperianScore = () => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    return experianScore?.score || "0";
  };

  const getPaydexScore = () => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    return paydexScore?.score || "0";
  };

  const getEquifaxScore = () => {
    const equifaxScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Equifax') || score.bureau?.includes('Business Score')
    );
    return equifaxScore?.score || "600";
  };

  const getExperianScoreInput = () => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    return experianScore?.score || "";
  };

  const getPaydexScoreInput = () => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    return paydexScore?.score || "";
  };

  const getEquifaxScoreInput = () => {
    const equifaxScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Equifax') || score.bureau?.includes('Business Score')
    );
    return equifaxScore?.score || "";
  };

  const getExperianDate = () => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    return experianScore?.dateChecked || "";
  };

  const getPaydexDate = () => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    return paydexScore?.dateChecked || "";
  };

  const getEquifaxDate = () => {
    const equifaxScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Equifax') || score.bureau?.includes('Business Score')
    );
    return equifaxScore?.dateChecked || "";
  };

  const getExperianNotes = () => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    return experianScore?.notes || "";
  };

  const getPaydexNotes = () => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    return paydexScore?.notes || "";
  };

  const updateExperianScore = (value: string) => {
    let experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    
    if (!experianScore) {
      experianScore = {
        id: Date.now().toString(),
        bureau: "Experian (Intelliscore Plus)",
        score: value,
        scoreRange: "1-100",
        dateChecked: "",
        trend: 'stable',
        notes: ""
      };
      setFormData({
        ...formData,
        creditScores: [...formData.creditScores, experianScore]
      });
    } else {
      updateCreditScore(experianScore.id, 'score', value);
    }
  };

  const updatePaydexScore = (value: string) => {
    let paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    
    if (!paydexScore) {
      paydexScore = {
        id: Date.now().toString(),
        bureau: "D&B (Paydex Score)",
        score: value,
        scoreRange: "1-100",
        dateChecked: "",
        trend: 'stable',
        notes: ""
      };
      setFormData({
        ...formData,
        creditScores: [...formData.creditScores, paydexScore]
      });
    } else {
      updateCreditScore(paydexScore.id, 'score', value);
    }
  };

  const updateEquifaxScore = (value: string) => {
    let equifaxScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Equifax') || score.bureau?.includes('Business Score')
    );
    
    if (!equifaxScore) {
      equifaxScore = {
        id: Date.now().toString(),
        bureau: "Equifax (Business Score)",
        score: value,
        scoreRange: "101-992",
        dateChecked: "",
        trend: 'stable',
        notes: ""
      };
      setFormData({
        ...formData,
        creditScores: [...formData.creditScores, equifaxScore]
      });
    } else {
      updateCreditScore(equifaxScore.id, 'score', value);
    }
  };

  const updateExperianDate = (value: string) => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    if (experianScore) {
      updateCreditScore(experianScore.id, 'dateChecked', value);
    }
  };

  const updatePaydexDate = (value: string) => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    if (paydexScore) {
      updateCreditScore(paydexScore.id, 'dateChecked', value);
    }
  };

  const updateEquifaxDate = (value: string) => {
    const equifaxScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Equifax') || score.bureau?.includes('Business Score')
    );
    if (equifaxScore) {
      updateCreditScore(equifaxScore.id, 'dateChecked', value);
    }
  };

  const updateExperianNotes = (value: string) => {
    const experianScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('Experian') || score.bureau?.includes('Intelliscore')
    );
    if (experianScore) {
      updateCreditScore(experianScore.id, 'notes', value);
    }
  };

  const updatePaydexNotes = (value: string) => {
    const paydexScore = formData.creditScores.find((score: CreditScore) => 
      score.bureau?.includes('D&B') || score.bureau?.includes('Paydex')
    );
    if (paydexScore) {
      updateCreditScore(paydexScore.id, 'notes', value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Credit */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Business Credit
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
          {/* Credit Score Overview Dashboard */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-700">Credit Score Overview</h4>
            
            {/* Credit Score Circular Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Experian Intelliscore Plus */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(getExperianScore() / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">{getExperianScore()}</span>
                    <span className="text-sm text-gray-500">1-100</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-1">
                    Experian <ExternalLink className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Intelliscore Plus</p>
                </div>
                {isEditing && (
                  <div className="space-y-2 w-full max-w-xs">
                    <Input
                      placeholder="Enter score (0-100)"
                      value={getExperianScoreInput()}
                      onChange={(e) => updateExperianScore(e.target.value)}
                      className="text-center"
                    />
                    <Input
                      type="date"
                      placeholder="dd/mm/yyyy"
                      value={getExperianDate()}
                      onChange={(e) => updateExperianDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* D&B Paydex Score */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(getPaydexScore() / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">{getPaydexScore()}</span>
                    <span className="text-sm text-gray-500">1-100</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-1">
                    D&B <ExternalLink className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Paydex Score</p>
                </div>
                {isEditing && (
                  <div className="space-y-2 w-full max-w-xs">
                    <Input
                      placeholder="Enter score (0-100)"
                      value={getPaydexScoreInput()}
                      onChange={(e) => updatePaydexScore(e.target.value)}
                      className="text-center"
                    />
                    <Input
                      type="date"
                      placeholder="dd/mm/yyyy"
                      value={getPaydexDate()}
                      onChange={(e) => updatePaydexDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Equifax Business Score */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f97316"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(getEquifaxScore() / 992) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-orange-600">{getEquifaxScore()}</span>
                    <span className="text-sm text-gray-500">101-992</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-1">
                    Equifax <ExternalLink className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-600">Business Score</p>
                </div>
                {isEditing && (
                  <div className="space-y-2 w-full max-w-xs">
                    <Input
                      placeholder="Enter score (101-992)"
                      value={getEquifaxScoreInput()}
                      onChange={(e) => updateEquifaxScore(e.target.value)}
                      className="text-center"
                    />
                    <Input
                      type="date"
                      placeholder="dd/mm/yyyy"
                      value={getEquifaxDate()}
                      onChange={(e) => updateEquifaxDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Credit Scores Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700">Business Credit Scores</h4>
            
            {/* Individual Score Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-blue-600 flex items-center gap-2">
                    Experian Intelliscore Score <ExternalLink className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Experian business credit score"
                    value={getExperianNotes()}
                    onChange={(e) => updateExperianNotes(e.target.value)}
                    rows={3}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-green-600 flex items-center gap-2">
                    D&B Paydex Score <ExternalLink className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Dun & Bradstreet Paydex score"
                    value={getPaydexNotes()}
                    onChange={(e) => updatePaydexNotes(e.target.value)}
                    rows={3}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </CardContent>
              </Card>
            </div>
          </div>


          {/* Credit Scores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Credit Scores
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addCreditScore}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Score
                </Button>
              )}
            </div>
            
            {formData.creditScores.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No credit scores added
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.creditScores.map((score: CreditScore, index: number) => (
                  <Card key={score.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {score.bureau || `Score #${index + 1}`}
                          {getTrendIcon(score.trend)}
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCreditScore(score.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Credit Bureau</Label>
                          {isEditing ? (
                            <Select value={score.bureau} onValueChange={(value) => updateCreditScore(score.id, 'bureau', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bureau" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Experian (Intelliscore Plus)">Experian (Intelliscore Plus)</SelectItem>
                                <SelectItem value="D&B (Paydex Score)">D&B (Paydex Score)</SelectItem>
                                <SelectItem value="Equifax (Business Score)">Equifax (Business Score)</SelectItem>
                                <SelectItem value="FICO SBSS">FICO SBSS</SelectItem>
                                <SelectItem value="PayNet">PayNet</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {score.bureau || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Score</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Credit score"
                              value={score.score}
                              onChange={(e) => updateCreditScore(score.id, 'score', e.target.value)}
                            />
                          ) : (
                            <div className={`text-2xl font-bold p-3 rounded border ${getScoreColor(score.score)}`}>
                              {score.score || "N/A"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Score Range</Label>
                          {isEditing ? (
                            <Input
                              placeholder="e.g., 0-100"
                              value={score.scoreRange}
                              onChange={(e) => updateCreditScore(score.id, 'scoreRange', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {score.scoreRange || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Date Checked</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={score.dateChecked}
                              onChange={(e) => updateCreditScore(score.id, 'dateChecked', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {score.dateChecked ? new Date(score.dateChecked).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Trend</Label>
                          {isEditing ? (
                            <Select value={score.trend} onValueChange={(value) => updateCreditScore(score.id, 'trend', value as 'up' | 'down' | 'stable')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select trend" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="up">Improving</SelectItem>
                                <SelectItem value="stable">Stable</SelectItem>
                                <SelectItem value="down">Declining</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getTrendIcon(score.trend)}
                              <span className="text-sm text-muted-foreground">
                                {score.trend === 'up' ? 'Improving' : score.trend === 'down' ? 'Declining' : 'Stable'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Notes</Label>
                          {isEditing ? (
                            <Textarea
                              placeholder="Notes about this score"
                              value={score.notes}
                              onChange={(e) => updateCreditScore(score.id, 'notes', e.target.value)}
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                              {score.notes || "No notes provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Credit Monitoring Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Credit Monitoring Services
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addCreditMonitoring}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              )}
            </div>
            
            {formData.creditMonitoring.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No credit monitoring services added
              </p>
            ) : (
              <div className="space-y-4">
                    {formData.creditMonitoring.map((monitoring: CreditMonitoring, index: number) => (
                  <Card key={monitoring.id} className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {monitoring.serviceName || `Service #${index + 1}`}
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCreditMonitoring(monitoring.id)}
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
                          <Label>Service Name</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Credit monitoring service"
                              value={monitoring.serviceName}
                              onChange={(e) => updateCreditMonitoring(monitoring.id, 'serviceName', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {monitoring.serviceName || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Login Credentials</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Username/email"
                              value={monitoring.loginCredentials}
                              onChange={(e) => updateCreditMonitoring(monitoring.id, 'loginCredentials', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {monitoring.loginCredentials || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Subscription Cost</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Monthly/yearly cost"
                              value={monitoring.subscriptionCost}
                              onChange={(e) => updateCreditMonitoring(monitoring.id, 'subscriptionCost', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {monitoring.subscriptionCost || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Renewal Date</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={monitoring.renewalDate}
                              onChange={(e) => updateCreditMonitoring(monitoring.id, 'renewalDate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {monitoring.renewalDate ? new Date(monitoring.renewalDate).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Features</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Service features and benefits"
                            value={monitoring.features}
                            onChange={(e) => updateCreditMonitoring(monitoring.id, 'features', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {monitoring.features || "No features listed"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes"
                            value={monitoring.notes}
                            onChange={(e) => updateCreditMonitoring(monitoring.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {monitoring.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Credit Tradelines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Tradelines
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addCreditTradeline}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tradeline
                </Button>
              )}
            </div>
            
            {formData.creditTradelines.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No credit tradelines added
              </p>
            ) : (
              <div className="space-y-4">
                    {formData.creditTradelines.map((tradeline: CreditTradeline, index: number) => (
                  <Card key={tradeline.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {tradeline.creditorName || `Tradeline #${index + 1}`}
                          <Badge className={getAccountStatusColor(tradeline.accountStatus)}>
                            {tradeline.accountStatus || "Unknown"}
                          </Badge>
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCreditTradeline(tradeline.id)}
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
                          <Label>Creditor Name</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Name of creditor"
                              value={tradeline.creditorName}
                              onChange={(e) => updateCreditTradeline(tradeline.id, 'creditorName', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.creditorName || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Type</Label>
                          {isEditing ? (
                            <Select value={tradeline.accountType} onValueChange={(value) => updateCreditTradeline(tradeline.id, 'accountType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Line of Credit">Line of Credit</SelectItem>
                                <SelectItem value="Term Loan">Term Loan</SelectItem>
                                <SelectItem value="Trade Account">Trade Account</SelectItem>
                                <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.accountType || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Credit Limit ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={tradeline.creditLimit}
                              onChange={(e) => updateCreditTradeline(tradeline.id, 'creditLimit', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.creditLimit ? `$${tradeline.creditLimit}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Current Balance ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={tradeline.currentBalance}
                              onChange={(e) => updateCreditTradeline(tradeline.id, 'currentBalance', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.currentBalance ? `$${tradeline.currentBalance}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Payment History</Label>
                          {isEditing ? (
                            <Select value={tradeline.paymentHistory} onValueChange={(value) => updateCreditTradeline(tradeline.id, 'paymentHistory', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select history" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Excellent">Excellent (No late payments)</SelectItem>
                                <SelectItem value="Good">Good (1-2 late payments)</SelectItem>
                                <SelectItem value="Fair">Fair (3-5 late payments)</SelectItem>
                                <SelectItem value="Poor">Poor (6+ late payments)</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.paymentHistory || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Status</Label>
                          {isEditing ? (
                            <Select value={tradeline.accountStatus} onValueChange={(value) => updateCreditTradeline(tradeline.id, 'accountStatus', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Paid Off">Paid Off</SelectItem>
                                <SelectItem value="Delinquent">Delinquent</SelectItem>
                                <SelectItem value="Charge Off">Charge Off</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getAccountStatusColor(tradeline.accountStatus)}>
                              {tradeline.accountStatus || "Unknown"}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Date Opened</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={tradeline.dateOpened}
                              onChange={(e) => updateCreditTradeline(tradeline.id, 'dateOpened', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.dateOpened ? new Date(tradeline.dateOpened).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Last Reported</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={tradeline.lastReported}
                              onChange={(e) => updateCreditTradeline(tradeline.id, 'lastReported', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {tradeline.lastReported ? new Date(tradeline.lastReported).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes about this tradeline"
                            value={tradeline.notes}
                            onChange={(e) => updateCreditTradeline(tradeline.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {tradeline.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Credit Goals and Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="creditGoals">Credit Goals</Label>
              {isEditing ? (
                <Textarea
                  id="creditGoals"
                  placeholder="What are your business credit goals?"
                  value={formData.creditGoals}
                  onChange={(e) => setFormData({ ...formData, creditGoals: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.creditGoals || "No credit goals defined"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditStrategy">Credit Strategy</Label>
              {isEditing ? (
                <Textarea
                  id="creditStrategy"
                  placeholder="How will you achieve your credit goals?"
                  value={formData.creditStrategy}
                  onChange={(e) => setFormData({ ...formData, creditStrategy: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.creditStrategy || "No credit strategy defined"}
                </p>
              )}
            </div>
          </div>

          {/* Credit Building Timeline */}
          <div className="space-y-2">
            <Label htmlFor="creditBuildingTimeline">Credit Building Timeline</Label>
            {isEditing ? (
              <Textarea
                id="creditBuildingTimeline"
                placeholder="Timeline and milestones for building business credit"
                value={formData.creditBuildingTimeline}
                onChange={(e) => setFormData({ ...formData, creditBuildingTimeline: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.creditBuildingTimeline || "No timeline defined"}
              </p>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about business credit..."
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
