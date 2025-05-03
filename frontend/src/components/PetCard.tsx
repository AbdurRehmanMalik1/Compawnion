import clsx from "clsx";

interface PetCardProps {
    name: string;
    description: string;
    imageUrl: string;
}

const PetCard: React.FC<PetCardProps> = ({ name, description, imageUrl }) => {
    return (
        <div className={
            clsx("cursor-pointer gap-y-2 bg-white border border-[rgba(0,0,0,0.17)] rounded-lg py-0 box-border flex flex-col items-start",
                "hover:shadow-lg hover:translate-y-1 transition-transform duration-100"
            )
        }>
            <img className="w-[100%] rounded-tl-inherit" src={imageUrl} alt={name} />
            <div className="pl-2 pb-4">
                <h2 className="text-[var(--color-primary)] text-3xl">{name}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default PetCard;