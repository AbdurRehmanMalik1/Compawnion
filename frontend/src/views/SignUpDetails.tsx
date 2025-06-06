import React, { useState, useEffect } from "react";
import RoleForm from "../components/signupdetails/RoleForm";
import ProfileForm from "../components/signupdetails/ProfileForm";
import AddressForm from "../components/signupdetails/AddressForm";
import ShelterForm from "../components/signupdetails/ShelterForm";
import VeterinarianForm from "../components/signupdetails/VeterinarianForm";
import clsx from "clsx";
import { registerUserRole } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router";

const getInitialFormData = (role: string) => {
    const base = {
        role,
        profilePic: null,
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    };

    if (role === "Veterinarian") {
        return {
            ...base,
            clinicName: "",
            specialization: "",
            experience: "",
            education: [{ degree: "", institution: "", year: "" }]
        };
    } else if (role === "Shelter") {
        return {
            ...base,
            shelterName: "",
            description: "",
            logo: "",
            adoptionPolicy: "",
            location: {
                type: "Point",
                coordinates: [-73.935242, 40.73061]
            },
        };
    }
    // Adopter only needs base fields
    return base;
};

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

        // Veterinarian-specific
        clinicName: "",
        specialization: "",
        experience: "",
        education: [{ degree: "", institution: "", year: "" }],

        // Shelter-specific
        location: {
            type: "Point",
            coordinates: [-73.935242, 40.73061]
        },
        shelterName: "",
        description: "",
        logo: "",
        coverImage: "",
        adoptionPolicy: ""
    });


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === "role") {
            setFormData(getInitialFormData(value));
            setStep(1); // jump to next step after selecting role
            setErrors({});
            setShowErrors(false);
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: files ? files[0] : value
            }));
        }
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
                return [
                    <RoleForm formData={formData} handleChange={handleChange} />,
                    <ProfileForm formData={formData} handleChange={handleChange} />,
                    <AddressForm formData={formData} handleChange={handleChange} />
                ];
            case "Shelter":
                return [
                    <RoleForm formData={formData} handleChange={handleChange} />,
                    <ProfileForm formData={formData} handleChange={handleChange} />,
                    <AddressForm formData={formData} handleChange={handleChange} />,
                    <ShelterForm
                        formData={formData}
                        handleChange={handleChange}
                        errors={errors}
                        showErrors={showErrors}
                    />
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
    const dispatch = useAppDispatch();

    const submitSignUpDetailsForm = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        setShowErrors(true);

        // Validate role-specific fields
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

        if (formData.role === "Shelter") {
            if (!formData.shelterName.trim()) newErrors.shelterName = "Shelter name is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // Structure the payload
        const commonData = {
            profilePic: formData.profilePic,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                country: formData.country
            }
        };

        let roleData: any = {};

        if (formData.role === "Veterinarian") {
            roleData = {
                clinicName: formData.clinicName,
                specialization: formData.specialization,
                experience: formData.experience,
                education: formData.education
            };
        } else if (formData.role === "Shelter") {
            roleData = {
                shelterName: formData.shelterName,
                description: formData.description,
                logo: formData.logo,
                coverImage: formData.coverImage,
                adoptionPolicy: formData.adoptionPolicy,
                address: `${formData.street}`,
                location: {
                    type: "Point",
                    coordinates: [
                        -73.935242,
                        40.73061
                    ]
                },
            };
        }
        console.log(formData.role.toLowerCase());
        const payload = {
            ...commonData,
            // address:`${formData.street}`,
            role: formData.role.toLowerCase(),
            roleData
        };

        console.log("Submitted Payload:", payload);
        dispatch(registerUserRole(payload));
    };
    const navigate = useNavigate();
    const {role} = useAppSelector(state=>state.auth);
    useEffect(()=>{
        if(role)
            navigate('/adopt');
    },[navigate , role])
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
                    {step !== 0 && step === formSteps.length - 1 ? (
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
