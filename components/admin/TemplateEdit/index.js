import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import DesignWidget from '../../DesignWidget/DesignWidget'
import './style.scss'

const TemplateEdit = (props) => {

	const [state, setState] = useState({
		init: false,
		template: null,
		status: 'none',
		data: null
	});

	const titleText = useRef(null);

	useEffect(()=>{
		axios.post('/api/admin/template/get', {
			uuid: props.uuid
		}).then(res => {
			setState(state => ({
				...state,
				init: true,
				template: res.data.template,
				data: res.data.template,
				plan:true
			}));
		}).catch(err => {});
	}, []);

	function updateStatus(status) {
		setState(state => ({
			...state,
			status
		}));
	}

	function saveTemplate() {
		if (state.status !== 'waiting') {
			updateStatus('waiting');
			axios.post('/api/admin/template/update', {
				uuid:    state.template.uuid,
				title:   titleText.current.value,
				content: state.data.content,
				width:   state.data.width,
				height:  state.data.height,
				png:     state.data.png,
				svg:     state.data.svg
			}).then(res => {
				if (res.data.success == true) {
					updateStatus('success');
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
		<>
			{
				!state.init
				?<div className="uk-margin">
					... Loading Templates
				</div>
				:<>
					<div className="uk-margin title-form">
						<input className="uk-input uk-form-width-medium" type="text" defaultValue={state.template.title} ref={titleText} />
						<a className="uk-button uk-button-default uk-margin-small-left" onClick={saveTemplate}>
							{ state.status === 'success' && <i className="fas fa-check uk-margin-small-right uk-text-success"></i> }
							{ state.status !== 'waiting' && 'Save' }
							{ state.status === 'waiting' && <i className="fas fa-circle-notch fa-spin uk-margin-small-left uk-margin-small-right"></i> }
						</a>
						{ state.status === 'failed' && <span className="uk-margin-left">
							<i className="fas fa-exclamation-triangle uk-margin-small-right uk-text-danger"></i>
							Title is empty
						</span>}
					</div>
					<DesignWidget
						content={state.template.content}
						plan={state.plan}
						width={state.template.width}
						height={state.template.height}
						getDesign={getDesign}/>
				</>
			}
		</>
	);
}

const targetEl = document.getElementById('template-edit');

if (targetEl) {

	var uuid = targetEl.getAttribute('uuid');

	ReactDOM.render(
		<TemplateEdit uuid={uuid} />,
		targetEl
	);
}