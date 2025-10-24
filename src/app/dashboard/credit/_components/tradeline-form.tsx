"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradelineType, TradelineStatus } from "@/generated/prisma";
import { CreditTradeline } from "@/hooks/use-credit";

interface TradelineFormProps {
  tradeline?: CreditTradeline | null;
  onSubmit: (tradelineData: any) => void;
  onCancel: () => void;
}

export function TradelineForm({ tradeline, onSubmit, onCancel }: TradelineFormProps) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<TradelineType>(TradelineType.CREDIT_CARD);
  const [creditorName, setCreditorName] = useState("");
  const [status, setStatus] = useState<TradelineStatus>(TradelineStatus.ACTIVE);
  const [creditLimit, setCreditLimit] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (tradeline) {
      setAccountName(tradeline.accountName);
      setAccountType(tradeline.accountType);
      setCreditorName(tradeline.creditorName);
      setStatus(tradeline.status);
      setCreditLimit(tradeline.creditLimit?.toString() || "");
      setCurrentBalance(tradeline.currentBalance.toString());
      setMinimumPayment(tradeline.minimumPayment?.toString() || "");
      setInterestRate(tradeline.interestRate?.toString() || "");
      setNotes(tradeline.notes || "");
    }
  }, [tradeline]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountName || !creditorName) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        accountName,
        accountType,
        creditorName,
        status,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        currentBalance: currentBalance ? parseFloat(currentBalance) : 0,
        minimumPayment: minimumPayment ? parseFloat(minimumPayment) : null,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        notes: notes || null,
      });
    } catch (error) {
      console.error('Failed to save tradeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name *</Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Chase Freedom"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountType">Account Type *</Label>
        <Select value={accountType} onValueChange={(value) => setAccountType(value as TradelineType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[220]">
            <SelectItem value={TradelineType.CREDIT_CARD}>Credit Card</SelectItem>
            <SelectItem value={TradelineType.AUTO_LOAN}>Auto Loan</SelectItem>
            <SelectItem value={TradelineType.MORTGAGE}>Mortgage</SelectItem>
            <SelectItem value={TradelineType.PERSONAL_LOAN}>Personal Loan</SelectItem>
            <SelectItem value={TradelineType.LINE_OF_CREDIT}>Line of Credit</SelectItem>
            <SelectItem value={TradelineType.STUDENT_LOAN}>Student Loan</SelectItem>
            <SelectItem value={TradelineType.OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditorName">Creditor Name *</Label>
        <Input
          id="creditorName"
          value={creditorName}
          onChange={(e) => setCreditorName(e.target.value)}
          placeholder="Chase Bank"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as TradelineStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[220]">
            <SelectItem value={TradelineStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={TradelineStatus.CLOSED}>Closed</SelectItem>
            <SelectItem value={TradelineStatus.PAID_OFF}>Paid Off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            type="number"
            step="0.01"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            placeholder="5000.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentBalance">Current Balance</Label>
          <Input
            id="currentBalance"
            type="number"
            step="0.01"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minimumPayment">Minimum Payment</Label>
          <Input
            id="minimumPayment"
            type="number"
            step="0.01"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
            placeholder="35.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="18.99"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about this account..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : tradeline ? "Update" : "Add"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
