import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser } from '../redux/slices/authSlice';
import { useEffect } from 'react';

const LogoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { name, isAuthenticated } = useAppSelector(state => state.auth);
    const handleLogout = async () => {
        console.log("Logging out...");
        dispatch(logoutUser());
    };
    useEffect(() => {
        if (!isAuthenticated)
            navigate('/login');
    }, [navigate, isAuthenticated])
    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/pet7.jpg')" }}
        >
            <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-6">{name}, are you sure you want to log out?</h1>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-2xl shadow transition duration-300"
                >
                    Confirm Logout
                </button>
            </div>
        </div>
    );
};

export default LogoutPage;
