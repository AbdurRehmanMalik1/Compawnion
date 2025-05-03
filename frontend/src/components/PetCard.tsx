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
            <img className="w-[100%]" src={imageUrl} alt={name} />
            <div className="pl-2 pb-4">
                <h2 className="text-[var(--color-primary)] text-3xl">{name}</h2>
                <p>{description}</p>
            </div>

            {/* <button type="button" className="focus:outline-none self-center text-white mt-4 bg-[var(--color-secondary)] rounded-md px-4 py-1 cursor-pointer hover:bg-[var(--color-secondary-light)]">Adopt</button> */}
        </div>
    );
};

export default PetCard;