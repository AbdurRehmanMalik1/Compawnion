import { Pet } from "../types/Pet";
import { useAppSelector } from "../redux/hooks";
import PetCard from "../components/PetCard";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import AdoptCategory from "../components/adopt/AdoptCategory";

const testImageUrl = `
https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBYYFhUjvNhBJ9SwQTv8X3PyQVtd-EejwOMQ&s
`
const testPets: Array<Pet> = [
    new Pet('Jojo', 'Evil Catto trust me', testImageUrl),
    new Pet('Eno', 'Fatto Catto Potato', testImageUrl),
    new Pet('Oreo', 'Red lippy cute nice catto', testImageUrl),
    new Pet('Jojo', 'Evil Catto trust me', testImageUrl),
    new Pet('Eno', 'Fatto Catto Potato', testImageUrl),
    new Pet('Oreo', 'Red lippy cute nice catto', testImageUrl),
]

export type FilterKey = "Species" | "Color" | "Gender" | "Breed";


export interface FilterFormData {
    Species: string;
    Color?: string;
    Gender?: string;
    Breed?: string;
}

export interface FilterCategory {
    options: string[];
    prereqs?: FilterKey[];
}

const filterCategories: Record<FilterKey, FilterCategory> = {
    Species: {
        options: ["Cats", "Dogs", "Others"]
    },
    Color: {
        options: ["Gray", "Black", "White", "Orange"]
    },
    Gender: {
        options: ["Male", "Female", "Others"]
    },
    Breed: {
        options: ["Persian Cat", "African Gray Parrot", "Orange Catto"],
        prereqs: ["Species"]
    }
};




const Adopt = () => {
    const adoptDate = useAppSelector(state => state.adopt);
    const pets = adoptDate?.results?.length > 0 ? adoptDate.results : testPets;
    const handleSearchPet = (e: React.FormEvent) => {
        e.preventDefault();
    }
    const [filterFormData, setFilterFormData] = useState<FilterFormData>({
        Species: "",
        Color: "",
        Gender: "",
        Breed: ""
    });

    const handleFilterChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;

            setFilterFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        },
        []
    );
    console.log(filterFormData);
    return (
        <div className="mt-5 flex flex-col items-center justify-center gap-y-5">
            <div className="flex flex-col items-center gap-y-7 border-b-1 pb-8 w-[90%] ">
                <h1 className="text-center bolder text-4xl">Adopt a friend Right Now!</h1>

            </div>
            <div className={clsx("bg-gray-100 flex flex-col")}>
                <div className="pl-4 flex flex-col items-start gap-y-4 mb-4">
                    <h1 className="font-bold xtext-3xl">Search Filters</h1>
                    <form onSubmit={handleSearchPet} className="flex items-center rounded-lg border-0 h-10">
                        <input
                            type="text"
                            className="h-full flex-1  border-t border-b border-l rounded-tl-lg rounded-bl-lg px-2 py-1 outline-none"
                            placeholder="Search Your Compawnion!"
                        />
                        <button
                            type="submit"
                            className="h-full border-t border-b rounded-tr-lg rounded-br-lg bg-[var(--color-secondary)] text-white px-3 py-1 cursor-pointer hover:bg-[var(--color-secondary-light)]"
                        >
                            Search
                        </button>
                    </form>
                </div>
                <div className={clsx("flex flex-col", "md:items-start md:flex-row")}>
                    <div className={clsx(
                        "flex px-9 flex-col min-w-70",
                        "md:pl-2"
                    )}>
                        {
                            (Object.entries(filterCategories) as [FilterKey, FilterCategory][]).map(
                                ([category, data]) => (
                                    <AdoptCategory
                                        key={category}
                                        category={category}
                                        data={data}
                                        formData={filterFormData}
                                        handleChange={handleFilterChange}
                                    />
                                )
                            )
                        }
                    </div>
                    <div className="flex flex-row justify-center gap-x-5 gap-y-4 flex-wrap">
                        {
                            pets.map(({ name, description, imageUrl }, index) => {
                                return (
                                    <PetCard key={index} name={name} description={description} imageUrl={imageUrl} />
                                )
                            })
                        }
                    </div>
                </div>

            </div>


        </div>
        // </div>
    )

}
export default Adopt;