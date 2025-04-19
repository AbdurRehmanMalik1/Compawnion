import axios from "axios";
import { useEffect } from "react";
import { apiUrl } from "../config";

const Login = () => {
    const inputClass: string = 'w-100 px-4 py-2 rounded-[8px] shadow-sm outline-none';


    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                console.log(response.data);
            }).catch(err => {
                console.error(err);
            })
    }, [])

    return (
        <div className="flex flex-row h-screen">
            <div style={{ background: 'black', width: '50%' }}>
            </div>
            <form className="mt-20 flex flex-col gap-y-20 m-auto">
                <h1 className="text-4xl text-center font-medium">Compawnion</h1>
                <input className={inputClass} type="email" placeholder='Email Address' />
                <input className={inputClass} type="password" placeholder='Password' />
                <div className="flex flex-row justify-between items-center">
                    <button type="submit" className="bg-red-100 rounded-[8px] px-6 py-2">Login</button>
                    <div className="flex gap-x-2">
                        <input id="keepLogin" name="keepLogin" type="checkbox" />
                        <label htmlFor="keepLogin">Keep me logged in</label>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default Login