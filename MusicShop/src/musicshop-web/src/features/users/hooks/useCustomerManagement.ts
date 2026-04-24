import { useState } from 'react';
import { UserProfile } from '../types';

const MOCK_USERS: UserProfile[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@musicshop.com', 
    role: 'Admin', 
    status: 'Active', 
    joinDate: '2026-01-01', 
    lastLogin: '2026-04-20 10:30', 
    totalSpent: 0 
  },
  { 
    id: '2', 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'Customer', 
    status: 'Active', 
    joinDate: '2026-03-15', 
    lastLogin: '2026-04-18 15:45', 
    totalSpent: 450.25 
  },
  { 
    id: '3', 
    name: 'Sarah Connor', 
    email: 'sarah@terminator.com', 
    role: 'Customer', 
    status: 'Locked', 
    joinDate: '2026-02-20', 
    lastLogin: '2026-03-10 09:00', 
    totalSpent: 1250.00 
  },
  { 
    id: '4', 
    name: 'Thomas Anderson', 
    email: 'neo@matrix.io', 
    role: 'Customer', 
    status: 'Active', 
    joinDate: '2026-04-01', 
    lastLogin: '2026-04-20 08:20', 
    totalSpent: 89.99 
  },
];

export function useCustomerManagement() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setDeletingUserId(null);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active' && u.role === 'Customer').length,
    admins: users.filter(u => u.role === 'Admin').length,
  };

  return {
    users,
    stats,
    selectedUser,
    deletingUserId,
    actions: {
      openEdit: (user: UserProfile) => setSelectedUser(user),
      closeEdit: () => setSelectedUser(null),
      confirmDelete: (id: string) => setDeletingUserId(id),
      cancelDelete: () => setDeletingUserId(null),
      executeDelete: handleDeleteUser,
    }
  };
}
