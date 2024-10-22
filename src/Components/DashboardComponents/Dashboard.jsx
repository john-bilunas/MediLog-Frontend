import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import DashboardSection from "./DashboardSection";
import PatientOverview from "./PatientOverview";
import Add from "./Add";
import MyInfo from "./MyInfo";
const Dashboard = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    //state variables
    const [userInfo, setUserInfo] = useState({});
    //render variable
// console.log("checking if logged in on dashboard", auth.isLoggedIn)
// useEffect for checking login when the component mounts
useEffect(() => {
    if(!auth.isLoggedIn){
            navigate('/login')
        }
}, [])
    
    
    const fetchUserInfo = async () => {
        const info = await getUserInformation();    
        console.log('inside fetch userInfo: ', info)
        setUserInfo({...info});
        
    };
    //useEffects
    useEffect(  () => {

        const fetchUserInfoInEffect = async () => {
            const info = await getUserInformation();    
            setUserInfo(info);
            
        };
        fetchUserInfoInEffect();
    }, []);

    //Side Effect functions
    const getUserInformation = async () => {

        const fetchURL  = `${process.env.REACT_APP_API_BASE_URL}/api/users/`;
        try{
            let data = await fetch(fetchURL, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${auth.getLocalStorageAuth()}`
                }
            } );
            const dashboardInfo = await data.json();
            return dashboardInfo;
        }catch(err){
            console.log('error', err)
        }


    }
    const handleUserLogout = () => {
        auth.logout();
        navigate('/login')
    }

    return (

        auth.isLoggedIn && <>

        <button className= "logout" onClick={handleUserLogout}>Logout</button>
        <h2>Welcome, {`${userInfo.firstname} ${userInfo.lastname}`}</h2>
            <DashboardSection title= "My Info">
                <MyInfo email= {userInfo.email} phone= {userInfo.phone} name= {`${userInfo.firstname} ${userInfo.lastname}`} username= {userInfo.username}/>
            </DashboardSection>
            <DashboardSection title= "Add to Profile">
                <Add userInfo= {userInfo} fetchUserInfo= {fetchUserInfo}/>
            </DashboardSection>
            <DashboardSection title= "Patient Overview">
                <PatientOverview userInfo= {userInfo} fetchUserInfo= {fetchUserInfo}>

                </PatientOverview>

            </DashboardSection>
        </>
    )



}

export default Dashboard;