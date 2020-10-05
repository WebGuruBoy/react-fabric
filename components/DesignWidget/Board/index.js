import React, { useState, useEffect, useRef } from 'react'
import useDesignWidget from "../useDesignWidget";
import './style.scss'

export default (props) => {

    const { globalState, createCanvas } = useDesignWidget();

    useEffect(()=>{
        createCanvas('canvas');
    }, []);

    return (
        <canvas id="canvas"></canvas>
    );
}