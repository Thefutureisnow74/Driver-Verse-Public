"use client";

import { useState, useEffect } from "react";
import { CreditBureau, CreditGoalType, TradelineType, TradelineStatus } from "@/generated/prisma";

export interface CreditScore {
  id: string;
  bureau: CreditBureau;
  scoreType: string;
  score: number | null;
  minRange: number;
  maxRange: number;
  lastUpdated: string | null;
  isTracked: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreditGoal {
  id: string;
  goalType: CreditGoalType;
  goalName: string;
  currentValue: number | null;
  targetValue: number;
  targetDate: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTradeline {
  id: string;
  accountName: string;
  accountType: TradelineType;
  creditorName: string;
  status: TradelineStatus;
  creditLimit: number | null;
  currentBalance: number;
  minimumPayment: number | null;
  interestRate: number | null;
  openedDate: string | null;
  closedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useCreditScores() {
  const [creditScores, setCreditScores] = useState<CreditScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditScores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credit/scores");
      if (!response.ok) throw new Error("Failed to fetch credit scores");
      const data = await response.json();
      setCreditScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCreditScore = async (scoreData: Partial<CreditScore>) => {
    try {
      const response = await fetch("/api/credit/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) throw new Error("Failed to update credit score");
      
      const updatedScore = await response.json();
      setCreditScores(prev => 
        prev.map(score => 
          score.bureau === updatedScore.bureau ? updatedScore : score
        )
      );
      
      return updatedScore;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update credit score");
      throw err;
    }
  };

  useEffect(() => {
    fetchCreditScores();
  }, []);

  return {
    creditScores,
    isLoading,
    error,
    updateCreditScore,
    refreshCreditScores: fetchCreditScores,
  };
}

export function useCreditGoals() {
  const [creditGoals, setCreditGoals] = useState<CreditGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditGoals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credit/goals");
      if (!response.ok) throw new Error("Failed to fetch credit goals");
      const data = await response.json();
      setCreditGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createCreditGoal = async (goalData: Omit<CreditGoal, "id" | "isCompleted" | "completedAt" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/credit/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) throw new Error("Failed to create credit goal");
      
      const newGoal = await response.json();
      setCreditGoals(prev => [newGoal, ...prev]);
      
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create credit goal");
      throw err;
    }
  };

  const deleteCreditGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/credit/goals/${goalId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete credit goal");
      
      setCreditGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete credit goal");
      throw err;
    }
  };

  useEffect(() => {
    fetchCreditGoals();
  }, []);

  return {
    creditGoals,
    isLoading,
    error,
    createCreditGoal,
    deleteCreditGoal,
    refreshCreditGoals: fetchCreditGoals,
  };
}

export function useCreditTradelines() {
  const [tradelines, setTradelines] = useState<CreditTradeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradelines = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credit/tradelines");
      if (!response.ok) throw new Error("Failed to fetch credit tradelines");
      const data = await response.json();
      setTradelines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createTradeline = async (tradelineData: Omit<CreditTradeline, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/credit/tradelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradelineData),
      });

      if (!response.ok) throw new Error("Failed to create credit tradeline");
      
      const newTradeline = await response.json();
      setTradelines(prev => [newTradeline, ...prev]);
      
      return newTradeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create credit tradeline");
      throw err;
    }
  };

  const updateTradeline = async (tradelineId: string, tradelineData: Partial<CreditTradeline>) => {
    try {
      const response = await fetch(`/api/credit/tradelines/${tradelineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradelineData),
      });

      if (!response.ok) throw new Error("Failed to update credit tradeline");
      
      const updatedTradeline = await response.json();
      setTradelines(prev => 
        prev.map(tradeline => 
          tradeline.id === tradelineId ? updatedTradeline : tradeline
        )
      );
      
      return updatedTradeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update credit tradeline");
      throw err;
    }
  };

  const deleteTradeline = async (tradelineId: string) => {
    try {
      const response = await fetch(`/api/credit/tradelines/${tradelineId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete credit tradeline");
      
      setTradelines(prev => prev.filter(tradeline => tradeline.id !== tradelineId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete credit tradeline");
      throw err;
    }
  };

  useEffect(() => {
    fetchTradelines();
  }, []);

  return {
    tradelines,
    isLoading,
    error,
    createTradeline,
    updateTradeline,
    deleteTradeline,
    refreshTradelines: fetchTradelines,
  };
}
