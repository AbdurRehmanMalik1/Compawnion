import React, { useState } from 'react';
import clsx from 'clsx';

const PetForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        species: 'dog',
        breed: '',
        age: { value: '', unit: 'years' },
        gender: 'male',
        size: 'medium',
        color: '',
        images: [] as string[],
        imageFiles: [] as File[],
        description: '',
        adoptionStatus: 'available',
        adoptionFee: '',
        healthDetails: {
            isVaccinated: false,
            isNeutered: false,
            medicalHistory: '',
        },
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAgeChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const key = name.split('.')[1];
        setFormData((prev) => ({
            ...prev,
            age: {
                ...prev.age,
                [key]: value,
            },
        }));
    };

    const handleHealthChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const key = name.split('.')[1];

        setFormData((prev) => ({
            ...prev,
            healthDetails: {
                ...prev.healthDetails,
                [key]: type === 'checkbox' && e.target instanceof HTMLInputElement
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
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = new FormData();
        formData.imageFiles.forEach((file, index) => {
            payload.append(`image${index}`, file);
        });

        payload.append('data', JSON.stringify({
            ...formData,
            images: undefined,
            imageFiles: undefined,
        }));

        console.log('Submitting payload:', formData);
    };
    const inputClass =
        "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

    return (
        <div className="min-h-screen bg-[url('/pet.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-4xl p-6 space-y-6 bg-white text-black rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90"
            >
                <h1 className="text-3xl font-bold text-center text-[var(--color-primary)]">Create Pet Profile</h1>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className={inputClass}
                    />
                    <input
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        placeholder="Breed"
                        className={inputClass}
                    />
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
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Cat</option>
                        <option value="others">Cat</option>
                    </select>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unknown">Unknown</option>
                    </select>
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                    </select>
                    <select
                        name="adoptionStatus"
                        value={formData.adoptionStatus}
                        onChange={handleInputChange}
                        className={inputClass}
                    >
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="adopted">Adopted</option>
                    </select>
                </div>

                {/* Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="age.value"
                        value={formData.age.value}
                        onChange={handleAgeChange}
                        placeholder="Age"
                        className={inputClass}
                    />
                    <select
                        name="age.unit"
                        value={formData.age.unit}
                        onChange={handleAgeChange}
                        className={inputClass}
                    >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
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
                        className={inputClass}
                    />
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
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className={`${inputClass} h-24`}
                />

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
                    className="w-full md:w-auto bg-[var(--color-primary)] hover:brightness-110 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );


};

export default PetForm;
