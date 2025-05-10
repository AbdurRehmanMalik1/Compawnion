import React from "react";

interface FormData {
  role: string;
}

interface RoleFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ formData, handleChange }) => {
  const roles = ["Adopter", "Shelter", "Veterinarian"];

  return (
    <div>
      <p className="mb-4 font-medium">Select your role:</p>
      {roles.map((role) => (
        <div key={role} className="mb-2">
          <input
            id={role}
            type="radio"
            name="role"
            value={role}
            checked={formData.role === role}
            onChange={handleChange}
            className="peer hidden"
          />
          <label
            htmlFor={role}
            className="cursor-pointer block px-4 py-2 border rounded-md peer-checked:bg-blue-500 peer-checked:text-white"
          >
            {role}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RoleForm;
