import React from "react";

interface ProfileFormProps {
  formData: {
    profilePic: File | null;
    firstName: string;
    lastName: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  handleChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block mb-1 font-medium">Profile Picture</label>
      <input
        type="file"
        name="profilePic"
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
    </div>

    <div>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="w-full border rounded p-2"
      />
    </div>

    <div>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="w-full border rounded p-2"
      />
    </div>

    <div>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full border rounded p-2"
      />
    </div>
  </div>
);

export default ProfileForm;
