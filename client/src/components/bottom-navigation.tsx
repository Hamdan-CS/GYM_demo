import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface BottomNavigationProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const navItems: NavItem[] = [
  { id: 'home', icon: 'fas fa-home', label: 'Home' },
  { id: 'workouts', icon: 'fas fa-dumbbell', label: 'Workouts' },
  { id: 'nutrition', icon: 'fas fa-apple-alt', label: 'Nutrition' },
  { id: 'progress', icon: 'fas fa-chart-line', label: 'Progress' },
  { id: 'profile', icon: 'fas fa-robot', label: 'AI Coach' }
];

export function BottomNavigation({ activeNav, onNavChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-morphism backdrop-blur-lg border-t border-white/10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300",
                  activeNav === item.id ? "bg-violet-500/20" : ""
                )}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavChange(item.id)}
              >
                <i className={cn(
                  `${item.icon} text-xl transition-colors duration-300`,
                  activeNav === item.id ? "text-violet-400" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  activeNav === item.id ? "text-violet-400" : "text-gray-400"
                )}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
