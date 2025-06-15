import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card3D } from "@/components/3d-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const aiResponses = [
  "Great question! For building muscle, focus on compound exercises like squats, deadlifts, and bench press. Aim for 3-4 sets of 6-8 reps with progressive overload.",
  "Remember to stay hydrated! Aim for at least 8 glasses of water daily, especially after workouts. Your body needs proper hydration for optimal performance.",
  "Protein is crucial for muscle recovery. Try to consume 1.6-2.2g per kg of body weight daily. Good sources include chicken, fish, eggs, and legumes.",
  "Rest is just as important as training! Make sure you're getting 7-9 hours of quality sleep each night for optimal muscle recovery and growth.",
  "Consistency beats perfection! It's better to work out 3 times a week consistently than to go all-out once and then skip the next week.",
  "Don't forget about your form! Quality over quantity - it's better to do fewer reps with perfect form than many reps with poor technique.",
  "Nutrition timing matters! Try to eat a balanced meal with protein and carbs within 2 hours after your workout for optimal recovery.",
  "Listen to your body! If you're feeling overly fatigued or sore, it might be time for a rest day or some light active recovery.",
  "Progressive overload is key! Gradually increase weight, reps, or sets over time to continue challenging your muscles and seeing progress.",
  "Variety keeps things interesting! Mix up your workouts every 4-6 weeks to prevent plateaus and maintain motivation."
];

const quickPrompts = [
  "How do I build muscle?",
  "Best exercises for beginners?",
  "What should I eat post-workout?",
  "How much rest do I need?",
  "Tips for staying motivated?",
  "How to improve form?"
];

export function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your AI fitness coach. I'm here to help you with workout advice, nutrition tips, and motivation. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const getRandomResponse = () => {
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  };

  const simulateTyping = (response: string, messageId: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const newMessage: Message = {
        id: messageId,
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Generate AI response
    const response = getRandomResponse();
    const aiMessageId = (Date.now() + 1).toString();
    
    simulateTyping(response, aiMessageId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <motion.div 
      className="p-6 pb-24 h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto flex flex-col h-full">
        
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg"
            animate={{ 
              boxShadow: [
                "0 4px 20px rgba(139, 92, 246, 0.3)",
                "0 4px 30px rgba(6, 182, 212, 0.4)",
                "0 4px 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <i className="fas fa-robot text-white text-xl" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">AI Fitness Coach</h1>
            <p className="text-sm text-gray-400">Your personal trainer & nutritionist</p>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <motion.div 
          className="flex-1 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card3D className="h-full" hoverable={false}>
            <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "flex gap-3",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <i className="fas fa-robot text-white text-sm" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                        message.isUser 
                          ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
                          : "bg-slate-700 text-gray-100"
                      )}>
                        <p className="leading-relaxed">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-2 opacity-70",
                          message.isUser ? "text-gray-200" : "text-gray-400"
                        )}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      {message.isUser && (
                        <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <i className="fas fa-user text-gray-300 text-sm" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-robot text-white text-sm" />
                      </div>
                      <div className="bg-slate-700 rounded-2xl px-4 py-3 flex items-center gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Card3D>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div 
          className="mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="whitespace-nowrap px-3 py-2 bg-slate-700 rounded-lg text-xs text-gray-300 hover:bg-slate-600 transition-colors"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card3D hoverable={false} className="bg-slate-800/50 backdrop-blur-md border-slate-600">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fitness..."
                  className="bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl w-12 h-12 p-0"
              >
                {isTyping ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  <i className="fas fa-paper-plane" />
                )}
              </Button>
            </div>
          </Card3D>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>AI Coach is online and ready to help</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}