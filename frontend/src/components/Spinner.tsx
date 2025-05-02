const Spinner = ({
    size = 24,
    theme = 'primary',
}: {
    size?: number;
    theme?: string;
}) => (
    <div
        className="animate-spin rounded-full border-4 border-t-transparent"
        style={{
            width: size,
            height: size,
            borderColor: `var(--color-${theme})`,
            borderTopColor: 'transparent',
        }}
    />
);

export default Spinner;
