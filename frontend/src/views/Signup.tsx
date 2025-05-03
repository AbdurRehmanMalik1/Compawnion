import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { apiServer } from "../apiconfig";
import { getAxiosErrorData } from "../utility";

interface SignupForm {
    name: string,
    email: string,
    password: string
}
const Signup = () => {

    const inputRow: string = "flex relative items-center border-b pb-2 border-gray-200 focus-within:border-black";
    const inputClass: string = "w-md px-4 py-2 outline-none flex-grow bg-white  ";
    const LinkStyle: string = "no-underline text-inherit";
    const lowerOpacityHover = 'hover:opacity-80';
    const PageButton: string = `${LinkStyle} text-end bg-[var(--color-primary)] rounded-bl-xl rounded-tl-xl px-3 py-1 ${lowerOpacityHover}`;
    const ActivePageButton: string = `${LinkStyle} text-end bg-[var(--color-secondary)] rounded-bl-xl rounded-tl-xl px-3 py-1 ${lowerOpacityHover}`;
    const inputIcon: string = "w-4 sm:w-6";
    const CenterLeftPageButton: string = `${LinkStyle} w-20 bg-[var(--color-primary)] rounded-bl-xl rounded-tl-xl px-5 py-3 ${lowerOpacityHover}`;
    const CenterLeftActivePageButton: string = `${LinkStyle} w-20  bg-[var(--color-secondary)] rounded-bl-xl rounded-tl-xl px-5 py-3 ${lowerOpacityHover}`;
    const CenterRightPageButton: string = `${LinkStyle} w-20 bg-[var(--color-primary)] rounded-br-xl rounded-tr-xl px-5 py-3 ${lowerOpacityHover}`;
    const CenterRightActivePageButton: string = `${LinkStyle} w-20 bg-[var(--color-secondary)] rounded-br-xl rounded-tr-xl px-5 py-3 ${lowerOpacityHover}`;

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignupForm>({
        name: '',
        email: '',
        password: '',
    });
    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { name, email, password } = formData;
        setLoading(true);
        apiServer.post('/signup', { name, email, password })
            .then((_res) => {
                //const data = res.data;
                setError('');
                setLoading(false);
                navigate('verifyCode', { state: { name, email, password } });
            }).catch(err => {
                setLoading(false);
                const data = getAxiosErrorData(err);
                if (data.error)
                    setError(data.error?.message);
                else
                    setError('Unknown Error');
            })
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

    return (
        <div className="flex justify-center md:grid md:grid-cols-[1fr_600px] h-[80vh]">
            <div className="bg-black hidden md:flex md:flex-row relative">
                <img src="/login-cat-background.jpeg" className="object-cover w-full h-[92vh]" />
                <div className="absolute top-[15%] right-0 text-white hidden sm:flex flex-col items-end gap-y-2 items-stretch">
                    <NavLink to={'/login'} className={togglePageButtonClass}>Login</NavLink>
                    <NavLink to={'/signup'} className={togglePageButtonClass}>Signup</NavLink>
                </div>
            </div>
            <form onSubmit={submitForm} className="relative box-border sm:px-0 w-[80%] sm:w-[60%] flex flex-col gap-y-8 md:gap-y-10 m-auto mt-5 text-sm sm:text-2sm ">
                <h1 className="text-3xl md:text-4xl text-center font-medium mt-10 mb-8">Compawnion</h1>
                <div className="text-white flex flex-row md:hidden justify-center">
                    <NavLink to={'/login'} className={toggleCenterLeftPageButtonClass}>Login</NavLink>
                    <NavLink to={'/signup'} className={toggleCenterRightPageButtonClass}>Signup</NavLink>
                </div>
                <div className={inputRow}>
                    <img className={inputIcon} src="username_icon.png" />
                    <input name="name" onChange={handleChange} className={inputClass} type="text" placeholder="Username" />
                </div>
                <div className={inputRow}>
                    <img className={inputIcon} src="email_icon.jpg" />
                    <input name="email" onChange={handleChange} className={inputClass} type="email" placeholder="Email Address" />
                </div>
                <div className={inputRow}>
                    <img className={inputIcon} src="password_icon.png" />
                    <input name="password" onChange={handleChange} className={inputClass} type="password" placeholder="Password" />
                </div>
                {
                    error &&
                    <div className="flex flex-row items-center justify-center text-[var(--color-error-red)] mt-[-10px] mb-[-10px]">
                        <img width={30} className="inputIcon" src="/error_warning_icon.jpg" />
                        <label>{error}</label>
                    </div>
                }
                <div className="flex flex-row justify-center items-center mt-0">
                    <button disabled={loading} type="submit"
                        className={`bg-[var(--color-primary)] text-white ${!loading ? 'cursor-pointer' : ''} rounded-[40px] font-medium px-6 py-2 sm:px-10 sm:py-3 ${loading ? `opacity-80` : ''}`}>Sign Up
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Signup