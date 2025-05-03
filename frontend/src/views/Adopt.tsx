import { Pet } from "../types/Pet";
import { useAppSelector } from "../redux/hooks";
import PetCard from "../components/PetCard";
import clsx from "clsx";

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

const filterCategories = {
    Species: ["Cats", "Dogs", "Others"],
    Color: ["Gray", "Black", "White", "Orange"],
    Gender: ["Male" , "Female" , "Others"] 

}


const AdoptCategory = ({ category, options }: { category: any, options: string[] }) => {
    return (
        <div key={category} className={clsx("flex flex-col border-t-1 border-b-1 border-[rgba(0,0,0,0.2)] py-2", "last:border-t-0")}>
            <h1 className="font-normal text-2xl px-2 pb-2">{category}</h1>
            {
                options.map(option => {
                    return (
                        <label className={
                            clsx("text-[rgba(0,0,0,0.8)] cursor-pointer rounded-md border-box py-2 px-2", "hover:bg-gray-300")}>{option}
                        </label>
                    )
                })
            }
        </div>
    )
}


const Adopt = () => {
    const adoptDate = useAppSelector(state => state.adopt);
    const pets = adoptDate?.results?.length > 0 ? adoptDate.results : testPets;
    const handleSearchPet = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        // <div className="mt-10 h-full flex flex-col justify-center items-start">
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
                <div className={clsx("flex flex-col", "md:flex-row")}>
                    <div className="flex pl-2 flex-col min-w-70">
                        {
                            Object.entries(filterCategories).map(([category, options]) =>
                                <AdoptCategory category={category} options={options} />
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