"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradelineType, TradelineStatus } from "@/generated/prisma";
import { CreditTradeline } from "@/hooks/use-credit";

interface TradelineCardProps {
  tradeline: CreditTradeline;
  onEdit: (tradeline: CreditTradeline) => void;
  onDelete: (tradelineId: string) => void;
}

export function TradelineCard({ tradeline, onEdit, onDelete }: TradelineCardProps) {
  const getAccountTypeLabel = (type: TradelineType) => {
    switch (type) {
      case TradelineType.CREDIT_CARD:
        return "Credit Card";
      case TradelineType.AUTO_LOAN:
        return "Auto Loan";
      case TradelineType.MORTGAGE:
        return "Mortgage";
      case TradelineType.PERSONAL_LOAN:
        return "Personal Loan";
      case TradelineType.LINE_OF_CREDIT:
        return "Line of Credit";
      case TradelineType.STUDENT_LOAN:
        return "Student Loan";
      case TradelineType.OTHER:
        return "Other";
      default:
        return type;
    }
  };

  const getStatusColor = (status: TradelineStatus) => {
    switch (status) {
      case TradelineStatus.ACTIVE:
        return "default";
      case TradelineStatus.CLOSED:
        return "secondary";
      case TradelineStatus.PAID_OFF:
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: TradelineStatus) => {
    switch (status) {
      case TradelineStatus.ACTIVE:
        return "Active";
      case TradelineStatus.CLOSED:
        return "Closed";
      case TradelineStatus.PAID_OFF:
        return "Paid Off";
      default:
        return status;
    }
  };

  const getUtilizationPercentage = () => {
    if (!tradeline.creditLimit || tradeline.creditLimit === 0) return 0;
    return (tradeline.currentBalance / tradeline.creditLimit) * 100;
  };

  const utilization = getUtilizationPercentage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{tradeline.accountName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{tradeline.creditorName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(tradeline.status)}>
              {getStatusLabel(tradeline.status)}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tradeline)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(tradeline.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          {getAccountTypeLabel(tradeline.accountType)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Financial Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {tradeline.creditLimit && (
            <div>
              <span className="text-muted-foreground">Credit Limit:</span>
              <div className="font-medium">${tradeline.creditLimit.toLocaleString()}</div>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Current Balance:</span>
            <div className="font-medium">${tradeline.currentBalance.toLocaleString()}</div>
          </div>
          {tradeline.minimumPayment && (
            <div>
              <span className="text-muted-foreground">Min Payment:</span>
              <div className="font-medium">${tradeline.minimumPayment.toLocaleString()}</div>
            </div>
          )}
          {tradeline.interestRate && (
            <div>
              <span className="text-muted-foreground">Interest Rate:</span>
              <div className="font-medium">{tradeline.interestRate}%</div>
            </div>
          )}
        </div>

        {/* Utilization Bar (for credit cards) */}
        {tradeline.accountType === TradelineType.CREDIT_CARD && tradeline.creditLimit && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utilization:</span>
              <span className={`font-medium ${utilization > 30 ? 'text-red-600' : utilization > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                {utilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  utilization > 30 ? 'bg-red-500' : utilization > 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {tradeline.notes && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            {tradeline.notes}
          </div>
        )}

        {/* Account Age */}
        <div className="text-xs text-muted-foreground">
          Added {new Date(tradeline.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
