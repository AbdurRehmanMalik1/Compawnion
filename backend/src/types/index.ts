export enum UserRole {
  ADOPTER = "adopter",
  SHELTER = "shelter",
  VETERINARIAN = "veterinarian",
}

export interface JwtPayload {
  userId: string;
}

export enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  AUDIO = "audio",
  OTHER = "other",
}
