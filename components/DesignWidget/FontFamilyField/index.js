import React, { useEffect, useState, useRef } from 'react'
import './style.scss'

export default (props) => {

	const [state, setState] = useState({
		fonts: [
			'Arvo',
			'B612 Mono',
			'Courier Prime',
			'Cutive Mono',
			'Geo',
			'Lekton',
			"'Libre Barcode 39', sans-serif",
			'Libre Barcode 39 Text',
			'Nanum Gothic Coding',
			"'Open Sans', sans-serif",
			'Press Start 2P',
			'PT Mono',
			"'Raleway', sans-serif",
			"'Roboto', sans-serif",
			'Roboto Mono',
			'Share Tech Mono',
			'Source Code Pro',
			'Space Mono',
			'Special Elite',
			'Stint Ultra Expanded',
			'Thermal Receipt1',
			'Thermal Receipt2',
			'VT323'
		],
		fontFamily: 'Arvo',
		showList: false
	});

	useEffect(() => {
		setState(state => ({
			...state,
			fontFamily: props.fontFamily
		}));
	}, []);

	function toggleList() {
		setState(state => ({
			...state,
			showList: !state.showList
		}));
	}

	function handleFontUpdate(font) {
		setState(state => ({
			...state,
			fontFamily: font
		}));
		props.handleUpdate(font);
	}

	return (
		<div className="font-family-field">
			<label>Font Family</label>
			<div className="font-family-content">
				<div className="font-selected" onClick={toggleList}>
					{state.fontFamily}
					{ state.showList
						? <i className="fas fa-chevron-down"></i>
						: <i className="fas fa-chevron-right"></i>
					}
				</div>
				{ state.showList &&
					<div>
						{ state.fonts.map((font, i) =>
							<div className="font-option" onClick={() => handleFontUpdate(font)} key={i} >
								{font}
							</div>
						)}
					</div>
				}
			</div>
		</div>
	)
}