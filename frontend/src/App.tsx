import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router';
import './App.css';
import Login from './views/Login'
import Signup from './views/Signup'
import Navbar from './components/Navbar'
import Home from './views/Home'
import VerifyCode from './views/VerifyCode'
import Adopt from './views/Adopt'
import PrivateRoute from './components/PrivateRoute'
import { useAppSelector } from './redux/hooks'
import AboutUs from './views/About';
import ContactUs from './views/Contact';
import SignUpDetails from './views/SignUpDetails';


const AppLayout = () => {
  let  isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  isAuthenticated = false;
  return (
    <div className="flex flex-col h-full flex-grow">
      {isAuthenticated ? null : <Navbar />}
      <Outlet />
    </div>
  )
}
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path='about' element={<AboutUs/>}/>
            <Route path='contact' element={<ContactUs/>}/>
            <Route path='signUpDetails' element={<SignUpDetails/>}/>
            <Route path='signup' element={<Outlet />} >
              <Route index element={<Signup />} />
              <Route path='verifyCode' element={<VerifyCode />} />
            </Route>
            <Route path='login' element={<Login />} />
            <Route path='adopt' element={<PrivateRoute><Adopt /></PrivateRoute>}></Route>
          </Route>
          <Route path='error404' element={<div>Error 404 Page Not Found</div>} />
          <Route path='*' element={<div>Error 404 Page Not Found</div>} />
        </Routes>
      </Router>
    </>
  )
}
export default App