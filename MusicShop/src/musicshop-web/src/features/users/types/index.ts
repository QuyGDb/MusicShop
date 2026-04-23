export type UserRole = 'Admin' | 'Customer';
export type UserStatus = 'Active' | 'Locked';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastLogin: string;
  totalSpent: number;
  avatarUrl?: string;
}
