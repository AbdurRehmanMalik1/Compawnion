import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddPet } from "../api/pet.api";
import {
  PetSpecies,
  PetGender,
  PetSize,
  AgeUnit,
  AdoptionStatus,
} from "../types/pet.types";
import { useAppSelector } from "../redux/hooks";
import CloudinaryUploader from "../CloudinaryUploader";

const PetForm = () => {
  const navigate = useNavigate();
  const { _id: shelterId } = useAppSelector((state) => state.auth);
  const addPetMutation = useAddPet();

  const [formData, setFormData] = useState({
    name: "",
    species: PetSpecies.DOG,
    breed: "",
    age: { value: "", unit: AgeUnit.YEARS },
    gender: PetGender.MALE,
    size: PetSize.MEDIUM,
    color: "",
    images: [] as string[],
    imageFiles: [] as File[],
    description: "",
    adoptionStatus: AdoptionStatus.AVAILABLE,
    adoptionFee: "",
    healthDetails: {
      isVaccinated: false,
      isNeutered: false,
      medicalHistory: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.breed.trim()) newErrors.breed = "Breed is required";
    if (!formData.age.value) newErrors.age = "Age is required";
    // if (formData.images.length === 0)
    //   newErrors.images = "At least one image is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAgeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      age: {
        ...prev.age,
        [key]: value,
      },
    }));
    // Clear age error when user starts typing
    if (errors.age) {
      setErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const handleHealthChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const key = name.split(".")[1];

    setFormData((prev) => ({
      ...prev,
      healthDetails: {
        ...prev.healthDetails,
        [key]:
          type === "checkbox" && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value,
      },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: imageUrls,
        imageFiles: files,
      }));
      // Clear image error when files are selected
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);
      // Upload images to Cloudinary
      const imageUrls: string[] = [];
      for (const file of formData.imageFiles) {
        try {
          const url = await CloudinaryUploader.upload(file);
          imageUrls.push(url);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload images. Please try again.");
        }
      }

      // Create the pet with the image URLs
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: {
          value: Number(formData.age.value),
          unit: formData.age.unit,
        },
        gender: formData.gender,
        size: formData.size,
        color: formData.color || undefined,
        images: imageUrls,
        description: formData.description,
        adoptionStatus: formData.adoptionStatus,
        adoptionFee: formData.adoptionFee
          ? Number(formData.adoptionFee)
          : undefined,
        healthDetails: formData.healthDetails,
        shelterId,
      };

      await addPetMutation.mutateAsync(petData);

      // Show success message and redirect
      alert("Pet added successfully!");
      navigate("/adopt");
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add pet. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="min-h-screen bg-[url('/pet.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl p-6 space-y-6 bg-white text-black rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90"
      >
        <h1 className="text-3xl font-bold text-center text-[var(--color-primary)]">
          Create Pet Profile
        </h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>
          <div>
            <input
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              placeholder="Breed"
              className={`${inputClass} ${
                errors.breed ? "border-red-500" : ""
              }`}
            />
            {errors.breed && <p className={errorClass}>{errors.breed}</p>}
          </div>
          <input
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Color"
            className={inputClass}
          />
          <input
            name="adoptionFee"
            type="number"
            value={formData.adoptionFee}
            onChange={handleInputChange}
            placeholder="Adoption Fee"
            className={inputClass}
          />
          <select
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            className={inputClass}
          >
            {Object.values(PetSpecies).map((species) => (
              <option key={species} value={species}>
                {species.charAt(0).toUpperCase() + species.slice(1)}
              </option>
            ))}
          </select>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={inputClass}
          >
            {Object.values(PetGender).map((gender) => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>
          <select
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            className={inputClass}
          >
            {Object.values(PetSize).map((size) => (
              <option key={size} value={size}>
                {size
                  .split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </option>
            ))}
          </select>
          <select
            name="adoptionStatus"
            value={formData.adoptionStatus}
            onChange={handleInputChange}
            className={inputClass}
          >
            {Object.values(AdoptionStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="age.value"
              value={formData.age.value}
              onChange={handleAgeChange}
              placeholder="Age"
              className={`${inputClass} ${errors.age ? "border-red-500" : ""}`}
            />
            {errors.age && <p className={errorClass}>{errors.age}</p>}
          </div>
          <select
            name="age.unit"
            value={formData.age.unit}
            onChange={handleAgeChange}
            className={inputClass}
          >
            {Object.values(AgeUnit).map((unit) => (
              <option key={unit} value={unit}>
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="font-semibold">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className={`${inputClass} ${errors.images ? "border-red-500" : ""}`}
          />
          {errors.images && <p className={errorClass}>{errors.images}</p>}
          <div className="flex gap-4 mt-2 flex-wrap">
            {formData.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className={`${inputClass} h-24 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className={errorClass}>{errors.description}</p>
          )}
        </div>

        {/* Health Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="healthDetails.isVaccinated"
              checked={formData.healthDetails.isVaccinated}
              onChange={handleHealthChange}
              className="accent-[var(--color-primary)]"
            />
            Vaccinated
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="healthDetails.isNeutered"
              checked={formData.healthDetails.isNeutered}
              onChange={handleHealthChange}
              className="accent-[var(--color-primary)]"
            />
            Neutered
          </label>

          <textarea
            name="healthDetails.medicalHistory"
            value={formData.healthDetails.medicalHistory}
            onChange={handleHealthChange}
            placeholder="Medical History"
            className={`${inputClass} col-span-full h-24`}
          />
        </div>

        <button
          type="submit"
          disabled={addPetMutation.isPending || isUploading}
          className="w-full md:w-auto bg-[var(--color-primary)] hover:brightness-110 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading
            ? "Uploading Images..."
            : addPetMutation.isPending
            ? "Adding Pet..."
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PetForm;
