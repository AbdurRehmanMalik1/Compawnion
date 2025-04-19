type Props = {}

const Login = (props: Props) => {
    const inputClass : string = 'w-80 px-4 py-2 rounded-[8px] shadow-sm outline-none';
    return (
        <div className="flex flex-col">
            <div className='mt-20 flex flex-col gap-y-10 m-auto'>
                <h1 className="text-4xl text-center font-medium">Compawnion</h1>
                <input className={inputClass} placeholder='Email Address' />
                <input className={inputClass} placeholder='Password' />
                <div className='flex flex-row justify-between items-center'>
                    <button className="bg-red-100 rounded-[8px] px-6 py-2">Login</button>
                    <div className="flex gap-x-2">
                        <input type='checkbox' />
                        <label>Keep me logged in</label>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login