import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePetById } from "../api/pet.api";
import { useAppSelector } from "../redux/hooks";

const PetDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: petData, isLoading, error } = usePetById(id || "");
  const { role } = useAppSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );

  if (error || !petData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">Error loading pet details</div>
      </div>
    );

  const pet = petData.pet;
  const shelter = pet.shelterId;

  const handleChatClick = () => {
    navigate("/chats", {
      state: {
        shelterId: shelter._id,
        shelterName: shelter.roleData.shelterName,
        petId: pet._id,
        petName: pet.name,
      },
    });
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto space-y-12">
      {/* Image Section */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-start">
        {/* Main Image */}
        <div className="flex justify-center lg:w-[400px] lg:h-[400px]">
          <img
            src={pet.images[selectedImage]}
            alt="Main Pet"
            className="w-full max-w-[400px] h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 justify-center flex-wrap lg:flex-col lg:items-center lg:ml-6 lg:h-[400px] lg:overflow-y-auto">
          {pet.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setSelectedImage(idx)}
              className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                idx === selectedImage
                  ? "border-[var(--color-primary-dark)]"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Pet Info */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--color-primary-dark)]">
            {pet.name}
          </h1>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <Info label="Species" value={pet.species} />
            <Info label="Breed" value={pet.breed} />
            <Info label="Age" value={`${pet.age.value} ${pet.age.unit}`} />
            <Info label="Gender" value={pet.gender} />
            {pet.size && <Info label="Size" value={pet.size} />}
            {pet.color && <Info label="Color" value={pet.color} />}
            {pet.adoptionFee && (
              <Info label="Adoption Fee" value={`$${pet.adoptionFee}`} />
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mt-6 mb-2">
              About {pet.name}
            </h2>
            <p className="text-gray-700 text-lg">{pet.description}</p>
          </div>

          {/* Health Details */}
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mt-6 mb-2">
              Health Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <Info
                label="Vaccinated"
                value={pet.healthDetails.isVaccinated ? "Yes" : "No"}
              />
              <Info
                label="Neutered"
                value={pet.healthDetails.isNeutered ? "Yes" : "No"}
              />
              {pet.healthDetails.medicalHistory && (
                <div className="col-span-2">
                  <span className="font-semibold text-[var(--color-dark)]">
                    Medical History:
                  </span>
                  <p className="text-[var(--color-text)] mt-1">
                    {pet.healthDetails.medicalHistory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Button - Only show if user is logged in and not a shelter */}
          {role !== "shelter" && (
            <button
              onClick={handleChatClick}
              className="mt-6 inline-block px-6 py-3 bg-[var(--color-primary-dark)] hover:bg-[var(--color-secondary)] text-white font-semibold text-lg rounded-lg transition-all"
            >
              Chat with Shelter
            </button>
          )}
        </div>

        {/* Shelter Info */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">
              {shelter.roleData.shelterName}
            </h2>
            <p className="text-gray-700 text-lg">
              {shelter.roleData.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[var(--color-primary-dark)]">
              Contact Information
            </h3>
            <div className="grid gap-3 text-lg">
              <Info label="Address" value={shelter.roleData.address} />
              {shelter.roleData.phone && (
                <Info label="Phone" value={shelter.roleData.phone} />
              )}
              <Info label="Email" value={shelter.email} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[var(--color-primary-dark)]">
              Location
            </h3>
            <div className="grid gap-3 text-lg">
              <Info
                label="Coordinates"
                value={`${shelter.roleData.location.coordinates[1].toFixed(
                  4
                )}, ${shelter.roleData.location.coordinates[0].toFixed(4)}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-semibold text-[var(--color-dark)]">{label}:</span>{" "}
    <span className="text-[var(--color-text)]">{value}</span>
  </div>
);

export default PetDetailsPage;
