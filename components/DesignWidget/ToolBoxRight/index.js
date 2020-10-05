import React, { useState, useEffect, useRef } from 'react'

import useDesignWidget from '../useDesignWidget'
import ActionButton from "../ActionButton/index"
import ColorField from "../ColorField/index"
import NumberField from "../NumberField/index"
import TextAlignField from "../TextAlignField/index"
import FontStyleField from "../FontStyleField/index"
import FontFamilyField from "../FontFamilyField/index"
import LayerAction from "../LayerAction/index"
import GroupAction from "../GroupAction/index"
import './style.scss'

export default (props) => {
	const {
		globalState,
		updateCanvasWidth,
		updateCanvasHeight,
		setOpacity,
		setStroke,
		setFill,
		setFontSize,
		setLineHeight,
		setCharSpacing,
		setFontStyle,
		setTextAlign,
		setFontFamily,
		removeSelected,
		moveSelectedToBack,
		moveSelectedToFront,
		moveSelectedToBackwards,
		moveSelectedToForward,
		cloneSelected,
		alignSelected,
		cancelSelection,
		setLock,
		setUnLock,
		getCanvas,
		setActiveItem
	} = useDesignWidget();
	const [state, setState] = useState({
		layouts: [],
		plan:props.plan
	});
	const stopIcon = <i className="far fa-stop-circle"></i>;
	const closeIcon = <i className="fas fa-times"></i>;

	useEffect(() => {
		globalState.getDesign(getCanvas());
		let obj = getCanvas();
		setState({
			layouts: obj.content.reverse()
		});
	}, [globalState.modified]);
	function selectLayer(id, selecable){
		if(selecable)
			setActiveItem(id);
	}
	function unlockLayer(id){
		setUnLock(id);
	}
	function goForward(){
		moveSelectedToForward();
	}
	function goBackward(){
		moveSelectedToBackwards();
	}
	return (
		<div className="toolbox-right">
			<div className="uk-padding-small">
				<div className="uk-margin">
					<div className="section-title">
						Layers
						<LayerAction layerUp={moveSelectedToFront} layerDown={moveSelectedToBack} clone={cloneSelected} pin={setLock} layerForward={goForward} layerBackward={goBackward} delete={removeSelected} deselect={cancelSelection} plan={state.plan}/>
					</div>
					<div className="layers-wrap">
					{
						state.layouts.map((layout) =>
							(!(layout.type=='image' && layout.src.indexOf('watermark_js.png')>-1 && layout.selectable==false)) &&
							<div className={layout.active?'layer-item active':'layer-item'} key={layout.id} onClick={()=>selectLayer(layout.id, layout.selectable)}>
								{layout.type=='i-text'?'Text Layer':(layout.type + ' Layer')}
								{ !layout.selectable?
									<span className="unpin-btn" onClick={()=>unlockLayer(layout.id)}><i className="fas fa-thumbtack"></i></span>
									:''
								}
							</div>
						
						)
					}
					</div>
				</div>
				<div className="uk-margin">
					<div className="section-title">
						Canvas
					</div>
					<NumberField title="Width" scroll={false} handleUpdate={updateCanvasWidth} value={globalState.width}/>
					<NumberField title="Height" scroll={false} handleUpdate={updateCanvasHeight} value={globalState.height}/>
				</div>
				{ globalState.selected &&
					<div>
						{!globalState.group && <>
							<div className="section-title">Selection</div>
							<ColorField title="Fill" color={globalState.fill} handleUpdate={setFill} />
							<ColorField title="Stroke" color={globalState.stroke} handleUpdate={setStroke} />
							<NumberField title="Opacity" scroll={true} min="0" max="100" step="1" handleUpdate={setOpacity} value={globalState.opacity}/>
							{globalState.type === 'i-text' && <>
								<NumberField title="Font Size" scroll={true} min="0" max="120" step="1" handleUpdate={setFontSize} value={globalState.fontSize}/>
								<NumberField title="Line Height" scroll={true} min="0" max="5" step="0.01" handleUpdate={setLineHeight} value={globalState.lineHeight}/>
								<NumberField title="Char Spacing" scroll={true} min="0" max="1000" step="1" handleUpdate={setCharSpacing} value={globalState.charSpacing}/>
								<TextAlignField align={globalState.textAlign} handleChange={setTextAlign} />
								<FontStyleField fontStyle={globalState.fontStyle} handleUpdate={setFontStyle} />
								<FontFamilyField fontFamily={globalState.fontFamily} handleUpdate={setFontFamily} />
							</>}
						</>}
						{globalState.group && <>
							<div className="section-title">Group Selection</div>
							<GroupAction align={alignSelected} />
						</>}
					</div>
				}
			</div>
		</div>
	);
}