import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router";

const NavDropDown = ({ items, isOpen }: { items: Array<string>, isOpen: boolean }) => {
    return (
        <ul
            className={clsx(
                'w-full text-center rounded-b-xl top-full pb-2 left-0 bg-[var(--color-primary-dark)] flex-col text-white z-10',
                isOpen ? 'flex' : 'hidden',
                "static sm:absolute pl-10 sm:px-2 "
            )}
        >
            {
                items.map(item => (
                    <NavLink key={item} to={item.toLowerCase()}
                        className={({ isActive }: { isActive: boolean }) => `border-white px-2 py-1 ${isActive ? 'border-b font-bold' : ''} hover:opacity-70`}>
                        {item}
                    </NavLink>
                ))
            }
        </ul>
    );
}


export default React.memo(NavDropDown);