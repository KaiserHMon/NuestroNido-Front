export interface Level {
  id?: string;
  name: string;
  level_number: number;
  required_progress: number;
  image_url?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  familyId?: string;
  color?: MemberColor;
  experience_points: number;
  level?: Level;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession extends User {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  family?: Family;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  token: string;
  family?: Family;
}

export interface MemberColor {
  id: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
  wcagContrast: number;
}

export interface Family {
  id: string;
  name: string;
  invitationCode: string;
  creatorId: string;
  members: Member[];
  maxMembers?: number;
  maxNotes?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFamilyRequest {
  name: string;
}

export interface CreateFamilyResponse {
  success: boolean;
  family: Family;
  invitationCode: string;
}

export interface JoinFamilyRequest {
  invitationCode: string;
}

export interface JoinFamilyResponse {
  success: boolean;
  family: Family;
  member: Member;
}

export interface ValidateCodeRequest {
  code: string;
}

export interface ValidateCodeResponse {
  valid: boolean;
  familyName?: string;
  currentMembers?: number;
  maxMembers?: number;
  error?: string;
}

export interface UpdateFamilyRequest {
  newName: string;
}

export interface UpdateFamilyResponse {
  success: boolean;
  family: Family;
}

export interface DeleteFamilyRequest {
  confirmationText: string;
}

export interface DeleteFamilyResponse {
  success: boolean;
  message: string;
}

export interface Member {
  id: string;
  name: string;
  color: MemberColor;
  experience_points: number;
  level?: Level;
  roleId: 'creator' | 'member';
  familyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberRequest {
  name: string;
  familyId: string;
}

export interface DeleteMemberRequest {
  memberId: string;
  newCreatorId?: string;
  reason?: string;
}

export interface DeleteMemberResponse {
  success: boolean;
  message: string;
  updatedFamily?: {
    members: Member[];
    newCreator?: Member;
  };
}

export interface Note {
  id: string;
  title: string | null;
  content: string | null;
  family_id: string;
  user_id: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  user: {
    id: string;
    name: string;
    experience_points: number;
    level?: Level;
    color?: MemberColor;
  };
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  family_id: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

export interface Task {
  id: string;
  title: string;
  dateType?: 'date' | 'days';
  date?: string; // ISO 8601 string: due_date
  endDate?: string; // ISO 8601 string: end_date
  daysOfWeek?: string[]; // ["1", "3"] for Monday and Wednesday
  time?: string; // Optional: "14:30"
  creatorId: string;
  creatorColor: MemberColor;
  priority?: 'low' | 'medium' | 'high';
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  assignedMembers?: string[];
  familyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTask {
  id: string;
  title: string;
  family_id: string;
  assigned_to_user_id: string | null;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  week_days: string | null;
  status: 'pending' | 'completed';
  due_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  noteId: string;
  title: string;
  date: Date;
  memberColor: MemberColor;
  memberName: string;
}

export interface LeaderboardEntry {
  rank: number;
  member: {
    id: string;
    name: string;
    color: MemberColor;
    imageUrl?: string;
  };
  experience_points: number;
  level: Level;
  nextLevel?: Level;
  badge?: 'gold' | 'silver' | 'bronze';
}

export interface PlayerSummaryLeaderboard {
  currentPosition: number;
  totalMembers: number;
  points: number;
  pointsToNextRank: number;
  previousPosition?: number;
}

export interface AppError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  family: Family | null;
  token: string | null;
  levels: Level[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (code: string) => Promise<void>;
  joinByLink: (token: string) => Promise<void>;
  updateFamily: (familyId: string, name: string) => Promise<void>;
  deleteFamily: (familyId: string) => Promise<void>;
  refreshFamily: () => Promise<void>;
}
