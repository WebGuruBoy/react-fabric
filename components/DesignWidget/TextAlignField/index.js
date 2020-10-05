import React, { useEffect, useState } from 'react'
import './style.scss'

export default (props) => {

    const [align, setAlign] = useState('none');

    useEffect(()=> {
        setAlign(props.align);
    }, []);


    function handleClick(align) {
        setAlign(align);
        props.handleChange(align);
    }

    return (
        <div className="text-align-field">
            <label className="field-title">Text Align</label>
            <div className="field-content">
                <div className={align === 'left' ? 'align-btn active' : 'align-btn'} onClick={()=>handleClick('left')}>
                    <i className="fas fa-align-left"></i>
                </div>
                <div className={align === 'right' ? 'align-btn active' : 'align-btn'} onClick={()=>handleClick('right')}>
                    <i className="fas fa-align-right"></i>
                </div>
                <div className={align === 'center' ? 'align-btn active' : 'align-btn'} onClick={()=>handleClick('center')}>
                    <i className="fas fa-align-center"></i>
                </div>
                <div className={align === 'justify' ? 'align-btn active' : 'align-btn'} onClick={()=>handleClick('justify')}>
                    <i className="fas fa-align-justify"></i>
                </div>
            </div>
        </div>
    )
}