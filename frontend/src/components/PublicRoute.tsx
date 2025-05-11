import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router';

const PublicRoute = ({ children }: { children: React.JSX.Element }) => {
    const navigate = useNavigate();
    const { isAuthenticated, isVerified } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated && !isVerified)
            navigate('/signup/verifyCode');
        else if (isAuthenticated) {
            navigate('/adopt');
        }
    }, [isAuthenticated, navigate]);

    // if (isAuthenticated || !isVerified) return children
    // else if (isAuthenticated) return <Spinner size={30} />;

    return children;
};

export default PublicRoute;
