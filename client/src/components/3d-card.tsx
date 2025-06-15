import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card3D({ children, className, hoverable = true, onClick }: Card3DProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl p-6",
        "bg-gradient-to-br from-slate-800 to-slate-800/80",
        "shadow-[20px_20px_60px_#0d0d1a,-20px_-20px_60px_#232342]",
        "border border-white/5",
        hoverable && "cursor-pointer",
        className
      )}
      whileHover={hoverable ? {
        y: -5,
        scale: 1.02,
        boxShadow: "25px 25px 80px #0d0d1a, -25px -25px 80px #232342"
      } : undefined}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
