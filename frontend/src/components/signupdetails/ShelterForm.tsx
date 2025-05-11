import React from "react";

interface ShelterFormProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors: any;
    showErrors: boolean;
}

const ShelterForm: React.FC<ShelterFormProps> = ({ formData, handleChange, errors, showErrors }) => {
    return (
        <div className="space-y-3">
            <h1 className="text-start text-2xl">Shelter Information</h1>

            <div>
                <input
                    type="text"
                    name="shelterName"
                    value={formData.shelterName}
                    onChange={handleChange}
                    placeholder="Shelter Name *"
                    className="p-2 border rounded w-full"
                />
                {showErrors && !formData.shelterName.trim() && (
                    <p className="text-red-500 text-sm mt-1">Shelter name is required.</p>
                )}
            </div>

            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="p-2 border rounded w-full"
                rows={3}
            />

            <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Logo URL"
                className="p-2 border rounded w-full"
            />

            <textarea
                name="adoptionPolicy"
                value={formData.adoptionPolicy}
                onChange={handleChange}
                placeholder="Adoption Policy"
                className="p-2 border rounded w-full"
                rows={4}
            />
        </div>
    );
};

export default ShelterForm;
