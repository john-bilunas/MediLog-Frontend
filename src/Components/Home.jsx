

import { useContext, useEffect } from "react"
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
//Non authencticated
export const Home = () => {

    //get information from AuthContext
    const auth = useContext(AuthContext);  
   
    const navigate = useNavigate();
    
    useEffect( () => {
        navigate('/dashboard');
    }, []);
    

    return (
        <>
            <h2>Home page</h2>

            
        </>




    )

}