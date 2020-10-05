import React, { useState, useRef } from 'react'
import useDesignWidget from '../useDesignWidget'
import ActionButton from "../ActionButton/index";
import './style.scss'

export default () => {

	const [newImageLink, setNewImageLink] = useState('');

	const {
		addText,
		addLine,
		addSquare,
		addTriangle,
		addCircle,
		addImage
	} = useDesignWidget();

	const textEl = useRef(null);

	function handleAddText() {
		addText(textEl.current.value);
	}

	function handleImageLoad(event) {
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = (e) => {
				setNewImageLink(e.target['result']);
			}
			reader.readAsDataURL(event.target.files[0]);
		  }
	}

	function handleAddImage() {
		addImage(newImageLink);
	}

	function handleClearImage() {
		setNewImageLink('');
	}

	return (
		<div className="toolbox-left">
			<div className="uk-padding-small">
				<div className="uk-margin">
					<div className="section-title">Text</div>
					<input type="text" className="tb-input" ref={textEl} />
					<ActionButton action={handleAddText} title="ADD"/>
				</div>
				<div className="uk-margin">
					<div className="section-title">Shape</div>
					<ActionButton action={addLine} title="Line"/>
					<ActionButton action={addSquare} title="Square"/>
					<ActionButton action={addTriangle} title="Triangle"/>
					<ActionButton action={addCircle} title="Circle"/>
				</div>
				<div className="uk-margin">
					<div className="section-title">Image</div>
					<div className="image-box">
						<div className="highlight-border">
							<input type="file" id="new-image" onChange={handleImageLoad} />
							{ newImageLink === '' ?
								<label className="new-image" htmlFor="new-image">
									Add Image
								</label>
								:<div className="image-preview" onClick={handleAddImage}>
									<img src={newImageLink} />
								</div>
							}
						</div>
						{ newImageLink !== '' && <ActionButton action={handleClearImage} title="Remove" /> }
					</div>
				</div>
			</div>
		</div>
	);
}