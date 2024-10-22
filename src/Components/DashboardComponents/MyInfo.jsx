import editIcon from '../../pictures/edit-icon.png'
import { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
const MyInfo = ({email, phone, name, username}) => {


    //state variables
    const [isEdit, setIsEdit] = useState(false);


    //Event handler functions
    const handleEdit = (e) => {
        //just add toggling for now
        setIsEdit(true)
    }
    const handleReset = (e) => {
        //just add toggling for now
        setIsEdit(false)
    }
    const handleSave = (e) => {
        //just add toggling for now
        // setIsEdit((prev) => !prev)
    }
    const auth = useContext(AuthContext);
    return (
            <div className= "dashboard-content-container">
                <ul className= "my-info-list">
                    <li><strong>Name:</strong> {name}</li>
                    <li><strong>Username:</strong> {username}</li>
                    <li><strong>Email:</strong> {email}</li>
                    <li><strong>Phone:</strong> {phone}</li>
                </ul>
                {/* <div className= "center">

                    <button className= 'button save' onClick = {handleSave}>Save</button>
                    <button className= 'button undo' onClick = {handleReset}>Undo</button>
                
                </div> */}
            
            </div>
            )
    
}
export default MyInfo;