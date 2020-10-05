import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import './style.scss'

export default (props) => {

    const [state, setState] = useState({
        showColorPicker: false,
        color: props.color
    });

    function toggleColorPicker() {
        setState(state => ({
            ...state,
            showColorPicker: !state.showColorPicker
        }));
    }

    function handleUpdate(color) {
        setState(state => ({
            ...state,
            color: color.hex
        }));
        props.handleUpdate(color.hex);
    }

    return (
        <div className="color-field">
            <div className="color-field-row">
                <label>{props.title}</label>
                <div className="color-field-content" onClick={toggleColorPicker}>
                    <span className="color-value">
                        {state.color || "#######"}
                    </span>
                    <span className="color-box" style={{backgroundColor: state.color}}></span>
                    {state.showColorPicker
                        ?<i className="fas fa-chevron-down"></i>
                        :<i className="fas fa-chevron-right"></i>
                    }
                </div>
            </div>
            {state.showColorPicker && <SketchPicker color={ state.color } onChange={handleUpdate}/>}
        </div>
    )
}