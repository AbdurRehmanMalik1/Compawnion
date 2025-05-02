import { NavLink } from "react-router";
import { useState } from "react";
import React from "react";
import NavDropDown from "./NavDropDown";
const navItemsLoggedIn = [
    {
        name: 'Home',
        path: '/',
        clickable: true,
    },
    {
        name: 'About',
        path: '/about',
        clickable: true,
    },
    {
        name: 'Contact',
        path: '/contact',
        clickable: true,
    },
    {
        name: 'Account',
        path: '#',
        clickable: false,
        items: ['Profile', 'Logout'],
    }
];

const ClickableLinkClass = ({ isActive, isDropdownOpen, clickable }: { isActive: boolean, isDropdownOpen: boolean, clickable: boolean }) => {
    return `${isActive || (isDropdownOpen && clickable === false) ? 'bg-[var(--color-primary-dark)]' : ''} border-box px-6 group-hover:bg-[var(--color-primary-dark)] h-[100%] py-[2vh]`;
};


const NavbarLoggedIn = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

    const handleDropdownToggle = (name: string) => {
        setIsDropdownOpen(isDropdownOpen === name ? null : name); // Toggle the dropdown
    };

    return (
        <nav>
            <ul className="bg-[var(--color-primary)] text-white flex flex-row h-[8vh] justify-around items-center">
                {
                    navItemsLoggedIn.map(({ name, items, clickable, path }, index) => (
                        <li
                            key={index}
                            className="group relative flex flex-col"
                            onMouseEnter={() => setIsDropdownOpen(name)} // Show on hover for desktop
                            onMouseLeave={() => setIsDropdownOpen(null)} // Hide on hover out for desktop
                            onClick={() => handleDropdownToggle(name)} // Toggle on click for mobile
                        >
                            <NavLink
                                onClick={(e) => !clickable && e.preventDefault()} // Prevent navigation for non-clickable links
                                to={path}
                                className={() => ClickableLinkClass({ isActive: false, isDropdownOpen: isDropdownOpen === name, clickable })}
                            >
                                {name}
                            </NavLink>

                            {items && (
                                <NavDropDown
                                    items={items}
                                    isOpen={isDropdownOpen === name}
                                />
                            )}
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
}

export default React.memo(NavbarLoggedIn);
