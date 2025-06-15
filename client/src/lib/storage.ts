export interface OnboardingData {
  goal: 'lose-weight' | 'gain-muscle' | 'stay-fit';
  age: number;
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
}

export const LOCAL_STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'fitpulse_onboarding_complete',
  USER_DATA: 'fitpulse_user_data',
  USER_ID: 'fitpulse_user_id',
} as const;

export class LocalStorage {
  static getOnboardingComplete(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
  }

  static setOnboardingComplete(complete: boolean): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ONBOARDING_COMPLETE, complete.toString());
  }

  static getUserData(): OnboardingData | null {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  static setUserData(data: OnboardingData): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }

  static getUserId(): number | null {
    const id = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
    return id ? parseInt(id) : null;
  }

  static setUserId(id: number): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, id.toString());
  }

  static clearAll(): void {
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
