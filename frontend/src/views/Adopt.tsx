import { useAppSelector } from "../redux/hooks";
import PetCard from "../components/PetCard";
import CategorySelector from "../components/CategorySelector";
import { Pet, PetSpecies, PetGender } from "../types/pet.types";
import { UserRole } from "../types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchPets } from "../api/pet.api";
import { useState } from "react";

interface CategoryOption {
  value: string;
  label: string;
}

export default function Adopt() {
  const { role } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | "all">(
    "all"
  );
  const [selectedGender, setSelectedGender] = useState<PetGender | "all">(
    "all"
  );

  const { data: petsData, isLoading } = useSearchPets({
    species: selectedSpecies !== "all" ? selectedSpecies : undefined,
    gender: selectedGender !== "all" ? selectedGender : undefined,
    search: searchQuery || undefined,
  });

  const filteredPets = petsData?.pets?.filter((pet: Pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies =
      selectedSpecies === "all" || pet.species === selectedSpecies;
    const matchesGender =
      selectedGender === "all" || pet.gender === selectedGender;
    return matchesSearch && matchesSpecies && matchesGender;
  });

  const speciesOptions: CategoryOption[] = [
    { value: "all", label: "All" },
    { value: PetSpecies.DOG, label: "Dogs" },
    { value: PetSpecies.CAT, label: "Cats" },
    { value: PetSpecies.BIRD, label: "Birds" },
    { value: PetSpecies.RABBIT, label: "Rabbits" },
    { value: PetSpecies.OTHER, label: "Others" },
  ];

  const genderOptions: CategoryOption[] = [
    { value: "all", label: "All" },
    { value: PetGender.MALE, label: "Male" },
    { value: PetGender.FEMALE, label: "Female" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-12 mb-8 bg-gradient-to-r from-blue-400 to-pink-300 rounded-b-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
          Find Your New Best Friend
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-4">
          Browse adorable pets looking for a loving home
        </p>
        <img
          src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&q=80"
          alt="Cute pet"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search pets by name or breed..."
            className="w-full p-3 pl-12 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Category Selectors */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center items-center">
        <CategorySelector
          title="Species"
          options={speciesOptions}
          selectedValue={selectedSpecies}
          onSelect={(value: string) =>
            setSelectedSpecies(value as PetSpecies | "all")
          }
        />

        <CategorySelector
          title="Gender"
          options={genderOptions}
          selectedValue={selectedGender}
          onSelect={(value: string) =>
            setSelectedGender(value as PetGender | "all")
          }
        />
      </div>

      {/* Pet Grid */}
      <div className="px-2 md:px-8 pb-12">
        {isLoading ? (
          <div className="text-center text-lg text-gray-500 py-12">
            Loading...
          </div>
        ) : filteredPets?.length === 0 ? (
          <div className="text-center text-lg text-gray-400 py-12">
            No pets found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 bg-white/70 rounded-3xl shadow-lg p-8">
            {filteredPets?.map((pet: Pet) => (
              <PetCard
                key={pet._id}
                name={pet.name}
                description={pet.description || ""}
                imageUrl={
                  pet.images && pet.images.length > 0 ? pet.images[0] : ""
                }
                pet={pet}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
