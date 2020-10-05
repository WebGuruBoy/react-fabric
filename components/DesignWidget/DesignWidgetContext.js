import React, { useState } from 'react'

const DesignWidgetContext = React.createContext([{}, () => {}]);

const DesignWidgetProvider = (props) => {
    const [state, setState] = useState({
        init: false,
        selected: false
    });
    return (
        <DesignWidgetContext.Provider value={[state, setState]}>
            {props.children}
        </DesignWidgetContext.Provider>
    );
}

export { DesignWidgetContext, DesignWidgetProvider };