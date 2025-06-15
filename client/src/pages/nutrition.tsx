import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card3D } from "@/components/3d-card";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { NutritionEntry } from "@shared/schema";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: string;
  time: string;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: string;
}

const commonFoods: FoodItem[] = [
  { id: "1", name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6, category: "protein" },
  { id: "2", name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fats: 1.8, category: "carbs" },
  { id: "3", name: "Avocado (1 medium)", calories: 234, protein: 3, carbs: 12, fats: 21, category: "fats" },
  { id: "4", name: "Greek Yogurt (1 cup)", calories: 130, protein: 23, carbs: 9, fats: 0, category: "protein" },
  { id: "5", name: "Banana (1 medium)", calories: 105, protein: 1, carbs: 27, fats: 0.3, category: "carbs" },
  { id: "6", name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fats: 14, category: "fats" },
  { id: "7", name: "Sweet Potato (1 medium)", calories: 103, protein: 2, carbs: 24, fats: 0.1, category: "carbs" },
  { id: "8", name: "Salmon (100g)", calories: 208, protein: 25, carbs: 0, fats: 12, category: "protein" },
];

export function NutritionPage() {
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [waterIntake, setWaterIntake] = useState(6); // glasses
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [customMeal, setCustomMeal] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const queryClient = useQueryClient();
  const userId = LocalStorage.getUserId() || 1;

  // Queries
  const { data: todaysNutrition } = useQuery<NutritionEntry | null>({
    queryKey: [`/api/nutrition/${userId}/today`],
  });

  // Add nutrition mutation
  const addNutritionMutation = useMutation({
    mutationFn: async (nutrition: { calories: number; protein: number; carbs: number; fats: number }) => {
      return apiRequest('POST', '/api/nutrition', {
        userId,
        ...nutrition
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nutrition/${userId}/today`] });
    }
  });

  // Calculate totals from today's meals
  const totals = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Add API totals if available
  if (todaysNutrition) {
    totals.calories += todaysNutrition.calories;
    totals.protein += todaysNutrition.protein;
    totals.carbs += todaysNutrition.carbs;
    totals.fats += todaysNutrition.fats;
  }

  // Calculate macros percentages
  const macroData = [
    { name: 'Protein', value: totals.protein * 4, color: '#8B5CF6' },
    { name: 'Carbs', value: totals.carbs * 4, color: '#06B6D4' },
    { name: 'Fats', value: totals.fats * 9, color: '#10B981' }
  ];

  const handleAddMeal = (food: FoodItem) => {
    const meal: Meal = {
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      category: food.category,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTodaysMeals(prev => [...prev, meal]);
    setIsAddMealOpen(false);
  };

  const handleAddCustomMeal = () => {
    if (customMeal.name && customMeal.calories > 0) {
      const meal: Meal = {
        id: Date.now().toString(),
        ...customMeal,
        category: "custom",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTodaysMeals(prev => [...prev, meal]);
      setCustomMeal({ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
      setIsAddMealOpen(false);
    }
  };

  const addWaterGlass = () => {
    if (waterIntake < 12) {
      setWaterIntake(prev => prev + 1);
    }
  };

  const removeWaterGlass = () => {
    if (waterIntake > 0) {
      setWaterIntake(prev => prev - 1);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protein': return 'fas fa-drumstick-bite';
      case 'carbs': return 'fas fa-bread-slice';
      case 'fats': return 'fas fa-oil-can';
      default: return 'fas fa-utensils';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'protein': return 'bg-violet-500';
      case 'carbs': return 'bg-cyan-500';
      case 'fats': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      className="p-6 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <h1 className="text-2xl font-bold">Nutrition</h1>
            <p className="text-gray-400">Track your daily intake</p>
          </div>
          
          <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl">
                <i className="fas fa-plus mr-2" />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-gray-600 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Add Meal</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Quick Add Foods */}
                <div>
                  <h3 className="text-white font-medium mb-3">Quick Add</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {commonFoods.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleAddMeal(food)}
                        className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          getCategoryColor(food.category)
                        )}>
                          <i className={cn(getCategoryIcon(food.category), "text-white text-sm")} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{food.name}</p>
                          <p className="text-gray-400 text-xs">{food.calories} cal</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Meal */}
                <div className="border-t border-gray-600 pt-4">
                  <h3 className="text-white font-medium mb-3">Custom Meal</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300">Meal Name</Label>
                      <Input
                        value={customMeal.name}
                        onChange={(e) => setCustomMeal(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Protein Shake"
                        className="bg-slate-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300">Calories</Label>
                        <Input
                          type="number"
                          value={customMeal.calories || ""}
                          onChange={(e) => setCustomMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Protein (g)</Label>
                        <Input
                          type="number"
                          value={customMeal.protein || ""}
                          onChange={(e) => setCustomMeal(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Carbs (g)</Label>
                        <Input
                          type="number"
                          value={customMeal.carbs || ""}
                          onChange={(e) => setCustomMeal(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Fats (g)</Label>
                        <Input
                          type="number"
                          value={customMeal.fats || ""}
                          onChange={(e) => setCustomMeal(prev => ({ ...prev, fats: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleAddCustomMeal}
                      disabled={!customMeal.name || customMeal.calories <= 0}
                      className="w-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    >
                      Add Custom Meal
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Daily Summary */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card3D hoverable={false}>
            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2">Today's Calories</h3>
              <div className="text-3xl font-bold text-violet-400">{totals.calories}</div>
              <p className="text-sm text-gray-400">of 2000 goal</p>
            </div>
            
            {totals.calories > 0 ? (
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${Math.round(value)} cal`, 
                        name
                      ]}
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-utensils text-4xl text-gray-500 mb-4" />
                  <p className="text-gray-400">No meals logged yet</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Protein</p>
                <p className="font-semibold text-violet-400">{totals.protein}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Carbs</p>
                <p className="font-semibold text-cyan-400">{totals.carbs}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fats</p>
                <p className="font-semibold text-green-400">{totals.fats}g</p>
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Water Intake */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card3D hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Water Intake</h3>
                <p className="text-sm text-gray-400">{waterIntake} of 8 glasses</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={removeWaterGlass}
                  className="border-gray-600 text-gray-400 hover:bg-slate-700"
                >
                  <i className="fas fa-minus" />
                </Button>
                <Button 
                  size="sm"
                  onClick={addWaterGlass}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <i className="fas fa-plus" />
                </Button>
              </div>
            </div>
            
            <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((waterIntake / 8) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between mt-3">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    i < waterIntake ? "bg-cyan-500 text-white" : "bg-slate-700 text-gray-500"
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <i className="fas fa-tint text-xs" />
                </motion.div>
              ))}
            </div>
          </Card3D>
        </motion.div>

        {/* Today's Meals */}
        <motion.div 
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-semibold text-white">Today's Meals</h3>
          
          <AnimatePresence>
            {todaysMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card3D className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        getCategoryColor(meal.category)
                      )}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <i className={cn(getCategoryIcon(meal.category), "text-white")} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{meal.name}</h4>
                        <span className="text-xs text-gray-400">{meal.time}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        <span>{meal.calories} cal</span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fats}g</span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {todaysMeals.length === 0 && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <i className="fas fa-utensils text-4xl text-gray-500 mb-4" />
              <p className="text-gray-400">No meals logged today</p>
              <p className="text-gray-500 text-sm mt-2">Add your first meal to start tracking!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}