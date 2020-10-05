import React from 'react'
import { DesignWidgetProvider } from './DesignWidgetContext'
import Container from './Container/index'
import './fonts.scss'

export default (props) => {
    return (
        <DesignWidgetProvider>
            <Container
                content={props.content}
                plan={props.plan}
                debug={props.debug}
                createFlag={props.createFlag}
                width={props.width}
                height={props.height}
                getDesign={props.getDesign}/>
        </DesignWidgetProvider>
    );
}