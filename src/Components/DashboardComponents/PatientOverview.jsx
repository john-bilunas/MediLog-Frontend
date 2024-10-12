import React, { useEffect, useLayoutEffect } from 'react'
import {useState, useContext} from 'react'
import { AuthContext } from '../AuthProvider';


function PatientOverview({userInfo}) {

    const auth = useContext(AuthContext);

    // //STATE
    // const [isSuccess, setIsSuccess] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    // //add patient state
    // const [patientFirst, setPatientFirst] = useState('');
    // const [patientLast, setPatientLast] = useState('');
    
    // const [medOptionsForPatient, setMedOptionsForPatient] = useState([]);
    // //rendered variables
    const [selectedPatient, setSelectedPatient] = useState("");
    const [medLogs, setMedLogs] = useState([]);
    const [currentPatientMedList, setCurrentPatientMedList] = useState([]);
    const patients = userInfo.patients || [];



    console.log("medlogs", medLogs);
    const patientOptions = patients.map( patient => {
            return (<option value= {patient._id} key={patient._id} >{`${patient.firstname} ${patient.lastname}`}</option>)
        });
        let formattedMedLogs = (<li style= {{'text-align': 'center'}}>No data to display</li>);
        if(medLogs.length > 0){
            formattedMedLogs = medLogs.map( (el) => {
                return <li> {el.medication.name + " - " + el.medication.dosage.amount + " " + el.medication.dosage.unit + " @ " + el.date}</li>
            });
        };
        let formattedMedList = (<li>No data to display</li>);
        if(medLogs.length > 0){
            console.log('med logs exist')
            formattedMedList = currentPatientMedList.map( (el) => {
                return <li> {el.name + " - " + el.dosage.amount + " " + el.dosage.unit + " every " + el.numberOfHoursBetweenDoses + " hours"}</li>
            });
        }
        
    // useEffect( () => {
    //     // get a new list of med logs and sort them
    //     const currentPatientInfo = patients.find( (p) =>{
    //         return selectedPatient === p._id;
    //     })
    //     if(currentPatientInfo && currentPatientInfo.log){
    //         setMedLogs(currentPatientInfo.log);
    //     }else{
    //         setMedLogs([]);
    //     }
    //     if(currentPatientInfo && currentPatientInfo.medications){
    //         setMedLogs(currentPatientInfo.log);
    //     }else{
    //         setMedLogs([]);
    //     }
    //     setCurrentPatientMedList()
    // }, [selectedPatient]);

    const getPatientsMedLogs = async (patientId) => {
        try{
            const getLogsURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients/log/${patientId}`
            let response = await fetch( getLogsURL, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            // response = response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch med logs');
            }

            const data = await response.json();
            console.log("patient data: ", data);
            //patientData
                //medications
                //log
            const logs = data.patientInfo.log;
            console.log("logs", logs)
            // iterate over logs and convert the iso date strings 
            for(let i = 0; i < logs.length; i++){
                logs[i].date =  new Date(logs[i].date)
            }
            // sort the logs by date
            const currentLogs = logs;
            currentLogs.sort((a,b) => b.date - a.date)
            
            
            //iterate over the logs and convert date back to a string to present to the user
            for(let i = 0; i < currentLogs.length; i++){
                // currentLogs[i].date = currentLogs[i].date.toLocalDateString();
                currentLogs[i].date = currentLogs[i].date.toLocaleDateString() + " " + currentLogs[i].date.toLocaleTimeString().slice(0,5) + currentLogs[i].date.toLocaleTimeString().slice(-2);
            }

            //update the state for the med logs that are being used
            setMedLogs(currentLogs);

            const patientsMedications = data.patientInfo.medications;
            console.log('patiens meds', patientsMedications)
            setCurrentPatientMedList(patientsMedications)
        }catch(err){
            console.log('Error getting med logs', err)
        }
        


    }

    useEffect( () => {
        getPatientsMedLogs(selectedPatient);
    }, [userInfo]);


  return (
    <div className= "dashboard-content-container">
        {/* Form that contains a dropdown for selecting a patient */}
        <form >

        {/* dropdown for patient */}
        <select name="patient" id="patient" onChange = { async (e) => {
             setSelectedPatient(e.target.value);
             getPatientsMedLogs(e.target.value);
             }}>
            <option value= {""} key={"select"} >Select a patient...</option>
            {patientOptions}
        </select>

        </form>
        {/* display the logs sorted by date */}

        {selectedPatient != "" && ( 
            <>
                
                <h4>Med List</h4>
                <ul className= "log-display"> {formattedMedList}</ul>

                <h4>Med Log</h4>
                <ul className= "log-display"> {formattedMedLogs} </ul>
            </>
        ) 
            
        }

    </div>
  )
}

export default PatientOverview;