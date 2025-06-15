import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  age: integer("age").notNull(),
  height: integer("height").notNull(), // in cm
  weight: integer("weight").notNull(), // in kg
  fitnessLevel: text("fitness_level").notNull(), // beginner, intermediate, advanced
  goal: text("goal").notNull(), // lose-weight, gain-muscle, stay-fit
  onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // strength, cardio, flexibility
  duration: integer("duration").notNull(), // in minutes
  calories: integer("calories").notNull(),
  completed: boolean("completed").default(false).notNull(),
  progress: integer("progress").default(0).notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  weight: integer("weight").notNull(), // in kg
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nutritionEntries = pgTable("nutrition_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(), // in grams
  carbs: integer("carbs").notNull(), // in grams
  fats: integer("fats").notNull(), // in grams
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertNutritionEntrySchema = createInsertSchema(nutritionEntries).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WeightEntry = typeof weightEntries.$inferSelect;
export type NutritionEntry = typeof nutritionEntries.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type InsertNutritionEntry = z.infer<typeof insertNutritionEntrySchema>;
