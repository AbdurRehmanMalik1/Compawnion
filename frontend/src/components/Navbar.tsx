import { NavLink } from "react-router";
import '../style/Navbar.css';
import { useState } from "react";

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

const NavDropDown = ({ items, isOpen }: { items: Array<string>, isOpen: boolean }) => {
    return (
        <ul className={`w-full text-center absolute ${isOpen ? 'flex' : 'hidden'} rounded-b-xl top-full px-2 pb-2 left-0 bg-[var(--color-primary-dark)] flex-col text-white z-10`}>
            {
                items.map(item => (
                    <NavLink key={item} to={item.toLowerCase()}
                        className={({ isActive }: { isActive: boolean }) => `border-white px-2 py-1 ${isActive ? 'border-b font-bold' : ''}`}>
                        {item}
                    </NavLink>
                ))
            }
        </ul>
    );
}

const ClickableLinkClass = ({ isActive, isDropdownOpen,clickable }: { isActive: boolean, isDropdownOpen: boolean,clickable:boolean}) => {
    return `${isActive || (isDropdownOpen && clickable === false) ? 'bg-[var(--color-primary-dark)]' : ''} border-box px-6 group-hover:bg-[var(--color-primary-dark)] h-[100%] py-[2vh]`;
};

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

    const handleDropdownToggle = (name: string) => {
        setIsDropdownOpen(isDropdownOpen === name ? null : name); // Toggle the dropdown
    };

    return (
        <nav>
            <ul className="bg-[var(--color-primary)] text-white flex flex-row h-[8vh] justify-around items-center">
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
                                className={()=>ClickableLinkClass({ isActive:false, isDropdownOpen: isDropdownOpen === name, clickable })}
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

export default Navbar;
