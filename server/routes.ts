import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema, insertWorkoutSchema, insertWeightEntrySchema, insertNutritionEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Create user profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validation = insertUserProfileSchema.extend({ userId: z.number() }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid profile data", errors: validation.error.errors });
      }
      
      const profile = await storage.createUserProfile(validation.data);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update user profile
  app.patch("/api/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const validation = insertUserProfileSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid profile data", errors: validation.error.errors });
      }
      
      const profile = await storage.updateUserProfile(userId, validation.data);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get user workouts
  app.get("/api/workouts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workouts = await storage.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get workouts" });
    }
  });

  // Get today's workout
  app.get("/api/workouts/:userId/today", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workout = await storage.getTodaysWorkout(userId);
      res.json(workout || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get today's workout" });
    }
  });

  // Create workout
  app.post("/api/workouts", async (req, res) => {
    try {
      const validation = insertWorkoutSchema.extend({ userId: z.number() }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid workout data", errors: validation.error.errors });
      }
      
      const workout = await storage.createWorkout(validation.data);
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  // Update workout
  app.patch("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertWorkoutSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid workout data", errors: validation.error.errors });
      }
      
      const workout = await storage.updateWorkout(id, validation.data);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to update workout" });
    }
  });

  // Get user weight entries
  app.get("/api/weight/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const entries = await storage.getUserWeightEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weight entries" });
    }
  });

  // Get latest weight
  app.get("/api/weight/:userId/latest", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const entry = await storage.getLatestWeight(userId);
      res.json(entry || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get latest weight" });
    }
  });

  // Create weight entry
  app.post("/api/weight", async (req, res) => {
    try {
      const validation = insertWeightEntrySchema.extend({ userId: z.number() }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid weight data", errors: validation.error.errors });
      }
      
      const entry = await storage.createWeightEntry(validation.data);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to create weight entry" });
    }
  });

  // Get today's nutrition
  app.get("/api/nutrition/:userId/today", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const nutrition = await storage.getTodaysNutrition(userId);
      res.json(nutrition || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get today's nutrition" });
    }
  });

  // Create nutrition entry
  app.post("/api/nutrition", async (req, res) => {
    try {
      const validation = insertNutritionEntrySchema.extend({ userId: z.number() }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid nutrition data", errors: validation.error.errors });
      }
      
      const entry = await storage.createNutritionEntry(validation.data);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to create nutrition entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
