"use client";

import { useState } from "react";
import { CheckCircle, Circle, Clock, ExternalLink, ChevronRight, User, Target, ArrowLeft, Square, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingStep, OnboardingSubStep } from "@/data/onboarding-steps";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: OnboardingStep;
  onToggle: (stepId: string) => Promise<void>;
  isLoading?: boolean;
}

function StepCard({ step, onToggle, isLoading }: StepCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(step.id);
    } catch (error) {
      console.error('Failed to toggle step:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusIcon = () => {
    if (step.isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />;
    }
    if (step.completionPercentage > 0) {
      return <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
    }
    return <Circle className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />;
  };

  const getStatusBadge = () => {
    if (step.isCompleted) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Complete</Badge>;
    }
    if (step.completionPercentage > 0) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">In Progress</Badge>;
    }
    return <Badge variant="outline">Not Started</Badge>;
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md cursor-pointer",
      step.isCompleted && "ring-1 ring-green-200 dark:ring-green-800 bg-green-50/30 dark:bg-green-900/10"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getStatusIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Step {step.order}
                </span>
                {getStatusBadge()}
              </div>
              <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                {step.title}
              </CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {step.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              disabled={isToggling || isLoading}
              className="text-xs"
            >
              {isToggling ? "..." : step.isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </Button>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
        </div>
      </CardHeader>

      {step.completionPercentage > 0 && step.completionPercentage < 100 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {step.completionPercentage}%
              </span>
            </div>
            <Progress value={step.completionPercentage} className="h-2" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function OverallProgressCard({ 
  overallProgress, 
  completedSteps, 
  totalSteps 
}: { 
  overallProgress: number; 
  completedSteps: number; 
  totalSteps: number; 
}) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Overall Progress
            </CardTitle>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your onboarding journey
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Progress
            </span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {completedSteps}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalSteps - completedSteps}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Remaining
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SubStepCardProps {
  subStep: OnboardingSubStep;
  stepId: string;
  onToggle: (stepId: string, subStepId: string) => Promise<void>;
  isLoading?: boolean;
}

function SubStepCard({ subStep, stepId, onToggle, isLoading }: SubStepCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(stepId, subStep.id);
    } catch (error) {
      console.error('Failed to toggle sub-step:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAction = () => {
    if (subStep.actionUrl) {
      window.location.href = subStep.actionUrl;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      subStep.isCompleted && "ring-1 ring-green-200 dark:ring-green-800 bg-green-50/30 dark:bg-green-900/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggle}
            disabled={isToggling || isLoading}
            className="mt-1 transition-colors hover:scale-110"
          >
            {subStep.isCompleted ? (
              <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Square className="h-5 w-5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                "font-medium text-sm",
                subStep.isCompleted 
                  ? "text-green-900 dark:text-green-100 line-through" 
                  : "text-neutral-900 dark:text-white"
              )}>
                {subStep.title}
              </h4>
              {subStep.isOptional && (
                <Badge variant="outline" className="text-xs">Optional</Badge>
              )}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
              {subStep.description}
            </p>
            
            {subStep.actionUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAction}
                className="text-xs h-7"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                {subStep.actionLabel || "Open"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OnboardingPage() {
  const { data, isLoading, error, toggleStepCompletion, toggleSubStepCompletion } = useOnboarding();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading your onboarding progress...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Error Loading Onboarding
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {error}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const steps = data?.steps || [];
  const overallProgress = data?.overallProgress || 0;
  const completedSteps = data?.completedSteps || 0;
  const totalSteps = data?.totalSteps || 0;

  const selectedStep = selectedStepId ? steps.find(step => step.id === selectedStepId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Driver Onboarding
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete your setup to start your driving journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress Overview */}
              <OverallProgressCard
                overallProgress={overallProgress}
                completedSteps={completedSteps}
                totalSteps={totalSteps}
              />
              
              {/* Primary Steps List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Steps</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => setSelectedStepId(step.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800",
                          selectedStepId === step.id && "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                        )}
                      >
                        <div className="flex-shrink-0">
                          {step.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : step.completionPercentage > 0 ? (
                            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                            {step.title}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Step {step.order} • {step.completionPercentage}%
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sub-steps Content */}
          <div className="lg:col-span-3">
            {!selectedStep ? (
              /* Welcome/Overview */
              <Card className="h-full">
                <CardContent className="p-12 text-center">
                  <div className="text-neutral-400 dark:text-neutral-500 mb-6">
                    <Target className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    Welcome to Driver Onboarding
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
                    Select a step from the sidebar to view and complete the sub-tasks. Each step contains specific actions to help you get started.
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalSteps}
                      </div>
                      <div className="text-xs text-neutral-500">Total Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {completedSteps}
                      </div>
                      <div className="text-xs text-neutral-500">Completed</div>
                    </div>
                    <div className="text-2xl font-bold text-neutral-400">•</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {totalSteps - completedSteps}
                      </div>
                      <div className="text-xs text-neutral-500">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Selected Step Sub-tasks */
              <div className="space-y-6">
                {/* Step Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {selectedStep.isCompleted ? (
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        ) : selectedStep.completionPercentage > 0 ? (
                          <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                          <Circle className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                        )}
                        <div>
                          <CardTitle className="text-xl">
                            Step {selectedStep.order}: {selectedStep.title}
                          </CardTitle>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {selectedStep.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Badge variant={selectedStep.isCompleted ? "default" : "secondary"}>
                          {selectedStep.completionPercentage}% Complete
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedStep.completionPercentage > 0 && selectedStep.completionPercentage < 100 && (
                      <div className="mt-4">
                        <Progress value={selectedStep.completionPercentage} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                </Card>

                {/* Sub-steps */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Tasks to Complete
                  </h3>
                  
                  {selectedStep.subSteps.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStep.subSteps.map((subStep) => (
                        <SubStepCard
                          key={subStep.id}
                          subStep={subStep}
                          stepId={selectedStep.id}
                          onToggle={toggleSubStepCompletion}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <div className="text-neutral-400 dark:text-neutral-500 mb-4">
                          <Circle className="h-12 w-12 mx-auto" />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                          No Sub-tasks Yet
                        </h4>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          This step doesn't have detailed sub-tasks yet. Check back later for updates!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
