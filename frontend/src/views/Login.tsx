import { useState } from "react";
import { Link, NavLink } from "react-router";

interface LoginForm {
    email: string,
    password: string
}
const Login = () => {
    //hidden md:block lg:w-[60%] md:w-[40%]
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });
    const inputRow: string = "flex relative items-center border-b pb-2 border-gray-200 focus-within:border-black";
    const inputClass: string = "w-md px-4 py-2 outline-none flex-grow";
    const LinkStyle: string = "no-underline text-inherit";
    const PageButton: string = `${LinkStyle} text-end bg-[var(--color-primary)] rounded-bl-xl rounded-tl-xl px-3 py-1`;
    const ActivePageButton: string = `${LinkStyle} text-end bg-[var(--color-secondary)] rounded-bl-xl rounded-tl-xl px-3 py-1`;
    const inputIcon: string = "w-4 sm:w-6";
    const CenterLeftPageButton: string = `${LinkStyle} w-20 bg-[var(--color-primary)] rounded-bl-xl rounded-tl-xl px-5 py-3`;
    const CenterLeftActivePageButton: string = `${LinkStyle} w-20  bg-[var(--color-secondary)] rounded-bl-xl rounded-tl-xl px-5 py-3`;
    const CenterRightPageButton: string = `${LinkStyle} w-20 bg-[var(--color-primary)] rounded-br-xl rounded-tr-xl px-5 py-3`;
    const CenterRightActivePageButton: string = `${LinkStyle} w-20 bg-[var(--color-secondary)] rounded-br-xl rounded-tr-xl px-5 py-3`;


    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { email, password } = formData;
        console.log(email);
        console.log(password);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const togglePageButtonClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? ActivePageButton : PageButton;
    const toggleCenterLeftPageButtonClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? CenterLeftActivePageButton : CenterLeftPageButton;
    const toggleCenterRightPageButtonClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? CenterRightActivePageButton : CenterRightPageButton;
    console.log(formData);
    return (
        <div className="flex justify-center md:grid md:grid-cols-[1fr_600px]">
            <div className="bg-black hidden md:flex md:flex-row relative">
                <img src="/login-cat-background.jpeg" className="object-cover w-full h-[92vh]" />
                <div className="absolute top-[15%] right-0 text-white hidden sm:flex flex-col items-end gap-y-2 items-stretch">
                    <NavLink to={'/login'} className={togglePageButtonClass}>Login</NavLink>
                    <NavLink to={'/signup'} className={togglePageButtonClass}>Signup</NavLink>
                </div>
            </div>
            <form onSubmit={submitForm} className="relative box-border sm:px-0 w-[80%] sm:w-[60%] flex flex-col gap-y-8 md:gap-y-14 m-auto mt-5 text-sm sm:text-2sm ">
                <h1 className="text-3xl md:text-4xl text-center font-medium mt-10 mb-8">Compawnion</h1>
                <div className="text-white flex flex-row md:hidden justify-center">
                    <NavLink to={'/login'} className={toggleCenterLeftPageButtonClass}>Login</NavLink>
                    <NavLink to={'/signup'} className={toggleCenterRightPageButtonClass}>Signup</NavLink>
                </div>
                <div className={inputRow}>
                    <img className={inputIcon} style={{backgroundColor:'inherit'}} src="email_icon.jpg"/>
                    <input name="email" onChange={handleChange} className={inputClass} type="email" placeholder="Email Address" />
                </div>
                <div className={inputRow}>
                    <img className={inputIcon} src="password_icon.png" />
                    <input name="password" onChange={handleChange} className={inputClass} type="password" placeholder="Password" />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <Link to={'/forgotpassword'} className={LinkStyle}>
                        <label className="cursor-pointer text-blue-800 block text-center">Forgot Password?</label>
                    </Link>
                    <div className="flex gap-x-2 cursor-pointer">
                        <input className="cursor-pointer" id="keepLogin" name="keepLogin" type="checkbox" />
                        <label className="cursor-pointer" htmlFor="keepLogin">Keep me logged in</label>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <button type="submit"
                        className="bg-[var(--color-primary)] text-white cursor-pointer rounded-[40px] font-medium px-6 py-2 sm:px-10 sm:py-3">Log in
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login