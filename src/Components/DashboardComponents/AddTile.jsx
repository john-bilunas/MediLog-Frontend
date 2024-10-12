import React, { useEffect } from 'react'
import {useState, useContext} from 'react'
import Modal from '../Modal'
import { AuthContext } from '../AuthProvider';
function AddTile({tileImage, title, userInfo, fetchUserInfo}) {
   
    const auth = useContext(AuthContext);

    //STATE
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPatientError, setIsPatientError] = useState(false);
    const [isMedError, setIsMedError] = useState(false);
    const [isLogError, setIsLogError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    //add patient state
    const [patientFirst, setPatientFirst] = useState('');
    const [patientLast, setPatientLast] = useState('');
    
    //add medication state
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newMedicationName, setNewMedicaitonName] = useState('');
    const [newMedicationAmount, setNewMedicationAmount] = useState('');
    const [newMedicationUnit, setNewMedicaitonUnit] = useState('');
    const [newMedicationFrequency, setNewMedicaitonFrequency] = useState('');

    //add log state
    const [selectedPatientForMedLog,setSelectedPatientForMedLog] = useState("");
    const [selectedMedication,setSelectedMedication] = useState("");
    const [logDateTime,setLogDateTime] = useState(null);
    const [medOptionsForPatient, setMedOptionsForPatient] = useState([]);
    //rendered variables

        const patients = userInfo.patients || [];
        const patientOptionsForMeds = patients.map( patient => {
                return (<option value= {patient._id} key={patient._id} >{`${patient.firstname} ${patient.lastname}`}</option>)
            });
            const patientOptionsForMedLog = patients.map( patient => {
                return (<option value= {patient._id} key={patient._id} >{`${patient.firstname} ${patient.lastname}`}</option>)
            });

            useEffect(() => {
                if(selectedPatientForMedLog){

                    getMedicationList();
                }
            }, [selectedPatientForMedLog]);

            useEffect(() => {

                const now = new Date();

                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

                setLogDateTime(formattedDateTime);
            }, []);
        const getMedicationList = () => {

            const patient = patients.find( (p) => { return p._id ===  selectedPatientForMedLog});
            
            let medications  = [];
            if(patient && patient.medications){
                medications = patient.medications;
            }

            let medicationOptions = [];
            if(patient && patient.medications)
                medicationOptions = medications.map( med => {
                    return (<option value= {med._id} key={med._id} >{`${med.name} - ${med.dosage.amount} ${med.dosage.unit} every ${med.numberOfHoursBetweenDoses} hours`}</option>)
                });
            setMedOptionsForPatient(medicationOptions);
        }


    //event listener functions
    const handleOpenModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        
    }

    // close modal with a delay

    const modalCloseAfterSuccess = () => {
        setIsSuccess(true);
        setTimeout( () => {
            setShowModal(false);
            setIsSuccess(false);
        }, 2500);
    }
    /*
        FETCH REQUESTS
    */
    // Fetch to add a patient

    const addPatientToProfile = async(e) => {
        e.preventDefault();
        try{
            const addPatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients`
            let response = await fetch( addPatientURL, {
                method: 'POST',
                body: JSON.stringify({
                    firstname: patientFirst,
                    lastname: patientLast
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            const x = new Error('test error');
            if(patientFirst[0] === 'J')
            throw x;
            // response = response.json();
            setIsPatientError(false);
            fetchUserInfo();
            modalCloseAfterSuccess();
            //reset the state
            setPatientFirst("");
            setPatientLast("")
        }catch(err){
            setIsPatientError(true);
            console.log('Error adding patient', err)
        }
        


    }

    const addMedicationToPatient = async(e) => {
        e.preventDefault();
        try{
            const addPatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/medication`
            let response = await fetch( addPatientURL, {
                method: 'POST',
                body: JSON.stringify({
                    patientId: selectedPatient,
                    medication: {
                        name: newMedicationName,
                        dosage:{
                            amount: newMedicationAmount,
                            unit: newMedicationUnit
                        },
                        numberOfHoursBetweenDoses: newMedicationFrequency
                    }
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${auth.getLocalStorageAuth()}`
                }

            });

            //Should I check for the status code? And then hve the error message here?
            //reset state

            if(newMedicationName[0] === "J")
            throw new Error("med");
            setIsMedError(false);
            setSelectedPatient(null)
            setNewMedicaitonName('');
            setNewMedicationAmount('');
            setNewMedicaitonUnit('');
            setNewMedicaitonFrequency('');
            // response = response.json();
            modalCloseAfterSuccess();

            
            fetchUserInfo();

        }catch(err){
            setIsMedError(true);
            console.log('Error adding patient', err)
            //set error message and trigger boolean
            //there shouldn't really be any errors for what the user entered, so maybe say...
            //"Something went wrong, please make sure all fields are filled out and try again." in red text
        }
        


    }
    const addMedLogToPatient = async(e) => {
        //get format of what is expected by the backend
        e.preventDefault();
        try{


            const newMedLogBody = {
                patientId: selectedPatientForMedLog,
                medication: selectedMedication,
                date: logDateTime
            }
            

            const addPatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients/log`
            let response = await fetch( addPatientURL, {
                method: 'POST',
                body: JSON.stringify(newMedLogBody),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization' : `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            // response = response.json();
            setIsLogError(false);
            modalCloseAfterSuccess();
            fetchUserInfo();
            //reset state
            setSelectedPatientForMedLog("");
            setSelectedMedication("");
            setMedOptionsForPatient([]);
        }catch(err){
            setIsLogError(true);
            console.log('Error adding med log entry', err)
        }
        
    }
    return (
        <>
            <div className= "single-tile" onClick = {handleOpenModal}>
                <div className= "image-tile" >
                    <img src={tileImage} alt="" />
                </div>
                <h3>{title}</h3>
            </div>
            {showModal && 
            <Modal handleCloseModal= {handleCloseModal}>
                {/* Add Patient */}
                {title === "Add Patient" && 
                isSuccess === false &&
                <form className= "add-form">
                    <div className= "label-input">
                        <label htmlFor= "firstname" >Patient first name</label>
                        <input type="text" name= "firstname" id= "firstname" autoComplete='off' size= "88" placeholder='Ex. John' value= {patientFirst} onChange= {(e) => { setPatientFirst(e.target.value)}}/>
                    </div>
                    <div className= "label-input">
                        <label htmlFor= "lastname" >Patient last name</label>
                        <input type="text" name= "lastname" id= "lastname" autoComplete='off' placeholder='Ex. Smith' value= {patientLast} onChange= {(e) => { setPatientLast(e.target.value)}}/>
                    </div>

                    <button disabled= {patientFirst === "" || patientLast === "" } className= "button" onClick= {addPatientToProfile}>Add Patient</button>
                    </form>}
                    {/* Add Medication */}

                    {title === "Add Medication" && 
                    isSuccess === false &&
                <form className= "add-form">
                    <div className= "label-input">
                        <label htmlFor= "selected-patient" >Patient name</label>
                        <select name= "selected-patient" id= "selected-patient" value= {selectedPatient} onChange= { (e) => { setSelectedPatient(e.target.value)}} >
                        <option value= {null} key={"null"} >{`Select a patient...`}</option>
                            {patientOptionsForMeds}
                        </select>
                    </div>
                    {/* Medication Name */}
                    <div className= "label-input">
                        <label htmlFor= "new-medication-name" >Medication</label>
                        <input type="text" name= "new-medication-name" id= "new-medication-name" autoComplete='off'  placeholder='Ex. Amoxicillin' value= {newMedicationName} onChange= {(e) => { setNewMedicaitonName(e.target.value)}}/>
                    </div>
                    {/* Medication Quantity */}
                    <div className= "label-input">
                        <label htmlFor= "new-medication-amount" >Quantity</label>
                        <input type="text" name= "new-medication-amount" id= "new-medication-amount" autoComplete='off'  placeholder='Ex. 2' value= {newMedicationAmount} onChange= {(e) => { setNewMedicationAmount(e.target.value)}}/>
                    </div>
                    {/* Medication Units */}
                    <div className= "label-input">
                        <label htmlFor= "new-medication-unit" >Units</label>
                        <input type="text" name= "new-medication-unit" id= "new-medication-unit" autoComplete='off'  placeholder='Ex. Pills' value= {newMedicationUnit} onChange= {(e) => { setNewMedicaitonUnit(e.target.value)}}/>
                    </div>
                    {/* Medication Frequency */}
                    <div className= "label-input">
                        <label htmlFor= "new-medication-frequency" >Number of hours between doses</label>
                        <input type="text" name= "new-medication-frequency" id= "new-medication-frequency" autoComplete='off'  placeholder='Ex. 12' value= {newMedicationFrequency} onChange= {(e) => { setNewMedicaitonFrequency(e.target.value)}}/>
                    </div>
                    
                    <button disabled= {selectedPatient === null || newMedicationName === '' || newMedicationAmount === '' || newMedicationUnit === '' || newMedicationFrequency === '' } className= "button" onClick= {addMedicationToPatient}>Add Medication</button>
                </form>}
                {/* Add Log */}
                {title === "Add Medication Log Entry" && 
                isSuccess === false &&
                <form className= "add-form">
                    
                    <div className= "label-input">
                        <label htmlFor= "selected-patient" >Patient name</label>
                        <select name= "selected-patient" id= "selected-patient" value= {selectedPatientForMedLog} onChange= { (e) => { 
                            setSelectedPatientForMedLog(e.target.value)
                            }
                        
                        } >
                            <option value= {null} key={"select a patient"} >{`Select a patient...`}</option>
                                {patientOptionsForMedLog}
                        </select>
                        <label htmlFor= "selected-medication" >Medication</label>
                        <select name= "selected-medication" id= "selected-medication" value= {selectedMedication} onChange= { (e) => { setSelectedMedication(e.target.value);}} >
                            <option value= {null} key={"select a medication"} >{`Select medication...`}</option>
                                {medOptionsForPatient}
                        </select>

                        <input type="datetime-local" id="birthdaytime" name="birthdaytime" value = {logDateTime} onChange={e => {

                            setLogDateTime(e.target.value)
                        }
                         
                        }></input>
                    </div>
                    
                    <button disabled= {selectedPatientForMedLog === "" || selectedMedication === "" } className= "button" onClick= {addMedLogToPatient}>Add Log</button>
                    
                </form>}
                {isPatientError && <div className = 'error'> Error adding patient to profile. Please try again.</div>}
                {isMedError && <div className = 'error'> Error adding medication to patient. Please try again.</div>}
                {isLogError && <div className = 'error'> Error adding log entry to patient. Please try again.</div>}
                {isSuccess && <div className='success'>Success!!!</div>}
            </Modal>}
        </>
   
    
  )
}

export default AddTile