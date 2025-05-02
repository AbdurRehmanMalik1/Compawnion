import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router'
import './App.css'
import Login from './views/Login'
import Signup from './views/Signup'
import Navbar from './components/Navbar'
import Home from './views/Home'
import VerifyCode from './views/VerifyCode'

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
const App = () => {
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
          </Route>
          <Route path='error404' element={<div>Error 404 Page Not Found</div>}/>
          <Route path='*' element={<div>Error 404 Page Not Found</div>}/>
        </Routes>
      </Router>
    </>
  )
}
export default App