
import {useState} from 'react'
import expandButton from '../../pictures/expandButton.png'
const DashboardSection = ({children, title}) => {

    const [expanded, setExpanded]=useState(true);


    //event handler functions
    const handleChangeExpanded = () => {
        setExpanded( (prev) => !prev);
    }
    
    return(
        <section className= "dashboard-section-container">
            <header className= "expanding-title-section" onClick={(handleChangeExpanded)}> 
                <h3 className= "expanding-title">{title}</h3>
                <img className= {expanded? "dropdown-image expanded-dropdown-image" : "dropdown-image collapsed-dropdown-image"} src={expandButton} alt=""  />
                
            </header>
            
                {expanded && children}
            
            
        </section>

    )
}

export default DashboardSection;