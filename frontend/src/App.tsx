import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router';
import './App.css';
import Login from './views/Login'
import Signup from './views/Signup'
import Navbar from './components/navbar/Navbar'
import Home from './views/Home'
import VerifyCode from './views/VerifyCode'
import Adopt from './views/Adopt'
import PrivateRoute from './components/PrivateRoute'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import AboutUs from './views/About';
import ContactUs from './views/Contact';
import SignUpDetails from './views/SignUpDetails';
import PublicRoute from './components/PublicRoute';
import Forum from './views/CommunityForum';
import ChatList from './views/ChatPage';
import LiveStreamPage from './views/LiveStream';
import PetForm from './views/AddPet';
import { useEffect } from 'react';
import { autoLogin } from './redux/slices/authSlice';
import AdopterNavbar from './components/navbar/AdopterNavbar';
import LogoutPage from './views/Logout';




const AppLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch<any>(autoLogin());
  }, [dispatch]);

  const { isAuthenticated, name, role } = useAppSelector(state => state.auth);

  console.log(name)
  return (
    <div className="flex flex-col h-full flex-grow">
      {!isAuthenticated ? <Navbar /> : !role || role.toLowerCase() === 'adopter'.toLowerCase() ? <AdopterNavbar /> : null}
      {/* <Navbar /> */}
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<AboutUs />} />
            <Route path='contact' element={<ContactUs />} />
            <Route path='signup-details' element={<SignUpDetails />} />
            <Route path='forum' element={<Forum />} />
            <Route path='chats' element={<ChatList />} />
            <Route path='livestream' element={<LiveStreamPage />} />
            <Route path='add-pet' element={<PetForm />} />
            <Route path='logout' element={<PrivateRoute><LogoutPage /></PrivateRoute>} />
            <Route path='signup' element={<PublicRoute><Outlet /></PublicRoute>} >
              <Route index element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path='verifyCode' element={<VerifyCode />} />
            </Route>
            <Route path='login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='adopt' element={<PrivateRoute><Adopt /></PrivateRoute>}></Route>
          </Route>
          <Route path="error404" element={<div>Error 404 Page Not Found</div>} />
          <Route path="*" element={<div>Error 404 Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
