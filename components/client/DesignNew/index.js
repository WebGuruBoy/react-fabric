import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserView,
  MobileView
} from "react-device-detect";
import ReactDOM from 'react-dom'
import './style.scss'

const DesignCreate = () => {

	const [state, setState] = useState({
		init: false,
		templates: [],
		filtered: []
	});

	const searchText = useRef(null);

	useEffect(()=>{
		axios.post('/api/design/templates').then(res => {
			setState(state => ({
				...state,
				init: true,
				templates: res.data.templates,
				filtered: res.data.templates
			}));
		}).catch(err => {});
	}, []);

	function handleSearch() {
		let filtered = state.templates.filter(template => {
			if (template.title.toLowerCase().includes(searchText.current.value.toLowerCase())) {
				return true;
			}
			return false;
		})
		setState(state=>({
			...state,
			filtered
		}))
	}

	return (
		<>
		<BrowserView>
			{
				!state.init
				?<div className="uk-margin">
					... Loading Templates
				</div>
				:<>
					<div className="uk-margin">
						<input
							className="uk-input uk-form-width-medium"
							type="text"
							placeholder="Search"
							onChange={handleSearch}
							ref={searchText} />
					</div>
					<hr/>
					<div className="uk-margin uk-text-center">
						Choose Template
					</div>
					<div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3@s uk-child-width-1-4@m">
						{
							state.filtered.map(template =>
								<a
									className="uk-margin-bottom template-box"
									key={template.uuid}
									href={`/designs/new/${template.uuid}`}
									>
									<div className="uk-card uk-card-default uk-card-small ">
										<div className="uk-card-header">
											{ template.title }
										</div>
										<div className="uk-card-body uk-text-center design-thumbnail">
											{ template.png ? <img className="border-image" src={template.png+'.jpg'} />:<i className="far fa-image empty-image"></i> }
										</div>
									</div>
								</a>
							)
						}
					</div>
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

const targetEl = document.getElementById('design-new');

if (targetEl) {
	ReactDOM.render(
		<DesignCreate />,
		targetEl
	);
}