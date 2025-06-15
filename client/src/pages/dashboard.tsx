import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card3D } from "@/components/3d-card";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/lib/storage";
import { AI_TIPS } from "@/lib/types";
import type { UserProfile, Workout, WeightEntry, NutritionEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function Dashboard() {
  const [currentTip] = useState(() => AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
  const queryClient = useQueryClient();
  const userId = LocalStorage.getUserId() || 1; // Fallback for demo

  // Queries
  const { data: profile } = useQuery<UserProfile>({
    queryKey: [`/api/profile/${userId}`],
  });

  const { data: todaysWorkout } = useQuery<Workout | null>({
    queryKey: [`/api/workouts/${userId}/today`],
  });

  const { data: latestWeight } = useQuery<WeightEntry | null>({
    queryKey: [`/api/weight/${userId}/latest`],
  });

  const { data: todaysNutrition } = useQuery<NutritionEntry | null>({
    queryKey: [`/api/nutrition/${userId}/today`],
  });

  // Mutations
  const startWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!todaysWorkout) {
        return apiRequest('POST', '/api/workouts', {
          userId,
          name: 'Upper Body Strength',
          type: 'strength',
          duration: 45,
          calories: 300,
          progress: 0,
          completed: false
        });
      } else {
        return apiRequest('PATCH', `/api/workouts/${todaysWorkout.id}`, {
          progress: Math.min(todaysWorkout.progress + 10, 100)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${userId}/today`] });
    }
  });

  const updateWeightMutation = useMutation({
    mutationFn: async (weight: number) => {
      return apiRequest('POST', '/api/weight', {
        userId,
        weight
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/weight/${userId}/latest`] });
    }
  });

  const logMealMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/nutrition', {
        userId,
        calories: 350,
        protein: 25,
        carbs: 40,
        fats: 15
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nutrition/${userId}/today`] });
    }
  });

  // Calculate nutrition percentages
  const nutritionStats = todaysNutrition ? {
    carbsPercent: Math.round((todaysNutrition.carbs * 4 / todaysNutrition.calories) * 100),
    proteinPercent: Math.round((todaysNutrition.protein * 4 / todaysNutrition.calories) * 100),
    fatsPercent: Math.round((todaysNutrition.fats * 9 / todaysNutrition.calories) * 100),
    totalCalories: todaysNutrition.calories
  } : { carbsPercent: 0, proteinPercent: 0, fatsPercent: 0, totalCalories: 0 };

  const handleStartWorkout = () => {
    startWorkoutMutation.mutate();
  };

  const handleUpdateWeight = () => {
    const newWeight = prompt("Enter your current weight (kg):");
    if (newWeight && !isNaN(Number(newWeight))) {
      updateWeightMutation.mutate(Number(newWeight));
    }
  };

  const handleLogMeal = () => {
    logMealMutation.mutate();
  };

  return (
    <motion.div 
      className="p-6 pb-24" // Add bottom padding for navigation
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-gray-400">Ready for today's workout?</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <i className="fas fa-user text-lg text-white" />
          </div>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card3D className="bg-gradient-to-br from-violet-500/20 to-violet-500/5" hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-violet-400">7 days</p>
              </div>
              <i className="fas fa-fire text-violet-400 text-xl" />
            </div>
          </Card3D>
          
          <Card3D className="bg-gradient-to-br from-cyan-400/20 to-cyan-400/5" hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Calories</p>
                <p className="text-2xl font-bold text-cyan-400">{nutritionStats.totalCalories}</p>
              </div>
              <i className="fas fa-bolt text-cyan-400 text-xl" />
            </div>
          </Card3D>
        </motion.div>
        
        {/* Today's Summary Cards */}
        <motion.div 
          className="space-y-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          
          {/* Today's Workout Card */}
          <Card3D hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Workout</h3>
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-dumbbell text-violet-400" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">
                  {todaysWorkout?.name || "Upper Body Strength"}
                </span>
                <span className="text-sm bg-violet-500/20 text-violet-400 px-2 py-1 rounded-lg">
                  {todaysWorkout?.duration || 45} min
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${todaysWorkout?.progress || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <Button 
                onClick={handleStartWorkout}
                disabled={startWorkoutMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {startWorkoutMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  todaysWorkout?.progress === 100 ? "Workout Complete!" : "Start Workout"
                )}
              </Button>
            </div>
          </Card3D>
          
          {/* Nutrition Card */}
          <Card3D hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nutrition</h3>
              <div className="w-10 h-10 bg-red-400/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-apple-alt text-red-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <ProgressRing progress={nutritionStats.carbsPercent} color="#FF6B6B">
                  {nutritionStats.carbsPercent}%
                </ProgressRing>
                <p className="text-xs text-gray-400 mt-2">Carbs</p>
              </div>
              <div className="text-center">
                <ProgressRing progress={nutritionStats.proteinPercent} color="#6C63FF">
                  {nutritionStats.proteinPercent}%
                </ProgressRing>
                <p className="text-xs text-gray-400 mt-2">Protein</p>
              </div>
              <div className="text-center">
                <ProgressRing progress={nutritionStats.fatsPercent} color="#4ECDC4">
                  {nutritionStats.fatsPercent}%
                </ProgressRing>
                <p className="text-xs text-gray-400 mt-2">Fats</p>
              </div>
            </div>
            <Button 
              onClick={handleLogMeal}
              disabled={logMealMutation.isPending}
              className="w-full py-3 bg-gradient-to-r from-secondary to-secondary/80 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {logMealMutation.isPending ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Log Meal"
              )}
            </Button>
          </Card3D>
          
          {/* Weight Progress Card */}
          <Card3D hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Weight Progress</h3>
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-accent" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">
                  {latestWeight?.weight || profile?.weight || 70} kg
                </p>
                <p className="text-sm text-gray-400">Current Weight</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-accent">-1.5 kg</p>
                <p className="text-sm text-gray-400">This month</p>
              </div>
            </div>
            <Button 
              onClick={handleUpdateWeight}
              disabled={updateWeightMutation.isPending}
              className="w-full py-3 bg-gradient-to-r from-accent to-accent/80 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {updateWeightMutation.isPending ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Update Weight"
              )}
            </Button>
          </Card3D>
          
          {/* AI Coach Tip */}
          <Card3D 
            className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20" 
            hoverable={false}
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 gradient-text">AI Coach Tip</h4>
                <p className="text-sm text-gray-300 mb-4">
                  {currentTip.message}
                </p>
                <button className="text-primary text-sm font-semibold hover:text-accent transition-colors duration-300">
                  Ask AI Coach <i className="fas fa-arrow-right ml-1" />
                </button>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </div>
    </motion.div>
  );
}
