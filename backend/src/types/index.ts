import { Request } from 'express';
import { User } from '../models/user.model';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: User;
}

// User roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  THERAPIST = 'therapist'
}

// Module types
export interface EnabledModules {
  journal: boolean;
  moodTracker: boolean;
  planner: boolean;
  expenseManager: boolean;
  bookReader: boolean;
  [key: string]: boolean; // Allow for future modules
}

// User preferences
export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  emailFrequency?: string;
  [key: string]: any; // Allow for additional preferences
}

// API response format
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: {
    field: string;
    message: string;
  }[];
}

// Authentication related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  confirmPassword?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

// Profile related types
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  timezone?: string;
}

export interface PreferencesUpdateRequest {
  preferences: UserPreferences;
}

export interface ModulesUpdateRequest {
  enabledModules: Partial<EnabledModules>;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
