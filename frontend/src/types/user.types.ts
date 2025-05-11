export enum UserRole {
  ADOPTER = "adopter",
  SHELTER = "shelter",
  ADMIN = "admin",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  roleData?: {
    shelterName?: string;
    address?: string;
    phone?: string;
  };
}
