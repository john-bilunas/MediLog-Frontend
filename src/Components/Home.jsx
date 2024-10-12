

import { useContext, useEffect } from "react"
import { AuthContext } from "./AuthProvider";

//Non authencticated
export const Home = () => {

    //get information from AuthContext
    const auth = useContext(AuthContext);  
   


    return (
        <>
            <h2>Home page</h2>

            <h3>Welcome, {auth.name}</h3>
        </>




    )

}