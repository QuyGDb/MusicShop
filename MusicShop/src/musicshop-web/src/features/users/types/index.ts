export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin'
}
export enum UserStatus {
  Active = 'Active',
  Locked = 'Locked'
}

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
