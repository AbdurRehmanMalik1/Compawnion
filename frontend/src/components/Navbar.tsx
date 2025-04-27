import { ReactElement } from "react";
import { NavLink } from "react-router";

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
    }, {
        name: 'Login'
    }
];


const NavDropDown = ({ children }: { children: ReactElement }) => {
    return (
        <div className="absolute">
            {
                children
            }
        </div>
    )
}
const Navbar = () => {
    // const DropDown  = useCallback((item-list)=>{
    //     return(

    //     )
    // },[]);
    const navLinkClass = ({ isActive }: { isActive: boolean }) => {
        return `${isActive ? 'bg-[var(--color-primary-dark)] h-[100%] py-[2vh] border-box' : ''} px-6 hover:bg-[var(--color-primary-dark)] hover:h-[100%] hover:py-[2vh]`;
    }

    return (
        <nav>
            <ul className="bg-[var(--color-primary)] text-white flex flex-row h-[8vh] justify-around items-center">
                {
                    navItems.map(({ name, items }, index) => {
                        return (
                            <div className="relative flex flex-col" key={index}>
                                <NavLink to={name.toLowerCase()} className={navLinkClass}>
                                    {name}
                                </NavLink>
                                {
                                    items && <NavDropDown>
                                        {
                                            <>
                                                {

                                                }
                                            </>
                                        }
                                    </NavDropDown>
                                }
                            </div>
                        )
                    })
                }
            </ul>
        </nav>
    )
}


export default Navbar;