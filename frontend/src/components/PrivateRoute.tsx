import { useNavigate } from "react-router";
import { useAppSelector } from "../redux/hooks"

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    if (!isAuthenticated)
        navigate('/');

    return (
        children
    );
}

export default PrivateRoute;