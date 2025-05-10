import mongoose, { Document } from "mongoose";
import {
  Age,
  PetGender,
  PetSize,
  PetSpecies,
  AdoptionStatus,
  AgeUnit,
} from "../types/pet.types";

export interface HealthDetails {
  isVaccinated: boolean;
  isNeutered: boolean;
  medicalHistory?: string;
}

export interface PetModelI extends Document {
  _id: string;
  shelterId: mongoose.Types.ObjectId;
  name: string;
  species: PetSpecies;
  breed: string;
  age: Age;
  gender: PetGender;
  size?: PetSize;
  color?: string;
  images: string[];
  description?: string;
  adoptionStatus: AdoptionStatus;
  adoptionFee?: number;
  healthDetails: HealthDetails;
  createdAt: Date;
  updatedAt: Date;
}

const healthDetailsSchema = new mongoose.Schema<HealthDetails>({
  isVaccinated: {
    type: Boolean,
    required: true,
  },
  isNeutered: {
    type: Boolean,
    required: true,
  },
  medicalHistory: {
    type: String,
  },
});

const ageSchema = new mongoose.Schema<Age>({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: Object.values(AgeUnit),
    required: true,
  },
});

const petSchema = new mongoose.Schema<PetModelI>(
  {
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      enum: Object.values(PetSpecies),
      required: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: ageSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(PetGender),
      required: true,
    },
    size: {
      type: String,
      enum: Object.values(PetSize),
    },
    color: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    adoptionStatus: {
      type: String,
      enum: Object.values(AdoptionStatus),
      default: AdoptionStatus.AVAILABLE,
    },
    adoptionFee: {
      type: Number,
      min: 0,
    },
    healthDetails: {
      type: healthDetailsSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

petSchema.index({ size: 1 });
petSchema.index({ shelterId: 1 });
petSchema.index({ "age.unit": 1, "age.value": 1 });
petSchema.index(
  { name: "text", breed: "text", description: "text" },
  { weights: { name: 3, breed: 2, description: 1 } }
);

const PetModel = mongoose.model<PetModelI>("Pet", petSchema);

export default PetModel;
