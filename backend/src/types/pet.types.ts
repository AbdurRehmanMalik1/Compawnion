export enum PetSpecies {
  DOG = "dog",
  CAT = "cat",
  BIRD = "bird",
  RABBIT = "rabbit",
  OTHER = "other",
}

export enum AgeUnit {
  DAYS = "days",
  MONTHS = "months",
  YEARS = "years",
}

export enum PetGender {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown",
}

export enum PetSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "extra-large",
}

export enum AdoptionStatus {
  AVAILABLE = "available",
  PENDING = "pending",
  ADOPTED = "adopted",
}

export interface Age {
  value: number;
  unit: AgeUnit;
}

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
