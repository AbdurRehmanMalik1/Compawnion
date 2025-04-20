import { Route, Routes, BrowserRouter as Router } from 'react-router'
import './App.css'
import Login from './views/Login'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}
export default App