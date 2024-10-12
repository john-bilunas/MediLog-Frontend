import {useContext, useState, useRef} from 'react'
import AddTile from './AddTile'
import logEntryPic from '../../pictures/log-entry.png'
import medicationPic from '../../pictures/medication.png'
import patientPic from '../../pictures/patient.png'
import  { AuthContext } from '../AuthProvider'


function Add({userInfo, fetchUserInfo}) {



    /*
        STATE
    */

   const[selectedForm, setSelectedForm] = useState(null);
    const [showModal, setShowModal] = useState(false);
    //add patient state
    const [patientFirst, setPatientFirst] = useState('');
    const [patientLast, setPatientLast] = useState('');

    
    
    /*
        RENDERED VARIABLES
    */
  
        const auth = useContext(AuthContext);
    /*
        EVENT HANDLER FUNCTIONS
    */
    // On
    const handleOpenModal = (form) => {
        setShowModal(true);
        setSelectedForm(form);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedForm(null);
    }
    const handleAddPatient = (e) => {

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
            // response = response.json();

            
        }catch(err){
            console.log('Error adding patient', err)
        }
        


    }


    /*

    TEMP

    const [selectedPatient, setSelectedPatient] = useState(null); // dropdown
    const [medName, setMedName] = useState(null);
    const [amount, setAmount] = useState(null);
    const [unit, setUnit] = useState(null); // dropdown
    const [frequence, setFrequency] = useState(null);

    Med Format
        body{
        patientId,
        medication: {
            name,
            dosage: {
                amount,
                unit
            },
            frequency
        }
    }

    */

    return (
    <div className= "dashboard-content-container">
        <div className= "add-tiles">
            <AddTile tileImage= {patientPic} title= "Add Patient" userInfo= {userInfo} fetchUserInfo= {fetchUserInfo} >
                {/* Form to add a patient */}
                {/* <form className= "add-form">

                    <div className= "label-input">
                        <label htmlFor= "firstname" >Patient first name</label>
                        <input type="text" name= "firstname" id= "firstname" autoComplete='off' size= "88" placeholder='Ex. John' onChange= {(e) => { setPatientFirst(e.target.value)}}/>
                    </div>
                    <div className= "label-input">
                        <label htmlFor= "lastname" >Patient last name</label>
                        <input type="text" name= "lastname" id= "lastname" autoComplete='off' placeholder='Ex. Smith'  onChange= {(e) => { setPatientLast(e.target.value)}}/>
                    </div>
                    
                    <button disabled= {patientFirst === "" || patientLast === "" } className= "button" onClick= {addPatientToProfile}>Add Patient</button>
                </form> */}
            </AddTile>
            {/* Add Medication */}
            <AddTile tileImage= {medicationPic} title= "Add Medication" userInfo= {userInfo} fetchUserInfo= {fetchUserInfo} >
            </AddTile>
            <AddTile tileImage= {logEntryPic} title= "Add Medication Log Entry"  userInfo= {userInfo} fetchUserInfo= {fetchUserInfo} >    
            </AddTile>
        </div>
    </div>
  )
}

export default Add