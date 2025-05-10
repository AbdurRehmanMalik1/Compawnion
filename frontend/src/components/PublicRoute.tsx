import { useEffect } from 'react';
import Spinner from './Spinner'; // Assuming you have a Spinner component
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router';

const PublicRoute = ({ children }: { children: React.JSX.Element }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/adopt');
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) return <Spinner size={30} />;

    return children;
};

export default PublicRoute;
