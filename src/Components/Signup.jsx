import { useState, useEffect, useContext } from "react"
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {

    const [firstname,setFirstname] = useState('');
    const [lastname,setLastname] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');

    const [triedToSubmit, setTriedToSubmit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [errorMessage, setErrormessage] = useState('');
        const auth = useContext(AuthContext);
        useEffect( () => {
        setIsLoggedIn(auth.checkIfLoggedIn())
    });
    useEffect(() => {
        if(isLoggedIn) navigate("/dashboard")
    }, [isLoggedIn]);

    const navigate = useNavigate();
    //event handler functions
    const handleSignUp = async (e) => {
        e.preventDefault();
        setTriedToSubmit(true);
        
        //only run this functionality if there are no validation errors
        if(allValidators.length === 0){
        const signupURL  = `${process.env.REACT_APP_API_BASE_URL}/api/signup`;
        try{
            const signupBody = {
                firstname:firstname,
                lastname:lastname,
                username:username,
                password:password,
                email:email,
                phone:phone,
            }
            let response = await fetch(signupURL, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(signupBody),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const status = response.status;
            response = await response.json();
            console.log(response)
            if(status === 200){
                console.log('200');
                handleUserLogin();
                navigate("/dashboard")
                setErrormessage('')
            }else{
                setErrormessage(response.message)
            }   
            
            console.log(response)
            
        }
        catch(err){

        }
        }
        
    }
    
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


            auth.login(userInfo.accessToken, userInfo.id,  userInfo.name, userInfo.username);
            
        }catch(err){
            console.log('error', err)
        }
        finally{
            
        }
    }



    //Validation for firstname
    const [firstnameValidator,setFirstnameValidator] = useState([]);
    useEffect(() => {
        
        // const lastnameRegex = /^[a-zA-Z]+$/;
        const firstnameErrors = [];;
    
        // if( !lastnameRegex.test(lastname)) lastnameErrors.push((<li>Please enter a lastname.</li>))
        if(firstname.length < 1) firstnameErrors.push((<li>Please enter a first name.</li>));
        setFirstnameValidator(firstnameErrors);
    }, [firstname]);
    //Validation for lastname
    const [lastnameValidator,setLastnameValidator] = useState([]);
        useEffect(() => {
            
            // const lastnameRegex = /^[a-zA-Z]+$/;
            const lastnameErrors = [];;
        
            // if( !lastnameRegex.test(lastname)) lastnameErrors.push((<li>Please enter a lastname.</li>))
            if(lastname.length < 1) lastnameErrors.push((<li>Please enter a last name.</li>));
            setLastnameValidator(lastnameErrors);
        }, [lastname]);

    //Validation for password
    const [passwordValidator,setPasswordValidator] = useState([]);
        useEffect(() => {
            
            const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
            const passwordErrors = [];;
        
            if( !passwordRegex.test(password)) passwordErrors.push((<li>Please enter a valid password.It must be at least 8 characters and it may contain upper and lowercase letters, numbers, and special characters.</li>))
            setPasswordValidator(passwordErrors);
        }, [password]);

    //Validation for username
    const[usernameValidator,setUsernameValidator] = useState([]);
        useEffect(() => {
            
            const usernameRegex = /^[a-zA-Z0-9_-]+$/;
            const usernameErrors = [];;
        
            if( !usernameRegex.test(username)) usernameErrors.push((<li>Please enter a valid username. It can only contain numbers, letters, - and _.</li>))
            setUsernameValidator(usernameErrors);
        }, [username]);

    //Validation for email
    const[emailValidator,setEmailValidator] = useState([]);
        useEffect(() => {   
            
            const emailErrors = [];
            const emailRegexTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if( !emailRegexTest.test(email)) emailErrors.push((<li>Please enter a valid email address.</li>))
            setEmailValidator(emailErrors);
        }, [email]);
        
    //Validation for phone number
    const[phoneValidator,setPhoneValidator] = useState([]);
        useEffect(() => {
            const phoneErrors = [];
            const tempPhone = phone.trim();
            const numberRegex = /^[0-9]$/;
            let numberCount = 0;
            let dashCount = 0;
            let isValid = true;

            for(let i = 0; i < tempPhone.length; i++){
                if(tempPhone[i] === '-'){
                    dashCount ++;
                }else if( numberRegex.test(tempPhone[i]) ){
                    numberCount++;
                }else{
                    isValid = false;
                    break;
                }
            }
            //add validation error if the criteria of 
                // -10 numbers exactly
                // -maximum of two dashes
                // ...is not met
            if(isValid && numberCount === 10 && dashCount >= 0 && dashCount < 3){
                 }else{
                    phoneErrors.push((<li>Please enter a valid phone number that contains 10 numbers</li>));
                 }
            setPhoneValidator(phoneErrors);
        }, [phone]);
        //All validation
        const allValidators = [...firstnameValidator,...lastnameValidator,...passwordValidator,...usernameValidator,...emailValidator,...phoneValidator ]

    
    
    return (

        <div className= 'auth-wrapper'> 
        <h1>Signup</h1>   
        <div className="label-input">
                <label htmlFor="firstname">First name</label>
                <input type="text" id= "firstname" name= "firstname" value= {firstname} placeholder= "First Name" onChange = { (e) => { setFirstname(e.target.value) }}/>
            </div>
            <div className="label-input">
                <label htmlFor="lastname">Last name</label>
                <input type="text" id= "lastname" name= "lastname" value= {lastname} placeholder= "Last Name"onChange = { (e) => { setLastname(e.target.value) }}/>
            </div>
            <div className="label-input">
                <label htmlFor="username">Username</label>
                <input type="text" id= "username" name= "username" value= {username} placeholder= "Username" onChange = { (e) => { setUsername(e.target.value) }}/>
            </div>
            <div className="label-input">
                <label htmlFor="password">Password</label>
                <input type="password" id= "password" name= "password" value= {password} placeholder= "Password" onChange = { (e) => { setPassword(e.target.value) }}/>
            </div>
            <div className="label-input">
                <label htmlFor="email">Email Address</label>
                <input type="email" id= "email" name= "email" value= {email} placeholder= "Email address" onChange = { (e) => { setEmail(e.target.value) }}/>
            </div>
            <div className="label-input" >
                <label htmlFor="phone">Phone Number</label>
                <input type="text" id= "phone" name= "phone" value= {phone} placeholder="Phone Number" onChange = { (e) => { setPhone(e.target.value) }}/>
            </div>
            {triedToSubmit && (
                <ul style= {{color: "red"}}>
                    
                    {allValidators}
                </ul>)
                
             }
            



            <button className= "button"  onClick={ handleSignUp }>Signup</button>
            <button className= 'switch-auth' onClick= {() => { navigate('/login')}}>Already a member? Log in!</button>
            {errorMessage}
        </div>
    )
            }
    