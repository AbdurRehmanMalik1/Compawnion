import { apiServer } from "../apiconfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PetSpecies,
  PetGender,
  PetSize,
  AgeUnit,
  AdoptionStatus,
} from "../types/pet.types";

// Types
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
  shelterId: {
    _id: string;
    name: string;
    email: string;
    roleData: {
      shelterName: string;
      address: string;
      location: {
        type: "Point";
        coordinates: [number, number];
      };
      phone?: string;
      description?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddPetData {
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
}

export interface SearchPetsParams {
  species?: PetSpecies;
  gender?: PetGender;
  color?: string;
  breed?: string;
  minAge?: number;
  maxAge?: number;
  ageUnit?: AgeUnit;
  search?: string;
  adoptionStatus?: AdoptionStatus;
  minAdoptionFee?: number;
  maxAdoptionFee?: number;
  location?: string; // format: "longitude,latitude"
  radius?: number; // in kilometers
}

// API Functions
const addPet = async (data: AddPetData) => {
  const response = await apiServer.post<{ message: string; pet: Pet }>(
    "/pets",
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const getShelterPets = async (params: SearchPetsParams = {}) => {
  const response = await apiServer.get<{ message: string; pets: Pet[] }>(
    "/pets/shelter",
    { params, withCredentials: true }
  );
  return response.data;
};

const searchPets = async (params: SearchPetsParams = {}) => {
  const response = await apiServer.get<{ message: string; pets: Pet[] }>(
    "/pets/search",
    { params, withCredentials: true }
  );
  return response.data;
};

const getPetById = async (id: string) => {
  const response = await apiServer.get<{ message: string; pet: Pet }>(
    `/pets/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// React Query Hooks
export const useAddPet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPet,
    onSuccess: () => {
      // Invalidate and refetch shelter pets after adding a new pet
      queryClient.invalidateQueries({ queryKey: ["shelterPets"] });
    },
  });
};

export const useShelterPets = (params: SearchPetsParams = {}) => {
  return useQuery({
    queryKey: ["shelterPets", params],
    queryFn: () => getShelterPets(params),
  });
};

export const useSearchPets = (params: SearchPetsParams = {}) => {
  return useQuery({
    queryKey: ["searchPets", params],
    queryFn: () => searchPets(params),
  });
};

export const usePetById = (id: string) => {
  return useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPetById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};
