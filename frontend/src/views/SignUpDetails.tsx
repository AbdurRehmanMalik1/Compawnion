import React, { useState, useEffect } from "react";
import RoleForm from "../components/RoleForm";
import ProfileForm from "../components/ProfileForm";
import AddressForm from "../components/AddressForm";

const SignUpDetails: React.FC = () => {
    const [step, setStep] = useState(0);
    const [currentBg, setCurrentBg] = useState(0);

    const backgroundImages = [
        "/pet21.png",
        "/pet22.png",
        "/pet23.png",
        "/pet24.png"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [formData, setFormData] = useState({
        role: "",
        profilePic: null,
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const formSteps = [
        <RoleForm formData={formData} handleChange={handleChange} />,
        <ProfileForm formData={formData} handleChange={handleChange} />,
        <AddressForm formData={formData} handleChange={handleChange} />,
    ];

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center transition-all duration-1000"
            style={{
                backgroundImage: `url(${backgroundImages[currentBg]})`,
            }}
        >
            <div className="max-w-md w-full p-6 rounded shadow bg-white/30">
                {formSteps[step]}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 0}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={step === formSteps.length - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpDetails;
