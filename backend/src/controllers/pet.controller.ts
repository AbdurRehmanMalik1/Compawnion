import { Request, Response } from "express";
import PetModel, { PetModelI } from "../models/pet.model";
import { UserModelI } from "../models/user/user.model";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import { UserRole } from "../types";
import { PetSpecies, PetGender } from "../types/pet.types";
import UserModel from "../models/user/user.model";

const addPet = async (req: Request, res: Response) => {
  const user = req.user as UserModelI;

  // Create new pet with shelter ID
  const pet = await PetModel.create({
    ...req.body,
    shelterId: user._id,
  });

  res.status(201).json({
    message: "Pet added successfully",
    pet,
  });
};

const getShelterPets = async (req: Request, res: Response) => {
  const user = req.user as UserModelI;
  const {
    species,
    gender,
    color,
    breed,
    minAge,
    maxAge,
    ageUnit,
    search,
    adoptionStatus,
    minAdoptionFee,
    maxAdoptionFee,
  } = req.query;

  // Build query object
  const query: any = { shelterId: user._id };

  // Add filters if provided
  if (species) {
    query.species = species;
  }

  if (gender) {
    query.gender = gender;
  }

  if (color) {
    query.color = { $regex: color, $options: "i" }; // Case-insensitive search
  }

  if (breed) {
    query.breed = { $regex: breed, $options: "i" }; // Case-insensitive search
  }

  // Search in both name and description (case-insensitive partial match)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Adoption status filter
  if (adoptionStatus) {
    query.adoptionStatus = adoptionStatus;
  }

  // Adoption fee range filter
  if (minAdoptionFee || maxAdoptionFee) {
    query.adoptionFee = {};
    if (minAdoptionFee) {
      query.adoptionFee.$gte = Number(minAdoptionFee);
    }
    if (maxAdoptionFee) {
      query.adoptionFee.$lte = Number(maxAdoptionFee);
    }
  }

  // Age range filter
  if (minAge || maxAge || ageUnit) {
    query.age = {};
    if (ageUnit) {
      query.age.unit = ageUnit;
    }
    if (minAge || maxAge) {
      query.age.value = {};
      if (minAge) {
        query.age.value.$gte = Number(minAge);
      }
      if (maxAge) {
        query.age.value.$lte = Number(maxAge);
      }
    }
  }

  // Get all pets for the shelter with filters
  const pets = await PetModel.find(query)
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean();

  res.status(200).json({
    message: "Pets retrieved successfully",
    pets,
  });
};

const searchPets = async (req: Request, res: Response) => {
  const {
    species,
    gender,
    color,
    breed,
    minAge,
    maxAge,
    ageUnit,
    search,
    adoptionStatus,
    minAdoptionFee,
    maxAdoptionFee,
    location,
    radius,
  } = req.query;

  // Build query object
  const query: any = {};

  // Add filters if provided
  if (species) {
    query.species = species;
  }

  if (gender) {
    query.gender = gender;
  }

  if (color) {
    query.color = { $regex: color, $options: "i" }; // Case-insensitive search
  }

  if (breed) {
    query.breed = { $regex: breed, $options: "i" }; // Case-insensitive search
  }

  // Search in pet name, description, and shelter name
  if (search) {
    // First, find shelters matching the search term
    const matchingShelters = await UserModel.find({
      role: UserRole.SHELTER,
      "roleData.shelterName": { $regex: search, $options: "i" },
    }).select("_id");

    const shelterIds = matchingShelters.map((shelter) => shelter._id);

    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { shelterId: { $in: shelterIds } },
    ];
  }

  // Adoption status filter
  if (adoptionStatus) {
    query.adoptionStatus = adoptionStatus;
  }

  // Adoption fee range filter
  if (minAdoptionFee || maxAdoptionFee) {
    query.adoptionFee = {};
    if (minAdoptionFee) {
      query.adoptionFee.$gte = Number(minAdoptionFee);
    }
    if (maxAdoptionFee) {
      query.adoptionFee.$lte = Number(maxAdoptionFee);
    }
  }

  // Age range filter
  if (minAge || maxAge || ageUnit) {
    query.age = {};
    if (ageUnit) {
      query.age.unit = ageUnit;
    }
    if (minAge || maxAge) {
      query.age.value = {};
      if (minAge) {
        query.age.value.$gte = Number(minAge);
      }
      if (maxAge) {
        query.age.value.$lte = Number(maxAge);
      }
    }
  }

  // Location-based search
  let nearbyShelterIds: string[] = [];
  if (location && radius) {
    const [longitude, latitude] = (location as string).split(",").map(Number);
    const radiusInMeters = Number(radius) * 1000; // Convert km to meters

    // Find shelters within the radius
    const nearbyShelters = await UserModel.find({
      role: UserRole.SHELTER,
      "roleData.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    }).select("_id");

    nearbyShelterIds = nearbyShelters.map((shelter) => shelter._id);
    query.shelterId = { $in: nearbyShelterIds };
  }

  // Get all matching pets with filters
  const pets = await PetModel.find(query)
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean();

  // Populate shelter information
  const populatedPets = await PetModel.populate(pets, {
    path: "shelterId",
    select: "name email roleData",
    match: { role: UserRole.SHELTER },
  });

  res.status(200).json({
    message: "Pets retrieved successfully",
    pets: populatedPets,
  });
};

const getPetById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const pet = await PetModel.findById(id)
    .populate({
      path: "shelterId",
      select: "name email roleData",
      match: { role: UserRole.SHELTER },
    })
    .lean();

  if (!pet) {
    throw HttpExceptions.NotFound("Pet not found");
  }

  res.status(200).json({
    message: "Pet retrieved successfully",
    pet,
  });
};

export const petController = {
  addPet,
  getShelterPets,
  searchPets,
  getPetById,
};
