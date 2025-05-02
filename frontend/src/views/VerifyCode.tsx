import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const testUser = {
    name: 'bro',
    email: 'bro@gmail.com',
    password: '1234'
}

const VerifyCode = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string>('');
    const location = useLocation() || null;
    // useEffect(() => {
    //     if (!location?.state) navigate('/error404');
    // }, [location, navigate]);

    const { name, email, password } = location?.state ?? testUser;

    const backgroundUrl = `https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D`
    const removeUpDownArrow: string = `appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

    const submitVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(code);
    }

    return (
        name &&
        <div style={{
            backgroundImage: `url('${backgroundUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }} className="flex flex-row justify-center h-[92vh] items-center">
            <div className="bg-black/70 text-white flex flex-col items-center px-8 py-8 shadow-sm gap-y-5 rounded-lg">
                <h2 className="text-[var(--color-primary)] text-center text-2xl font-bold">Code Verification</h2>
                <p className="mb-10">Email was sent to <span className="text-[var(--color-secondary)] underline">{email}</span></p>
                <form onSubmit={submitVerifyCode} className="flex flex-row gap-x-3">
                    <input value={code} onChange={e => setCode(e.target.value)} type="number" className={`${removeUpDownArrow} px-2 py-2 outline-none border-1 rounded-md`} name="code" placeholder="Enter Verification Code" />
                    <button onClick={()=>{}} type="button" className="hover:opacity-80 border-none cursor-pointer rounded-lg align-center px-4 py-1 bg-[var(--color-secondary)]">Verify</button>
                </form>
                <a className="text-[var(--color-secondary)] border-b-1 cursor-pointer hover:opacity-90">Resend Email</a>
            </div>
        </div>
    )
}

export default VerifyCode;