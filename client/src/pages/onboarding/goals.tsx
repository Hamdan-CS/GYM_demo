import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/3d-card";
import { GOALS, type Goal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GoalsScreenProps {
  onNext: (goal: Goal['id']) => void;
}

export function GoalsScreen({ onNext }: GoalsScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal['id'] | null>(null);

  const handleGoalSelect = (goalId: Goal['id']) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      onNext(selectedGoal);
    }
  };

  return (
    <motion.div 
      className="min-h-screen p-6 flex flex-col"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto w-full">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-2">What's Your Goal?</h2>
          <p className="text-gray-300">Choose your primary fitness objective</p>
        </motion.div>
        
        <motion.div 
          className="space-y-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {GOALS.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card3D
                className={cn(
                  "transition-all duration-300 cursor-pointer",
                  selectedGoal === goal.id 
                    ? "ring-2 ring-primary bg-primary/20 border-primary/30" 
                    : "hover:bg-primary/10"
                )}
                onClick={() => handleGoalSelect(goal.id)}
                hoverable={true}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center",
                    goal.color
                  )}>
                    <i className={`${goal.icon} text-2xl`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                    <p className="text-gray-400">{goal.description}</p>
                  </div>
                  {selectedGoal === goal.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <i className="fas fa-check text-primary text-xl" />
                    </motion.div>
                  )}
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button 
            onClick={handleContinue}
            disabled={!selectedGoal}
            className={cn(
              "w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-semibold transition-all duration-300",
              selectedGoal 
                ? "opacity-100 hover:shadow-lg transform hover:scale-105" 
                : "opacity-50 cursor-not-allowed"
            )}
            size="lg"
          >
            Continue <i className="fas fa-arrow-right ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
