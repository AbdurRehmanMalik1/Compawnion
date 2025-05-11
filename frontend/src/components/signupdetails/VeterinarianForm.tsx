import React from "react";

interface EducationEntry {
    degree: string;
    institution: string;
    year: string;
}
interface VeterinarianFormProps {
    formData: {
        clinicName: string;
        specialization: string;
        experience: string;
        education: EducationEntry[];
    };
    errors: { [key: string]: string };
    showErrors: boolean; // ✅ Add this line
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEducationChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    addEducation: () => void;
    removeEducation: (index: number) => void;
}

const VeterinarianForm: React.FC<VeterinarianFormProps> = ({
    formData,
    handleChange,
    handleEducationChange,
    addEducation,
    removeEducation,
    errors
}) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">Veterinarian Details</h2>

        <div>
            <label className="block">Clinic Name (Optional)</label>
            <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
        </div>

        <div>
            <label className="block">Specialization (Optional)</label>
            <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
        </div>

        <div>
            <label className="block">
                Experience (years) <span className="text-red-500">*</span>
            </label>
            <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) handleChange(e);
                }}
                placeholder="Experience (years)"
                className={`w-full border p-2 rounded ${errors.experience ? "border-red-500" : ""}`}
            />
            {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience}</p>
            )}
        </div>

        <div>
            <label className="font-semibold">
                Education <span className="text-red-500">*</span>
            </label>
            {formData.education.map((entry, index) => (
                <div key={index} className="flex flex-wrap gap-2 mt-2 items-start">
                    <div className="w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Degree"
                            value={entry.degree}
                            onChange={(e) =>
                                handleEducationChange(index, { ...e, target: { ...e.target, name: "degree" } })
                            }
                            className={`border p-2 rounded w-full ${errors[`degree-${index}`] ? "border-red-500" : ""}`}
                        />
                        {errors[`degree-${index}`] && (
                            <p className="text-sm text-red-500">{errors[`degree-${index}`]}</p>
                        )}
                    </div>

                    <div className="w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Institution"
                            value={entry.institution}
                            onChange={(e) =>
                                handleEducationChange(index, { ...e, target: { ...e.target, name: "institution" } })
                            }
                            className={`border p-2 rounded w-full ${errors[`institution-${index}`] ? "border-red-500" : ""}`}
                        />
                        {errors[`institution-${index}`] && (
                            <p className="text-sm text-red-500">{errors[`institution-${index}`]}</p>
                        )}
                    </div>

                    <div className="w-full sm:w-1/4">
                        <input
                            type="number"
                            placeholder="Year"
                            value={entry.year}
                            onChange={(e) =>
                                handleEducationChange(index, { ...e, target: { ...e.target, name: "year" } })
                            }
                            className={`border p-2 rounded w-full ${errors[`year-${index}`] ? "border-red-500" : ""}`}
                        />
                        {errors[`year-${index}`] && (
                            <p className="text-sm text-red-500">{errors[`year-${index}`]}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 text-sm underline mt-2"
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addEducation}
                className="mt-2 text-blue-600 underline"
            >
                + Add Education
            </button>
        </div>
    </div>
);

export default VeterinarianForm;
