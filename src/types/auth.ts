export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  createdAt: string;
}
