const Login = () => {
    const inputClass: string = 'w-md px-4 py-2 rounded-[8px] shadow-sm outline-none'
    return (
        <div className="flex flex-row h-screen">
            <div className="bg-black hidden md:block lg:w-1/2 md:w-[40%]">
                <img src='/login-cat-background.jpeg' className="w-full h-full object-cover" />
            </div>
            <form className="mt-20 flex flex-col gap-y-16 m-auto py-12">
                <h1 className="text-4xl text-center font-medium mb-10">Compawnion</h1>
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