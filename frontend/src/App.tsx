import { Route, Routes, BrowserRouter as Router, Outlet } from 'react-router'
import './App.css'
import Login from './views/Login'
import Signup from './views/Signup'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}
export default App