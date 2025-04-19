import React from 'react'

type Props = {}

const Login = (props: Props) => {
    return (
        <div>
            <div className='w-[500px] flex flex-col gap-y-4 items-center'>
                <h1>Compawnion</h1>
                <input placeholder='Email Address' />
                <input placeholder='Password' />
                <div className='flex flex-row justify-between'>
                    <button>Login</button>
                    <div>
                        <input type="checkbox" />
                        <label>Keep me logged in</label>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login