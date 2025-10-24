"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Building2, 
  DollarSign,
  Percent,
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailBankingFinanceProps {
  businessProfile: BusinessProfile;
}

interface BankAccount {
  id: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  bankAddress: string;
  accountType: string;
}

interface BusinessLoan {
  id: string;
  loanNumber: string;
  issuingCompany: string;
  accountType: string;
  accountNumber: string;
  dateOpened: string;
  originalAmount: string;
  currentBalance: string;
  interestRate: string;
  monthlyPayment: string;
  paymentDueDate: string;
  accountStatus: string;
  notes: string;
}

interface CreditCard {
  id: string;
  cardNumber: string;
  issuingCompany: string;
  cardType: string;
  dateOpened: string;
  creditLimit: string;
  currentBalance: string;
  interestRate: string;
  minimumPayment: string;
  paymentDueDate: string;
  accountStatus: string;
  notes: string;
}

export function BusinessDetailBankingFinance({ businessProfile }: BusinessDetailBankingFinanceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Primary Bank
    primaryBankName: businessProfile.bankingFinanceInfo?.primaryBankName || "",
    primaryRoutingNumber: businessProfile.bankingFinanceInfo?.primaryRoutingNumber || "",
    primaryAccountNumber: businessProfile.bankingFinanceInfo?.primaryAccountNumber || "",
    primaryBankAddress: businessProfile.bankingFinanceInfo?.primaryBankAddress || "",
    
    // Secondary Bank
    secondaryBankName: businessProfile.bankingFinanceInfo?.secondaryBankName || "",
    secondaryRoutingNumber: businessProfile.bankingFinanceInfo?.secondaryRoutingNumber || "",
    secondaryAccountNumber: businessProfile.bankingFinanceInfo?.secondaryAccountNumber || "",
    secondaryBankAddress: businessProfile.bankingFinanceInfo?.secondaryBankAddress || "",
    
    // Business Loans
    businessLoans: businessProfile.bankingFinanceInfo?.businessLoans || [] as BusinessLoan[],
    
    // Business Credit Cards
    businessCreditCards: businessProfile.bankingFinanceInfo?.businessCreditCards || [] as CreditCard[],
    
    bankingNotes: businessProfile.bankingFinanceInfo?.bankingNotes || "",
    notes: businessProfile.bankingFinanceInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'banking-finance',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save banking and finance information');
      }

      const result = await response.json();
      console.log('Banking and finance information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving banking and finance information:', error);
      alert('Failed to save banking and finance information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      primaryBankName: businessProfile.bankingFinanceInfo?.primaryBankName || "",
      primaryRoutingNumber: businessProfile.bankingFinanceInfo?.primaryRoutingNumber || "",
      primaryAccountNumber: businessProfile.bankingFinanceInfo?.primaryAccountNumber || "",
      primaryBankAddress: businessProfile.bankingFinanceInfo?.primaryBankAddress || "",
      secondaryBankName: businessProfile.bankingFinanceInfo?.secondaryBankName || "",
      secondaryRoutingNumber: businessProfile.bankingFinanceInfo?.secondaryRoutingNumber || "",
      secondaryAccountNumber: businessProfile.bankingFinanceInfo?.secondaryAccountNumber || "",
      secondaryBankAddress: businessProfile.bankingFinanceInfo?.secondaryBankAddress || "",
      businessLoans: businessProfile.bankingFinanceInfo?.businessLoans || [],
      businessCreditCards: businessProfile.bankingFinanceInfo?.businessCreditCards || [],
      bankingNotes: businessProfile.bankingFinanceInfo?.bankingNotes || "",
      notes: businessProfile.bankingFinanceInfo?.notes || ""
    });
    setIsEditing(false);
  };

  const addBusinessLoan = () => {
    const newLoan: BusinessLoan = {
      id: Date.now().toString(),
      loanNumber: "",
      issuingCompany: "",
      accountType: "",
      accountNumber: "",
      dateOpened: "",
      originalAmount: "",
      currentBalance: "",
      interestRate: "",
      monthlyPayment: "",
      paymentDueDate: "",
      accountStatus: "Active",
      notes: ""
    };
    setFormData({
      ...formData,
      businessLoans: [...formData.businessLoans, newLoan]
    });
  };

  const removeBusinessLoan = (id: string) => {
    setFormData({
      ...formData,
      businessLoans: formData.businessLoans.filter((loan: BusinessLoan) => loan.id !== id)
    });
  };

  const updateBusinessLoan = (id: string, field: keyof BusinessLoan, value: string) => {
    setFormData({
      ...formData,
      businessLoans: formData.businessLoans.map((loan: BusinessLoan) =>
        loan.id === id ? { ...loan, [field]: value } : loan
      )
    });
  };

  const addCreditCard = () => {
    const newCard: CreditCard = {
      id: Date.now().toString(),
      cardNumber: "",
      issuingCompany: "",
      cardType: "",
      dateOpened: "",
      creditLimit: "",
      currentBalance: "",
      interestRate: "",
      minimumPayment: "",
      paymentDueDate: "",
      accountStatus: "Active",
      notes: ""
    };
    setFormData({
      ...formData,
      businessCreditCards: [...formData.businessCreditCards, newCard]
    });
  };

  const removeCreditCard = (id: string) => {
    setFormData({
      ...formData,
      businessCreditCards: formData.businessCreditCards.filter((card: CreditCard) => card.id !== id)
    });
  };

  const updateCreditCard = (id: string, field: keyof CreditCard, value: string) => {
    setFormData({
      ...formData,
      businessCreditCards: formData.businessCreditCards.map((card: CreditCard) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    });
  };

  return (
    <div className="space-y-6">
      {/* Banking and Finance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Banking and Finance
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
          {/* Primary Bank */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Primary Bank
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryBankName">Primary Bank Name</Label>
                {isEditing ? (
                  <Input
                    id="primaryBankName"
                    placeholder="Name of primary bank"
                    value={formData.primaryBankName}
                    onChange={(e) => setFormData({ ...formData, primaryBankName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryBankName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryRoutingNumber">Routing Number</Label>
                {isEditing ? (
                  <Input
                    id="primaryRoutingNumber"
                    placeholder="Bank routing number"
                    value={formData.primaryRoutingNumber}
                    onChange={(e) => setFormData({ ...formData, primaryRoutingNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.primaryRoutingNumber || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryAccountNumber">Account Number</Label>
                {isEditing ? (
                  <Input
                    id="primaryAccountNumber"
                    placeholder="Bank account number"
                    value={formData.primaryAccountNumber}
                    onChange={(e) => setFormData({ ...formData, primaryAccountNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.primaryAccountNumber ? `****${formData.primaryAccountNumber.slice(-4)}` : "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryBankAddress">Bank Address</Label>
                {isEditing ? (
                  <Input
                    id="primaryBankAddress"
                    placeholder="Bank branch address"
                    value={formData.primaryBankAddress}
                    onChange={(e) => setFormData({ ...formData, primaryBankAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryBankAddress || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Bank */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Secondary Bank
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryBankName">Secondary Bank Name</Label>
                {isEditing ? (
                  <Input
                    id="secondaryBankName"
                    placeholder="Second bank name"
                    value={formData.secondaryBankName}
                    onChange={(e) => setFormData({ ...formData, secondaryBankName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryBankName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryRoutingNumber">Secondary Routing Number</Label>
                {isEditing ? (
                  <Input
                    id="secondaryRoutingNumber"
                    placeholder="Second bank routing"
                    value={formData.secondaryRoutingNumber}
                    onChange={(e) => setFormData({ ...formData, secondaryRoutingNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.secondaryRoutingNumber || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryAccountNumber">Secondary Account Number</Label>
                {isEditing ? (
                  <Input
                    id="secondaryAccountNumber"
                    placeholder="Second bank account"
                    value={formData.secondaryAccountNumber}
                    onChange={(e) => setFormData({ ...formData, secondaryAccountNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.secondaryAccountNumber ? `****${formData.secondaryAccountNumber.slice(-4)}` : "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryBankAddress">Secondary Bank Address</Label>
                {isEditing ? (
                  <Input
                    id="secondaryBankAddress"
                    placeholder="Second bank address"
                    value={formData.secondaryBankAddress}
                    onChange={(e) => setFormData({ ...formData, secondaryBankAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryBankAddress || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Business Loans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Business Loans
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addBusinessLoan}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Loan
                </Button>
              )}
            </div>
            
            {formData.businessLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No business loans added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.businessLoans.map((loan: BusinessLoan, index: number) => (
                  <Card key={loan.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Loan #{index + 1}</CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBusinessLoan(loan.id)}
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
                          <Label>Issuing Company</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Bank or lender name"
                              value={loan.issuingCompany}
                              onChange={(e) => updateBusinessLoan(loan.id, 'issuingCompany', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.issuingCompany || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Type</Label>
                          {isEditing ? (
                            <Input
                              placeholder="e.g., Business Line of Credit, Term Loan"
                              value={loan.accountType}
                              onChange={(e) => updateBusinessLoan(loan.id, 'accountType', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.accountType || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Number (Last 4)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Last 4 digits"
                              value={loan.accountNumber}
                              onChange={(e) => updateBusinessLoan(loan.id, 'accountNumber', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                              {loan.accountNumber || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Date Opened</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={loan.dateOpened}
                              onChange={(e) => updateBusinessLoan(loan.id, 'dateOpened', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.dateOpened ? new Date(loan.dateOpened).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Original Amount ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={loan.originalAmount}
                              onChange={(e) => updateBusinessLoan(loan.id, 'originalAmount', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.originalAmount ? `$${loan.originalAmount}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Current Balance ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={loan.currentBalance}
                              onChange={(e) => updateBusinessLoan(loan.id, 'currentBalance', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.currentBalance ? `$${loan.currentBalance}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Interest Rate (%)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={loan.interestRate}
                              onChange={(e) => updateBusinessLoan(loan.id, 'interestRate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.interestRate ? `${loan.interestRate}%` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Monthly Payment ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={loan.monthlyPayment}
                              onChange={(e) => updateBusinessLoan(loan.id, 'monthlyPayment', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.monthlyPayment ? `$${loan.monthlyPayment}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Due Date (Day of Month)</Label>
                          {isEditing ? (
                            <Select value={loan.paymentDueDate} onValueChange={(value) => updateBusinessLoan(loan.id, 'paymentDueDate', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="1-31" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.paymentDueDate ? `${loan.paymentDueDate}${loan.paymentDueDate.endsWith('1') ? 'st' : loan.paymentDueDate.endsWith('2') ? 'nd' : loan.paymentDueDate.endsWith('3') ? 'rd' : 'th'} of month` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Status</Label>
                          {isEditing ? (
                            <Select value={loan.accountStatus} onValueChange={(value) => updateBusinessLoan(loan.id, 'accountStatus', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Paid Off">Paid Off</SelectItem>
                                <SelectItem value="Delinquent">Delinquent</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {loan.accountStatus || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes about this loan"
                            value={loan.notes}
                            onChange={(e) => updateBusinessLoan(loan.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {loan.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Business Credit Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Business Credit Cards
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addCreditCard}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credit Card
                </Button>
              )}
            </div>
            
            {formData.businessCreditCards.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No business credit cards added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.businessCreditCards.map((card: CreditCard, index: number) => (
                  <Card key={card.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Credit Card #{index + 1}</CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCreditCard(card.id)}
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
                          <Label>Issuing Company</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Card issuer name"
                              value={card.issuingCompany}
                              onChange={(e) => updateCreditCard(card.id, 'issuingCompany', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.issuingCompany || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Card Type</Label>
                          {isEditing ? (
                            <Input
                              placeholder="e.g., Business Credit Card"
                              value={card.cardType}
                              onChange={(e) => updateCreditCard(card.id, 'cardType', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.cardType || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Card Number (Last 4)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Last 4 digits"
                              value={card.cardNumber}
                              onChange={(e) => updateCreditCard(card.id, 'cardNumber', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                              {card.cardNumber ? `****${card.cardNumber}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Date Opened</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={card.dateOpened}
                              onChange={(e) => updateCreditCard(card.id, 'dateOpened', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.dateOpened ? new Date(card.dateOpened).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Credit Limit ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={card.creditLimit}
                              onChange={(e) => updateCreditCard(card.id, 'creditLimit', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.creditLimit ? `$${card.creditLimit}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Current Balance ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={card.currentBalance}
                              onChange={(e) => updateCreditCard(card.id, 'currentBalance', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.currentBalance ? `$${card.currentBalance}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Interest Rate (%)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={card.interestRate}
                              onChange={(e) => updateCreditCard(card.id, 'interestRate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.interestRate ? `${card.interestRate}%` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Minimum Payment ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={card.minimumPayment}
                              onChange={(e) => updateCreditCard(card.id, 'minimumPayment', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.minimumPayment ? `$${card.minimumPayment}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Due Date (Day of Month)</Label>
                          {isEditing ? (
                            <Select value={card.paymentDueDate} onValueChange={(value) => updateCreditCard(card.id, 'paymentDueDate', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="1-31" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.paymentDueDate ? `${card.paymentDueDate}${card.paymentDueDate.endsWith('1') ? 'st' : card.paymentDueDate.endsWith('2') ? 'nd' : card.paymentDueDate.endsWith('3') ? 'rd' : 'th'} of month` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Account Status</Label>
                          {isEditing ? (
                            <Select value={card.accountStatus} onValueChange={(value) => updateCreditCard(card.id, 'accountStatus', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                                <SelectItem value="Delinquent">Delinquent</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {card.accountStatus || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes about this credit card"
                            value={card.notes}
                            onChange={(e) => updateCreditCard(card.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {card.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Banking Notes */}
          <div className="space-y-2">
            <Label htmlFor="bankingNotes">Banking Notes</Label>
            {isEditing ? (
              <Textarea
                id="bankingNotes"
                placeholder="Additional banking information"
                value={formData.bankingNotes}
                onChange={(e) => setFormData({ ...formData, bankingNotes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.bankingNotes || "No banking notes provided"}
              </p>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about banking and finance..."
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
