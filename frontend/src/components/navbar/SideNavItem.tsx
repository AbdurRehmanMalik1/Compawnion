import React from "react";
import { NavLink } from "react-router";

interface SideNavItemProps {
    name: string;
    path: string;
    items?: string[]; // Optional items array for sub-navigation
    clickable: boolean;
}

const ClickableLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `${isActive ? 'bg-[var(--color-primary-dark)]' : ''} px-4 py-2 group-hover:bg-[var(--color-primary-dark)]`;
};

const SideNavItem = ({
    name,
    path,
    items,
    clickable,
}: SideNavItemProps) => {
    return (
        <li className="flex flex-col">
            <NavLink
                to={path}
                onClick={(e) => !clickable && e.preventDefault()}
                className={({ isActive }) =>
                    ClickableLinkClass({
                        isActive,
                    })
                }
            >
                {name}
            </NavLink>

            {/* Render the items as a list below the name */}
            {items && (
                <ul className="pl-6 mt-2">
                    {items.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.toLowerCase()}
                                className="text-white hover:opacity-70"
                            >
                                {item}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default React.memo(SideNavItem);
