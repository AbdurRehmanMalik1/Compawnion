import { useNavigate } from "react-router";
import { useAppSelector } from "../redux/hooks"
import Spinner from "./Spinner";
import { useEffect } from "react";

const roleList =  ['adopter', 'shelter', 'veterinarian']

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
    const navigate = useNavigate();
    const { isAuthenticated , role } = useAppSelector(state => state.auth);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        // if(!role || !roleList.includes(role.toLowerCase()))
        //     navigate('/signup-details');
    }, [isAuthenticated, navigate]);
    return (
        isAuthenticated ? children : <Spinner size={30} />

    );
}

export default PrivateRoute;