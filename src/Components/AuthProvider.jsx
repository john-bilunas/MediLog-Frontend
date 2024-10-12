import {useState, createContext, useContext, useEffect} from 'react';

export const AuthContext = createContext();

export default function AuthProvider({children}){

    //Auth info to keep
    const [isLoggedIn, setIsloggedIn] = useState(false);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    

    // Local Storage Functionality
    function setLocalStorageAuth(token){
        localStorage.setItem('authToken', token)

    }
    function getLocalStorageAuth(){
        const authToken = localStorage.getItem('authToken');
        return authToken;
    } 
    function deleteLocalStorageAuth(){
        localStorage.removeItem('authToken')
    }


    // function checkIfAuthStillValid(){
    //     //reach out to API to check if authentication is still valid w/ JWT

    //     // y - 

    //     // n - 
    //         //invoke deleteStorageAuth
    //         setIsloggedIn(false);
    //         setId(null);
    //         setName(null);
    //         setUsername(null);
    // }


    // Login ad Logout functionality
        // Update state used in context
        // Update local storage token
    function login(accessToken, userId, userFullName, userUsername){
        setIsloggedIn(true);
        setId(userId);
        setName(userFullName);
        setUsername(userUsername);

        setLocalStorageAuth(accessToken);
        localStorage.setItem('id', userId);
        localStorage.setItem('name', userFullName);
        localStorage.setItem('username', userUsername);

    }
    function logout(){
        setIsloggedIn(false);
        setId(null);
        setName(null);
        setUsername(null);
        deleteLocalStorageAuth();
    }
    function checkIfLoggedIn(){
        if(isLoggedIn) return true;
        return false;
    }


    //Check if token exists
    //send it in request along with _id to get users information
    console.log("token" , getLocalStorageAuth())

    const verifyJWT = async () => {
        try{
            const verifiyURL = `${process.env.REACT_APP_API_BASE_URL}/api/login/verifyJWT`
            let response = await fetch( verifiyURL, {
                method: 'POST',
                body: JSON.stringify({}),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${getLocalStorageAuth()}`
                }

            });
            // response = response.json();
            console.log("LOGGED IN SUCCESS")
            login();
            
        }catch(err){
            console.log('Error adding patient', err)
        }
    }
    // useEffect( () => {
    //     //reach out to db to see if jwt is valid. if so, set logged in to true
    //     verifyJWT();
        
    // }, []);

    return(
        <AuthContext.Provider value = {{ isLoggedIn, id, name, username, login, logout, getLocalStorageAuth, checkIfLoggedIn}}>
            {children} 
        </AuthContext.Provider>
       
    )
}

// export const useAuth = useContext(AuthContext);
