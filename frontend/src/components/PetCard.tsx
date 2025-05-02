
interface PetCardProps {
    name: string;
    description: string;
    imageUrl: string;
}

const PetCard: React.FC<PetCardProps> = ({ name, description, imageUrl }) => {
    return (
        <div className="py-0 border-box flex flex-col items-start"  >
            <img className="w-[100%]" src={imageUrl} alt={name} />
            <h2 className="text-[var(--color-primary)] text-3xl">{name}</h2>
            <p>{description}</p>
            <button type="button" className="focus:outline-none self-center text-white mt-4 bg-[var(--color-secondary)] rounded-md px-4 py-1 cursor-pointer hover:bg-[var(--color-secondary-light)]">Adopt</button>
        </div>
    );
};

export default PetCard;