import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router'
import './App.css'
import Login from './views/Login'
import Signup from './views/Signup'
import Navbar from './components/Navbar'
import Home from './views/Home'

const AppLayout = ()=>{
  return(
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout/>}>
            <Route index element={<Home/>}/>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}
export default App