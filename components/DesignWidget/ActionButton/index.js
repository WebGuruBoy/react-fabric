import React, { useEffect, useState } from 'react'
import './style.scss'

export default (props) => {

    function handleClick() {
        props.action();
    }
    return (
        <span className="action-btn" onClick={handleClick}>
            {props.icon}
            {props.title}
        </span>
    )
}