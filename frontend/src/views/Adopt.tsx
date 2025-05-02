import { Pet } from "../types/Pet";
import { useAppSelector } from "../redux/hooks";
import PetCard from "../components/PetCard";

const testImageUrl = `
https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBYYFhUjvNhBJ9SwQTv8X3PyQVtd-EejwOMQ&s
`
const testPets: Array<Pet> = [
    new Pet('Jojo', 'Evil Catto trust me', testImageUrl),
    new Pet('Eno', 'Fatto Catto Potato', testImageUrl),
    new Pet('Oreo', 'Red lippy cute nice catto', testImageUrl),
]

const Adopt = () => {
    const adoptDate = useAppSelector(state => state.adopt);
    const pets = adoptDate?.results?.length > 0 ? adoptDate.results : testPets;
    const handleSearchPet = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <div className="mt-10 h-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-y-5">
                <div className="flex flex-col items-center gap-y-7 border-b-1 pb-8 w-[90%] ">
                    <h1 className="text-center bolder text-4xl">Adopt a friend Right Now!</h1>
                    <form onSubmit={handleSearchPet} className="flex items-center rounded-lg border-0 h-10">
                        <input
                            type="text"
                            className="h-full flex-1 border-t border-b border-l rounded-tl-lg rounded-bl-lg px-2 py-1 outline-none"
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
                <div className="flex flex-row justify-center gap-x-5 shadow-md p-6 flex-wrap">
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
    )

}
export default Adopt;