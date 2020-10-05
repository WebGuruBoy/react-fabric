import React from 'react'
import './style.scss'

export default (props) => {
    return (
        <div className="layer-action">
            <div className="layer-actions">

                <div className="layer-action-btn" onClick={props.layerDown}>
                    <i className="fas fa-angle-double-down"></i>
                </div>
                <div className="layer-action-btn" onClick={props.layerUp}>
                    <i className="fas fa-angle-double-up"></i>
                </div>
                <div className="layer-action-btn" onClick={props.layerBackward}>
                    <i className="fas fa-level-down-alt"></i>
                </div>
                <div className="layer-action-btn" onClick={props.layerForward}>
                    <i className="fas fa-level-up-alt"></i>
                </div>
                <div className="layer-action-btn" onClick={props.clone}>
                    <i className="far fa-clone"></i>
                </div>
                <div className="layer-action-btn" onClick={props.pin}>
                    <i className="fas fa-thumbtack"></i>
                </div>
                <div className="layer-action-btn" onClick={props.delete}>
                    <i className="fas fa-trash"></i>
                </div>
            </div>
        </div>
    )
}