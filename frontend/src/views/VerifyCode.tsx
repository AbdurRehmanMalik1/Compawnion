import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import clsx from "clsx";
import Spinner from "../components/Spinner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { verifyOTP } from "../redux/slices/authSlice";

const testUser = {
    name: 'Abdur Rehman Malik',
    email: 'abdurrehman4415@gmail.com',
    password: '123456'
}

const VerifyCode = () => {
    

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isVerified ,isAuthenticated ,name,email} = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [location, navigate]);

    useEffect(() => {
        if (isVerified && isAuthenticated) {
            navigate("/adopt");
        }
    }, [isVerified, navigate]);

    const [code, setCode] = useState<string>('');

    const backgroundUrl = `https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D`
    const removeUpDownArrow: string = `appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

    const submitVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        //Sending otp: code
        const resultAction = await dispatch(verifyOTP(code));

        if (verifyOTP.fulfilled.match(resultAction)) {
            navigate('/login', { state: { email } });
        }
    }

    return (
        name &&

        <div style={{
            backgroundImage: `url('${backgroundUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: "center",
            backgroundRepeat: 'no-repeat'
        }} className="flex flex-row justify-center items-center flex-grow h-[92vh]">
            <div className="bg-black/70 text-white flex flex-col items-center px-8 py-8 shadow-sm gap-y-5 rounded-lg">
                <h2 className="text-[var(--color-primary)] text-center text-2xl font-bold">Code Verification</h2>
                <p className="mb-10">Email was sent to <span className="text-[var(--color-secondary)] underline">{email}</span></p>
                <form onSubmit={submitVerifyCode} className="flex flex-row gap-x-3">
                    <input value={code} onChange={e => setCode(e.target.value)} type="number" className={`${removeUpDownArrow} px-2 py-2 outline-none border-1 rounded-md`} name="code" placeholder="Enter Verification Code" />
                    <button type="submit" disabled={loading} className={clsx('hover:opacity-80 border-none rounded-lg align-center px-4 py-1 bg-[var(--color-secondary)]', loading ? 'opacity-80 cursor-normal' : 'cursor-pointer')}>Verify</button>
                </form>
                {
                    error &&
                    <div className="flex flex-row items-center justify-center text-[var(--color-error-red)] ">
                        <label>{error}</label>
                    </div>
                }
                <a className="text-[var(--color-secondary)] border-b-1 cursor-pointer hover:opacity-90">Resend Email</a>
                <div className="h-[8px]">
                    {

                        loading &&
                        <Spinner size={24} />
                    }
                </div>

            </div>
        </div>

    )
}

export default VerifyCode;