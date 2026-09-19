export type UserRole = 'superadmin' | 'company_admin' | 'company_staff' | 'customer';

export interface User {
  id?: string;
  email: string;
  password: string;
  nombre: string;
  phone?: string;
  role: UserRole;
  companyId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  nombre: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
