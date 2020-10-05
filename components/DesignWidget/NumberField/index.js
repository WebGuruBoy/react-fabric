import React, { useEffect, useState, useRef } from 'react'
import './style.scss'

export default (props) => {

    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.value);
    }, []);

    const inputEl = useRef(null);
    const scrollEl = useRef(null);

    function handleInput() {
        setValue(inputEl.current.value);
        props.handleUpdate(inputEl.current.value);
    }

    function handleScroll() {
        setValue(scrollEl.current.value);
        props.handleUpdate(scrollEl.current.value);
    }

    return (
        <div className="number-filed">
            <div className="number-field-row">
                <label>{props.title}</label>
                <input
                    type="text"
                    ref={inputEl}
                    value={value}
                    onChange={handleInput}/>
            </div>
            {props.scroll &&
                <div className="number-field-row">
                    <label></label>
                    <input
                        type="range"
                        min={props.min}
                        max={props.max}
                        step={props.step}
                        ref={scrollEl}
                        value={value}
                        onChange={handleScroll}/>
                </div>
            }
        </div>
    )
}