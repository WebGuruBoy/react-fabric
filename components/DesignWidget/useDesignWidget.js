import { useContext, useEffect } from 'react'
import { DesignWidgetContext } from "./DesignWidgetContext"
import { fabric } from 'fabric';
import 'fabric-history';
const uuidv1 = require('uuid/v1');
var canvas = null;
var skipitem = 0;
export default () => {
	const [state, setState] = useContext(DesignWidgetContext);

	function createCanvas(id) {
		canvas = new fabric.Canvas(id, {
			hoverCursor: 'pointer',
			selection: true,
			selectionBorderColor: 'blue',
			width: state.width,
			height: state.height,
			backgroundColor: 'transparent'
		});
		// canvas.initialize();
		canvas.on({
			'object:added': (e) => {canvasUpdated(); },
			'object:removed': (e) => {canvasUpdated(); },
			'object:selected': (e) => {canvasUpdated(); },
			'object:moving': (e) => { },
			'object:modified': (e) => {
				canvasUpdated();
			},
			'selection:created': (e) => {
				selectObjects(e);
			},
			'selection:updated': (e) => {
				selectObjects(e);
				canvasUpdated();
			},
			'selection:cleared': (e) => {
				cancelSelection();
				canvasUpdated();
			}
		});
		// document.fonts.ready.then(function () {
			loadCanvas(state.content);
		// });
		canvas.clearHistory();
		setState(state => ({
			...state,
			width: state.width,
			height: state.height
		}));
	}

	function canvasUpdated() {
		setState(state=>({
			...state,
			modified: uuidv1()
		}));
	}

	function selectObjects(e) {
		let selectedObject = e.target;
		selectedObject.hasRotatingPoint = true;
		selectedObject.transparentCorners = false;

		setState(state => ({
			...state,
			selected: true,
			group: selectedObject.type === 'activeSelection',
			type: selectedObject.type,
			id: getId(),
			locked: getLocked(), 
			opacity: getOpacity(),
			fill: getFill(),
			stroke: getStroke(),
			fontSize: getFontSize(),
			lineHeight: getLineHeight(),
			charSpacing: getCharSpacing() || 0,
			textAlign: getTextAlign(),
			fontStyle: getFontStyle(),
			fontFamily: getFontFamily()
		}));
	}

	function cancelSelection() {
		canvas.discardActiveObject().renderAll();
		setState(state => ({
			...state,
			selected: false
		}))
	}

	function getActiveStyle(styleName, object) {
		object = object || canvas.getActiveObject();
		if (!object) return '';
	
		return (object.getSelectionStyles && object.isEditing)
			? (object.getSelectionStyles()[styleName] || '')
			: (object[styleName] || '');
	}
	
	function setActiveStyle(styleName, value, object) {
		object = object || canvas.getActiveObject();
		if (!object) return;

		if(typeof(object._objects)!='undefined' && object._objects.length>1){

			object = object._objects[0];
		}
		
		if (object.setSelectionStyles && object.isEditing) {
			var style = {};
			style[styleName] = value;
			object.setSelectionStyles(style);
			object.setCoords();
		}
		else {
			object.set(styleName, value);
		}
	
		object.setCoords();
		canvas.renderAll();
	}

	function getActiveProp(name) {
		var object = canvas.getActiveObject();
		if (!object) return '';
		return object[name] || '';
	}

	function setActiveProp(name, value) {
		var object = canvas.getActiveObject();
		if (!object) return;
		object.set(name, value).setCoords();
		canvas.renderAll();

		// var object = canvas.getActiveObject();
		// if (!object) return;
		// var style = {};
		// style[name] = value;
		// object.setSelectionStyles(style);
		// object.set(name, value);
		// object.setCoords();
		// canvas.renderAll();
	}

	function getId() {
		return canvas.getActiveObject().toObject().id;
	}

	function getOpacity() {
		return getActiveStyle('opacity', null) * 100;
	}

	function setOpacity(opacity) {
		setActiveStyle('opacity', opacity / 100, null);
		setState(state => ({
			...state,
			opacity,
			modified: uuidv1()
		}));
	}

	function getStroke() {
		return getActiveStyle('stroke', null);
	}

	function setStroke(stroke) {
		setActiveStyle('stroke', stroke, null);
		setState(state => ({
			...state,
			stroke,
			modified: uuidv1()
		}));
	}

	function getFill() {
		return getActiveStyle('fill', null);
	}

	function setFill(fill) {
		setActiveStyle('fill', fill, null);
		setState(state => ({
			...state,
			fill,
			modified: uuidv1()
		}));
	}

	function getFontSize() {
		return getActiveStyle('fontSize', null);
	}

	function setFontSize(fontSize) {
		setActiveStyle('fontSize', parseInt(fontSize), null);
		setState(state => ({
			...state,
			fontSize,
			modified: uuidv1()
		}));
	}

	function getLineHeight() {
		return getActiveStyle('lineHeight', null);
	}

	function setLineHeight(lineHeight) {
		let activeObject = canvas.getActiveObject();
		activeObject.set('lineHeight',parseFloat(lineHeight));
		canvas.renderAll();
		setState(state => ({
			...state,
			lineHeight,
			modified: uuidv1()
		}));
	}

	function getCharSpacing() {
		return getActiveStyle('charSpacing', null);
	}

	function setCharSpacing(charSpacing) {
		setActiveStyle('charSpacing', charSpacing, null);
		setState(state => ({
			...state,
			charSpacing,
			modified: uuidv1()
		}));
	}

	function getFontStyle() {
		return {
			bold: getActiveStyle('fontWeight', null) === 'bold',
			italic: getActiveStyle('fontStyle', null) === 'italic',
			underline: getActiveStyle('underline', null),
			overline: getActiveStyle('overline', null),
			linethrough: getActiveStyle('linethrough', null)
		};
	}

	function setFontStyle(fontStyle) {
		setActiveStyle('fontWeight', fontStyle.bold ? 'bold' : '', null);
		setActiveStyle('fontStyle', fontStyle.italic? 'italic' : 'normal', null);
		setActiveStyle('underline', fontStyle.underline);
		setActiveStyle('overline', fontStyle.overline);
		setActiveStyle('linethrough', fontStyle.linethrough);
		setState(state => ({
			...state,
			fontStyle,
			modified: uuidv1()
		}));
	}

	function getTextAlign() {
		return getActiveProp('textAlign');
	}

	function setTextAlign(textAlign) {
		setActiveProp('textAlign', textAlign);
		setState(state => ({
			...state,
			textAlign,
			modified: uuidv1()
		}));
	}

	function getFontFamily() {
		return getActiveProp('fontFamily');
	}

	function setFontFamily(fontFamily) {
		fabric.util.clearFabricFontCache();
		setActiveProp('fontFamily', fontFamily);
		setState(state => ({
			...state,
			fontFamily,
			modified: uuidv1()
		}));
	}

	function getLocked() {
		let activeObject = canvas.getActiveObject();
		return !activeObject.selectable;
	}

	function setLock() {
		let activeObject = canvas.getActiveObject();
		activeObject.selectable = false;
		setState(state => ({
			...state,
			modified: uuidv1()
		}))
		canvas.discardActiveObject().renderAll();
		canvas.renderAll();
		canvasUpdated();
	}
	function setUnLock(id) {
		canvas.discardActiveObject().renderAll();
		canvas.getObjects().forEach(object => {
			let obj = object.toObject();
			if(obj['id']==id){
				object.selectable = true;
				canvas.setActiveObject(object);
				object.setCoords();
			}
		});
		canvas.renderAll();
		canvasUpdated();
	}
	function setActiveItem(id){
		canvas.discardActiveObject().renderAll();
		canvas.getObjects().forEach(object => {
			let obj = object.toObject();
			if(obj['id']==id){
				canvas.setActiveObject(object);
				canvas.renderAll();
				object.setCoords();
			}
		});
		canvasUpdated();
	}
	function loadCanvas(data) {
		console.log("==================Start loading JSON==================")
		if(! state.plan && state.createFlag){
			addWatermark();
		}
		data.forEach(object => {
			createObjectFromJSON(object);
		});
	};
	function addWatermark() {
		let str = "expenseFAST";
		for(let w=0;w<state.width;w+=500){
			for(let h=0;h<state.height;h+=500){
				fabric.Image.fromURL('/images/watermark_js.png', (image) => {
				// let text = new fabric.IText(str, {
				// 	left: w,
				// 	top: h+90,
				// 	fontFamily: 'Arvo',
				// 	angle: -45,
				// 	fill: '#888888',
				// 	scaleX: 4,
				// 	scaleY: 4,
				// 	fontWeight: '',
				// 	hasRotatingPoint: false,
				// 	selectable:false,
				// 	opacity:0.3
				// });
				// extend(text, uuidv1());
				// canvas.add(text);
				// selectItemAfterAdded(text);
				
					image.set({
						left: w,
						top: h,
						angle: 0,
						padding: 10,
						cornersize: 10,
						hasRotatingPoint: true,
						selectable:false,
						watermark:true,
					});
					// image.scaleToWidth(200);
					let id = uuidv1()
					let obj = extend(image, id);
					canvas.add(image);
					selectItemAfterAdded(image);
					setActiveItem(id);
					moveSelectedToBack();
					canvasUpdated();
				});
				}
			}
		// canvasUpdated();
	}
	function createObjectFromJSON(data) {
		if(state.debug){
			console.log('---------- object json ------------');
			console.log(data);
		}
		let clone;
		switch (data.type) {
			case 'line':
				clone = new fabric.Line(
					[0,100,200,100],
					data
				);
				addObjectToCanvas(clone, data.id);
				break;
			case 'rect':
				clone = new fabric.Rect(data);
				if(! state.plan && state.createFlag){
					var text = new fabric.Text("expenseFAST", {
						fontSize: 16,
						fill:'#ddd'
					});
					text.set("top", data.top + data.height*data.scaleY/2 - (text.height / 2));
					text.set("left", data.left + data.width*data.scaleX/2 - (text.width / 2));
					var group = new fabric.Group([clone, text], {
						left: data.left,
						top: data.top,
					});
				} else {
					var group = clone;
				}
				addObjectToCanvas(group, data.id);
				break;
			case 'circle':
				clone = new fabric.Circle(data);
				if(! state.plan && state.createFlag){
					var text = new fabric.Text("expenseFAST", {
						fontSize: 16,
						fill:'#ddd'
					});
					text.set("top", data.top + data.height*data.scaleY/2 - (text.height / 2));
					text.set("left", data.left + data.width*data.scaleX/2 - (text.width / 2));
					var group = new fabric.Group([clone, text], {
						left: data.left,
						top: data.top,
					});
				} else {
					var group = clone;
				}
				addObjectToCanvas(group, data.id);
				break;
			case 'triangle':
				clone = new fabric.Triangle(data);
				if(! state.plan && state.createFlag){
					var text = new fabric.Text("expenseFAST", {
						fontSize: 14,
						fill:'#ddd'
					});
					text.set("top", data.top + data.height*data.scaleY - (text.height*2));
					text.set("left", data.left + data.width*data.scaleX/2 - (text.width / 2));
					var group = new fabric.Group([clone, text], {
						left: data.left,
						top: data.top,
					});
				} else {
					var group = clone;
				}
				addObjectToCanvas(group, data.id);
				break;
			case 'i-text':
				if(state.plan && data.text=='expenseFAST' && data.selectable==false){
					break;
				}
				if(data.text==null){
					if(state.debug){
						console.error('*******************ERROR*********************');
						console.error('******* text value is null - breaking *******');
						console.error('*********************************************');
					}
					addObjectToCanvas(null, data.id);
					break;
				}
				clone = new fabric.IText('', data);
				addObjectToCanvas(clone, data.id);
				break;
			case 'image':
				if(state.plan && data.src.indexOf('watermark_js.png')>-1 && data.selectable==false){
					skipitem++;
					break;
				}
				fabric.Image.fromObject(data, d => {
					clone = d;
					if(!d){
						if(state.debug){
							console.error('*******************ERROR*********************');
							console.error('******** Image source is not found. *********')
							console.error('*********************************************');
						}
						addObjectToCanvas(null, data.id);
						return false
					}
					if(! state.plan && state.createFlag){
						var text = new fabric.Text("expenseFAST", {
							fontSize: 14,
							fill:'#ddd'
						});
						text.set("top", data.top + data.height*data.scaleY/2 - (text.height/2));
						text.set("left", data.left + data.width*data.scaleX/2 - (text.width / 2));
						var group = new fabric.Group([clone, text], {
							left: data.left,
							top: data.top,
						});
					} else {
						var group = clone;
					}
					addObjectToCanvas(group, data.id);
				});
				break;
			case 'group':
				switch (data.objects[0].type) {
					case 'rect':
						clone = new fabric.Rect(data.objects[0]);
						break;
					case 'circle':
						clone = new fabric.Circle(data.objects[0]);
						break;
					case 'triangle':
						clone = new fabric.Triangle(data.objects[0]);
						break;
					case 'image':
						fabric.Image.fromObject(data.objects[0], d => {
							clone = d;
							if(!d){
								if(state.debug){
									console.error('*******************ERROR*********************');
									console.error('******** Image source is not found. *********')
									console.error('*********************************************');
								}
								addObjectToCanvas(null, data.id);
								return false
							}
							if(! state.plan){
								var text = new fabric.Text("", data.objects[1]);
								var group = new fabric.Group([clone, text], {
									left: data.left,
									top: data.top,
								});
							} else {
								clone.left = data.left;
								clone.top = data.top;
								var group = clone;
							}
							addObjectToCanvas(group, data.id);
						});
						return;
						break;
				}
				if(! state.plan){
					var text = new fabric.Text("", data.objects[1]);
					var group = new fabric.Group([clone, text], {
						left: data.left,
						top: data.top,
					});
				} else {
					clone.left = data.left;
					clone.top = data.top;
					var group = clone;
				}
				addObjectToCanvas(group, data.id);
			break;
		}
		
		if (clone) {
		}
	}
	
	function addObjectToCanvas(object, id) {
		// console.log('start to add object to canvas')
		if(object==null){
			skipitem++;
			if(canvas.getObjects().length==state.content.length-skipitem){
				document.fonts.ready.then(function () {
					setTimeout(function(){
						setActiveItem(state.content[0].id);
						moveSelectedToBack();
						setActiveItem(state.content[state.content.length-1-skipitem].id);
						// if(! state.plan && state.createFlag){
						// 	addWatermark();
						// }
						canvas.clearHistory();
					},200);
				});
			}
			return false;
		} 
		extend(object, id);
		canvas.add(object);
		canvas.renderAll();
		// console.log('finish adding object to canvas')
		var textId = null;
	
		if(canvas.getObjects().length==state.content.length-skipitem){
			document.fonts.ready.then(function () {
				setTimeout(function(){
					setActiveItem(state.content[0].id);
					moveSelectedToBack();
					setActiveItem(state.content[state.content.length-1-skipitem].id);
					// if(! state.plan && state.createFlag){
					// 		addWatermark();
					// }
					canvas.clearHistory();
				},200);
			});
		}
	}
	
	function getCanvas() {
		let objects = [];
		let activeObjects = canvas.getActiveObjects();
		canvas.getObjects().forEach(object => {
			if(object){
				let obj = object.toObject();
				obj['selectable'] = object.selectable;
				obj['active'] = false;
				if(activeObjects.indexOf(object)!=-1)
					obj['active'] = true;
				objects.push(obj);
			}
		});

		return {
			content: objects,
			width: canvas.getWidth(),
			height: canvas.getHeight(),
			png: canvas.toDataURL('png'),
			svg: canvas.toSVG()
		};
	}

	/* Left Control Panel */

	function addText(str) {
		let text = new fabric.IText(str, {
			left: 10,
			top: 10,
			fontFamily: 'Arvo',
			angle: 0,
			fill: '#000000',
			scaleX: 0.5,
			scaleY: 0.5,
			fontWeight: '',
			hasRotatingPoint: true
		});
		extend(text, uuidv1());
		canvas.add(text);
		selectItemAfterAdded(text);
		canvasUpdated();
	}

	function extend(obj, id) {
		obj.toObject = (function (toObject) {
			return function () {
				return fabric.util.object.extend(toObject.call(this), {id});
			};
		})(obj.toObject);
	}

	function selectItemAfterAdded(obj) {
		
		cleanSelect();
		// canvas.setActiveObject(obj);
		canvas.renderAll();
		obj.setCoords();
	}

	function cleanSelect() {
		canvas.discardActiveObject().renderAll();
	}

	function addLine() {
		let line = new fabric.Line([0,50,100,50],{
			stroke: '#333333',
			strokeWidth: 3
		});
		let obj = extend(line, uuidv1());
		canvas.add(line);
		selectItemAfterAdded(line);
		canvasUpdated();
	}

	function addSquare() {
		let square = new fabric.Rect({
			width: 100, height: 100, left: 10, top: 10, fill: '#4caf50'
		});

		if(! state.plan){
			var text = new fabric.Text("expenseFAST", {
				fontSize: 16,
				fill:'#ddd'
			});
			text.set("top", 60 - (text.height / 2));
			text.set("left", 60 - (text.width / 2));
			var group = new fabric.Group([square, text], {
				left: 10,
				top: 10,
			});
		} else {
			var group = square;
		}
		let obj = extend(group, uuidv1());
		canvas.add(group);
		selectItemAfterAdded(group);
		canvasUpdated();
	}

	function addTriangle() {
		let triangle = new fabric.Triangle({
			width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
		});
		if(! state.plan){
			var text = new fabric.Text("expenseFAST", {
				fontSize: 14,
				fill:'#ddd'
			});
			text.set("top", 80 - (text.height / 2));
			text.set("left", 60 - (text.width / 2));
			var group = new fabric.Group([triangle, text], {
				left: 10,
				top: 10,
			});
		} else {
			var group = triangle;
		}
		let obj = extend(group, uuidv1());

		canvas.add(group);
		selectItemAfterAdded(group);
		canvasUpdated();
	}

	function addCircle() {
		let circle = new fabric.Circle({
			radius: 50, left: 10, top: 10, fill: '#ff5722'
		});
		if(! state.plan){
			var text = new fabric.Text("expenseFAST", {
				fontSize: 14,
				fill:'#ddd'
			});
			text.set("top", 60 - (text.height / 2));
			text.set("left", 60 - (text.width / 2));
			var group = new fabric.Group([circle, text], {
				left: 10,
				top: 10,
			});
		} else {
			var group = circle;
		}
		let obj = extend(group, uuidv1());

		canvas.add(group);
		selectItemAfterAdded(group);
		canvasUpdated();
	}

	function addImage(link) {
		fabric.Image.fromURL(link, (image) => {
			image.set({
				left: 10,
				top: 10,
				angle: 0,
				padding: 10,
				cornersize: 10,
				hasRotatingPoint: true,
			});
			image.scaleToWidth(200);
			var imgheight = image.height / image.width *100 - 10;
			if(! state.plan){
				var text = new fabric.Text("expenseFAST", {
					fontSize: 18,
					fill:'#ddd',
					fontWeight:'bold'
				});
				text.set("top", imgheight - (text.height / 2));
				text.set("left", 90 - (text.width / 2));
				var group = new fabric.Group([image, text], {
					left: 10,
					top: 10,
				});
			} else {
				var group = image;
			}
			let obj = extend(group, uuidv1());
			canvas.add(group);
			selectItemAfterAdded(group);
			canvasUpdated();
		});
	}

	/* Right Control Panel */

	function updateCanvasWidth(width) {
		canvas.setWidth(width);
		canvas.renderAll();
		setState(state=>({
			...state,
			width,
			modified: uuidv1()
		}));
	}

	function updateCanvasHeight(height) {
		canvas.setHeight(height);
		canvas.renderAll();
		setState(state=>({
			...state,
			height,
			modified: uuidv1()
		}));
	}

	function removeSelected() {
		let activeObjects = canvas.getActiveObjects();
		canvas.discardActiveObject().renderAll();
		activeObjects.forEach(function(object) {
			canvas.remove(object);
		});
		canvas.renderAll();
		canvasUpdated();
	}

	function moveSelectedToBack() {
		let activeObjects = canvas.getActiveObjects();
		canvas.discardActiveObject().renderAll();
		activeObjects.forEach(function(object) {
			object.sendToBack();
		});
		canvas.renderAll();
		canvasUpdated();
	}

	function moveSelectedToFront() {
		let activeObjects = canvas.getActiveObjects();
		canvas.discardActiveObject().renderAll();
		activeObjects.forEach(function(object) {
			object.bringToFront();
		});
		canvas.renderAll();
		canvasUpdated();
	}

	function moveSelectedToBackwards() {
		let activeObjects = canvas.getActiveObjects();
		canvas.discardActiveObject().renderAll();
		activeObjects.forEach(function(object) {
			object.sendBackwards();
			canvas.setActiveObject(object);
		});
		canvas.renderAll();
		canvasUpdated();
	}

	function moveSelectedToForward() {
		let activeObjects = canvas.getActiveObjects();
		canvas.discardActiveObject().renderAll();
		activeObjects.forEach(function(object) {
			object.bringForward();
			canvas.setActiveObject(object);
		});
		canvas.renderAll();
		canvasUpdated();
	}

	function cloneSelected() {
		let activeObject = canvas.getActiveObject();
		if (activeObject) {
			let clone;
			switch (activeObject.type) {
				case 'line':
					clone = new fabric.Line(activeObject.toObject());
				break;
				case 'rect':
					clone = new fabric.Rect(activeObject.toObject());
				break;
				case 'circle':
					clone = new fabric.Circle(activeObject.toObject());
				break;
				case 'triangle':
					clone = new fabric.Triangle(activeObject.toObject());
				break;
				case 'i-text':
					clone = new fabric.IText('', activeObject.toObject());
				break;
				case 'image':
					clone = fabric.util.object.clone(activeObject);
				break;
			}
			if (clone) {
				clone.set({ left: 10, top: 10 });
				extend(clone, uuidv1());
				canvas.add(clone);
				selectItemAfterAdded(clone);
				canvasUpdated();
			}
		}
	}

	function alignSelected(direction) {
		let activeObject = canvas.getActiveObject();
		let width = activeObject.width;
		let height = activeObject.height;

		let activeObjects = canvas.getActiveObjects();

		switch (direction) {
			case 'left':
				activeObjects.forEach(function(object) {
					object.left -= (object.left + width/2);
					canvas.renderAll();
					object.setCoords();
				});
				break;
			case 'right':
				activeObjects.forEach(function(object) {
					object.left += (width/2 - object.left - object.width * object.scaleX - 1);
					canvas.renderAll();
					object.setCoords();
				});
				break;
			case 'up':
				activeObjects.forEach(function(object) {
					object.top -= (object.top + height/2);
					canvas.renderAll();
					object.setCoords();
				});
				break;
			case 'down':
				activeObjects.forEach(function(object) {
					object.top += (height/2 - object.top - object.height * object.scaleY - 1);
					canvas.renderAll();
					object.setCoords();
				});
				break;
			default:
				break;
		}
		canvasUpdated();
	}
	function canvasUndo(){
		canvas.undo();
	}
	function canvasRedo(){
		canvas.redo();
	}
	return {
		globalState: state,
		createCanvas,
		getCanvas,
		/* Left Control Panel */
		addText,
		addLine,
		addSquare,
		addTriangle,
		addCircle,
		addImage,
		/* Right Control Panel */
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
		moveSelectedToBack,
		moveSelectedToBackwards,
		moveSelectedToFront,
		moveSelectedToForward,
		cloneSelected,
		setLock,
		setUnLock,
		removeSelected,
		alignSelected,
		cancelSelection,
		canvasUndo,
		canvasRedo,
		setActiveItem
	}
};