import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-responsive-modal'
import { DesignWidgetContext } from '../DesignWidgetContext'
import Board from '../Board/index'
import ToolBoxLeft from '../ToolBoxLeft/index'
import ToolBoxRight from '../ToolBoxRight/index'
import './style.scss'

export default (props) => {

	const [state, setState] = useContext(DesignWidgetContext);
	const [loadFont, setLoadFont] = useState(true);

	useEffect(()=>{
		setState(state => ({
			...state,
			init: true,
			content: props.content,
			plan:props.plan,
			debug:props.debug,
			createFlag:props.createFlag,
			width: props.width,
			height: props.height,
			getDesign: props.getDesign
		}));
		setTimeout(() => {
			// setLoadFont(false);
		}, 3);
	}, []);

	return (
		<React.Fragment>
			{state.init &&
				<div className="container design-widget">
					<div className="row">
						<div className="col-sm-3">
							<ToolBoxLeft/>
						</div>
						<div className="col-sm-6">
							<div className="editor-container">
								<div className="editor-border">
									<div className="editor-box">
										<Board debug={state.debug}/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-3">
							<ToolBoxRight plan={state.plan} debug={state.debug}/>
						</div>
					</div>
					
				</div>
			}
		</React.Fragment>
	);
}