import logo from './logo.svg';
import './App.css';
// import AuthContext from './Contexts/AuthContext';
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import { useContext } from 'react';
//import components
import {Home} from './Components/Home'
import {Login} from './Components/Login'
import {Signup} from './Components/Signup'
import { AuthContext } from './Components/AuthProvider'
import Dashboard from './Components/DashboardComponents/Dashboard';
function App() {

  const auth = useContext(AuthContext)

  return (
    
            
   <BrowserRouter>
      <header>
        <h1>MediLog</h1>
        <nav>
        <ul>
          {/* <li><Link to="/">Home</Link></li> */}
          {/* <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li> */}
        </ul>
        </nav> 
      </header>
      
     <Routes>
        <Route path= "/" element = {<Home />}/>
        <Route path= "/login" element = {<Login />}/>
        <Route path= "/signup" element = {<Signup />}/>
        <Route path= "/dashboard" element = {<Dashboard />}/>
     </Routes >
     
    </BrowserRouter>
    

    
    
  );
}

export default App;
