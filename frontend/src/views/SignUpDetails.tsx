import React, { useState, useEffect } from "react";
import RoleForm from "../components/signupdetails/RoleForm";
import ProfileForm from "../components/signupdetails/ProfileForm";
import AddressForm from "../components/signupdetails/AddressForm";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router";


const roleList = ['adopter', 'shelter', 'veterinarian']
interface FormData {
    role: string;
    profilePic: File | null;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

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

    const [formData, setFormData] = useState<FormData>({
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { role } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (roleList.includes(role))
            navigate('/adopt')
    }, [navigate, role])

    const submitSignUpDetailsForm = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Form")
        console.log(formData);
    }
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
            className="min-h-screen px-4 bg-cover bg-center flex items-center justify-center transition-all duration-1000"
            style={{
                backgroundImage: `url(${backgroundImages[currentBg]})`,
                objectFit: "cover"
            }}
        >
            <form onSubmit={submitSignUpDetailsForm} className="max-w-md w-full p-6  rounded shadow bg-white/90">
                {formSteps[step]}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 0}
                        type="button"
                        className={clsx(
                            "bg-[var(--color-secondary)] text-white border-none px-4 py-2 border rounded cursor-pointer",
                            "disabled:opacity-50 disabled:cursor-default",
                            "hover:opacity-80"
                        )}
                    >
                        Back
                    </button>
                    {
                        formSteps.length - 1 === step ?
                            <button
                                type="submit"
                                className={clsx(
                                    "bg-[var(--color-primary)] border-none px-4 py-2 text-white rounded cursor-pointer",
                                    "hover:opacity-80"
                                )}
                            >
                                Finish
                            </button>
                            :
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === formSteps.length - 1}
                                type="button"
                                className={clsx(
                                    "bg-[var(--color-primary)] border-none px-4 py-2 text-white rounded cursor-pointer",
                                    "hover:opacity-80"
                                )}
                            >
                                Next
                            </button>
                    }

                </div>
            </form>
        </div>
    );
};

export default SignUpDetails;
