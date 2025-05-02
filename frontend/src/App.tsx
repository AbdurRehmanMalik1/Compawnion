import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router'
import './App.css'
import Login from './views/Login'
import Signup from './views/Signup'
import Navbar from './components/Navbar'
import Home from './views/Home'
import VerifyCode from './views/VerifyCode'
import Dashboard from './views/Dashboard'
import Adopt from './views/Adopt'
import DashboardNavbar from './components/DashboardNavbar'
import { useAppSelector } from './redux/hooks'

const AppLayout = () => {
  return (
    <>
      <DashboardNavbar />
      <Outlet />
    </>
  )
}
const App = () => {
  const name = useAppSelector(state=>state.auth.name)
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path='/signup' element={<Outlet />} >
              <Route index element={<Signup/>}/>
              <Route path='verifyCode' element={<VerifyCode/>}/>
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/adopt' element={<Adopt/>}></Route>
          </Route>
          <Route path='error404' element={<div>Error 404 Page Not Found</div>}/>
          <Route path='*' element={<div>Error 404 Page Not Found</div>}/>
        </Routes>
      </Router>
    </>
  )
}
export default App