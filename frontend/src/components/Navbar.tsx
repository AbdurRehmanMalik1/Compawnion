import { NavLink } from "react-router";
import '../style/Navbar.css';
import { useState } from "react";
import React from "react";
import NavDropDown from "./NavDropDown";

const navItems = [
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
        items: ['Login', 'Signup'],
    }
];

const ClickableLinkClass = ({ isActive, isDropdownOpen, clickable }: { isActive: boolean, isDropdownOpen: boolean, clickable: boolean }) => {
    return `${isActive || (isDropdownOpen && clickable === false) ? 'bg-[var(--color-primary-dark)]' : ''} border-box px-6 group-hover:bg-[var(--color-primary-dark)] h-[100%] py-[2vh]`;
};

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

    const handleDropdownToggle = (name: string) => {
        setIsDropdownOpen(isDropdownOpen === name ? null : name); // Toggle the dropdown
    };

    return (
        <nav>
            <ul className="bg-[var(--color-primary)] text-white flex flex-row justify-start items-center">
                <li className="flex flex-row items-center">
                    <svg className="w-[64px] h-[45px]" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="14" r="8" fill="#10b981" />
                        <circle cx="44" cy="14" r="8" fill="#10b981" />
                        <circle cx="10" cy="32" r="8" fill="#10b981" />
                        <circle cx="54" cy="32" r="8" fill="#10b981" />
                        <path d="M32 28c-8 0-18 10-18 18 0 4 4 8 10 8h16c6 0 10-4 10-8 0-8-10-18-18-18z" fill="#10b981" />
                    </svg>
                    <label className="text-[var(--color-secondary-light)]">Compawnion</label>
                </li>
                <div className="pl-4 flex flex-row justify-around items-center flex-grow">
                {
                    navItems.map(({ name, items, clickable, path }, index) => (
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
                </div>
                
            </ul>
        </nav>
    );
}

export default React.memo(Navbar);;
