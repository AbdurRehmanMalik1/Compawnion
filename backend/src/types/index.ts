export enum UserRole {
  ADOPTER = "adopter",
  SHELTER = "shelter",
  VETERINARIAN = "veterinarian",
}

export interface JwtPayload {
  userId: string;
}
