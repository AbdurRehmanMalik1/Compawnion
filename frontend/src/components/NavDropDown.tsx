import { NavLink } from "react-router";

const NavDropDown = ({ items, isOpen }: { items: Array<string>, isOpen: boolean }) => {
    return (
        <ul className={`w-full text-center absolute ${isOpen ? 'flex' : 'hidden'} rounded-b-xl top-full px-2 pb-2 left-0 bg-[var(--color-primary-dark)] flex-col text-white z-10`}>
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


export default NavDropDown;