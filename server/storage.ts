import { 
  users, 
  userProfiles, 
  workouts, 
  weightEntries, 
  nutritionEntries,
  type User, 
  type UserProfile, 
  type Workout, 
  type WeightEntry, 
  type NutritionEntry,
  type InsertUser, 
  type InsertUserProfile, 
  type InsertWorkout, 
  type InsertWeightEntry, 
  type InsertNutritionEntry 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profiles
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile & { userId: number }): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Workouts
  getUserWorkouts(userId: number): Promise<Workout[]>;
  getTodaysWorkout(userId: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout & { userId: number }): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  
  // Weight Entries
  getUserWeightEntries(userId: number): Promise<WeightEntry[]>;
  getLatestWeight(userId: number): Promise<WeightEntry | undefined>;
  createWeightEntry(entry: InsertWeightEntry & { userId: number }): Promise<WeightEntry>;
  
  // Nutrition Entries
  getUserNutritionEntries(userId: number): Promise<NutritionEntry[]>;
  getTodaysNutrition(userId: number): Promise<NutritionEntry | undefined>;
  createNutritionEntry(entry: InsertNutritionEntry & { userId: number }): Promise<NutritionEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private workouts: Map<number, Workout>;
  private weightEntries: Map<number, WeightEntry>;
  private nutritionEntries: Map<number, NutritionEntry>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.workouts = new Map();
    this.weightEntries = new Map();
    this.nutritionEntries = new Map();
    this.currentId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // User Profiles
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
  }

  async createUserProfile(profileData: InsertUserProfile & { userId: number }): Promise<UserProfile> {
    const id = this.currentId++;
    const profile: UserProfile = { 
      ...profileData, 
      id, 
      createdAt: new Date() 
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: number, profileData: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = await this.getUserProfile(userId);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profileData };
    this.userProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Workouts
  async getUserWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(workout => workout.userId === userId);
  }

  async getTodaysWorkout(userId: number): Promise<Workout | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.workouts.values()).find(workout => 
      workout.userId === userId && 
      workout.createdAt >= today && 
      workout.createdAt < tomorrow
    );
  }

  async createWorkout(workoutData: InsertWorkout & { userId: number }): Promise<Workout> {
    const id = this.currentId++;
    const workout: Workout = { 
      ...workoutData, 
      id, 
      createdAt: new Date() 
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: number, workoutData: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existingWorkout = this.workouts.get(id);
    if (!existingWorkout) return undefined;
    
    const updatedWorkout = { ...existingWorkout, ...workoutData };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  // Weight Entries
  async getUserWeightEntries(userId: number): Promise<WeightEntry[]> {
    return Array.from(this.weightEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLatestWeight(userId: number): Promise<WeightEntry | undefined> {
    const entries = await this.getUserWeightEntries(userId);
    return entries[0];
  }

  async createWeightEntry(entryData: InsertWeightEntry & { userId: number }): Promise<WeightEntry> {
    const id = this.currentId++;
    const entry: WeightEntry = { 
      ...entryData, 
      id, 
      createdAt: new Date() 
    };
    this.weightEntries.set(id, entry);
    return entry;
  }

  // Nutrition Entries
  async getUserNutritionEntries(userId: number): Promise<NutritionEntry[]> {
    return Array.from(this.nutritionEntries.values()).filter(entry => entry.userId === userId);
  }

  async getTodaysNutrition(userId: number): Promise<NutritionEntry | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.nutritionEntries.values()).find(entry => 
      entry.userId === userId && 
      entry.createdAt >= today && 
      entry.createdAt < tomorrow
    );
  }

  async createNutritionEntry(entryData: InsertNutritionEntry & { userId: number }): Promise<NutritionEntry> {
    const id = this.currentId++;
    const entry: NutritionEntry = { 
      ...entryData, 
      id, 
      createdAt: new Date() 
    };
    this.nutritionEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
