import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocalStorage, type OnboardingData } from "./lib/storage";
import { WelcomeScreen } from "./pages/onboarding/welcome";
import { GoalsScreen } from "./pages/onboarding/goals";
import { ProfileScreen } from "./pages/onboarding/profile";
import { Dashboard } from "./pages/dashboard";
import { BottomNavigation } from "./components/bottom-navigation";
import { apiRequest } from "./lib/queryClient";

type OnboardingStep = 'welcome' | 'goals' | 'profile';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedGoal, setSelectedGoal] = useState<OnboardingData['goal']>('lose-weight');
  const [activeNav, setActiveNav] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check onboarding status on mount
    const onboardingComplete = LocalStorage.getOnboardingComplete();
    setIsOnboardingComplete(onboardingComplete);
    setIsLoading(false);
  }, []);

  const handleWelcomeNext = () => {
    setCurrentStep('goals');
  };

  const handleGoalSelection = (goal: OnboardingData['goal']) => {
    setSelectedGoal(goal);
    setCurrentStep('profile');
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Save to local storage
      LocalStorage.setUserData(data);
      LocalStorage.setOnboardingComplete(true);
      
      // Create user profile on backend
      await apiRequest('POST', '/api/profile', {
        userId: 1, // Using static user ID for demo
        ...data,
        onboardingComplete: true
      });
      
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Still mark as complete locally if backend fails
      LocalStorage.setOnboardingComplete(true);
      setIsOnboardingComplete(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(240, 41%, 6%) 0%, hsl(240, 27%, 11%) 100%)' }}>
        <div className="text-center">
          <i className="fas fa-dumbbell text-4xl mb-4 animate-pulse" style={{ color: 'hsl(260, 100%, 70%)' }} />
          <p className="text-gray-300">Loading FitPulse...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, hsl(240, 41%, 6%) 0%, hsl(240, 27%, 11%) 100%)' }}>
          {!isOnboardingComplete ? (
            <div className="onboarding-container">
              {currentStep === 'welcome' && <WelcomeScreen onNext={handleWelcomeNext} />}
              {currentStep === 'goals' && <GoalsScreen onNext={handleGoalSelection} />}
              {currentStep === 'profile' && (
                <ProfileScreen goal={selectedGoal} onComplete={handleOnboardingComplete} />
              )}
            </div>
          ) : (
            <div className="main-app">
              {activeNav === 'home' && <Dashboard />}
              {activeNav === 'workouts' && (
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Workouts</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}
              {activeNav === 'nutrition' && (
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Nutrition</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}
              {activeNav === 'progress' && (
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Progress</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}
              {activeNav === 'profile' && (
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Profile</h2>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )}
              
              <BottomNavigation activeNav={activeNav} onNavChange={setActiveNav} />
            </div>
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
