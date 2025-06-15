import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-primary rounded-full"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-16 w-12 h-12 bg-secondary rounded-full"
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-16 h-16 bg-accent rounded-full"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>
      
      <div className="text-center z-10 max-w-md mx-auto">
        {/* App Logo */}
        <motion.div 
          className="mb-8 w-32 h-32 mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-[20px_20px_60px_#0d0d1a,-20px_-20px_60px_#232342]"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <i className="fas fa-dumbbell text-4xl text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          FitPulse
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Your AI-Powered Fitness Companion for a Healthier Tomorrow
        </motion.p>
        
        {/* Animation placeholder */}
        <motion.div 
          className="w-64 h-48 mx-auto mb-8 bg-dark-surface rounded-2xl flex items-center justify-center shadow-[20px_20px_60px_#0d0d1a,-20px_-20px_60px_#232342]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.i 
            className="fas fa-heart-pulse text-6xl text-primary"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button 
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl"
            size="lg"
          >
            Get Started <i className="fas fa-arrow-right ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
