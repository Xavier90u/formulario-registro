export interface Company {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  logo?: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCompanyDTO {
  name: string;
  email: string;
  phone?: string;
  description?: string;
  logo?: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  logo?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
