const TitleAndIcon = () => {
    const pawColor = "#1defa9";
    return (
        <><svg className="w-[64px] h-[45px]" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="14" r="8" fill={pawColor} />
            <circle cx="44" cy="14" r="8" fill={pawColor} />
            <circle cx="10" cy="32" r="8" fill={pawColor} />
            <circle cx="54" cy="32" r="8" fill={pawColor} />
            <path d="M32 28c-8 0-18 10-18 18 0 4 4 8 10 8h16c6 0 10-4 10-8 0-8-10-18-18-18z" fill={pawColor} />
        </svg>
            <label className="text-[var(--color-secondary-light)]">Compawnion</label></>
    )
}

export default TitleAndIcon;