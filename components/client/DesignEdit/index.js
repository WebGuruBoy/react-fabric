import React, { useState, useEffect, useRef } from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';
import ReactDOM from 'react-dom'
import Modal from "react-responsive-modal"
import DesignWidget from '../../DesignWidget/DesignWidget'
import useDesignWidget from '../../DesignWidget/useDesignWidget'
import {
  BrowserView,
  MobileView
} from "react-device-detect";
let shareBoxImageStyle = {
	width: '300px',
	border: '1px dashed #CCC'
};

const DesignEdit = (props) => {

	const [state, setState] = useState({
		init: false,
		design: null,
		status: 'none',
		data: null,
		showShareBox: false,
		showDownloadBox: false
	});
	const {
		canvasUndo,
		canvasRedo
	} = useDesignWidget();
	const titleText = useRef(null);

	useEffect(()=>{
		axios.post('/api/design/get', {
			uuid: props.uuid
		}).then(res => {
			setState(state => ({
				...state,
				init: true,
				design: res.data.design,
				data: res.data.design,
				plan: res.data.plan,
				createFlag:false
			}));
		}).catch(err => {});
	}, []);

	function updateStatus(status) {
		setState(state => ({
			...state,
			status
		}));
	}
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
	function preSaveDesign() {
		axios.post('/api/design/update', {
			uuid    : state.design.uuid,
			title   : titleText.current.value,
			content : state.data.content,
			width   : state.data.width,
			height  : state.data.height,
			png     : state.data.png,
			svg     : state.data.svg
		}).then(res => {
			if (res.data.success == true) {
				setState(state => ({
					...state,
					design: res.data.design
				}));
			}
		}).catch(err => {});
	}
	function saveDesign() {
		if (state.status !== 'waiting') {
			updateStatus('waiting');
			axios.post('/api/design/update', {
				uuid    : state.design.uuid,
				title   : titleText.current.value,
				content : state.data.content,
				width   : state.data.width,
				height  : state.data.height,
				png     : state.data.png,
				svg     : state.data.svg
			}).then(res => {
				if (res.data.success == true) {
					setState(state => ({
						...state,
						status: 'success',
						design: res.data.design
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

	function openShareBox() {
		preSaveDesign();
		setState(state=>({
			...state,
			showShareBox: true
		}));
	}

	function closeShareBox() {
		setState(state=>({
			...state,
			showShareBox: false
		}));
	}

	function openDownloadBox() {
		preSaveDesign();
		setState(state=>({
			...state,
			showDownloadBox: true
		}));
	}

	function closeDownloadBox() {
		setState(state=>({
			...state,
			showDownloadBox: false
		}));
	}

	return (
		<>
		<BrowserView>
			{
				!state.init
				?<div className="uk-margin">
					... Loading Design
				</div>
				:<>
					<div className="uk-margin title-form">
						<input className="uk-input uk-form-width-medium" type="text" defaultValue={state.design.title} ref={titleText} />
						<a className="uk-button uk-button-default uk-margin-small-left" onClick={saveDesign}>
							{ state.status === 'success' && <i className="fas fa-check uk-margin-small-right uk-text-success"></i> }
							{ state.status !== 'waiting' && 'Save' }
							{ state.status === 'waiting' && <i className="fas fa-circle-notch fa-spin uk-margin-small-left uk-margin-small-right"></i> }
						</a>
						<a className="uk-button uk-button-default" onClick={handleUndo}>
							<span>Undo</span>
						</a>
						<a className="uk-button uk-button-default" onClick={handleRedo}>
							<span>Redo</span>
						</a>
						<button className="uk-button uk-button-default uk-margin-left" onClick={openShareBox}>
							<i className="fas fa-share-alt"></i>
						</button>
						<button className="uk-button uk-button-default uk-margin-left" onClick={openDownloadBox}>
							<i className="fas fa-download"></i>
						</button>
						<Modal open={state.showShareBox} onClose={closeShareBox} closeIconSize={0}>
							<div>{state.saved}</div>
							<div className="uk-margin uk-text-center">
								<div className="uk-margin-bottom">Preview of Saved Design</div>
								<img src={props.baseurl+state.design.png+ '?' + Date.now()} style={shareBoxImageStyle} key={state.saved}/>
							</div>
							{ props.etarget=='1'?
								<>
							<div className="uk-margin-small-bottom uk-text-center">Share:</div>
							<a href={props.baseurl+state.design.png}>
								{props.baseurl+state.design.png}
							</a>
							</>
							:
							<>
							<p className="text-center text-small">
								Please upgrade to remove watermark<br/> and download.
							</p>
							<p className="text-center">
								<a className="uk-button uk-button-danger" href={props.baseurl+'/myaccount'}>
									<i className="fas fa-gift uk-margin-right"></i>
									Upgrade
								</a>
							</p>
							</>
							}
						</Modal>
						<Modal open={state.showDownloadBox} onClose={closeDownloadBox} closeIconSize={0}>
							<div>{state.saved}</div>
							<div className="uk-margin uk-text-center">
								<div className="uk-margin-bottom">Preview of Saved Design</div>
								<img src={props.baseurl+state.design.png+ '?' + Date.now()} style={shareBoxImageStyle} key={state.saved}/>
							</div>
							<div className="uk-margin-small-bottom uk-text-center">Download:</div>
							<div className="uk-margin uk-text-center">
								{ props.etarget=='1'?
								<>
								<a className="uk-button uk-button-default" href={props.baseurl+state.design.png} download>
									<i className="fas fa-download uk-margin-right"></i>
									.PNG
								</a>
								<a className="uk-button uk-button-default uk-margin-left" href={props.baseurl+state.design.svg} download>
									<i className="fas fa-download uk-margin-right"></i>
									.JPG
								</a>
								</>
								:
								<>
								<p className="text-center text-small">
									Please upgrade to remove watermark<br/> and download.
								</p>
								<a className="uk-button uk-button-danger" href={props.baseurl+'/myaccount'}>
									<i className="fas fa-gift uk-margin-right"></i>
									Upgrade
								</a>
								</>
								}
							</div>
						</Modal>
						{ state.status === 'failed' && <span className="uk-margin-left">
							<i className="fas fa-exclamation-triangle uk-margin-small-right uk-text-danger"></i>
							Title is empty
						</span>}
					</div>
					<KeyboardEventHandler
								handleKeys={['ctrl+z', 'ctrl+y']}
								onKeyEvent={handleHistory} />
					<DesignWidget
						content={state.design.content}
						plan={state.plan}
						createFlag = {state.createFlag}
						width={state.design.width}
						height={state.design.height}
						getDesign={getDesign}/>
				</>
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

const targetEl = document.getElementById('design-edit');

if (targetEl) {

	var uuid = targetEl.getAttribute('uuid');
	var baseurl = targetEl.getAttribute('baseurl');
	var etarget = targetEl.getAttribute('etarget');
	var debug = targetEl.getAttribute('debug');

	ReactDOM.render(
		<DesignEdit uuid={uuid} baseurl={baseurl} etarget={etarget} debug={debug}/>,
		targetEl
	);
}