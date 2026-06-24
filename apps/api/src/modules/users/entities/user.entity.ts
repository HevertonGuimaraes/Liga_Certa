export type UserRole = 'ADMIN' | 'ORGANIZER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
