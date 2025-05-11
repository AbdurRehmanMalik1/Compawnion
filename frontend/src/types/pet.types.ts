export enum PetSpecies {
  DOG = "dog",
  CAT = "cat",
  BIRD = "bird",
  RABBIT = "rabbit",
  OTHER = "other",
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

export enum AgeUnit {
  DAYS = "days",
  MONTHS = "months",
  YEARS = "years",
}

export enum AdoptionStatus {
  AVAILABLE = "available",
  PENDING = "pending",
  ADOPTED = "adopted",
}

export interface Pet {
  _id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: {
    value: number;
    unit: AgeUnit;
  };
  gender: PetGender;
  size?: PetSize;
  color?: string;
  images: string[];
  description?: string;
  adoptionStatus?: AdoptionStatus;
  adoptionFee?: number;
  healthDetails: {
    isVaccinated: boolean;
    isNeutered: boolean;
    medicalHistory?: string;
  };
  shelterId: string;
  createdAt: string;
  updatedAt: string;
}
