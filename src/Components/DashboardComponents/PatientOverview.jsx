import React, { useEffect, useLayoutEffect } from 'react'
import {useState, useContext} from 'react'
import { AuthContext } from '../AuthProvider';
import Modal from '../Modal';
import editLogo from '../../pictures/edit.svg'
import trashLogo from '../../pictures/trash.svg'
// import trashLogo from '../../pictures/trash.svg'

function PatientOverview({userInfo, fetchUserInfo}) {

    const auth = useContext(AuthContext);

    // //STATE
    // const [patientFirst, setPatientFirst] = useState('');
    // const [patientLast, setPatientLast] = useState('');
    
    const [isSuccess, setIsSuccess] = useState();
    const [selectedPatient, setSelectedPatient] = useState("");
    const [medLogs, setMedLogs] = useState([]);
    const [currentPatientMedList, setCurrentPatientMedList] = useState([]);
    //current patient info
    const [patientFirst, setPatientFirst] = useState('');
    const [patientLast, setPatientLast] = useState('');

    const [deleteLogDescription, setDeleteLogDescription] = useState('');
    const [deleteLogId, setDeleteLogId] = useState('');
    const [deleteMedDescription, setDeleteMedDescription] = useState('');
    const [deleteMedId, setDeleteMedId] = useState('');
    const [currModal, setCurrModal] = useState("delete patient");

    const [isEditMode , setIsEditMode] = useState(false)
    /*
    currModal options
        delete patient
        update patient
        delete medication
        update medication
        delete log
        update log
        success
    */
    const [deleteMeds, setDeleteMeds] = useState(false);
    const [editMeds, setEditMeds] = useState(false);
    
    
    const patients = userInfo.patients || [];
    console.log("ALL PATIENTS:", patients)
    

    const [showModal, setShowModal] = useState(false);
    // const [deletePatient, setDeletePatient] = useState();


    const patientNames = {

    }
    // create options list for user to select a patient
    const patientOptions = patients.map( patient => {
            patientNames[patient._id] = `${patient.firstname} ${patient.lastname}`;
            return (<option value= {patient._id} key={patient._id} >{`${patient.firstname} ${patient.lastname}`}</option>)
        });


    // create list items to display logs for the user
        let formattedMedLogs = (<li style= {{'text-align': 'center'}}>No logs to display</li>);
        if(medLogs.length > 0){
            formattedMedLogs = medLogs.map( (el) => {
                return (<li> 
                    { isEditMode === true && (
                        <>
                        {/* <img className= "update-image" src={editLogo}  alt="edit"  /> */}
                    <img className= "update-image" src={trashLogo}  alt="trash" onClick={() => { 
                        setDeleteLogId(el._id)
                        setDeleteLogDescription(el.medication.name + " - " + el.medication.dosage.amount + " " + el.medication.dosage.unit + " @ " + el.date);
                        setCurrModal("delete log");
                        setShowModal(true);
                        }}/>
                        </>
                    )}
                    <span>{el.medication.name + " - " + el.medication.dosage.amount + " " + el.medication.dosage.unit + " @ " + el.date}</span></li>)
            });
        };
        // create list items to display medications 
        let formattedMedList = (<li style= {{'text-align': 'center'}}>No medicaitons to display</li>);
        if(currentPatientMedList.length > 0){
            console.log('med logs exist')
            formattedMedList = currentPatientMedList.map( (el) => {
                return (<li> 
                    { isEditMode === true && (
                        <>
                        {/* <img className= "update-image" src={editLogo}  alt="edit"  /> */}
                    <img className= "update-image" src={trashLogo}  alt="trash" onClick={() => { 
                        setDeleteMedId(el._id)
                        setDeleteMedDescription(el.name + " - " + el.dosage.amount + " " + el.dosage.unit + " every " + el.numberOfHoursBetweenDoses + " hours");
                        setCurrModal("delete medication");
                        setShowModal(true);
                        }}/>
                        </>
                    )}
                    <span>{el.name + " - " + el.dosage.amount + " " + el.dosage.unit + " every " + el.numberOfHoursBetweenDoses + " hours"}</span></li>)
                    
            });
        } 
    const deleteMedLog = async (logId) => {
        try{
            const deletePatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients/log`;
            const response = await fetch( deletePatientURL, {
                method: 'DELETE',
                body:JSON.stringify({
                    patientId: selectedPatient,
                    logId: deleteLogId
                }),
                credentials: 'include',
                headers:{
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            console.log('delete patient response', response)
            if(response.status !== 200) throw new Error('Failed to delete log entry.');

            modalCloseAfterSuccess(() => {});
            setDeleteLogId('');
            setDeleteLogDescription('');
            await fetchUserInfo();

        }
        catch(err) {
            console.log('There was an error with deleting a log entry.')
        }


    }
    const deleteMed = async() => {
        try{
            const deleteMedicationURL = `${process.env.REACT_APP_API_BASE_URL}/api/medication`;
            const response = await fetch( deleteMedicationURL, {
                method: 'DELETE',
                body:JSON.stringify({
                    patientId: selectedPatient,
                    medicationId: deleteMedId
                }),
                credentials: 'include',
                headers:{
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            console.log('delete patient response', response)
            if(response.status !== 200) throw new Error('Failed to delete medication.');

            modalCloseAfterSuccess(() => {setDeleteMedId('')});
            
            await fetchUserInfo();

        }
        catch(err) {
            console.log('There was an error with deleting a patient.')
        }
    }
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
            setPatientFirst(data.patientInfo.firstname);
            setPatientLast(data.patientInfo.lastname);
            //patientData
                //firstname
                //lastname
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

    const handleOpenModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const modalCloseAfterSuccess = (func) => {
        // setIsSuccess(true);
        setCurrModal('success');
        setTimeout( () => {
            if(func) func();
            setShowModal(false);
            setIsSuccess(false);
        }, 2500);
    }
    const deletePatient = async() => {
        try{
            const deletePatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients`;
            const response = await fetch( deletePatientURL, {
                method: 'DELETE',
                body:JSON.stringify({
                    patientId: selectedPatient
                }),
                credentials: 'include',
                headers:{
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            console.log('delete patient response', response)
            if(response.status !== 200) throw new Error('Failed to delete patient.');

            modalCloseAfterSuccess(() => {setSelectedPatient('')});
            
            await fetchUserInfo();

        }
        catch(err) {
            console.log('There was an error with deleting a patient.')
        }
    }
    
    const updatePatient = async(e) => {
        try{
            e.preventDefault();
            const updatePatientURL = `${process.env.REACT_APP_API_BASE_URL}/api/patients`;
            const response = await fetch( updatePatientURL, {
                method: 'PUT',
                body:JSON.stringify({
                    patientId: selectedPatient,
                    firstname: patientFirst,
                    lastname: patientLast
                }),
                credentials: 'include',
                headers:{
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${auth.getLocalStorageAuth()}`
                }

            });
            console.log('update patient response', response)
            if(response.status !== 200) throw new Error('Failed to update patient.');

            modalCloseAfterSuccess(() => {});
            await fetchUserInfo();

        }
        catch(err) {
            console.log('There was an error with updating a patient.')
        }
    }
  return (
    <>  
        
    <div className= "dashboard-content-container">

        {
            isEditMode === true && selectedPatient !== "" && (
                <span id= "x" onClick={ () =>{ setIsEditMode(false)}}>×</span>
            
            )}

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
        {
            isEditMode === false && selectedPatient !== "" && <button className="update button" onClick={() => { setIsEditMode(true)}}>Edit</button>
            }
        {isEditMode === true && (<div className="multi-buttons">
            <button className="edit button" onClick = { () => {
                //change modal type to open
                setCurrModal('update patient');
                //open modal
                handleOpenModal();
            }}>Edit Patient</button>
            <button className="delete button" onClick = { () => {
                //change modal type to open
                setCurrModal('delete patient');
                //open modal
                handleOpenModal();
            }}>Delete Patient</button>     
        </div>)}
        {/* display the logs sorted by date */}
        {selectedPatient != "" && ( 
            <>
            
            <div id= "patient-info">
                
                <div className= "patient-info-section">
                    <h4>Med List</h4>
                    <ul className= "log-display"> {formattedMedList}</ul>
                    {/* <div className="multi-buttons">
                        <button className="edit button" onClick = {handleOpenModal}>Edit Medication</button>
                        <button className="delete button" onClick = {handleOpenModal}>Delete Medication</button>     
                    </div> */}
                </div>
                <div className= "patient-info-section">
                    <h4>Med Log</h4>
                    <ul className= "log-display"> {formattedMedLogs} </ul>
                    {/* <div className="multi-buttons">
                        <button className="edit button" onClick = {handleOpenModal}>Edit Log Entry</button>
                        <button className="delete button" onClick = {handleOpenModal}>Delete Log Entry</button>     
                    </div> */}
                </div>

                

                
            </div>

            {/* 
                ALL UPDATE/DELETE MODALS
            */}

            {/* Delete Patient modal */}
            {showModal && currModal === "delete patient" &&  (<Modal handleCloseModal= {handleCloseModal}>
                <p className='confirm-warning'>
                    Are you sure you want to delete patient <b>{patientNames[selectedPatient]}</b>?
                Their medications and log entries will also be permenantly deleted.
                </p>
                <div className= "multi-buttons">
                <button className="cancel button" onClick= { handleCloseModal}>Keep Patient</button>
                <button className="delete button" onClick={deletePatient}>Delete Patient</button>
                </div>
                
                {/* {isSuccess && <div className='success'>{patientNames[selectedPatient]} has been succesfully removed.</div>} */}
                {isSuccess && <div className='success'>This patient has been succesfully removed.</div>}
            </Modal>)
        }
        {/* Update Patient modal */}
        {showModal && currModal === "update patient" && (<Modal handleCloseModal= {handleCloseModal}>
            <p className='confirm-warning'>
            You are updaing patient <b>{patientFirst} {patientLast}</b>
            </p>
            <form className= "add-form">
                    <div className= "label-input">
                        <label htmlFor= "firstname" >Patient first name</label>
                        <input type="text" name= "firstname" id= "firstname" autoComplete='off' size= "88" placeholder='Ex. John' value= {patientFirst} onChange= {(e) => { setPatientFirst(e.target.value)}}/>
                    </div>
                    <div className= "label-input">
                        <label htmlFor= "lastname" >Patient last name</label>
                        <input type="text" name= "lastname" id= "lastname" autoComplete='off' placeholder='Ex. Smith' value= {patientLast} onChange= {(e) => { setPatientLast(e.target.value)}}/>
                    </div>
                    <div className= "multi-buttons">
                        <button className="cancel button" onClick= {handleCloseModal}>Cancel</button>
                        <button className="save button" onClick={updatePatient}>Update Patient</button>
                    </div>
                    </form>
                {isSuccess && <div className='success'>This patient has been succesfully Updated.</div>}
            </Modal>)
        }
        {showModal && currModal === "delete log" && (<Modal handleCloseModal= {handleCloseModal}>
            <p className='confirm-warning'>
            Are you sure that you want to delete this log: <b>{deleteLogDescription}</b>?
            </p>
                    <div className= "multi-buttons">
                        <button className="cancel button" onClick= {handleCloseModal}>Cancel</button>
                        <button className="save button" onClick={ deleteMedLog}>Delete Log Entry</button>
                    </div>

                {isSuccess && <div className='success'>This patient has been succesfully Updated.</div>}
            </Modal>)
        }
        {showModal && currModal === "delete medication" && (<Modal handleCloseModal= {handleCloseModal}>
            <p className='confirm-warning'>
            Are you sure that you want to delete this medication: <b>{deleteMedDescription}</b>?
            <br></br>
            Please note that this will remove all log entries using this medication. If you are just changing dosage, we strongly encourage you to add another medication rather than removing this one to ensure proper record keeping.
            </p>
                    <div className= "multi-buttons">
                        <button className="cancel button" onClick= {handleCloseModal}>Cancel</button>
                        <button className="save button" onClick={ deleteMed}>Delete Medication</button>
                    </div>

                {isSuccess && <div className='success'>This patient has been succesfully Updated.</div>}
            </Modal>)
        }
        {
            showModal && currModal === 'success' && <Modal>
                <div className='success'>Success!!!</div>
            </Modal>
            
        }




            <div className="multi-buttons">
            {/* <button className="delete button" onClick = {handleOpenModal}>Delete Patient</button>
            <button className="delete button">Delete a Medication</button>
            <button className="delete button">Delete a Log Entry</button> */}
            
            </div>
        </>
        ) 
            
        }

    </div>
    </>
  )
}

export default PatientOverview;