"use client";

import { useState } from "react";
import { ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditScore } from "@/hooks/use-credit";
import { CreditBureau } from "@/generated/prisma";

interface CreditScoreCardProps {
  creditScore: CreditScore;
  onUpdate: (scoreData: Partial<CreditScore>) => Promise<void>;
}

export function CreditScoreCard({ creditScore, onUpdate }: CreditScoreCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState(creditScore.score?.toString() || "");
  const [lastUpdated, setLastUpdated] = useState(
    creditScore.lastUpdated ? new Date(creditScore.lastUpdated).toISOString().split('T')[0] : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const getBureauColor = (bureau: CreditBureau) => {
    switch (bureau) {
      case CreditBureau.EXPERIAN:
        return "text-blue-600";
      case CreditBureau.TRANSUNION:
        return "text-green-600";
      case CreditBureau.EQUIFAX:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getBureauName = (bureau: CreditBureau) => {
    switch (bureau) {
      case CreditBureau.EXPERIAN:
        return "Experian";
      case CreditBureau.TRANSUNION:
        return "TransUnion";
      case CreditBureau.EQUIFAX:
        return "Equifax";
      default:
        return bureau;
    }
  };

  const getScorePercentage = () => {
    if (!creditScore.score) return 0;
    const range = creditScore.maxRange - creditScore.minRange;
    const scoreFromMin = creditScore.score - creditScore.minRange;
    return (scoreFromMin / range) * 100;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onUpdate({
        bureau: creditScore.bureau,
        scoreType: creditScore.scoreType,
        score: score ? parseInt(score) : null,
        lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : null,
        isTracked: true,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setScore(creditScore.score?.toString() || "");
    setLastUpdated(
      creditScore.lastUpdated ? new Date(creditScore.lastUpdated).toISOString().split('T')[0] : ""
    );
    setIsEditing(false);
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-lg font-semibold ${getBureauColor(creditScore.bureau)}`}>
          {getBureauName(creditScore.bureau)}
          <ExternalLink className="w-4 h-4 inline ml-2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(getScorePercentage() / 100) * 314.16} 314.16`}
                className={getBureauColor(creditScore.bureau)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-3xl font-bold ${getBureauColor(creditScore.bureau)}`}>
                {creditScore.score || 0}
              </div>
              <div className="text-sm text-gray-500">
                {creditScore.minRange}-{creditScore.maxRange}
              </div>
            </div>
          </div>
        </div>

        {/* Score Type */}
        <div className="text-center">
          <div className="font-medium">{creditScore.scoreType}</div>
          <div className="text-sm text-muted-foreground">
            Last Updated: {creditScore.lastUpdated 
              ? new Date(creditScore.lastUpdated).toLocaleDateString()
              : "Not tracked"
            }
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor={`score-${creditScore.bureau}`}>Enter {getBureauName(creditScore.bureau)} Score</Label>
              <Input
                id={`score-${creditScore.bureau}`}
                type="number"
                min={creditScore.minRange}
                max={creditScore.maxRange}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`${creditScore.minRange}-${creditScore.maxRange}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`date-${creditScore.bureau}`} className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id={`date-${creditScore.bureau}`}
                type="date"
                value={lastUpdated}
                onChange={(e) => setLastUpdated(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            Enter {getBureauName(creditScore.bureau)} Score
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
