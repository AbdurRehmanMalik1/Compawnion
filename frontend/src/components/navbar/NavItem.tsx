
import { NavLink } from "react-router";
import NavDropDown from "./NavDropDown";
import React from "react";

interface NavItemProps {
    name: string;
    path: string;
    items?: string[];
    clickable: boolean;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (name: string | null) => void;
    handleDropdownToggle: (name: string) => void;
    isActive?: boolean;
}

const ClickableLinkClass = ({ isActive, isDropdownOpen, clickable }: { isActive: boolean, isDropdownOpen: boolean, clickable: boolean }) => {
    return `${isActive || (isDropdownOpen && clickable === false) ? 'bg-[var(--color-primary-dark)]' : ''} border-box px-6 group-hover:bg-[var(--color-primary-dark)] h-[100%] py-[2vh]`;
};


const NavItem = ({
    name,
    path,
    items,
    clickable,
    isDropdownOpen,
    setIsDropdownOpen,
    handleDropdownToggle,
}: NavItemProps) => {
    return (
        <li
            className="group relative flex flex-col"
            onMouseEnter={() => setIsDropdownOpen(name)}
            onMouseLeave={() => setIsDropdownOpen(null)}
            onClick={() => handleDropdownToggle(name)}
        >
            <NavLink
                onClick={(e) => !clickable && e.preventDefault()}
                to={path}
                className={() =>
                    ClickableLinkClass({
                        isActive: false,
                        isDropdownOpen,
                        clickable,
                    })
                }
            >
                {name}
            </NavLink>
            {
                items && (
                    <NavDropDown items={items} isOpen={isDropdownOpen} />
                )
            }
        </li>
    );
};

export default React.memo(NavItem);
