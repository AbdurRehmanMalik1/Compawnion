import clsx from "clsx";
import React from "react";
import { FilterCategory, FilterFormData, FilterKey } from "../../views/Adopt";

interface AdoptCategoryProps {
    category: FilterKey;
    data: FilterCategory;
    formData: FilterFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdoptCategory = React.memo(({
    category,
    data,
    formData,
    handleChange
}: AdoptCategoryProps) => {
    const prereqsMet =
        !data.prereqs ||
        data.prereqs.every((key) => {
            const typedKey = key as keyof FilterFormData;
            return formData[typedKey] && formData[typedKey].length > 0;
        });
    return (
        <div
            key={category}
            className={clsx(
                "flex flex-col border-t-1 border-b-1 border-[rgba(0,0,0,0.2)] py-2",
                "last:border-t-0",
                "peer-checked:bg-[var(--color-primary)]"
            )}

        >
            <h1 className="font-normal text-2xl px-2 pb-2">{category}</h1>
            {!prereqsMet ? (
                <p className="text-sm text-red-500 px-2">
                    Please select {data.prereqs?.join(", ")} first
                </p>
            ) : (
                data.options.map((option) => (
                    <label
                        htmlFor={`${category}-${option}`}
                        key={option}
                        className={clsx(
                            "flex items-center cursor-pointer px-2 py-2 rounded-md text-[rgba(0,0,0,0.8)] ",
                            "hover:opacity-80",
                            formData[category as keyof FilterFormData] === option ? "bg-[var(--color-secondary)]" : ''
                        )}
                    >
                        <input
                            id={`${category}-${option}`}
                            type="radio"
                            className="peer hidden"
                            onChange={handleChange}
                            value={option}
                            name={category}
                        />
                        <span className={clsx(
                            "ml-2",
                            "peer-checked:font-bold"
                        )} >
                            {option}
                        </span>
                    </label>
                ))
            )}
        </div>
    );
});


export default AdoptCategory;