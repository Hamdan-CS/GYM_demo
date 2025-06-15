import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FITNESS_LEVELS } from "@/lib/types";
import type { OnboardingData } from "@/lib/storage";

const profileSchema = z.object({
  age: z.number().min(13).max(120),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'])
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileScreenProps {
  goal: OnboardingData['goal'];
  onComplete: (data: OnboardingData) => void;
}

export function ProfileScreen({ goal, onComplete }: ProfileScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 25,
      height: 175,
      weight: 70,
      fitnessLevel: 'beginner'
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const completeData: OnboardingData = {
      goal,
      ...data
    };
    
    onComplete(completeData);
    setIsSubmitting(false);
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
          <h2 className="text-3xl font-bold mb-2">Tell Us About You</h2>
          <p className="text-gray-300">Help us personalize your experience</p>
        </motion.div>
        
        <motion.form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-300">Age</Label>
              <Input
                type="number"
                placeholder="25"
                className="w-full p-4 bg-dark-surface rounded-xl border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                {...form.register('age', { valueAsNumber: true })}
              />
              {form.formState.errors.age && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.age.message}</p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-300">Height (cm)</Label>
              <Input
                type="number"
                placeholder="175"
                className="w-full p-4 bg-dark-surface rounded-xl border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                {...form.register('height', { valueAsNumber: true })}
              />
              {form.formState.errors.height && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.height.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-300">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="70"
              className="w-full p-4 bg-dark-surface rounded-xl border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              {...form.register('weight', { valueAsNumber: true })}
            />
            {form.formState.errors.weight && (
              <p className="text-red-400 text-sm mt-1">{form.formState.errors.weight.message}</p>
            )}
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-300">Fitness Level</Label>
            <Select onValueChange={(value) => form.setValue('fitnessLevel', value as any)}>
              <SelectTrigger className="w-full p-4 bg-dark-surface rounded-xl border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_LEVELS.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    <div>
                      <div className="font-medium">{level.title}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.fitnessLevel && (
              <p className="text-red-400 text-sm mt-1">{form.formState.errors.fitnessLevel.message}</p>
            )}
          </div>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup <i className="fas fa-check ml-2" />
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </motion.div>
  );
}
