"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditGoalType } from "@/generated/prisma";

interface CreditGoalFormProps {
  onSubmit: (goalData: any) => void;
  onCancel: () => void;
}

export function CreditGoalForm({ onSubmit, onCancel }: CreditGoalFormProps) {
  const [goalType, setGoalType] = useState<CreditGoalType>(CreditGoalType.CREDIT_SCORE);
  const [goalName, setGoalName] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getGoalTypeLabel = (type: CreditGoalType) => {
    switch (type) {
      case CreditGoalType.CREDIT_SCORE:
        return "Credit Score";
      case CreditGoalType.DEBT_PAYOFF:
        return "Debt Payoff";
      case CreditGoalType.UTILIZATION_REDUCTION:
        return "Utilization Reduction";
      default:
        return type;
    }
  };

  const getPlaceholderText = () => {
    switch (goalType) {
      case CreditGoalType.CREDIT_SCORE:
        return {
          goalName: "Reach 750 credit score",
          currentValue: "720",
          targetValue: "750",
        };
      case CreditGoalType.DEBT_PAYOFF:
        return {
          goalName: "Pay off credit card debt",
          currentValue: "5000",
          targetValue: "0",
        };
      case CreditGoalType.UTILIZATION_REDUCTION:
        return {
          goalName: "Reduce credit utilization",
          currentValue: "30",
          targetValue: "10",
        };
      default:
        return {
          goalName: "My credit goal",
          currentValue: "0",
          targetValue: "100",
        };
    }
  };

  const placeholders = getPlaceholderText();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName || !targetValue) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        goalType,
        goalName,
        currentValue: currentValue ? parseFloat(currentValue) : null,
        targetValue: parseFloat(targetValue),
        targetDate: targetDate || null,
        notes: notes || null,
      });
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goalType">Goal Type *</Label>
        <Select value={goalType} onValueChange={(value) => setGoalType(value as CreditGoalType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[220]">
            <SelectItem value={CreditGoalType.CREDIT_SCORE}>Credit Score</SelectItem>
            <SelectItem value={CreditGoalType.DEBT_PAYOFF}>Debt Payoff</SelectItem>
            <SelectItem value={CreditGoalType.UTILIZATION_REDUCTION}>Utilization Reduction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goalName">Goal Name *</Label>
        <Input
          id="goalName"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          placeholder={placeholders.goalName}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentValue">Current Value</Label>
          <Input
            id="currentValue"
            type="number"
            step="0.01"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholders.currentValue}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetValue">Target Value *</Label>
          <Input
            id="targetValue"
            type="number"
            step="0.01"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder={placeholders.targetValue}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetDate">Target Date (Optional)</Label>
        <Input
          id="targetDate"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about your goal..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Adding..." : "Add Goal"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
