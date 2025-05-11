import React, { useState, useEffect } from "react";
import RoleForm from "../components/signupdetails/RoleForm";
import ProfileForm from "../components/signupdetails/ProfileForm";
import AddressForm from "../components/signupdetails/AddressForm";
import VeterinarianForm from "../components/signupdetails/VeterinarianForm";
import clsx from "clsx";

const SignUpDetails: React.FC = () => {
    const [step, setStep] = useState(0);
    const [currentBg, setCurrentBg] = useState(0);
    const [errors, setErrors] = useState<any>({});
    const [showErrors, setShowErrors] = useState(false);

    const backgroundImages = ["/pet21.png", "/pet22.png", "/pet23.png", "/pet24.png"];

    const [formData, setFormData] = useState<any>({
        role: "",
        profilePic: null,
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        clinicName: "",
        specialization: "",
        experience: "",
        education: [{ degree: "", institution: "", year: "" }]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newEducation = [...formData.education];
        newEducation[index][e.target.name] = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            education: newEducation
        }));
    };

    const addEducation = () => {
        setFormData((prev: any) => ({
            ...prev,
            education: [...prev.education, { degree: "", institution: "", year: "" }]
        }));
    };

    const removeEducation = (index: number) => {
        if (formData.education.length === 1) return;
        setFormData((prev: any) => ({
            ...prev,
            education: prev.education.filter((_: any, i: number) => i !== index)
        }));
    };

    const getSteps = () => {
        switch (formData.role) {
            case "Adopter":
            case "Shelter":
                return [
                    <RoleForm formData={formData} handleChange={handleChange} />,
                    <ProfileForm formData={formData} handleChange={handleChange} />,
                    <AddressForm formData={formData} handleChange={handleChange} />
                ];
            case "Veterinarian":
                return [
                    <RoleForm formData={formData} handleChange={handleChange} />,
                    <ProfileForm formData={formData} handleChange={handleChange} />,
                    <AddressForm formData={formData} handleChange={handleChange} />,
                    <VeterinarianForm
                        formData={formData}
                        handleChange={handleChange}
                        handleEducationChange={handleEducationChange}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                        errors={errors}
                        showErrors={showErrors}
                    />
                ];
            default:
                return [<RoleForm formData={formData} handleChange={handleChange} />];
        }
    };

    const formSteps = getSteps();

    const submitSignUpDetailsForm = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        setShowErrors(true); // ✅ So errors show now

        // Validate veterinarian-specific fields
        if (formData.role === "Veterinarian") {
            formData.education.forEach((entry: any, index: number) => {
                if (!entry.degree.trim()) newErrors[`degree-${index}`] = "Please fill the necessary fields.";
                if (!entry.institution.trim()) newErrors[`institution-${index}`] = "Please fill the necessary fields.";
                if (!entry.year.trim()) newErrors[`year-${index}`] = "Please fill the necessary fields.";
            });

            if (!formData.experience.trim()) {
                newErrors.experience = "Experience is required.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        console.log("Submitted Form", formData);
        // submit logic
    };

    return (
        <div
            className="min-h-screen px-4 bg-cover bg-center flex items-center justify-center transition-all duration-1000"
            style={{
                backgroundImage: `url(${backgroundImages[currentBg]})`
            }}
        >
            <form onSubmit={submitSignUpDetailsForm} className="max-w-md w-full p-6 rounded shadow bg-white/90">
                {formSteps[step]}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 0}
                        type="button"
                        className={clsx(
                            "bg-[var(--color-secondary)] text-white px-4 py-2 rounded",
                            "disabled:opacity-50"
                        )}
                    >
                        Back
                    </button>
                    {step!=0 && step === formSteps.length - 1 ? (
                        <button
                            type="submit"
                            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-80"
                        >
                            Finish
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setStep(step + 1);
                                setShowErrors(false); // ✅ Hide errors while navigating
                            }}
                            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-80"
                        >
                            Next
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SignUpDetails;
