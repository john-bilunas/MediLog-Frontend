
// import AuthContext from './Contexts/AuthContext';
import { Routes, Route, Link, Navigate} from 'react-router-dom';
import { useContext } from 'react';
//import components
import { Home } from './Home';
import {Login} from './Login'
import {Signup} from './Signup'
import AuthProvider from './AuthProvider'
function App() {



  return (
    
     <Routes>
        <Route path= "/" element = {<Home />}/>
        <Route path= "/login" element = {<Login />}/>
        <Route path= "/signup" element = {<Signup />}/>
     </Routes >
 
  );
}

export default MyRouter;
