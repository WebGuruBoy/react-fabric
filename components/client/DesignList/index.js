import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserView,
  MobileView
} from "react-device-detect";
import './style.scss'

const DesignList = () => {

    const [state, setState] = useState({
        init: false,
        designs: []
    });

    useEffect(()=>{
        axios.post('/api/design/all').then(res => {
            setState({
                init: true,
                designs: res.data.designs
            });
        }).catch(err => {});
    }, []);

    function removeDesign(uuid) {
        var r = confirm("Do you want to remove?");
        if (r == true) {
            axios.post('/api/design/remove',{
                uuid
            }).then(res => {
                setState(state=>({
                    ...state,
                    designs: res.data.designs
                }));
            }).catch(err => {});
        }
    }

    return (
        <>
        <BrowserView>
            {
                !state.init
                ?<div className="uk-margin">
                    ... Loading Designs
                </div>
                : <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3@s uk-child-width-1-4@m">
                    {
                        state.designs.map(design =>
                            <div className="uk-margin-bottom design-box" key={design.uuid}>
                                <div className="uk-card uk-card-default uk-card-small">
                                    <div className="uk-card-header">
                                        { design.title }
                                        <a className="uk-button uk-button-default uk-button-small uk-margin-left" onClick={()=>removeDesign(design.uuid)}>
                                            <i className="far fa-trash-alt"></i>
                                        </a>
                                    </div>
                                    <div className="uk-card-body uk-text-center design-thumbnail">
                                        <a className="design-preview" href={`/designs/edit/${design.uuid}`}>
                                            <img className="border-image" src={design.png+'.jpg'} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            }
        </BrowserView>
        <MobileView>
			<div className="text-center">
				<h2 className="text-bold">Looks like you're on a mobile device! </h2>
				<p>Please login from your desktop computer.</p>
			</div>
		</MobileView>
        </>
    );
}

const targetEl = document.getElementById('design-list');

if (targetEl) {
    ReactDOM.render(
        <DesignList />,
        targetEl
    );
}