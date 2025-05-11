import React from "react";

interface CategoryOption {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  title: string;
  options: CategoryOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-center">
      <span className="font-semibold mb-2 text-lg text-gray-700 drop-shadow">
        {title}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-5 py-2 rounded-full border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300
              ${
                selectedValue === option.value
                  ? "bg-gradient-to-r from-pink-400 to-blue-400 text-white border-transparent scale-105 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-pink-100 hover:text-pink-700"
              }
            `}
            onClick={() => onSelect(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
