import { NavLink } from "react-router";
import '../style/Navbar.css';

const navItems = [
    {
        name: 'Home'
    }, {
        name: 'About'
    }, {
        name: 'Contact'
    }, {
        name: 'Account',
        items: ['Login', 'Signup']
    }
];


const NavDropDown = ({ items }: { items: Array<string> }) => {
    return (
        <ul className="w-full text-center absolute hidden rounded-b-xl top-full px-2 
        pb-2 left-0 bg-[var(--color-primary-dark)] group-hover:flex flex-col text-white
        z-10
        ">
            {
                items.map(item =>
                    <NavLink key={item} to={item.toLowerCase()}
                        className={({ isActive }: { isActive: boolean }) => `border-white px-2 py-1 ${isActive ? 'border-b font-bold' : ''}`}
                    >
                        {item}</NavLink>
                )
            }
        </ul>
    )
}
const Navbar = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) => {
        return `${isActive ? 'bg-[var(--color-primary-dark)]' : ''} border-box px-6 group-hover:bg-[var(--color-primary-dark)] h-[100%] py-[2vh]`;
    }

    return (
        <nav>
            <ul className="bg-[var(--color-primary)] text-white flex flex-row h-[8vh] justify-around items-center">
                {
                    navItems.map(({ name, items }, index) =>
                        <li className="group relative flex flex-col" key={index}>
                            <NavLink to={name.toLowerCase()} className={navLinkClass}>
                                {name}
                            </NavLink>
                            {items && <NavDropDown items={items} />}
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}


export default Navbar;