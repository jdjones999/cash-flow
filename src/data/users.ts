import { User } from '../types/auth';

const STORAGE_KEY = 'cashflow_users_db';

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const addUser = (newUser: User) => {
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
};

export const toggleUserVerification = (id: string) => {
  const users = getUsers().map(user => {
    if (user.id === id && user.role !== 'admin') {
      return { ...user, isVerified: !user.isVerified };
    }
    return user;
  });
  saveUsers(users);
  return users;
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter(user => user.id !== id || user.role === 'admin');
  saveUsers(users);
  return users;
};
