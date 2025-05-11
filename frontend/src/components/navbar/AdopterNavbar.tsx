import { useCallback, useEffect, useState } from "react";
import React from "react";
import clsx from "clsx";
import NavItem from "./NavItem";
import SideNavItem from './SideNavItem';
import TitleAndIcon from '../TitleAndIcon';

const navItems = [
    {
        name: 'Browse Pets',
        path: '/adopt',
        clickable: true,
    },
    {
        name: 'Chats',
        path: '/chats',
        clickable: true,
    },
    {
        name: 'Appointments',
        path: '/vetappointment',
        clickable: true,
    },
    {
        name: 'Account',
        path: '#',
        clickable: false,
        items: ['Profile', 'Logout'],
    }
];

const AdopterNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
    const [hamburger, toggleHamburger] = useState<boolean>(false);

    const handleDropdownToggle = (name: string) => {
        setIsDropdownOpen(isDropdownOpen === name ? null : name);
    };

    const memoizedSetIsDropDownOpen = useCallback((val: string | null) => setIsDropdownOpen(val), []);
    const memoizedHandleDropdownToggle = useCallback((name: string) => handleDropdownToggle(name), []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                toggleHamburger(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav>
            <ul className={clsx(
                "bg-[var(--color-primary)] text-white flex justify-between",
                "sm:justify-start",
                "flex-row items-center"
            )}>
                <li className="flex flex-row items-center">
                    <TitleAndIcon />
                </li>
                <li onClick={() => toggleHamburger(prev => !prev)} className={clsx(
                    "justify-end inline-block mr-5 text-2xl cursor-pointer pl-9 z-12",
                    "sm:hidden",
                    "hover:opacity-80"
                )}>
                    &#9776;
                </li>

                {hamburger && (
                    <div
                        id="side-nav-items"
                        className={clsx(
                            "fixed top-0 left-0 h-full w-[60%] bg-[var(--color-primary-dark)] text-white shadow-lg transition-transform duration-300 z-10",
                            "translate-x-0",
                            "flex flex-col items-center"
                        )}
                    >
                        <TitleAndIcon />
                        {navItems.map(({ name, items, clickable, path }, index) => (
                            <SideNavItem
                                key={index}
                                name={name}
                                path={path}
                                clickable={clickable}
                                items={items}
                            />
                        ))}
                    </div>
                )}

                {!hamburger && (
                    <ul id="default-nav-items" className={clsx("hidden pl-4 flex-row justify-around items-center flex-grow", "sm:flex")}>
                        {navItems.map(({ name, items, clickable, path }, index) => (
                            <NavItem
                                key={index}
                                name={name}
                                path={path}
                                clickable={clickable}
                                items={items}
                                isDropdownOpen={isDropdownOpen === name}
                                setIsDropdownOpen={memoizedSetIsDropDownOpen}
                                handleDropdownToggle={memoizedHandleDropdownToggle}
                            />
                        ))}
                    </ul>
                )}
            </ul>
        </nav>
    );
};

export default React.memo(AdopterNavbar);
