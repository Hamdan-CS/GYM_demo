import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card3D } from "@/components/3d-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { WeightEntry, UserProfile } from "@shared/schema";

interface WeightData {
  date: string;
  weight: number;
  day: string;
}

export function WeightProgressPage() {
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const queryClient = useQueryClient();
  const userId = LocalStorage.getUserId() || 1;

  // Queries
  const { data: profile } = useQuery<UserProfile>({
    queryKey: [`/api/profile/${userId}`],
  });

  const { data: weightEntries = [] } = useQuery<WeightEntry[]>({
    queryKey: [`/api/weight/${userId}`],
  });

  const { data: latestWeight } = useQuery<WeightEntry | null>({
    queryKey: [`/api/weight/${userId}/latest`],
  });

  // Add weight mutation
  const addWeightMutation = useMutation({
    mutationFn: async (weight: number) => {
      return apiRequest('POST', '/api/weight', {
        userId,
        weight
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/weight/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/weight/${userId}/latest`] });
      setIsAddWeightOpen(false);
      setNewWeight("");
    }
  });

  // Prepare chart data
  const chartData: WeightData[] = weightEntries
    .slice(-30) // Last 30 entries
    .map((entry, index) => ({
      date: entry.createdAt.toISOString().split('T')[0],
      weight: entry.weight,
      day: `Day ${index + 1}`
    }));

  // Calculate BMI and stats
  const currentWeight = latestWeight?.weight || profile?.weight || 70;
  const height = profile?.height || 175;
  const bmi = currentWeight / Math.pow(height / 100, 2);
  const goalWeight = profile?.goal === 'lose-weight' ? currentWeight - 10 : 
                   profile?.goal === 'gain-muscle' ? currentWeight + 5 : currentWeight;
  
  const weightChange = weightEntries.length > 1 
    ? currentWeight - (weightEntries[weightEntries.length - 2]?.weight || currentWeight)
    : 0;

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (weight && weight > 0 && weight < 500) {
      addWeightMutation.mutate(weight);
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { text: "Normal", color: "text-green-400" };
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-400" };
    return { text: "Obese", color: "text-red-400" };
  };

  const bmiStatus = getBMIStatus(bmi);

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
            <h1 className="text-2xl font-bold">Weight Progress</h1>
            <p className="text-gray-400">Track your weight journey</p>
          </div>
          
          <Dialog open={isAddWeightOpen} onOpenChange={setIsAddWeightOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl">
                <i className="fas fa-plus mr-2" />
                Add Weight
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-gray-600">
              <DialogHeader>
                <DialogTitle className="text-white">Record Your Weight</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Current Weight (kg)</Label>
                  <Input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter your weight"
                    className="bg-slate-700 border-gray-600 text-white"
                    step="0.1"
                    min="1"
                    max="500"
                  />
                </div>
                <Button 
                  onClick={handleAddWeight}
                  disabled={addWeightMutation.isPending || !newWeight}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400"
                >
                  {addWeightMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    "Record Weight"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Current Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card3D className="text-center" hoverable={false}>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Current Weight</p>
              <p className="text-2xl font-bold text-violet-400">{currentWeight.toFixed(1)}kg</p>
              <div className="flex items-center justify-center gap-1">
                <i className={cn(
                  "fas text-xs",
                  weightChange >= 0 ? "fa-arrow-up text-green-400" : "fa-arrow-down text-red-400"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  weightChange >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {Math.abs(weightChange).toFixed(1)}kg
                </span>
              </div>
            </div>
          </Card3D>
          
          <Card3D className="text-center" hoverable={false}>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Goal Weight</p>
              <p className="text-2xl font-bold text-cyan-400">{goalWeight.toFixed(1)}kg</p>
              <p className="text-xs text-gray-500">
                {Math.abs(currentWeight - goalWeight).toFixed(1)}kg to goal
              </p>
            </div>
          </Card3D>
        </motion.div>

        {/* BMI Card */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card3D 
            className="bg-gradient-to-br from-violet-500/10 to-cyan-400/10 border border-violet-500/20"
            hoverable={false}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Body Mass Index</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{bmi.toFixed(1)}</span>
                  <div>
                    <p className={cn("text-sm font-medium", bmiStatus.color)}>
                      {bmiStatus.text}
                    </p>
                    <p className="text-xs text-gray-400">Normal: 18.5-24.9</p>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <i className="fas fa-weight text-2xl text-white" />
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Weight Chart */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card3D hoverable={false}>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Weight Trend</h3>
              <p className="text-sm text-gray-400">Last 30 days</p>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}kg`, 'Weight']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="url(#weightGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#06B6D4' }}
                    />
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-chart-line text-4xl text-gray-500 mb-4" />
                  <p className="text-gray-400">No weight data yet</p>
                  <p className="text-gray-500 text-sm mt-2">Add your first weight entry!</p>
                </div>
              </div>
            )}
          </Card3D>
        </motion.div>

        {/* Progress Summary */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card3D className="text-center" hoverable={false}>
            <div className="space-y-1">
              <i className="fas fa-calendar text-violet-400 text-lg" />
              <p className="text-xs text-gray-400">Entries</p>
              <p className="font-semibold">{weightEntries.length}</p>
            </div>
          </Card3D>
          
          <Card3D className="text-center" hoverable={false}>
            <div className="space-y-1">
              <i className="fas fa-target text-cyan-400 text-lg" />
              <p className="text-xs text-gray-400">To Goal</p>
              <p className="font-semibold">{Math.abs(currentWeight - goalWeight).toFixed(1)}kg</p>
            </div>
          </Card3D>
          
          <Card3D className="text-center" hoverable={false}>
            <div className="space-y-1">
              <i className="fas fa-trophy text-yellow-400 text-lg" />
              <p className="text-xs text-gray-400">Progress</p>
              <p className="font-semibold">
                {profile?.goal === 'lose-weight' && weightChange < 0 ? 'Good' :
                 profile?.goal === 'gain-muscle' && weightChange > 0 ? 'Good' :
                 'Stable'}
              </p>
            </div>
          </Card3D>
        </motion.div>
      </div>
    </motion.div>
  );
}