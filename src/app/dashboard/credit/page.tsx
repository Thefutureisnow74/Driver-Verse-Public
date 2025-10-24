"use client";

import { useState } from "react";
import { Plus, Target, TrendingUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCreditScores, useCreditGoals, useCreditTradelines } from "@/hooks/use-credit";
import { CreditScoreCard } from "./_components/credit-score-card";
import { CreditGoalForm } from "./_components/credit-goal-form";
import { TradelineForm } from "./_components/tradeline-form";
import { TradelineCard } from "./_components/tradeline-card";
import { CreditGoalType } from "@/generated/prisma";

export default function CreditPage() {
  const { creditScores, isLoading: scoresLoading, updateCreditScore } = useCreditScores();
  const { creditGoals, isLoading: goalsLoading, createCreditGoal, deleteCreditGoal } = useCreditGoals();
  const { tradelines, isLoading: tradelinesLoading, createTradeline, updateTradeline, deleteTradeline } = useCreditTradelines();

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTradelineForm, setShowTradelineForm] = useState(false);
  const [editingTradeline, setEditingTradeline] = useState<any>(null);

  // Calculate credit utilization and total credit limit
  const activeTradelines = tradelines.filter(t => t.status === 'ACTIVE' && t.accountType === 'CREDIT_CARD');
  const totalCreditLimit = activeTradelines.reduce((sum, t) => sum + (t.creditLimit || 0), 0);
  const totalBalance = activeTradelines.reduce((sum, t) => sum + t.currentBalance, 0);
  const creditUtilization = totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0;

  // Calculate average credit score
  const trackedScores = creditScores.filter(s => s.isTracked && s.score !== null);
  const averageScore = trackedScores.length > 0 
    ? Math.round(trackedScores.reduce((sum, s) => sum + (s.score || 0), 0) / trackedScores.length)
    : 0;

  const handleCreateGoal = async (goalData: any) => {
    try {
      await createCreditGoal(goalData);
      setShowGoalForm(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleCreateTradeline = async (tradelineData: any) => {
    try {
      await createTradeline(tradelineData);
      setShowTradelineForm(false);
    } catch (error) {
      console.error('Failed to create tradeline:', error);
    }
  };

  const handleUpdateTradeline = async (tradelineData: any) => {
    if (!editingTradeline) return;
    
    try {
      await updateTradeline(editingTradeline.id, tradelineData);
      setShowTradelineForm(false);
      setEditingTradeline(null);
    } catch (error) {
      console.error('Failed to update tradeline:', error);
    }
  };

  const handleEditTradeline = (tradeline: any) => {
    setEditingTradeline(tradeline);
    setShowTradelineForm(true);
  };

  if (scoresLoading || goalsLoading || tradelinesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Personal Credit Manager</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manually track your credit scores, goals, and tradelines for better financial management
        </p>
      </div>

      <Tabs defaultValue="scores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Personal Credit Scores</span>
            <span className="sm:hidden">Scores</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <Target className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Credit Goals</span>
            <span className="sm:hidden">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="tradelines" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Credit Tradelines</span>
            <span className="sm:hidden">Tradelines</span>
          </TabsTrigger>
        </TabsList>

        {/* Credit Scores Tab */}
        <TabsContent value="scores" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Credit Score Overview</h2>
            
            {/* Credit Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {creditScores.map((score) => (
                <CreditScoreCard
                  key={score.id}
                  creditScore={score}
                  onUpdate={updateCreditScore}
                />
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}</div>
                  <p className="text-xs text-muted-foreground">
                    {averageScore === 0 ? 'Poor' : averageScore >= 750 ? 'Excellent' : averageScore >= 700 ? 'Good' : averageScore >= 650 ? 'Fair' : 'Poor'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
                  <div className="h-4 w-4 text-green-600">$</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{creditUtilization.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Balance: ${totalBalance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
                  <div className="h-4 w-4 text-purple-600">$</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalCreditLimit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Balance: ${totalBalance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Credit Goals Tab */}
        <TabsContent value="goals" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-semibold">Credit Goals</h2>
            <Button onClick={() => setShowGoalForm(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Add Credit Goal</span>
              <span className="sm:hidden">Add Goal</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={goal.goalType === CreditGoalType.CREDIT_SCORE ? "default" : goal.goalType === CreditGoalType.DEBT_PAYOFF ? "destructive" : "secondary"}>
                      {goal.goalType.replace('_', ' ')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCreditGoal(goal.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{goal.goalName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current:</span>
                      <span className="font-medium">{goal.currentValue || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Target:</span>
                      <span className="font-medium">{goal.targetValue}</span>
                    </div>
                    {goal.targetDate && (
                      <div className="flex justify-between text-sm">
                        <span>Target Date:</span>
                        <span className="font-medium">
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {goal.notes && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {goal.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {creditGoals.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No credit goals yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Set financial goals to track your credit improvement progress</p>
              <Button onClick={() => setShowGoalForm(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Credit Tradelines Tab */}
        <TabsContent value="tradelines" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-semibold">Credit Tradelines</h2>
            <Button onClick={() => setShowTradelineForm(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Add Tradeline</span>
              <span className="sm:hidden">Add Account</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tradelines.map((tradeline) => (
              <TradelineCard
                key={tradeline.id}
                tradeline={tradeline}
                onEdit={handleEditTradeline}
                onDelete={deleteTradeline}
              />
            ))}
          </div>

          {tradelines.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tradelines yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Add your credit accounts to track balances and payments</p>
              <Button onClick={() => setShowTradelineForm(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Tradeline
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Goal Form Dialog */}
      {showGoalForm && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-[210]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add Credit Goal</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGoalForm(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <CreditGoalForm
                onSubmit={handleCreateGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tradeline Form Dialog */}
      {showTradelineForm && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-[210]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingTradeline ? 'Edit Tradeline' : 'Add Tradeline'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowTradelineForm(false);
                    setEditingTradeline(null);
                  }}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <TradelineForm
                tradeline={editingTradeline}
                onSubmit={editingTradeline ? handleUpdateTradeline : handleCreateTradeline}
                onCancel={() => {
                  setShowTradelineForm(false);
                  setEditingTradeline(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
