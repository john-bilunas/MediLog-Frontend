import React from 'react'

function Modal({children, handleCloseModal}) {
  return (
    <div className= "modal-background">
        <div className= "inner-modal">
            <span className= "x" id= "x" onClick= {handleCloseModal}>×</span>
            {children}
        </div>  
    </div>

  )
}

export default Modal