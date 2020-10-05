import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const TemplateList = () => {

    const [state, setState] = useState({
        init: false,
        templates: [],
        status: 'none'
    });

    const titleText = useRef(null);

    useEffect(()=>{
        axios.post('/api/admin/template/all').then(res => {
            setState(state => ({
                init: true,
                templates: res.data.templates
            }));
        }).catch(err => {});
    }, []);

    function updateStatus(status) {
        setState(state => ({
            ...state,
            status
        }));
    }

    function createTemplate() {
        if (state.status !== 'waiting') {
            updateStatus('waiting');
            axios.post('/api/admin/template/create', {
                title: titleText.current.value,
            }).then(res => {
                if (res.data.success == true) {
                    updateStatus('success');
                    setState(state => ({
                        ...state,
                        templates: res.data.templates
                    }));
                } else {
                    updateStatus('failed');
                }
            }).catch(err => {});
        }
    }

    function archiveTemplate(uuid) {
        var r = confirm("Do you want to archive?");
        if (r == true) {
            axios.post('/api/admin/template/archive',{
                uuid
            }).then(res => {
                setState(state=>({
                    ...state,
                    templates: res.data.templates
                }));
            }).catch(err => {});
        }
    }

    return (
        <>
            {
                !state.init
                ?<div className="uk-margin">
                    ... Loading Templates
                </div>
                :<>
                    <div className="uk-margin">
                        <input className="uk-input uk-form-width-medium" type="text" placeholder="Title" ref={titleText} />
                        <a className="uk-button uk-button-default uk-margin-small-left" onClick={createTemplate}>
                            { state.status === 'success' && <i className="fas fa-check uk-margin-small-right uk-text-success"></i> }
                            { state.status === 'failed' && <i className="fas fa-exclamation-triangle uk-margin-small-right uk-text-danger"></i> }
                            { state.status !== 'waiting' && 'Create' }
                            { state.status === 'waiting' && <i className="fas fa-circle-notch fa-spin uk-margin-small-left uk-margin-small-right"></i> }
                        </a>
                    </div>
                    <hr/>
                    <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3@s uk-child-width-1-4@m">
                        {
                            state.templates.map(template =>
                                <div className="uk-margin-bottom template-box" key={template.uuid}>
                                    <div className="uk-card uk-card-default uk-card-small">
                                        <div className="uk-card-header no-before short-header">
                                            { template.title }
                                        </div>
                                        <div className="uk-card-body uk-text-center design-thumbnail">
                                            { template.png ? <img className="border-image" src={template.png+'.jpg'} />:<i className="far fa-image empty-image"></i> }
                                        </div>
                                        <div className="uk-card-footer uk-text-center">
                                            <a className="uk-button uk-button-default uk-button-small uk-margin-right" href={`/admin/templates/edit/${template.uuid}`}>
                                                <i className="far fa-edit"></i>
                                            </a>
                                            <a className="uk-button uk-button-default uk-button-small" onClick={()=>archiveTemplate(template.uuid)}>
                                                <i className="far fa-trash-alt"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </>
            }
        </>
    );
}

const targetEl = document.getElementById('template-list');

if (targetEl) {
    ReactDOM.render(
        <TemplateList />,
        targetEl
    );
}