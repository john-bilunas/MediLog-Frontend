import {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import  {AuthContext}  from './AuthProvider';
const loginObj = {username: "JB", password: "JB"};
export const Login = () => {

    const auth = useContext(AuthContext);

    // state
    const [username, setUsername] =  useState("");
    const [password, setPassword] =  useState("");
    const [loginError, setLoginError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect( () => {
        setIsLoggedIn(auth.checkIfLoggedIn())
    });
    useEffect(() => {
        if(isLoggedIn) navigate("/dashboard")
    }, [isLoggedIn]);
    

    //eent handlers
    const handleUserLogin = async () => {

        const loginURL  = `${process.env.REACT_APP_API_BASE_URL}/api/login`;
        try{
            let userInfo = await fetch(loginURL, {
                method: "POST",
                body: JSON.stringify({username:username, password:password}),
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            } );
            userInfo = await userInfo.json();


            //accessToken, userId, userFullName, userUsername){
            if(userInfo.error){
                // console.log(userInfo.message)
                setLoginError(userInfo.message);
            }else{
                // console.log("userInfo", userInfo);
                setLoginError(null);
                auth.login(userInfo.accessToken, userInfo.id,  userInfo.name, userInfo.username);
                // navigate("/dashboard");
            }
            
        }catch(err){
            console.log('error', err)
        }
        finally{
            setIsLoggedIn(auth.checkIfLoggedIn());
        }
    }
    const handleFakeLogin = async () => {
        
        const loginURL  = `${process.env.REACT_APP_API_BASE_URL}/api/login`;
        try{
            let userInfo = await fetch(loginURL, {
                method: "POST",
                body: JSON.stringify(loginObj),
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            } );
            userInfo = await userInfo.json();


            //accessToken, userId, userFullName, userUsername){
            auth.login(userInfo.accessToken, userInfo.id,  userInfo.name, userInfo.username)
            console.log("userInfo", userInfo);
        }catch(err){
            console.log('error', err)
        }
    }

    const handleUserLogout = () => {
        auth.logout();
    }


    return (
        <div className= 'auth-wrapper'> 
        <h1>Login</h1>
        {/* <button className= "button" onClick={handleFakeLogin}>Login to MediLog</button>
        <button className= "button" onClick={handleUserLogout}>Logout of MediLog</button>
        <h1> Actual Login page below</h1> */}

        
        <div className="label-input">
                <label htmlFor="username">Username</label>
                <input type="text" id= "username" name= "username" placeholder= "Username"value= {username} onChange = { (e) => { setUsername(e.target.value) }}/>
            </div>
            <div className="label-input">
                <label htmlFor="password">Password</label>
                <input type="password" id= "password" name= "password" placeholder= "Password"  value= {password} onChange = { (e) => { setPassword(e.target.value) }}/>
            </div>
            



            <button className= "button" onClick={ handleUserLogin}>Login</button>
            {loginError && <p className= "credential-error">{loginError}</p>}
            <button className= 'switch-auth' onClick= {() => { navigate('/signup')}}>Not yet a member? Sign up!</button>
        </div>
       
    )
    
    }