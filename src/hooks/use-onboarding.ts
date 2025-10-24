import { useState, useEffect, useCallback } from 'react';
import { OnboardingStep, OnboardingSubStep } from '@/data/onboarding-steps';

interface OnboardingData {
  steps: OnboardingStep[];
  overallProgress: number;
  totalSteps: number;
  completedSteps: number;
}

interface UseOnboardingReturn {
  data: OnboardingData | null;
  isLoading: boolean;
  error: string | null;
  toggleStepCompletion: (stepId: string) => Promise<void>;
  updateStepProgress: (stepId: string, isCompleted: boolean, subStepsProgress?: OnboardingSubStep[]) => Promise<void>;
  toggleSubStepCompletion: (stepId: string, subStepId: string) => Promise<void>;
  getSubSteps: (stepId: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnboardingData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/onboarding');
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStepCompletion = useCallback(async (stepId: string) => {
    try {
      const response = await fetch(`/api/onboarding/${stepId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle step completion');
      }

      // Refresh data after successful toggle
      await fetchOnboardingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle step');
      throw err;
    }
  }, [fetchOnboardingData]);

  const updateStepProgress = useCallback(async (
    stepId: string, 
    isCompleted: boolean, 
    subStepsProgress?: OnboardingSubStep[]
  ) => {
    try {
      const response = await fetch(`/api/onboarding/${stepId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted,
          subStepsProgress
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update step progress');
      }

      // Refresh data after successful update
      await fetchOnboardingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update step');
      throw err;
    }
  }, [fetchOnboardingData]);

  const toggleSubStepCompletion = useCallback(async (stepId: string, subStepId: string) => {
    try {
      const response = await fetch(`/api/onboarding/${stepId}/substeps/${subStepId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle sub-step completion');
      }

      // Refresh data after successful toggle
      await fetchOnboardingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle sub-step');
      throw err;
    }
  }, [fetchOnboardingData]);

  const getSubSteps = useCallback(async (stepId: string) => {
    try {
      const response = await fetch(`/api/onboarding/${stepId}/substeps`);
      if (!response.ok) {
        throw new Error('Failed to fetch sub-steps');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sub-steps');
      throw err;
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchOnboardingData();
  }, [fetchOnboardingData]);

  // Initialize onboarding progress on first load
  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        // Initialize progress
        await fetch('/api/onboarding', { method: 'POST' });
        // Then fetch current state
        await fetchOnboardingData();
      } catch (err) {
        console.error('Failed to initialize onboarding:', err);
        await fetchOnboardingData(); // Try to fetch anyway
      }
    };

    initializeOnboarding();
  }, [fetchOnboardingData]);

  return {
    data,
    isLoading,
    error,
    toggleStepCompletion,
    updateStepProgress,
    toggleSubStepCompletion,
    getSubSteps,
    refreshData
  };
}

// Hook for individual step management
export function useOnboardingStep(stepId: string) {
  const [step, setStep] = useState<OnboardingStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStep = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/onboarding/${stepId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch step data');
      }

      const result = await response.json();
      setStep(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [stepId]);

  const toggleCompletion = useCallback(async () => {
    try {
      const response = await fetch(`/api/onboarding/${stepId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle step completion');
      }

      // Refresh step data
      await fetchStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle step');
      throw err;
    }
  }, [stepId, fetchStep]);

  useEffect(() => {
    fetchStep();
  }, [fetchStep]);

  return {
    step,
    isLoading,
    error,
    toggleCompletion,
    refreshStep: fetchStep
  };
}
