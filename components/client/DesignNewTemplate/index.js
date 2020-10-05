import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserView,
  MobileView
} from "react-device-detect";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import ReactDOM from 'react-dom'
import DesignWidget from '../../DesignWidget/DesignWidget'
import useDesignWidget from '../../DesignWidget/useDesignWidget'
import './style.scss'

const DesignNewTemplate = (props) => {

	const [state, setState] = useState({
		init: false,
		status: 'none'
	});
	const {
		canvasUndo,
		canvasRedo
	} = useDesignWidget();
	const titleText = useRef(null);

	useEffect(()=>{
		axios.post('/api/design/template', {
			uuid: props.uuid
		}).then(res => {
			setState(state => ({
				...state,
				init: true,
				template: res.data.template,
				data: res.data.template,
				plan: res.data.plan,
				debug: props.debug,
				createFlag:true
			}));
		}).catch(err => {});
	}, []);
	function handleUndo(){
		canvasUndo();
	}
	function handleRedo(){
		canvasRedo();
	}

	function handleHistory(event){
		if (event=='ctrl+y'){
			canvasRedo();
			return;
		}
		if (event=='ctrl+z'){
			canvasUndo();
		}
	}
	function updateStatus(status) {
		setState(state => ({
			...state,
			status
		}));
	}

	function createDesign() {
		if (state.status !== 'waiting') {
			updateStatus('waiting');
			axios.post('/api/design/create', {
				...state.data,
				uuid  : state.template.uuid,
				title : titleText.current.value
			}).then(res => {
				if (res.data.success == true) {
					setState(state => ({
						...state,
						status: 'success',
						uuid: res.data.uuid
					}));
				} else {
					updateStatus('failed');
				}
			}).catch(err => {});
		}
	}

	function getDesign(data) {
		setState(state => ({
			...state,
			data
		}));
	}

	return (
		<React.Fragment>
			<BrowserView>
			{!state.init
				? <div className="uk-margin">
					... Loading Template
				</div>
				: <>
					{ state.status === 'success'
						? <div className="next-actions">
							<a className="uk-button uk-button-default" href={`/designs/edit/${state.uuid}`}>
								<i className="fas fa-pen"></i>
								Continue Editing
							</a>
							<a className="uk-button uk-button-primary" href={`/designs/new/${state.template.uuid}`}>
								<i className="fas fa-arrow-left"></i>
								Create similar design
							</a>
							<a className="uk-button uk-button-primary" href="/designs/new">
								<i className="fas fa-arrow-left"></i>
								Create new design
							</a>
						</div>
						: <>
							<div className="uk-margin title-form">
								<input className="uk-input" type="text" ref={titleText} placeholder="Title"/>
								<a className="uk-button uk-button-default" onClick={createDesign}>
									{ state.status === 'waiting' && <i className="fas fa-circle-notch fa-spin uk-margin-right"></i> }
									<i className="fas fa-save">&nbsp;</i><span className="d-none d-md-inline">Save</span>
								</a>
								<a className="uk-button uk-button-default" onClick={handleUndo}>
									<i className="fas fa-undo">&nbsp;</i><span className="d-none d-md-inline">Undo</span>
								</a>
								<a className="uk-button uk-button-default" onClick={handleRedo}>
									<i className="fas fa-redo">&nbsp;</i><span className="d-none d-md-inline">Redo</span>
								</a>
								{ state.status === 'failed' && <span className="uk-margin-left">
									<i className="fas fa-exclamation-triangle uk-margin-small-right uk-text-danger"></i>
									Title is empty
								</span>}
							</div>
							<KeyboardEventHandler
								handleKeys={['ctrl+z', 'ctrl+y']}
								onKeyEvent={handleHistory} />
							<DesignWidget
								content={state.template.content}
								plan={state.plan}
								debug={state.debug}
								createFlag = {state.createFlag}
								width={state.template.width}
								height={state.template.height}
								getDesign={getDesign}
								onKeyDown={handleHistory}/>
						</>
					}
				</>
			}
			</BrowserView>
			<MobileView>
			<div className="text-center">
				<h2 className="text-bold">Looks like you're on a mobile device! </h2>
				<p>Please login from your desktop computer.</p>
			</div>
			</MobileView>
		</React.Fragment>
	);
}

const targetEl = document.getElementById('design-new-template');

if (targetEl) {

	var uuid = targetEl.getAttribute('uuid');
	var debug = targetEl.getAttribute('debug');
	ReactDOM.render(
		<DesignNewTemplate uuid={uuid} debug={debug}/>,
		targetEl
	);
}