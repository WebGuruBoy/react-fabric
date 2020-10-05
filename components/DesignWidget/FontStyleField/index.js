import React, { useEffect, useState } from 'react'
import './style.scss'

export default (props) => {

    const [fontStyle, setFontStyle] = useState({
        bold: false,
        italic: false,
        underline: false,
        overline: false,
        linethrough: false
    });

    useEffect(()=> {
        setFontStyle(props.fontStyle);
    }, []);

    function toggleBold() {
        let _fontStyle = {
            ...fontStyle,
            bold: !fontStyle.bold
        };
        setFontStyle(_fontStyle);
        props.handleUpdate(_fontStyle);
    }

    function toggleItalic() {
        let _fontStyle = {
            ...fontStyle,
            italic: !fontStyle.italic
        };
        setFontStyle(_fontStyle);
        props.handleUpdate(_fontStyle);
    }

    function toggleUnderline() {
        let _fontStyle = {
            ...fontStyle,
            underline: !fontStyle.underline
        };
        setFontStyle(_fontStyle);
        props.handleUpdate(_fontStyle);
    }

    function toggleOverline() {
        let _fontStyle = {
            ...fontStyle,
            overline: !fontStyle.overline
        };
        setFontStyle(_fontStyle);
        props.handleUpdate(_fontStyle);
    }

    function toggleLinethrough() {
        let _fontStyle = {
            ...fontStyle,
            linethrough: !fontStyle.linethrough
        };
        setFontStyle(_fontStyle);
        props.handleUpdate(_fontStyle);
    }

    return (
        <div className="font-style-field">
            <label className="field-title">Font Style</label>
            <div className="field-content">
                <div className={fontStyle.bold ? 'align-btn active' : 'align-btn'} onClick={toggleBold}>
                    <i className="fas fa-bold"></i>
                </div>
                <div className={fontStyle.italic ? 'align-btn active' : 'align-btn'} onClick={toggleItalic}>
                    <i className="fas fa-italic"></i>
                </div>
                <div className={fontStyle.underline ? 'align-btn active' : 'align-btn'} onClick={toggleUnderline}>
                    <i className="fas fa-underline"></i>
                </div>
                <div className={fontStyle.overline ? 'align-btn active' : 'align-btn'} onClick={toggleOverline}>
                    <i className="fas fa-underline fa-flip-vertical"></i>
                </div>
                <div className={fontStyle.linethrough ? 'align-btn active' : 'align-btn'} onClick={toggleLinethrough}>
                    <i className="fas fa-strikethrough"></i>
                </div>
            </div>
        </div>
    )
}