const Login = () => {
    //hidden md:block lg:w-[60%] md:w-[40%]
    const inputClass: string = "w-lg px-4 py-2 outline-none";
    const inputRow: string = "flex flex-row items-center gap-x-3 border-b pb-2 border-gray-200 focus-within:border-black"
    return (
        <div className="grid lg:grid-cols-[1fr_700px] md:grid-cols-[0px_1fr] h-screen">
            <div className="bg-black">
                <img src="/login-cat-background.jpeg" className="object-cover h-full" />
            </div>
            <form className="mt-20 flex flex-col gap-y-16 m-auto py-12 text-xl">
                <h1 className="text-4xl text-center font-medium mb-10">Compawnion</h1>
                <div className={inputRow}>
                    <img className="w-8" src="data:image/png;base64,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" />
                    <input className={inputClass} type="email" placeholder="Email Address" />
                </div>
                <div className={inputRow}>
                    <img className="w-8" src="data:image/png;base64,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" />
                    <input className={inputClass} type="password" placeholder="Password" />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <button style={{ backgroundColor: '#10b099' }} type="submit"
                        className="text-white cursor-pointer rounded-[40px] font-medium text-xl px-12 py-5">Log in</button>
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