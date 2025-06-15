export interface Goal {
  id: 'lose-weight' | 'gain-muscle' | 'stay-fit';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface FitnessLevel {
  id: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
}

export interface DashboardStats {
  streak: number;
  calories: number;
  currentWeight: number;
  weightChange: number;
}

export interface WorkoutProgress {
  name: string;
  type: string;
  duration: number;
  progress: number;
  calories: number;
}

export interface NutritionStats {
  carbsPercent: number;
  proteinPercent: number;
  fatsPercent: number;
  totalCalories: number;
}

export interface AITip {
  message: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'motivation';
}

export const GOALS: Goal[] = [
  {
    id: 'lose-weight',
    title: 'Lose Weight',
    description: 'Burn calories and shed pounds',
    icon: 'fas fa-weight-scale',
    color: 'bg-red-500/20 text-red-400'
  },
  {
    id: 'gain-muscle',
    title: 'Gain Muscle',
    description: 'Build strength and mass',
    icon: 'fas fa-dumbbell',
    color: 'bg-primary/20 text-primary'
  },
  {
    id: 'stay-fit',
    title: 'Stay Fit',
    description: 'Maintain healthy lifestyle',
    icon: 'fas fa-heart',
    color: 'bg-accent/20 text-accent'
  }
];

export const FITNESS_LEVELS: FitnessLevel[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Just starting your fitness journey'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Some experience with regular exercise'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced with consistent training'
  }
];

export const AI_TIPS: AITip[] = [
  {
    message: "Great job on yesterday's workout! Today focus on proper form rather than speed. Remember to stay hydrated and get adequate rest.",
    category: 'workout'
  },
  {
    message: "Try adding more protein to your meals. Aim for 1.6-2.2g per kg of body weight to support muscle recovery and growth.",
    category: 'nutrition'
  },
  {
    message: "Don't forget to stretch after your workout. 10-15 minutes of stretching can significantly improve your flexibility and reduce injury risk.",
    category: 'recovery'
  },
  {
    message: "Consistency beats perfection! Even a 20-minute workout is better than no workout. Keep showing up for yourself.",
    category: 'motivation'
  }
];
