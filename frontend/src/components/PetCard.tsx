import { Pet } from "../api/pet.api";
import { Link } from "react-router-dom";

interface PetCardProps {
  name: string;
  description: string;
  imageUrl: string;
  pet: Pet;
}

const PetCard = ({ name, description, imageUrl, pet }: PetCardProps) => {
  return (
    <Link to={`/pet/${pet._id}`} className="no-underline text-black">
      <div className="flex flex-col w-full h-[460px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white">
        <div className="h-64 w-full">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col gap-3">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-600 line-clamp-2 text-base">{description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
              {pet.species}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
              {pet.gender}
            </span>
            {pet.breed && (
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
                {pet.breed}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
