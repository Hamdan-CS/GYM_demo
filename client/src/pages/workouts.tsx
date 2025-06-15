import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card3D } from "@/components/3d-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { Workout } from "@shared/schema";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number;
}

const muscleGroups = [
  { id: "all", name: "All", icon: "fas fa-dumbbell", color: "bg-violet-500" },
  { id: "chest", name: "Chest", icon: "fas fa-heart", color: "bg-red-500" },
  { id: "legs", name: "Legs", icon: "fas fa-running", color: "bg-blue-500" },
  { id: "arms", name: "Arms", icon: "fas fa-muscle", color: "bg-green-500" },
  { id: "back", name: "Back", icon: "fas fa-backward", color: "bg-yellow-500" },
  { id: "shoulders", name: "Shoulders", icon: "fas fa-angle-up", color: "bg-purple-500" },
];

const sampleExercises: Exercise[] = [
  { id: "1", name: "Bench Press", muscleGroup: "chest", sets: 3, reps: 10, weight: 80 },
  { id: "2", name: "Squats", muscleGroup: "legs", sets: 4, reps: 12, weight: 100 },
  { id: "3", name: "Bicep Curls", muscleGroup: "arms", sets: 3, reps: 15, weight: 20 },
  { id: "4", name: "Deadlifts", muscleGroup: "back", sets: 3, reps: 8, weight: 120 },
  { id: "5", name: "Shoulder Press", muscleGroup: "shoulders", sets: 3, reps: 10, weight: 50 },
];

export function WorkoutsPage() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscleGroup: "",
    sets: 3,
    reps: 10,
    weight: 50
  });

  const queryClient = useQueryClient();
  const userId = LocalStorage.getUserId() || 1;

  // Filter exercises based on selected muscle group
  const filteredExercises = exercises.filter(exercise => 
    selectedMuscleGroup === "all" || exercise.muscleGroup === selectedMuscleGroup
  );

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.muscleGroup) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        ...newExercise
      };
      setExercises(prev => [...prev, exercise]);
      setNewExercise({ name: "", muscleGroup: "", sets: 3, reps: 10, weight: 50 });
      setIsAddDialogOpen(false);
    }
  };

  const handleStartWorkout = (exercise: Exercise) => {
    // Create a workout session for this exercise
    const workoutData = {
      userId,
      name: exercise.name,
      type: "strength",
      duration: 30,
      calories: 200,
      progress: 0,
      completed: false
    };
    
    // In a real app, you'd call the API here
    console.log("Starting workout:", workoutData);
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
            <h1 className="text-2xl font-bold">Workouts</h1>
            <p className="text-gray-400">Track your exercises</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl">
                <i className="fas fa-plus mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-gray-600">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Exercise Name</Label>
                  <Input
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Push-ups"
                    className="bg-slate-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Muscle Group</Label>
                  <Select onValueChange={(value) => setNewExercise(prev => ({ ...prev, muscleGroup: value }))}>
                    <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.slice(1).map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Sets</Label>
                    <Input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                      className="bg-slate-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Reps</Label>
                    <Input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, reps: parseInt(e.target.value) }))}
                      className="bg-slate-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Weight (kg)</Label>
                    <Input
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="bg-slate-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddExercise}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-400"
                >
                  Add Exercise
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Muscle Group Filters */}
        <motion.div 
          className="flex gap-3 overflow-x-auto pb-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {muscleGroups.map((group, index) => (
            <motion.button
              key={group.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300",
                selectedMuscleGroup === group.id
                  ? `${group.color} text-white shadow-lg` 
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              )}
              onClick={() => setSelectedMuscleGroup(group.id)}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <i className={group.icon} />
              <span className="font-medium">{group.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Exercise Cards */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card3D 
                  className="cursor-pointer hover:shadow-2xl"
                  onClick={() => handleStartWorkout(exercise)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          muscleGroups.find(g => g.id === exercise.muscleGroup)?.color || "bg-gray-500"
                        )}>
                          <i className={muscleGroups.find(g => g.id === exercise.muscleGroup)?.icon || "fas fa-dumbbell"} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{exercise.name}</h3>
                          <p className="text-sm text-gray-400 capitalize">
                            {exercise.muscleGroup}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-400">Sets</p>
                          <p className="font-semibold text-violet-400">{exercise.sets}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400">Reps</p>
                          <p className="font-semibold text-cyan-400">{exercise.reps}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400">Weight</p>
                          <p className="font-semibold text-green-400">{exercise.weight}kg</p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="ml-4"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-violet-500 to-cyan-400 rounded-lg"
                      >
                        <i className="fas fa-play" />
                      </Button>
                    </motion.div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredExercises.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <i className="fas fa-dumbbell text-4xl text-gray-500 mb-4" />
            <p className="text-gray-400">No exercises found for this muscle group</p>
            <p className="text-gray-500 text-sm mt-2">Add some exercises to get started!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}