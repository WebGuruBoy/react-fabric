import React from 'react'
import './style.scss'

export default (props) => {

    function align(direction) {
        props.align(direction);
    }

    return (
        <div className="group-action">
            <label>Group Action</label>
            <div className="group-actions">
                <div className="group-action-btn" onClick={()=>align('left')}>
                    <i className="fas fa-angle-double-left"></i>
                </div>
                <div className="group-action-btn" onClick={()=>align('right')}>
                    <i className="fas fa-angle-double-right"></i>
                </div>
                <div className="group-action-btn" onClick={()=>align('up')}>
                    <i className="fas fa-angle-double-up"></i>
                </div>
                <div className="group-action-btn" onClick={()=>align('down')}>
                    <i className="fas fa-angle-double-down"></i>
                </div>
            </div>
        </div>
    )
}