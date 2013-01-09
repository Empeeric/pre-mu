/** ! NCLUD V3 - v0.1.0 - 2013-01-02
* http://nclud.com/
* Copyright (c) 2013
* nclud.com v3 scripts
*
* Oh, hey. Nice of you to take a look :)
*
* You're looking at the concatenated and minified version
* of all the js files used on the site.
* But in the spirit of open-source, you can still scour
* our original un-minified and fully commented scripts
* all within 
* nclud dev team; 
*/

/**
* nclud v3 | utils
*
* various properties and helper functions used throughout the site
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false, Element: false */

(function (window, $, undefined) {

	'use strict';

	// get global vars
	var NCLUD = window.NCLUD;
	var Modernizr = window.Modernizr;
	var location = window.location;
	var document = window.document;
	var docElem = document.documentElement;

	// utils object
	var utils = NCLUD.utils = {};

	// ----- sniff sniff ----- //

	// THIS IS BAD. DON'T COPY THIS.
	// We're trying to push the limits of web design.
	// Consequently, I'm running in to tricky obscure
	// browser bugs that I have no idea how to tackle.
	// They conundrums wrapped in enigmas. And you're the first one to discover it
	// In time, we'll work to remove all the sniff, rely solely on Modernizr
	// and healthy best practices.
	// But, for now, we got to ship this thing.

	var userAgent = window.navigator.userAgent;

	// Chrome: http://crbug.com/110462
	utils.isChrome = userAgent.indexOf('Chrome') !== -1;
	utils.isFirefox = userAgent.indexOf('Firefox') !== -1;

	// get browser version
	var splitUA = userAgent.split('/');
	if (utils.isChrome) {
		utils.browserVersion = parseInt(splitUA[splitUA.length - 2], 10);
	} else if (utils.isFirefox) {
		utils.browserVersion = parseInt(splitUA.pop(), 10);
	}

	// Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=726397
	utils.isBad3DFirefox = utils.isFirefox && utils.browserVersion < 13;

	// ----- IE < 9 indexOf ----- //

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt /*, from*/) {
			var len = this.length >>> 0;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
				if (from in this &&
		  this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	// ----- CSS and JS properties ----- //

	// get vendor prefixed CSS properties
	utils.cssProps = {};
	var props = 'transform perspective transition'.split(' ');
	var prop;
	for (var i = 0, len = props.length; i < len; i++) {
		prop = props[i];
		utils.cssProps[prop] = Modernizr.prefixed(prop);
	}

	utils.transEndEventName = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	}[utils.cssProps.transition];

	// ----- conditions ----- //

	// set is mobile based on window width
	utils.isMobile = $(window).width() <= 640;

	// can we use overflow scrolling, or lame scrolling
	utils.isTouchNonScrolling = Modernizr.touch && !Modernizr.overflowscrolling;

	utils.is404 = $('body').hasClass('error404');

	// ----- helper functions ----- //

	// appends script to body
	utils.addScript = function (scriptSrc) {
		var script = document.createElement('script');
		script.src = scriptSrc;
		document.body.appendChild(script);
	};

	// https://developer.mozilla.org/en/DOM/Using_full-screen_mode#Toggling_full_screen_mode
	utils.toggleFullScreen = function () {
		if (!Modernizr.fullscreen) {
			return;
		}
		// check if browser is already in fullscreen mode
		// alternative standard method
		if ((document.fullScreenElement && document.fullScreenElement !== null) ||
		// current working vendor methods
	  (!document.mozFullScreen && !document.webkitIsFullScreen)) {
			if (docElem.requestFullScreen) {
				docElem.requestFullScreen();
			} else if (docElem.webkitRequestFullScreen) {
				docElem.webkitRequestFullScreen();
			} else if (docElem.mozRequestFullScreen) {
				docElem.mozRequestFullScreen();
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}
		}
	};

})(window, jQuery);

/*!
* addTap v1.0.00 - helper function for adding click-ish events for touch devices
* by David DeSandro
* https://gist.github.com/1901569
*/

/*jshint undef: true, forin: false, browser: true */

(function (window, undefined) {

	var isTouch = 'ontouchstart' in window;
	var cursorStartEvent = isTouch ? 'touchstart' : 'mousedown';
	var cursorMoveEvent = isTouch ? 'touchmove' : 'mousemove';
	var cursorEndEvent = isTouch ? 'touchend' : 'mouseup';

	// -------------------------- addTap -------------------------- //

	function addTap(elem, onTap, options) {

		var handler = new addTap.Handler(onTap, options);

		elem.addEventListener(cursorStartEvent, handler, false);

	}

	// -------------------------- TapHandler -------------------------- //

	addTap.Handler = function (onTap, options) {
		// bail out if onTap callback is not set
		if (!onTap) {
			return;
		}

		// set onTap callback
		this.onTap = onTap;

		// set options
		this.options = {};
		// set defaults
		for (var prop in addTap.Handler.defaults) {
			this.options[prop] = addTap.Handler.defaults[prop];
		}
		// overwrite with passed-in options
		for (prop in options) {
			this.options[prop] = options[prop];
		}

	};

	addTap.Handler.defaults = {
		moveableBuffer: 3
	};

	addTap.Handler.prototype = {

		handleEvent: function (event) {
			if (this[event.type]) {
				this[event.type](event);
			}
		},

		// ----- start ----- //

		mousedown: function (event) {
			this.cursorStart(event);
		},

		touchstart: function (event) {
			// bail out if we already have a touch
			if (this.touch) {
				return;
			}
			// get first changedTouch
			this.touch = event.changedTouches[0];
			this.cursorStart(this.touch);
		},

		cursorStart: function (cursor) {
			// set start point
			this.startPoint = {
				x: cursor.pageX,
				y: cursor.pageY
			};

			// listen for move and end events
			window.addEventListener(cursorMoveEvent, this, false);
			window.addEventListener(cursorEndEvent, this, false);
		},

		// ----- move ----- //

		mousemove: function (event) {
			this.cursorMove(event);
		},

		touchmove: function (event) {
			var matchedTouch = this.getMatchedTouch(event);
			if (matchedTouch) {
				this.cursorMove(matchedTouch);
			}
		},

		getMatchedTouch: function (event) {
			var touch, matchedTouch;
			// iterate through touches
			for (var i = 0, len = event.changedTouches.length; i < len; i++) {
				touch = event.changedTouches[i];
				// get matched touch
				if (touch.identifier === this.touch.identifier) {
					matchedTouch = touch;
					break;
				}
			}
			return matchedTouch;
		},

		cursorMove: function (cursor) {
			var moveX = cursor.pageX - this.startPoint.x;
			var moveY = cursor.pageY - this.startPoint.y;

			// check if touch has moved outside buffer zone
			if (Math.abs(moveX) > this.options.moveableBuffer ||
		 Math.abs(moveY) > this.options.moveableBuffer
	) {
				// if outside, then remove listeners, so onTap won't be triggered
				this.reset();
			}

		},

		// ----- end ----- //

		mouseup: function (event) {
			this.cursorEnd(event, event);
		},

		touchend: function (event) {
			var matchedTouch = this.getMatchedTouch(event);
			if (matchedTouch) {
				this.cursorEnd(event, matchedTouch);
			}
		},

		cursorEnd: function (event, cursor) {
			// trigger onTap callback
			this.onTap(event, cursor);
			this.reset();
		},

		reset: function () {
			window.removeEventListener(cursorMoveEvent, this, false);
			window.removeEventListener(cursorEndEvent, this, false);
			delete this.touch;
		}

	};

	// publicize
	window.addTap = addTap;

})(window);

/**
* requestAnimationFrame polyfill by Erik Möller & Paul Irish et. al.
* https://gist.github.com/1866474
*
* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
* http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
**/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */

(function (window) {

	'use strict';

	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for (var i = 0; i < prefixes.length; i++) {
		if (requestAnimationFrame && cancelAnimationFrame) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
		cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] ||
							  window[prefix + 'CancelRequestAnimationFrame'];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function (id) {
			window.clearTimeout(id);
		};
	}

	// put in global namespace
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;

})(window);

/*
* smartresize: debounced resize event for jQuery
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*
* This saved you an hour of work? 
* Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
*/
(function ($) {

	var event = $.event,
	resizeTimeout;

	event.special["smartresize"] = {
		setup: function () {
			$(this).bind("resize", event.special.smartresize.handler);
		},
		teardown: function () {
			$(this).unbind("resize", event.special.smartresize.handler);
		},
		handler: function (event, execAsap) {
			// Save the context
			var context = this,
			args = arguments;

			// set correct event type
			event.type = "smartresize";

			if (resizeTimeout)
				clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function () {
				jQuery.event.handle.apply(context, args);
			}, execAsap === "execAsap" ? 0 : 100);
		}
	}

	$.fn.smartresize = function (fn) {
		return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
	};

})(jQuery);
/**
* Isotope v1.5.05ish, customized for nclud v3
* An exquisite jQuery plugin for magical layouts
* http://isotope.metafizzy.co
*
* Commercial use requires one-time license fee
* http://metafizzy.co/#licenses
*
* no sorting, mini-Modernizr
*
* Copyright 2011 David DeSandro / Metafizzy
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global Modernizr: false, jQuery: false */

(function (window, $, undefined) {

	'use strict';

	// helper function
	var capitalize = function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	// ========================= getStyleProperty by kangax ===============================
	// http://perfectionkills.com/feature-testing-css-properties/

	var prefixes = 'Moz Webkit Khtml O Ms'.split(' ');

	var getStyleProperty = function (propName) {
		var style = document.documentElement.style,
		prefixed;

		// test standard property first
		if (typeof style[propName] === 'string') {
			return propName;
		}

		// capitalize
		propName = capitalize(propName);

		// test vendor specific properties
		for (var i = 0, len = prefixes.length; i < len; i++) {
			prefixed = prefixes[i] + propName;
			if (typeof style[prefixed] === 'string') {
				return prefixed;
			}
		}
	};

	var transformProp = getStyleProperty('transform'),
	  transitionProp = getStyleProperty('transitionProperty');


	// ========================= isoTransform ===============================

	/**
	*  provides hooks for .css({ scale: value, translate: [x, y] })
	*  Progressively enhanced CSS transforms
	*  Uses hardware accelerated 3D transforms for Safari
	*  or falls back to 2D transforms.
	*/

	if (Modernizr.csstransforms) {

		// i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
		// HACK always use 2D transform notation
		// resolves bug in iPad not showing items
		var transformFnNotations = { // 2D transform functions
			translate: function (position) {
				return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
			},
			scale: function (scale) {
				return 'scale(' + scale + ') ';
			}
		}
	;

		var setIsoTransform = function (elem, name, value) {
			// unpack current transform data
			var data = $.data(elem, 'isoTransform') || {},
		  newData = {},
		  fnName,
		  transformObj = {},
		  transformValue;

			// i.e. newData.scale = 0.5
			newData[name] = value;
			// extend new value over current data
			$.extend(data, newData);

			for (fnName in data) {
				transformValue = data[fnName];
				transformObj[fnName] = transformFnNotations[fnName](transformValue);
			}

			// get proper order
			// ideally, we could loop through this give an array, but since we only have
			// a couple transforms we're keeping track of, we'll do it like so
			var translateFn = transformObj.translate || '',
		  scaleFn = transformObj.scale || '',
			// sorting so translate always comes first
		  valueFns = translateFn + scaleFn;

			// set data back in elem
			$.data(elem, 'isoTransform', data);

			// set name to vendor specific property
			elem.style[transformProp] = valueFns;
		};

		// ==================== scale ===================

		$.cssNumber.scale = true;

		$.cssHooks.scale = {
			set: function (elem, value) {
				setIsoTransform(elem, 'scale', value);
			},
			get: function (elem, computed) {
				var transform = $.data(elem, 'isoTransform');
				return transform && transform.scale ? transform.scale : 1;
			}
		};

		$.fx.step.scale = function (fx) {
			$.cssHooks.scale.set(fx.elem, fx.now + fx.unit);
		};


		// ==================== translate ===================

		$.cssNumber.translate = true;

		$.cssHooks.translate = {
			set: function (elem, value) {

				setIsoTransform(elem, 'translate', value);
			},

			get: function (elem, computed) {
				var transform = $.data(elem, 'isoTransform');
				return transform && transform.translate ? transform.translate : [0, 0];
			}
		};

	}

	// ========================= get transition-end event ===============================
	var transitionEndEvent, transitionDurProp;

	if (Modernizr.csstransitions) {
		transitionEndEvent = {
			WebkitTransitionProperty: 'webkitTransitionEnd',  // webkit
			MozTransitionProperty: 'transitionend',
			OTransitionProperty: 'oTransitionEnd',
			transitionProperty: 'transitionEnd'
		}[transitionProp];

		transitionDurProp = getStyleProperty('transitionDuration');
	}



	// ========================= Isotope ===============================


	// our "Widget" object constructor
	$.Isotope = function (options, element, callback) {
		this.element = $(element);

		this._create(options);
		this._init(callback);
	};

	// styles of container element we want to keep track of
	var isoContainerStyles = ['overflow', 'position', 'width', 'height'];

	$.Isotope.settings = {
		resizable: true,
		layoutMode: 'straightDown',
		containerClass: 'isotope',
		itemClass: 'isotope-item',
		hiddenClass: 'isotope-hidden',
		hiddenStyle: { opacity: 0, scale: 0.001 },
		visibleStyle: { opacity: 1, scale: 1 },
		animationEngine: 'best-available',
		animationOptions: {
			queue: false,
			duration: 800
		},
		resizesContainer: true,
		transformsEnabled: !$.browser.opera, // disable transforms in Opera
		itemPositionDataEnabled: false
	};

	$.Isotope.prototype = {

		// sets up widget
		_create: function (options) {

			this.options = $.extend({}, $.Isotope.settings, options);

			this.styleQueue = [];
			this.elemCount = 0;

			// get original styles in case we re-apply them in .destroy()
			var elemStyle = this.element[0].style;
			this.originalStyle = {};
			for (var i = 0, len = isoContainerStyles.length; i < len; i++) {
				var prop = isoContainerStyles[i];
				this.originalStyle[prop] = elemStyle[prop] || '';
			}

			this.element.css({
				overflow: 'hidden',
				position: 'relative'
			});

			this._updateAnimationEngine();
			this._updateUsingTransforms();

			// need to get atoms
			this.reloadItems();

			// get top left position of where the bricks should be
			var $cursor = $(document.createElement('div')).prependTo(this.element);
			this.offset = $cursor.position();
			$cursor.remove();

			// add isotope class first time around
			var instance = this;
			setTimeout(function () {
				instance.element.addClass(instance.options.containerClass);
			}, 0);

			// bind resize method
			if (this.options.resizable) {
				$(window).bind('smartresize.isotope', function () {
					instance.resize();
				});
			}

			// dismiss all click events from hidden events
			this.element.delegate('.' + this.options.hiddenClass, 'click', function () {
				return false;
			});

		},

		_getAtoms: function ($elems) {
			var selector = this.options.itemSelector,
			// filter & find 
		  $atoms = selector ? $elems.filter(selector).add($elems.find(selector)) : $elems,
			// base style for atoms
		  atomStyle = { position: 'absolute' };

			if (this.usingTransforms) {
				atomStyle.left = 0;
				atomStyle.top = 0;
			}

			$atoms.css(atomStyle).addClass(this.options.itemClass);

			return $atoms;
		},

		// _init fires when your instance is first created
		// (from the constructor above), and when you
		// attempt to initialize the widget again (by the bridge)
		// after it has already been initialized.
		_init: function (callback) {

			this.$filteredAtoms = this._filter(this.$allAtoms);
			this.reLayout(callback);

		},

		option: function (opts) {
			// change options AFTER initialization:
			// signature: $('#foo').bar({ cool:false });
			if ($.isPlainObject(opts)) {
				this.options = $.extend(true, this.options, opts);
			}
		},

		// ====================== updaters ====================== //
		// kind of like setters

		_updateAnimationEngine: function () {
			var animationEngine = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, '');
			// set applyStyleFnName
			switch (animationEngine) {
				case 'css':
				case 'none':
					this.isUsingJQueryAnimation = false;
					break;
				case 'jquery':
					this.isUsingJQueryAnimation = true;
					break;
				default: // best available
					this.isUsingJQueryAnimation = !Modernizr.csstransitions;
			}

			this._updateUsingTransforms();
		},

		_updateUsingTransforms: function () {
			var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
		Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

			this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
		},


		// ====================== Filtering ======================

		_filter: function ($atoms) {
			var filter = this.options.filter === '' ? '*' : this.options.filter;

			if (!filter) {
				return $atoms;
			}

			var hiddenClass = this.options.hiddenClass,
		  hiddenSelector = '.' + hiddenClass,
		  $hiddenAtoms = $atoms.filter(hiddenSelector),
		  $atomsToShow = $hiddenAtoms;

			if (filter !== '*') {
				$atomsToShow = $hiddenAtoms.filter(filter);
				var $atomsToHide = $atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);
				this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
			}

			this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
			$atomsToShow.removeClass(hiddenClass);

			return $atoms.filter(filter);
		},


		// ====================== Layout Helpers ======================

		_translate: function (x, y) {
			return { translate: [x, y] };
		},

		_positionAbs: function (x, y) {
			return { left: x, top: y };
		},

		_pushPosition: function ($elem, x, y) {
			x += this.offset.left;
			y += this.offset.top;
			var position = this.getPositionStyles(x, y);
			this.styleQueue.push({ $el: $elem, style: position });
			if (this.options.itemPositionDataEnabled) {
				$elem.data('isotope-item-position', { x: x, y: y });
			}
		},


		// ====================== General Layout ======================

		// used on collection of atoms (should be filtered, and sorted before )
		// accepts atoms-to-be-laid-out to start with
		layout: function ($elems, callback) {

			var layoutMode = this.options.layoutMode;

			// layout logic
			this['_' + layoutMode + 'Layout']($elems);

			// set the size of the container
			if (this.options.resizesContainer) {
				var containerStyle = this['_' + layoutMode + 'GetContainerSize']();
				this.styleQueue.push({ $el: this.element, style: containerStyle });
			}

			this._processStyleQueue($elems, callback);

			this.isLaidOut = true;
		},

		_processStyleQueue: function ($elems, callback) {
			// are we animating the layout arrangement?
			// use plugin-ish syntax for css or animate
			var styleFn = !this.isLaidOut ? 'css' : (
			this.isUsingJQueryAnimation ? 'animate' : 'css'
		  ),
		  animOpts = this.options.animationOptions,
		  objStyleFn, processor,
		  triggerCallbackNow, callbackFn;

			// default styleQueue processor, may be overwritten down below
			processor = function (i, obj) {
				obj.$el[styleFn](obj.style, animOpts);
			};

			if (this._isInserting && this.isUsingJQueryAnimation) {
				// if using styleQueue to insert items
				processor = function (i, obj) {
					// only animate if it not being inserted
					objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
					obj.$el[objStyleFn](obj.style, animOpts);
				};

			} else if (callback) {
				// has callback
				var isCallbackTriggered = false,
			instance = this;
				triggerCallbackNow = true;
				// trigger callback only once
				callbackFn = function () {
					if (isCallbackTriggered) {
						return;
					}
					callback.call(instance.element, $elems);
					isCallbackTriggered = true;
				};

				if (this.isUsingJQueryAnimation && styleFn === 'animate') {
					// add callback to animation options
					animOpts.complete = callbackFn;
					triggerCallbackNow = false;

				} else if (Modernizr.csstransitions) {
					// detect if first item has transition
					var i = 0,
			  testElem = this.styleQueue[0].$el,
			  styleObj;
					// get first non-empty jQ object
					while (!testElem.length) {
						styleObj = this.styleQueue[i++];
						// HACK: sometimes styleQueue[i] is undefined
						if (!styleObj) {
							return;
						}
						testElem = styleObj.$el;
					}
					// get transition duration of the first element in that object
					// yeah, this is inexact
					var duration = parseFloat(getComputedStyle(testElem[0])[transitionDurProp]);
					if (duration > 0) {
						processor = function (i, obj) {
							obj.$el[styleFn](obj.style, animOpts)
							// trigger callback at transition end
				.one(transitionEndEvent, callbackFn);
						};
						triggerCallbackNow = false;
					}
				}
			}

			// process styleQueue
			$.each(this.styleQueue, processor);

			if (triggerCallbackNow) {
				callbackFn();
			}

			// clear out queue for next time
			this.styleQueue = [];
		},


		resize: function () {
			if (this['_' + this.options.layoutMode + 'ResizeChanged']()) {
				this.reLayout();
			}
		},


		reLayout: function (callback) {

			this['_' + this.options.layoutMode + 'Reset']();
			this.layout(this.$filteredAtoms, callback);

		},

		// ====================== Convenience methods ======================

		// ====================== Adding items ======================

		// adds a jQuery object of items to a isotope container
		addItems: function ($content, callback) {
			var $newAtoms = this._getAtoms($content);
			// add new atoms to atoms pools
			this.$allAtoms = this.$allAtoms.add($newAtoms);

			if (callback) {
				callback($newAtoms);
			}
		},

		// convienence method for adding elements properly to any layout
		// positions items, hides them, then animates them back in <--- very sezzy
		insert: function ($content, callback) {
			// position items
			this.element.append($content);

			var instance = this;
			this.addItems($content, function ($newAtoms) {
				var $newFilteredAtoms = instance._filter($newAtoms);
				instance._addHideAppended($newFilteredAtoms);
				instance.reLayout();
				instance._revealAppended($newFilteredAtoms, callback);
			});

		},

		// convienence method for working with Infinite Scroll
		appended: function ($content, callback) {
			var instance = this;
			this.addItems($content, function ($newAtoms) {
				instance._addHideAppended($newAtoms);
				instance.layout($newAtoms);
				instance._revealAppended($newAtoms, callback);
			});
		},

		// adds new atoms, then hides them before positioning
		_addHideAppended: function ($newAtoms) {
			this.$filteredAtoms = this.$filteredAtoms.add($newAtoms);
			$newAtoms.addClass('no-transition');

			this._isInserting = true;

			// apply hidden styles
			this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
		},

		// sets visible style on new atoms
		_revealAppended: function ($newAtoms, callback) {
			var instance = this;
			// apply visible style after a sec
			setTimeout(function () {
				// enable animation
				$newAtoms.removeClass('no-transition');
				// reveal newly inserted filtered elements
				instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
				instance._isInserting = false;
				instance._processStyleQueue($newAtoms, callback);
			}, 10);
		},

		// gathers all atoms
		reloadItems: function () {
			this.$allAtoms = this._getAtoms(this.element.children());
		},

		// removes elements from Isotope widget
		remove: function ($content) {
			// remove elements from Isotope instance in callback
			var instance = this;
			var removeContent = function () {
				instance.$allAtoms = instance.$allAtoms.not($content);
				$content.remove();
			};

			if ($content.filter(':not(.' + this.options.hiddenClass + ')').length) {
				// if any non-hidden content needs to be removed
				this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
				this.$filteredAtoms = this.$filteredAtoms.not($content);
				this.reLayout(removeContent);
			} else {
				// remove it now
				removeContent();
			}

		},

		// destroys widget, returns elements and container back (close) to original style
		destroy: function () {

			var usingTransforms = this.usingTransforms;

			this.$allAtoms
		.removeClass(this.options.hiddenClass + ' ' + this.options.itemClass)
		.each(function () {
			this.style.position = '';
			this.style.top = '';
			this.style.left = '';
			this.style.opacity = '';
			if (usingTransforms) {
				this.style[transformProp] = '';
			}
		});

			// re-apply saved container styles
			var elemStyle = this.element[0].style;
			for (var i = 0, len = isoContainerStyles.length; i < len; i++) {
				var prop = isoContainerStyles[i];
				elemStyle[prop] = this.originalStyle[prop];
			}

			this.element
		.unbind('.isotope')
		.undelegate('.' + this.options.hiddenClass, 'click')
		.removeClass(this.options.containerClass)
		.removeData('isotope');

			$(window).unbind('.isotope');

		},


		// ====================== LAYOUTS ======================

		// calculates number of rows or columns
		// requires columnWidth or rowHeight to be set on namespaced object
		// i.e. this.masonry.columnWidth = 200
		_getSegments: function (isRows) {
			var namespace = this.options.layoutMode,
		  measure = isRows ? 'rowHeight' : 'columnWidth',
		  size = isRows ? 'height' : 'width',
		  segmentsName = isRows ? 'rows' : 'cols',
		  containerSize = this.element[size](),
		  segments,
			// i.e. options.masonry && options.masonry.columnWidth
		  segmentSize = this.options[namespace] && this.options[namespace][measure] ||
			// or use the size of the first item, i.e. outerWidth
					this.$filteredAtoms['outer' + capitalize(size)](true) ||
			// if there's no items, use size of container
					containerSize;

			segments = Math.floor(containerSize / segmentSize);
			segments = Math.max(segments, 1);

			// i.e. this.masonry.cols = ....
			this[namespace][segmentsName] = segments;
			// i.e. this.masonry.columnWidth = ...
			this[namespace][measure] = segmentSize;

		},

		_checkIfSegmentsChanged: function (isRows) {
			var namespace = this.options.layoutMode,
		  segmentsName = isRows ? 'rows' : 'cols',
		  prevSegments = this[namespace][segmentsName];
			// update cols/rows
			this._getSegments(isRows);
			// return if updated cols/rows is not equal to previous
			return (this[namespace][segmentsName] !== prevSegments);
		},


		// ====================== straightDown ======================

		_straightDownReset: function () {
			this.straightDown = {
				y: 0
			};
		},

		_straightDownLayout: function ($elems) {
			var instance = this;
			$elems.each(function (i) {
				var $this = $(this);
				instance._pushPosition($this, 0, instance.straightDown.y);
				instance.straightDown.y += $this.outerHeight(true);
			});
		},

		_straightDownGetContainerSize: function () {
			return { height: this.straightDown.y };
		},

		_straightDownResizeChanged: function () {
			return true;
		},


		// ====================== straightAcross ======================

		_straightAcrossReset: function () {
			this.straightAcross = {
				x: 0
			};
		},

		_straightAcrossLayout: function ($elems) {
			var instance = this;
			$elems.each(function (i) {
				var $this = $(this);
				instance._pushPosition($this, instance.straightAcross.x, 0);
				instance.straightAcross.x += $this.outerWidth(true);
			});
		},

		_straightAcrossGetContainerSize: function () {
			return { width: this.straightAcross.x };
		},

		_straightAcrossResizeChanged: function () {
			return true;
		}

	};


	// helper function for logging errors
	// $.error breaks jQuery chaining
	var logError = function (message) {
		if (window.console) {
			window.console.error(message);
		}
	};

	// =======================  Plugin bridge  ===============================
	// leverages data method to either create or return $.Isotope constructor
	// A bit from jQuery UI
	//   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
	// A bit from jcarousel 
	//   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

	$.fn.isotope = function (options, callback) {
		if (typeof options === 'string') {
			// call method
			var args = Array.prototype.slice.call(arguments, 1);

			this.each(function () {
				var instance = $.data(this, 'isotope');
				if (!instance) {
					logError("cannot call methods on isotope prior to initialization; " +
			  "attempted to call method '" + options + "'");
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					logError("no such method '" + options + "' for isotope instance");
					return;
				}
				// apply method
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function () {
				var instance = $.data(this, 'isotope');
				if (instance) {
					// apply options & init
					instance.option(options);
					instance._init(callback);
				} else {
					// initialize new instance
					$.data(this, 'isotope', new $.Isotope(options, this, callback));
				}
			});
		}
		// return jQuery object
		// so plugin methods do not have to
		return this;
	};

})(window, jQuery);



/*!
* NETEYE Activity Indicator jQuery Plugin
* http://neteye.github.com/activity-indicator.html
*
* Copyright (c) 2010 NETEYE GmbH
* Licensed under the MIT license
*
* Author: Felix Gnass [fgnass at neteye dot de]
* Version: 1.0.0
*/

/**
* Plugin that renders a customisable activity indicator (spinner) using SVG or VML.
*/
(function ($) {

	$.fn.activity = function (opts) {
		this.each(function () {
			var $this = $(this);
			var el = $this.data('activity');
			if (el) {
				clearInterval(el.data('interval'));
				el.remove();
				$this.removeData('activity');
			}
			if (opts !== false) {
				opts = $.extend({ color: $this.css('color') }, $.fn.activity.defaults, opts);

				el = render($this, opts).css('position', 'absolute').prependTo(opts.outside ? 'body' : $this);
				var h = $this.outerHeight() - el.height();
				var w = $this.outerWidth() - el.width();
				var margin = {
					top: opts.valign == 'top' ? opts.padding : opts.valign == 'bottom' ? h - opts.padding : Math.floor(h / 2),
					left: opts.align == 'left' ? opts.padding : opts.align == 'right' ? w - opts.padding : Math.floor(w / 2)
				};
				var offset = $this.offset();
				if (opts.outside) {
					el.css({ top: offset.top + 'px', left: offset.left + 'px' });
				}
				else {
					margin.top -= el.offset().top - offset.top;
					margin.left -= el.offset().left - offset.left;
				}
				el.css({ marginTop: margin.top + 'px', marginLeft: margin.left + 'px' });
				animate(el, opts.segments, Math.round(10 / opts.speed) / 10);
				$this.data('activity', el);
			}
		});
		return this;
	};

	$.fn.activity.defaults = {
		segments: 12,
		space: 3,
		length: 7,
		width: 4,
		speed: 1.2,
		align: 'center',
		valign: 'center',
		padding: 4
	};

	$.fn.activity.getOpacity = function (opts, i) {
		var steps = opts.steps || opts.segments - 1;
		var end = opts.opacity !== undefined ? opts.opacity : 1 / steps;
		return 1 - Math.min(i, steps) * (1 - end) / steps;
	};

	/**
	* Default rendering strategy. If neither SVG nor VML is available, a div with class-name 'busy' 
	* is inserted, that can be styled with CSS to display an animated gif as fallback.
	*/
	var render = function () {
		return $('<div>').addClass('busy');
	};

	/**
	* The default animation strategy does nothing as we expect an animated gif as fallback.
	*/
	var animate = function () {
	};

	/**
	* Utility function to create elements in the SVG namespace.
	*/
	function svg(tag, attr) {
		var el = document.createElementNS("http://www.w3.org/2000/svg", tag || 'svg');
		if (attr) {
			$.each(attr, function (k, v) {
				el.setAttributeNS(null, k, v);
			});
		}
		return $(el);
	}

	if (document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) {

		// =======================================================================================
		// SVG Rendering
		// =======================================================================================

		/**
		* Rendering strategy that creates a SVG tree.
		*/
		render = function (target, d) {
			var innerRadius = d.width * 2 + d.space;
			var r = (innerRadius + d.length + Math.ceil(d.width / 2) + 1);

			var el = svg().width(r * 2).height(r * 2);

			var g = svg('g', {
				'stroke-width': d.width,
				'stroke-linecap': 'round',
				stroke: d.color
			}).appendTo(svg('g', { transform: 'translate(' + r + ',' + r + ')' }).appendTo(el));

			for (var i = 0; i < d.segments; i++) {
				g.append(svg('line', {
					x1: 0,
					y1: innerRadius,
					x2: 0,
					y2: innerRadius + d.length,
					transform: 'rotate(' + (360 / d.segments * i) + ', 0, 0)',
					opacity: $.fn.activity.getOpacity(d, i)
				}));
			}
			return $('<div>').append(el).width(2 * r).height(2 * r);
		};

		// Check if Webkit CSS animations are available, as they work much better on the iPad
		// than setTimeout() based animations.

		if (document.createElement('div').style.WebkitAnimationName !== undefined) {

			var animations = {};

			/**
			* Animation strategy that uses dynamically created CSS animation rules.
			*/
			animate = function (el, steps, duration) {
				if (!animations[steps]) {
					var name = 'spin' + steps;
					var rule = '@-webkit-keyframes ' + name + ' {';
					for (var i = 0; i < steps; i++) {
						var p1 = Math.round(100000 / steps * i) / 1000;
						var p2 = Math.round(100000 / steps * (i + 1) - 1) / 1000;
						var value = '% { -webkit-transform:rotate(' + Math.round(360 / steps * i) + 'deg); }\n';
						rule += p1 + value + p2 + value;
					}
					rule += '100% { -webkit-transform:rotate(100deg); }\n}';
					document.styleSheets[0].insertRule(rule);
					animations[steps] = name;
				}
				el.css('-webkit-animation', animations[steps] + ' ' + duration + 's linear infinite');
			};
		}
		else {

			/**
			* Animation strategy that transforms a SVG element using setInterval().
			*/
			animate = function (el, steps, duration) {
				var rotation = 0;
				var g = el.find('g g').get(0);
				el.data('interval', setInterval(function () {
					g.setAttributeNS(null, 'transform', 'rotate(' + (++rotation % steps * (360 / steps)) + ')');
				}, duration * 1000 / steps));
			};
		}

	}
	else {

		// =======================================================================================
		// VML Rendering
		// =======================================================================================

		var s = $('<shape>').css('behavior', 'url(#default#VML)');

		$('body').append(s);

		if (s.get(0).adj) {

			// VML support detected. Insert CSS rules for group, shape and stroke.
			var sheet = document.createStyleSheet();
			$.each(['group', 'shape', 'stroke'], function () {
				sheet.addRule(this, "behavior:url(#default#VML);");
			});

			/**
			* Rendering strategy that creates a VML tree. 
			*/
			render = function (target, d) {

				var innerRadius = d.width * 2 + d.space;
				var r = (innerRadius + d.length + Math.ceil(d.width / 2) + 1);
				var s = r * 2;
				var o = -Math.ceil(s / 2);

				var el = $('<group>', { coordsize: s + ' ' + s, coordorigin: o + ' ' + o }).css({ top: o, left: o, width: s, height: s });
				for (var i = 0; i < d.segments; i++) {
					el.append($('<shape>', { path: 'm ' + innerRadius + ',0  l ' + (innerRadius + d.length) + ',0' }).css({
						width: s,
						height: s,
						rotation: (360 / d.segments * i) + 'deg'
					}).append($('<stroke>', { color: d.color, weight: d.width + 'px', endcap: 'round', opacity: $.fn.activity.getOpacity(d, i) })));
				}
				return $('<group>', { coordsize: s + ' ' + s }).css({ width: s, height: s, overflow: 'hidden' }).append(el);
			};

			/**
			* Animation strategy that modifies the VML rotation property using setInterval().
			*/
			animate = function (el, steps, duration) {
				var rotation = 0;
				var g = el.get(0);
				el.data('interval', setInterval(function () {
					g.style.rotation = ++rotation % steps * (360 / steps);
				}, duration * 1000 / steps));
			};
		}
		$(s).remove();
	}

})(jQuery);
/*!
* jQuery Form Plugin
* version: 3.07 (06-APR-2012)
* @requires jQuery v1.3.2 or later
*
* Examples and documentation at: http://malsup.com/jquery/form/
* Project repository: https://github.com/malsup/form
* Dual licensed under the MIT and GPL licenses:
*    http://malsup.github.com/mit-license.txt
*    http://malsup.github.com/gpl-license-v2.txt
*/
/*global ActiveXObject alert */
; (function ($) {
	"use strict";

	/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are mutually exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
	$('#myForm').bind('submit', function(e) {
	e.preventDefault(); // <-- important
	$(this).ajaxSubmit({
	target: '#output'
	});
	});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
	$('#myForm').ajaxForm({
	target: '#output'
	});
	});
	
	You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
	form does not have to exist when you invoke ajaxForm:

	$('#myForm').ajaxForm({
	delegation: true,
	target: '#output'
	});
	
	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
	*/

	/**
	* Feature detection
	*/
	var feature = {};
	feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
	feature.formdata = window.FormData !== undefined;

	/**
	* ajaxSubmit() provides a mechanism for immediately submitting
	* an HTML form using AJAX.
	*/
	$.fn.ajaxSubmit = function (options) {
		/*jshint scripturl:true */

		// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
		if (!this.length) {
			log('ajaxSubmit: skipping submit process - no element selected');
			return this;
		}

		var method, action, url, $form = this;

		if (typeof options == 'function') {
			options = { success: options };
		}

		method = this.attr('method');
		action = this.attr('action');
		url = (typeof action === 'string') ? $.trim(action) : '';
		url = url || window.location.href || '';
		if (url) {
			// clean url (don't include hash vaue)
			url = (url.match(/^([^#]+)/) || [])[1];
		}

		options = $.extend(true, {
			url: url,
			success: $.ajaxSettings.success,
			type: method || 'GET',
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
		}, options);

		// hook for manipulating the form data before it is extracted;
		// convenient for use with rich editors like tinyMCE or FCKEditor
		var veto = {};
		this.trigger('form-pre-serialize', [this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
			return this;
		}

		// provide opportunity to alter form data before it is serialized
		if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSerialize callback');
			return this;
		}

		var traditional = options.traditional;
		if (traditional === undefined) {
			traditional = $.ajaxSettings.traditional;
		}

		var elements = [];
		var qx, a = this.formToArray(options.semantic, elements);
		if (options.data) {
			options.extraData = options.data;
			qx = $.param(options.data, traditional);
		}

		// give pre-submit callback an opportunity to abort the submit
		if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSubmit callback');
			return this;
		}

		// fire vetoable 'validate' event
		this.trigger('form-submit-validate', [a, this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
			return this;
		}

		var q = $.param(a, traditional);
		if (qx) {
			q = (q ? (q + '&' + qx) : qx);
		}
		if (options.type.toUpperCase() == 'GET') {
			options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
			options.data = null;  // data is null for 'get'
		}
		else {
			options.data = q; // data is the query string for 'post'
		}

		var callbacks = [];
		if (options.resetForm) {
			callbacks.push(function () { $form.resetForm(); });
		}
		if (options.clearForm) {
			callbacks.push(function () { $form.clearForm(options.includeHidden); });
		}

		// perform a load on the target only if dataType is not provided
		if (!options.dataType && options.target) {
			var oldSuccess = options.success || function () { };
			callbacks.push(function (data) {
				var fn = options.replaceTarget ? 'replaceWith' : 'html';
				$(options.target)[fn](data).each(oldSuccess, arguments);
			});
		}
		else if (options.success) {
			callbacks.push(options.success);
		}

		options.success = function (data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
			var context = options.context || options;    // jQuery 1.4+ supports scope context 
			for (var i = 0, max = callbacks.length; i < max; i++) {
				callbacks[i].apply(context, [data, status, xhr || $form, $form]);
			}
		};

		// are there files to upload?
		var fileInputs = $('input:file:enabled[value]', this); // [value] (issue #113)
		var hasFileInputs = fileInputs.length > 0;
		var mp = 'multipart/form-data';
		var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

		var fileAPI = feature.fileapi && feature.formdata;
		log("fileAPI :" + fileAPI);
		var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

		// options.iframe allows user to force iframe mode
		// 06-NOV-09: now defaulting to iframe mode if file input is detected
		if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
			// hack to fix Safari hang (thanks to Tim Molendijk for this)
			// see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
			if (options.closeKeepAlive) {
				$.get(options.closeKeepAlive, function () {
					fileUploadIframe(a);
				});
			}
			else {
				fileUploadIframe(a);
			}
		}
		else if ((hasFileInputs || multipart) && fileAPI) {
			fileUploadXhr(a);
		}
		else {
			$.ajax(options);
		}

		// clear element array
		for (var k = 0; k < elements.length; k++)
			elements[k] = null;

		// fire 'notify' event
		this.trigger('form-submit-notify', [this, options]);
		return this;

		// XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
		function fileUploadXhr(a) {
			var formdata = new FormData();

			for (var i = 0; i < a.length; i++) {
				formdata.append(a[i].name, a[i].value);
			}

			if (options.extraData) {
				for (var p in options.extraData)
					if (options.extraData.hasOwnProperty(p))
						formdata.append(p, options.extraData[p]);
			}

			options.data = null;

			var s = $.extend(true, {}, $.ajaxSettings, options, {
				contentType: false,
				processData: false,
				cache: false,
				type: 'POST'
			});

			if (options.uploadProgress) {
				// workaround because jqXHR does not expose upload property
				s.xhr = function () {
					var xhr = jQuery.ajaxSettings.xhr();
					if (xhr.upload) {
						xhr.upload.onprogress = function (event) {
							var percent = 0;
							var position = event.loaded || event.position; /*event.position is deprecated*/
							var total = event.total;
							if (event.lengthComputable) {
								percent = Math.ceil(position / total * 100);
							}
							options.uploadProgress(event, position, total, percent);
						}
					}
					return xhr;
				}
			}

			s.data = null;
			var beforeSend = s.beforeSend;
			s.beforeSend = function (xhr, o) {
				o.data = formdata;
				if (beforeSend)
					beforeSend.call(o, xhr, options);
			};
			$.ajax(s);
		}

		// private function for handling file uploads (hat tip to YAHOO!)
		function fileUploadIframe(a) {
			var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
			var useProp = !!$.fn.prop;

			if ($(':input[name=submit],:input[id=submit]', form).length) {
				// if there is an input with a name or id of 'submit' then we won't be
				// able to invoke the submit fn on the form (at least not x-browser)
				alert('Error: Form elements must not have name or id of "submit".');
				return;
			}

			if (a) {
				// ensure that every serialized input is still enabled
				for (i = 0; i < elements.length; i++) {
					el = $(elements[i]);
					if (useProp)
						el.prop('disabled', false);
					else
						el.removeAttr('disabled');
				}
			}

			s = $.extend(true, {}, $.ajaxSettings, options);
			s.context = s.context || s;
			id = 'jqFormIO' + (new Date().getTime());
			if (s.iframeTarget) {
				$io = $(s.iframeTarget);
				n = $io.attr('name');
				if (!n)
					$io.attr('name', id);
				else
					id = n;
			}
			else {
				$io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
				$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
			}
			io = $io[0];


			xhr = { // mock object
				aborted: 0,
				responseText: null,
				responseXML: null,
				status: 0,
				statusText: 'n/a',
				getAllResponseHeaders: function () { },
				getResponseHeader: function () { },
				setRequestHeader: function () { },
				abort: function (status) {
					var e = (status === 'timeout' ? 'timeout' : 'aborted');
					log('aborting upload... ' + e);
					this.aborted = 1;
					$io.attr('src', s.iframeSrc); // abort op in progress
					xhr.error = e;
					if (s.error)
						s.error.call(s.context, xhr, e, status);
					if (g)
						$.event.trigger("ajaxError", [xhr, s, e]);
					if (s.complete)
						s.complete.call(s.context, xhr, e);
				}
			};

			g = s.global;
			// trigger ajax global events so that activity/block indicators work like normal
			if (g && 0 === $.active++) {
				$.event.trigger("ajaxStart");
			}
			if (g) {
				$.event.trigger("ajaxSend", [xhr, s]);
			}

			if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
				if (s.global) {
					$.active--;
				}
				return;
			}
			if (xhr.aborted) {
				return;
			}

			// add submitting element to data if we know it
			sub = form.clk;
			if (sub) {
				n = sub.name;
				if (n && !sub.disabled) {
					s.extraData = s.extraData || {};
					s.extraData[n] = sub.value;
					if (sub.type == "image") {
						s.extraData[n + '.x'] = form.clk_x;
						s.extraData[n + '.y'] = form.clk_y;
					}
				}
			}

			var CLIENT_TIMEOUT_ABORT = 1;
			var SERVER_ABORT = 2;

			function getDoc(frame) {
				var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
				return doc;
			}

			// Rails CSRF hack (thanks to Yvan Barthelemy)
			var csrf_token = $('meta[name=csrf-token]').attr('content');
			var csrf_param = $('meta[name=csrf-param]').attr('content');
			if (csrf_param && csrf_token) {
				s.extraData = s.extraData || {};
				s.extraData[csrf_param] = csrf_token;
			}

			// take a breath so that pending repaints get some cpu time before the upload starts
			function doSubmit() {
				// make sure form attrs are set
				var t = $form.attr('target'), a = $form.attr('action');

				// update form attrs in IE friendly way
				form.setAttribute('target', id);
				if (!method) {
					form.setAttribute('method', 'POST');
				}
				if (a != s.url) {
					form.setAttribute('action', s.url);
				}

				// ie borks in some cases when setting encoding
				if (!s.skipEncodingOverride && (!method || /post/i.test(method))) {
					$form.attr({
						encoding: 'multipart/form-data',
						enctype: 'multipart/form-data'
					});
				}

				// support timout
				if (s.timeout) {
					timeoutHandle = setTimeout(function () { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
				}

				// look for server aborts
				function checkState() {
					try {
						var state = getDoc(io).readyState;
						log('state = ' + state);
						if (state && state.toLowerCase() == 'uninitialized')
							setTimeout(checkState, 50);
					}
					catch (e) {
						log('Server abort: ', e, ' (', e.name, ')');
						cb(SERVER_ABORT);
						if (timeoutHandle)
							clearTimeout(timeoutHandle);
						timeoutHandle = undefined;
					}
				}

				// add "extra" data to form if provided in options
				var extraInputs = [];
				try {
					if (s.extraData) {
						for (var n in s.extraData) {
							if (s.extraData.hasOwnProperty(n)) {
								extraInputs.push(
								$('<input type="hidden" name="' + n + '">').attr('value', s.extraData[n])
									.appendTo(form)[0]);
							}
						}
					}

					if (!s.iframeTarget) {
						// add iframe to doc and submit the form
						$io.appendTo('body');
						if (io.attachEvent)
							io.attachEvent('onload', cb);
						else
							io.addEventListener('load', cb, false);
					}
					setTimeout(checkState, 15);
					form.submit();
				}
				finally {
					// reset attrs and remove "extra" input elements
					form.setAttribute('action', a);
					if (t) {
						form.setAttribute('target', t);
					} else {
						$form.removeAttr('target');
					}
					$(extraInputs).remove();
				}
			}

			if (s.forceSync) {
				doSubmit();
			}
			else {
				setTimeout(doSubmit, 10); // this lets dom updates render
			}

			var data, doc, domCheckCount = 50, callbackProcessed;

			function cb(e) {
				if (xhr.aborted || callbackProcessed) {
					return;
				}
				try {
					doc = getDoc(io);
				}
				catch (ex) {
					log('cannot access response document: ', ex);
					e = SERVER_ABORT;
				}
				if (e === CLIENT_TIMEOUT_ABORT && xhr) {
					xhr.abort('timeout');
					return;
				}
				else if (e == SERVER_ABORT && xhr) {
					xhr.abort('server abort');
					return;
				}

				if (!doc || doc.location.href == s.iframeSrc) {
					// response not received yet
					if (!timedOut)
						return;
				}
				if (io.detachEvent)
					io.detachEvent('onload', cb);
				else
					io.removeEventListener('load', cb, false);

				var status = 'success', errMsg;
				try {
					if (timedOut) {
						throw 'timeout';
					}

					var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
					log('isXml=' + isXml);
					if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
						if (--domCheckCount) {
							// in some browsers (Opera) the iframe DOM is not always traversable when
							// the onload callback fires, so we loop a bit to accommodate
							log('requeing onLoad callback, DOM not available');
							setTimeout(cb, 250);
							return;
						}
						// let this fall through because server response could be an empty document
						//log('Could not access iframe DOM after mutiple tries.');
						//throw 'DOMException: not available';
					}

					//log('response detected');
					var docRoot = doc.body ? doc.body : doc.documentElement;
					xhr.responseText = docRoot ? docRoot.innerHTML : null;
					xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
					if (isXml)
						s.dataType = 'xml';
					xhr.getResponseHeader = function (header) {
						var headers = { 'content-type': s.dataType };
						return headers[header];
					};
					// support for XHR 'status' & 'statusText' emulation :
					if (docRoot) {
						xhr.status = Number(docRoot.getAttribute('status')) || xhr.status;
						xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
					}

					var dt = (s.dataType || '').toLowerCase();
					var scr = /(json|script|text)/.test(dt);
					if (scr || s.textarea) {
						// see if user embedded response in textarea
						var ta = doc.getElementsByTagName('textarea')[0];
						if (ta) {
							xhr.responseText = ta.value;
							// support for XHR 'status' & 'statusText' emulation :
							xhr.status = Number(ta.getAttribute('status')) || xhr.status;
							xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
						}
						else if (scr) {
							// account for browsers injecting pre around json response
							var pre = doc.getElementsByTagName('pre')[0];
							var b = doc.getElementsByTagName('body')[0];
							if (pre) {
								xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
							}
							else if (b) {
								xhr.responseText = b.textContent ? b.textContent : b.innerText;
							}
						}
					}
					else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
						xhr.responseXML = toXml(xhr.responseText);
					}

					try {
						data = httpData(xhr, dt, s);
					}
					catch (e) {
						status = 'parsererror';
						xhr.error = errMsg = (e || status);
					}
				}
				catch (e) {
					log('error caught: ', e);
					status = 'error';
					xhr.error = errMsg = (e || status);
				}

				if (xhr.aborted) {
					log('upload aborted');
					status = null;
				}

				if (xhr.status) { // we've set xhr.status
					status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
				}

				// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
				if (status === 'success') {
					if (s.success)
						s.success.call(s.context, data, 'success', xhr);
					if (g)
						$.event.trigger("ajaxSuccess", [xhr, s]);
				}
				else if (status) {
					if (errMsg === undefined)
						errMsg = xhr.statusText;
					if (s.error)
						s.error.call(s.context, xhr, status, errMsg);
					if (g)
						$.event.trigger("ajaxError", [xhr, s, errMsg]);
				}

				if (g)
					$.event.trigger("ajaxComplete", [xhr, s]);

				if (g && ! --$.active) {
					$.event.trigger("ajaxStop");
				}

				if (s.complete)
					s.complete.call(s.context, xhr, status);

				callbackProcessed = true;
				if (s.timeout)
					clearTimeout(timeoutHandle);

				// clean up
				setTimeout(function () {
					if (!s.iframeTarget)
						$io.remove();
					xhr.responseXML = null;
				}, 100);
			}

			var toXml = $.parseXML || function (s, doc) { // use parseXML if available (jQuery 1.5+)
				if (window.ActiveXObject) {
					doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(s);
				}
				else {
					doc = (new DOMParser()).parseFromString(s, 'text/xml');
				}
				return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
			};
			var parseJSON = $.parseJSON || function (s) {
				/*jslint evil:true */
				return window['eval']('(' + s + ')');
			};

			var httpData = function (xhr, type, s) { // mostly lifted from jq1.4.4

				var ct = xhr.getResponseHeader('content-type') || '',
				xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
				data = xml ? xhr.responseXML : xhr.responseText;

				if (xml && data.documentElement.nodeName === 'parsererror') {
					if ($.error)
						$.error('parsererror');
				}
				if (s && s.dataFilter) {
					data = s.dataFilter(data, type);
				}
				if (typeof data === 'string') {
					if (type === 'json' || !type && ct.indexOf('json') >= 0) {
						data = parseJSON(data);
					} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
						$.globalEval(data);
					}
				}
				return data;
			};
		}
	};

	/**
	* ajaxForm() provides a mechanism for fully automating form submission.
	*
	* The advantages of using this method instead of ajaxSubmit() are:
	*
	* 1: This method will include coordinates for <input type="image" /> elements (if the element
	*    is used to submit the form).
	* 2. This method will include the submit element's name/value data (for the element that was
	*    used to submit the form).
	* 3. This method binds the submit() method to the form for you.
	*
	* The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
	* passes the options argument along after properly binding events for submit elements and
	* the form itself.
	*/
	$.fn.ajaxForm = function (options) {
		options = options || {};
		options.delegation = options.delegation && $.isFunction($.fn.on);

		// in jQuery 1.3+ we can fix mistakes with the ready state
		if (!options.delegation && this.length === 0) {
			var o = { s: this.selector, c: this.context };
			if (!$.isReady && o.s) {
				log('DOM not ready, queuing ajaxForm');
				$(function () {
					$(o.s, o.c).ajaxForm(options);
				});
				return this;
			}
			// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
			log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
			return this;
		}

		if (options.delegation) {
			$(document)
			.off('submit.form-plugin', this.selector, doAjaxSubmit)
			.off('click.form-plugin', this.selector, captureSubmittingElement)
			.on('submit.form-plugin', this.selector, options, doAjaxSubmit)
			.on('click.form-plugin', this.selector, options, captureSubmittingElement);
			return this;
		}

		return this.ajaxFormUnbind()
		.bind('submit.form-plugin', options, doAjaxSubmit)
		.bind('click.form-plugin', options, captureSubmittingElement);
	};

	// private event handlers    
	function doAjaxSubmit(e) {
		/*jshint validthis:true */
		var options = e.data;
		if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
			e.preventDefault();
			$(this).ajaxSubmit(options);
		}
	}

	function captureSubmittingElement(e) {
		/*jshint validthis:true */
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length === 0) {
				return;
			}
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX !== undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') {
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function () { form.clk = form.clk_x = form.clk_y = null; }, 100);
	}


	// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
	$.fn.ajaxFormUnbind = function () {
		return this.unbind('submit.form-plugin click.form-plugin');
	};

	/**
	* formToArray() gathers form element data into an array of objects that can
	* be passed to any of the following ajax functions: $.get, $.post, or load.
	* Each object in the array has both a 'name' and 'value' property.  An example of
	* an array for a simple login form might be:
	*
	* [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
	*
	* It is this array that is passed to pre-submit callback functions provided to the
	* ajaxSubmit() and ajaxForm() methods.
	*/
	$.fn.formToArray = function (semantic, elements) {
		var a = [];
		if (this.length === 0) {
			return a;
		}

		var form = this[0];
		var els = semantic ? form.getElementsByTagName('*') : form.elements;
		if (!els) {
			return a;
		}

		var i, j, n, v, el, max, jmax;
		for (i = 0, max = els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n) {
				continue;
			}

			if (semantic && form.clk && el.type == "image") {
				// handle image inputs on the fly when semantic == true
				if (!el.disabled && form.clk == el) {
					a.push({ name: n, value: $(el).val(), type: el.type });
					a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
				}
				continue;
			}

			v = $.fieldValue(el, true);
			if (v && v.constructor == Array) {
				if (elements)
					elements.push(el);
				for (j = 0, jmax = v.length; j < jmax; j++) {
					a.push({ name: n, value: v[j] });
				}
			}
			else if (feature.fileapi && el.type == 'file' && !el.disabled) {
				if (elements)
					elements.push(el);
				var files = el.files;
				for (j = 0; j < files.length; j++) {
					a.push({ name: n, value: files[j], type: el.type });
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				if (elements)
					elements.push(el);
				a.push({ name: n, value: v, type: el.type, required: el.required });
			}
		}

		if (!semantic && form.clk) {
			// input type=='image' are not found in elements array! handle it here
			var $input = $(form.clk), input = $input[0];
			n = input.name;
			if (n && !input.disabled && input.type == 'image') {
				a.push({ name: n, value: $input.val() });
				a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
			}
		}
		return a;
	};

	/**
	* Serializes form data into a 'submittable' string. This method will return a string
	* in the format: name1=value1&amp;name2=value2
	*/
	$.fn.formSerialize = function (semantic) {
		//hand off to jQuery.param for proper encoding
		return $.param(this.formToArray(semantic));
	};

	/**
	* Serializes all field elements in the jQuery object into a query string.
	* This method will return a string in the format: name1=value1&amp;name2=value2
	*/
	$.fn.fieldSerialize = function (successful) {
		var a = [];
		this.each(function () {
			var n = this.name;
			if (!n) {
				return;
			}
			var v = $.fieldValue(this, successful);
			if (v && v.constructor == Array) {
				for (var i = 0, max = v.length; i < max; i++) {
					a.push({ name: n, value: v[i] });
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				a.push({ name: this.name, value: v });
			}
		});
		//hand off to jQuery.param for proper encoding
		return $.param(a);
	};

	/**
	* Returns the value(s) of the element in the matched set.  For example, consider the following form:
	*
	*  <form><fieldset>
	*      <input name="A" type="text" />
	*      <input name="A" type="text" />
	*      <input name="B" type="checkbox" value="B1" />
	*      <input name="B" type="checkbox" value="B2"/>
	*      <input name="C" type="radio" value="C1" />
	*      <input name="C" type="radio" value="C2" />
	*  </fieldset></form>
	*
	*  var v = $(':text').fieldValue();
	*  // if no values are entered into the text inputs
	*  v == ['','']
	*  // if values entered into the text inputs are 'foo' and 'bar'
	*  v == ['foo','bar']
	*
	*  var v = $(':checkbox').fieldValue();
	*  // if neither checkbox is checked
	*  v === undefined
	*  // if both checkboxes are checked
	*  v == ['B1', 'B2']
	*
	*  var v = $(':radio').fieldValue();
	*  // if neither radio is checked
	*  v === undefined
	*  // if first radio is checked
	*  v == ['C1']
	*
	* The successful argument controls whether or not the field element must be 'successful'
	* (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
	* The default value of the successful argument is true.  If this value is false the value(s)
	* for each element is returned.
	*
	* Note: This method *always* returns an array.  If no valid value can be determined the
	*    array will be empty, otherwise it will contain one or more values.
	*/
	$.fn.fieldValue = function (successful) {
		for (var val = [], i = 0, max = this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldValue(el, successful);
			if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
				continue;
			}
			if (v.constructor == Array)
				$.merge(val, v);
			else
				val.push(v);
		}
		return val;
	};

	/**
	* Returns the value of the field element.
	*/
	$.fieldValue = function (el, successful) {
		var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
		if (successful === undefined) {
			successful = true;
		}

		if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1)) {
			return null;
		}

		if (tag == 'select') {
			var index = el.selectedIndex;
			if (index < 0) {
				return null;
			}
			var a = [], ops = el.options;
			var one = (t == 'select-one');
			var max = (one ? index + 1 : ops.length);
			for (var i = (one ? index : 0); i < max; i++) {
				var op = ops[i];
				if (op.selected) {
					var v = op.value;
					if (!v) { // extra pain for IE...
						v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
					}
					if (one) {
						return v;
					}
					a.push(v);
				}
			}
			return a;
		}
		return $(el).val();
	};

	/**
	* Clears the form data.  Takes the following actions on the form's input fields:
	*  - input text fields will have their 'value' property set to the empty string
	*  - select elements will have their 'selectedIndex' property set to -1
	*  - checkbox and radio inputs will have their 'checked' property set to false
	*  - inputs of type submit, button, reset, and hidden will *not* be effected
	*  - button elements will *not* be effected
	*/
	$.fn.clearForm = function (includeHidden) {
		return this.each(function () {
			$('input,select,textarea', this).clearFields(includeHidden);
		});
	};

	/**
	* Clears the selected form elements.
	*/
	$.fn.clearFields = $.fn.clearInputs = function (includeHidden) {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
		return this.each(function () {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (re.test(t) || tag == 'textarea') {
				this.value = '';
			}
			else if (t == 'checkbox' || t == 'radio') {
				this.checked = false;
			}
			else if (tag == 'select') {
				this.selectedIndex = -1;
			}
			else if (includeHidden) {
				// includeHidden can be the valud true, or it can be a selector string
				// indicating a special test; for example:
				//  $('#myForm').clearForm('.special:hidden')
				// the above would clean hidden inputs that have the class of 'special'
				if ((includeHidden === true && /hidden/.test(t)) ||
				 (typeof includeHidden == 'string' && $(this).is(includeHidden)))
					this.value = '';
			}
		});
	};

	/**
	* Resets the form data.  Causes all form elements to be reset to their original value.
	*/
	$.fn.resetForm = function () {
		return this.each(function () {
			// guard against an input with the name of 'reset'
			// note that IE reports the reset function as an 'object'
			if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
				this.reset();
			}
		});
	};

	/**
	* Enables or disables any matching elements.
	*/
	$.fn.enable = function (b) {
		if (b === undefined) {
			b = true;
		}
		return this.each(function () {
			this.disabled = !b;
		});
	};

	/**
	* Checks/unchecks any matching checkboxes or radio buttons and
	* selects/deselects and matching option elements.
	*/
	$.fn.selected = function (select) {
		if (select === undefined) {
			select = true;
		}
		return this.each(function () {
			var t = this.type;
			if (t == 'checkbox' || t == 'radio') {
				this.checked = select;
			}
			else if (this.tagName.toLowerCase() == 'option') {
				var $sel = $(this).parent('select');
				if (select && $sel[0] && $sel[0].type == 'select-one') {
					// deselect all other options
					$sel.find('option').selected(false);
				}
				this.selected = select;
			}
		});
	};

	// expose debug var
	$.fn.ajaxSubmit.debug = false;

	// helper fn for console logging
	function log() {
		if (!$.fn.ajaxSubmit.debug)
			return;
		var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
		if (window.console && window.console.log) {
			window.console.log(msg);
		}
		else if (window.opera && window.opera.postError) {
			window.opera.postError(msg);
		}
	}

})(jQuery);

/**
* Diorama - 3D CSS transform polyfill
*
* sprites are transformed using scale,
* similar to Sega's super scaler games
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */

(function (window, undefined) {

	'use strict';

	var Diorama = {};

	var Modernizr = window.Modernizr;

	// forgive me for sniffing, but we've got dirty 3D rendering bugs
	var userAgent = window.navigator.userAgent;
	// Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=726397
	var isFirefox = userAgent.indexOf('Firefox') !== -1;
	var firefoxVersion = parseInt(userAgent.split('/').pop(), 10);
	var isBad3DFirefox = isFirefox && firefoxVersion < 13;
	var is3d = Modernizr.csstransforms3d && !isBad3DFirefox;

	// get prefixed css properties
	var cssProps = {};
	var props = 'perspective perspectiveOrigin transform transformOrigin transformStyle'.split(' ');
	var cssProp;
	for (var i = 0, len = props.length; i < len; i++) {
		cssProp = props[i];
		cssProps[cssProp] = Modernizr.prefixed(cssProp);
	}

	// -------------------------- Diorama.Environment -------------------------- //

	Diorama.Environment = function (element, perspective, perspectiveOrigin) {
		this.element = element;
		this.perspective = perspective;


		if (is3d) {
			this.element.style[cssProps.perspective] = this.perspective + 'px';
		}

		// collection of children
		this.children = [];

		this.setPerspectiveOrigin(perspectiveOrigin || { x: 0.5, y: 0.5 });

		window.addEventListener('resize', this, false);

	};

	Diorama.Environment.prototype.handleEvent = function (event) {
		// console.log( event.type )
		if (this['handle' + event.type]) {
			this['handle' + event.type](event);
		}
	};

	Diorama.Environment.prototype.setPerspectiveOrigin = function (origin) {
		this.perspectiveOrigin = origin;

		if (is3d) {
			// true 3D
			this.element.style[cssProps.perspectiveOrigin] = origin.x * 100 + '% ' + origin.y * 100 + '% ';
		} else {
			// super scaler 3D
			// set child transform origin to environment's perspective origin;
			for (var i = 0, len = this.children.length; i < len; i++) {
				this.children[i].simulatePerspectiveOrigin();
			}

		}

	};

	Diorama.Environment.prototype.handleresize = function (event) {
		var _this = this;

		function delayed() {
			_this.onDebouncedResize();
			_this._resizeTimeout = null;
		}

		if (this._resizeTimeout) {
			window.clearTimeout(this._resizeTimeout);
		}

		this._resizeTimeout = window.setTimeout(delayed, 150);
	};


	// need to reset transform origin for children in Super Scaler 3D environment
	Diorama.Environment.prototype.onDebouncedResize = function () {
		this.setPerspectiveOrigin(this.perspectiveOrigin);
	};

	// -------------------------- Diorama.Container -------------------------- //


	Diorama.Container = function (element, environment) {
		this.element = element;
		this.env = environment;

		this.x = 0;
		this.y = 0;
		this.z = 0;

		if (is3d) {
			this.element.style[cssProps.transformStyle] = 'preserve-3d';
		}

		this.children = [];
	};

	Diorama.Container.prototype.translate3d = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		if (is3d) {
			this.element.style[cssProps.transform] = 'translate3d( ' + x + 'px, ' + y + 'px, ' + z + 'px )';
		} else {
			// simulate container movement by moving children
			var child;
			for (var i = 0, len = this.children.length; i < len; i++) {
				child = this.children[i];
				child.translate3d(child.x, child.y, child.z);
			}
		}
	};

	// -------------------------- Diorama.Sprite -------------------------- //

	Diorama.Sprite = function (element, environment, parent) {
		this.element = element;
		this.env = environment;
		this.env.children.push(this);
		if (parent) {
			this.parent = parent;
			this.parent.children.push(this);
		}

		this.x = 0;
		this.y = 0;
		this.z = 0;

		if (!is3d) {
			this.simulatePerspectiveOrigin();
		}

	};

	// for super scaler 3d
	Diorama.Sprite.prototype.simulatePerspectiveOrigin = function () {
		var envEl = this.env.element;
		var origin = this.env.perspectiveOrigin;
		var originValue = envEl.offsetWidth * origin.x + 'px ' + envEl.offsetHeight * origin.y + 'px';

		this.element.style[cssProps.transformOrigin] = originValue;

	};

	Diorama.Sprite.prototype.translate3d = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		var elemStyle = this.element.style;

		if (is3d) {
			elemStyle[cssProps.transform] = 'translate3d( ' + x + 'px, ' + y + 'px, ' + z + 'px )';
		} else {
			var sx = this.x + (this.parent ? this.parent.x : 0);
			var sy = this.y + (this.parent ? this.parent.y : 0);
			var sz = this.z + (this.parent ? this.parent.z : 0);
			var scale = Math.max(0, this.env.perspective / (this.env.perspective - sz));
			sx *= scale;
			sy *= scale;
			if (Modernizr.csstransforms) {
				// position with 2D transforms
				elemStyle[cssProps.transform] = 'translate(' + sx + 'px,' + sy + 'px) scale(' + scale + ')';
			} else {
				// position with left/top absolute positioning
				elemStyle.left = sx + 'px';
				elemStyle.top = sy + 'px';
			}
		}
		// needed for Chrome and pseudo 3D
		elemStyle.zIndex = 100 + parseInt(z, 10);
	};

	window.Diorama = Diorama;

})(window, undefined);

/**
* Project Scene - custom constructor for work projects on nclud.com v3
* requires Modernizr, Diorama
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, Modernizr: true, Diorama: true */

(function (window, $, undefined) {

	'use strict';

	var NCLUD = window.NCLUD || {};

	// -------------------------- ProjectScene -------------------------- //

	function ProjectScene($project) {
		this.$project = $project;
		this.$list = $project.find('.images');
		this.$items = this.$list.children();
		this.$copy = $project.find('.copy');
		this.itemsLen = this.$items.length;
		this.projectItems = [];
		this.positionedItems = [];

		// init 3D environemnt
		this.dioramaEnv = new Diorama.Environment(
	this.$project[0], // elem
	NCLUD.settings.perspective, // perspective
	{x: 0.5, y: 0.5} // perspective Origin
  );

		// override new Diorama environemtn for legit 3D, inherit it instead
		if (Modernizr.csstransforms3d) {
			var style = {};
			style[Modernizr.prefixed('transformStyle')] = 'preserve-3d';
			style[Modernizr.prefixed('perspectiveOriginX')] = 'auto';
			style[Modernizr.prefixed('perspectiveOriginY')] = 'auto';
			style[Modernizr.prefixed('perspective')] = 'none';

			this.$project.css(style);

			style = {};
			style[Modernizr.prefixed('transformStyle')] = 'preserve-3d';
			this.$list.css(style);

		}

		// init project Item
		var projectItem, itemElem;
		for (var i = 0; i < this.itemsLen; i++) {
			// singleton that keeps track of item props
			itemElem = this.$items[i];
			projectItem = {
				element: itemElem,
				sprite: new Diorama.Sprite(itemElem, this.dioramaEnv),
				x: 0,
				y: 0
			};
			this.projectItems.push(projectItem);
			// save with jQuery Object
			this.$items.eq(i).data('projectItem', projectItem);
		}

		// init layout
		this.layoutType = $.camelCase(this.$project.data('layout'));
		this.setItemPositionIndex();
		this.layout();
		this.setInitialSelectedPositionIndex();
		this.translateItems();

		// bind event
		this.$list[0].addEventListener('click', this, false);

	}

	// -------------------------- helper functions and properties -------------------------- //


	ProjectScene.positionIndexSorter = function (itemA, itemB) {
		return itemA.positionIndex - itemB.positionIndex;
	};

	ProjectScene.topIndexes = {
		1: [0],
		2: [1, 0],
		3: [1, 0, 2],
		4: [2, 1, 3, 0],
		5: [2, 1, 3, 0, 4]
	};

	// -------------------------- methods -------------------------- //

	// select which project item is in front when initialized
	ProjectScene.prototype.setInitialSelectedPositionIndex = function () {
		var index;
		switch (this.layoutType) {
			case 'sideRight':
				// selected is rightmost
				index = this.itemsLen - 1;
				break;
			case 'top':
				// selected is the one in the middle
				index = Math.round(this.itemsLen / 2 - 1);
				break;
			default:
				// selected is the first one
				index = 0;
		}
		this.selectedPositionIndex = index;

	};

	ProjectScene.prototype.setItemPositionIndex = function () {
		var getPositionIndex;
		var len = this.itemsLen;
		switch (this.layoutType) {
			case 'sideRight':
				// first goes on far right, progress leftward
				getPositionIndex = function (i) {
					return len - i - 1;
				};
				break;
			case 'top':
				// first in center, stagger items alternating left/right
				var topIndexes = NCLUD.ProjectScene.topIndexes[this.itemsLen];
				getPositionIndex = function (i) {
					return topIndexes[i];
				};
				break;
			default:
				getPositionIndex = function (i) {
					return i;
				};
		}

		var positionIndex, projectItem;
		for (var i = 0; i < this.itemsLen; i++) {
			positionIndex = getPositionIndex(i);
			projectItem = this.projectItems[i];
			projectItem.positionIndex = positionIndex;
			// console.log( positionIndex )
			this.positionedItems[positionIndex] = projectItem;
		}
	};

	ProjectScene.prototype.layout = function () {
		// trigger layout-type specific layout logic
		switch (this.layoutType) {
			case 'cornerRight':
				this.cornerLayout(true);
				break;
			case 'cornerLeft':
				this.cornerLayout(false);
				break;
			default:
				this.fillLayout();
		}
	};

	// 3 items are in 3 different corners, then centers project
	ProjectScene.prototype.cornerLayout = function (isRight) {
		var listW = this.$list.width();
		var listH = this.$list.height();
		var item;

		var furthestOffsetX = isRight ? listW : 0;

		for (var i = 0; i < this.itemsLen; i++) {
			item = this.positionedItems[i];
			item.width = item.element.offsetWidth;
			item.height = item.element.offsetHeight;
			// line up corners of items with 'crannies'
			// corner layouts for copy is approx 40% width, 30% height

			if (isRight) {
				item.x = i > 0 ?
		Math.max(0, listW * 0.58 - item.width) : // flush left with cranny
		Math.min(listW * 0.55, listW - item.width); // overlap cranny
			} else {
				item.x = i > 0 ?
		listW * 0.42 : // flush left with cranny
		Math.max(0, listW * 0.45 - item.width); // overlap cranny
			}
			item.y = i === 2 ?
	  Math.max(0, listH * 0.3 - item.height) : // flush bottom with cranny
	  listH * 0.3; // flush top with cranny

			// get distance from opposite edge
			furthestOffsetX = isRight ?
	  Math.min(furthestOffsetX, item.x) :
	  Math.max(furthestOffsetX, item.width + item.x);
		}

		// center project
		var offsetX = isRight ? -furthestOffsetX / 2 : (listW - furthestOffsetX) / 2;
		this.$project.css({ left: offsetX });
	};

	ProjectScene.prototype.getPositionedItemWidth = function (i) {
		return this.positionedItems[i].element.offsetWidth;
	};

	// items take up full width of container
	ProjectScene.prototype.fillLayout = function () {

		var listW = this.$list.width();
		var listH = this.$list.height();
		var firstItemW = this.getPositionedItemWidth(0);
		var lastItemW = this.getPositionedItemWidth(this.itemsLen - 1);
		var midW = listW - (firstItemW + lastItemW) / 2;
		// center items
		var item, x;
		for (var i = 0; i < this.itemsLen; i++) {
			item = this.positionedItems[i];
			item.width = item.element.offsetWidth;
			item.height = item.element.offsetHeight;
			x = i === 0 ? 0 :
			// mid items & last item
	  (midW / (this.itemsLen - 1)) * i + firstItemW / 2 - item.width / 2;
			// center horizontally if just one item
			x = this.itemsLen === 1 ? (listW - item.width) / 2 : x;
			// keep item within list container bounds
			item.x = Math.max(0, Math.min(listW - item.width, x));
			// center vertically
			item.y = (listH - item.height) / 2;
		}

		// vertically center copy for side left & right layouts
		if (this.layoutType === 'sideLeft' || this.layoutType === 'sideRight') {
			var copyY = (listH - this.$copy.height()) / 2;
			this.$copy.css({ top: copyY });
		}

	};

	// position each item
	ProjectScene.prototype.translateItems = function () {
		var item, z, delta;
		// the distance in 3D between an item and the next item right behind it
		var zDistance = NCLUD.settings.projectDistance / (this.itemsLen * 2 + 1) * -1;
		for (var i = 0; i < this.itemsLen; i++) {
			item = this.projectItems[i];
			delta = this.selectedPositionIndex - item.positionIndex;
			z = Math.abs(delta) * 2;
			z = delta > 0 ? z - 1 : z;
			item.sprite.translate3d(item.x, item.y, z * zDistance);
		}
	};

	// convienence method
	ProjectScene.prototype.reLayout = function () {
		this.layout();
		this.translateItems();
	};

	// ---- event handling ---- //

	// allows to pass instance as event handler
	// for 'click' -> will trigger instance.handleclick
	ProjectScene.prototype.handleEvent = function (event) {
		var eventHandler = 'handle' + event.type;
		if (this[eventHandler]) {
			this[eventHandler](event);
		}
	};

	ProjectScene.prototype.handleclick = function (event) {
		// all clicks should be item clicks
		var $target = $(event.target);
		var $clickedProjectItem = $target.is('li') ? $target : $target.parents('.images li');
		if ($clickedProjectItem.length && NCLUD.section !== 'homepage') {
			this.handleItemClick($clickedProjectItem, event);
		}
	};

	ProjectScene.prototype.handleItemClick = function ($item, event) {
		// move to back if in front
		var projectItem = $item.data('projectItem');

		this.selectedPositionIndex = projectItem.positionIndex;

		this.translateItems();

		event.preventDefault();
	};

	NCLUD.ProjectScene = ProjectScene;

})(window, jQuery);

/**
* Inflickity v1.0.01
* Never-ending drag n' flick content
* https://github.com/nclud/inflickity
* requires Modernizr 2.5 and requestAnimationFrame polyfill
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */

(function (window, undefined) {

	'use strict';

	var document = window.document;
	var requestAnimationFrame = window.requestAnimationFrame;
	var isTouch = 'createTouch' in document;
	var cursorStartEvent = isTouch ? 'touchstart' : 'mousedown';
	var cursorMoveEvent = isTouch ? 'touchmove' : 'mousemove';
	var cursorEndEvent = isTouch ? 'touchend' : 'mouseup';
	var Modernizr = window.Modernizr;
	var transformProp = Modernizr.prefixed('transform');

	function getNow() {
		return (new Date()).getTime();
	}

	function Inflickity(elem, options) {

		this.element = elem;
		this.content = elem.children[0];

		// clone content so there is no gaps
		this.contentClone = this.content.cloneNode(true);
		if (this.content.id) {
			this.contentClone.id = this.content.id + '-inflickity-clone';
		}
		this.contentClone.className += ' inflickity-clone';
		this.element.appendChild(this.contentClone);

		// set options
		this.options = {};
		for (var prop in Inflickity.defaults) {
			this.options[prop] = options && options.hasOwnProperty(prop) ?
	  options[prop] : Inflickity.defaults[prop];
		}

		this.element.addEventListener(cursorStartEvent, this, false);

		// this.element.style.position = 'relative';
		this.content.style.position = 'absolute';
		this.contentClone.style.position = 'absolute';

		// flag for triggering clicks
		this.isUnmoved = true;

		this.x = 0;
		this.y = 0;
		this.offset = 0;
		this.contentWidth = this.content.offsetWidth;

		// use offset angle if css transforms are supported
		this.offsetAngle = Modernizr.csstransforms ? this.options.offsetAngle : 0;
		if (this.offsetAngle) {
			this.element.style[transformProp] = 'rotate(' + this.offsetAngle + 'rad)';
		}

		// keep track of mouse moves, mouse touches, etc
		this.contactPoints = [];

	}

	Inflickity.defaults = {
		clones: 1,
		friction: 0.03,
		maxContactPoints: 3,
		offsetAngle: 0,
		onClick: undefined,
		animationDuration: 400,
		// basically jQuery swing
		easing: function (progress, n, firstNum, diff) {
			return ((-Math.cos(progress * Math.PI) / 2) + 0.5) * diff + firstNum;
		}
	};


	// -------------------------- methods -------------------------- //

	Inflickity.prototype.setOffset = function (offset) {
		var contentW = this.contentWidth;

		// offset = positive number, between 0 & contentWidth
		this.offset = ((offset % contentW) + contentW) % contentW;

		this.positionElem(this.content, this.offset, 0);
		this.positionElem(this.contentClone, this.offset - contentW, 0);
	};

	Inflickity.prototype.positionElem = Modernizr.csstransforms3d ? function (elem, x, y) {
		elem.style[transformProp] = 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
	} :
  Modernizr.csstransforms ? function (elem, x, y) {
	  elem.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
  } :
  function (elem, x, y) {
	  elem.style.left = x + 'px';
	  elem.style.top = y + 'px';
  };

	Inflickity.prototype.pushContactPoint = function (offset) {

		var contactPoints = this.contactPoints;

		// remove oldest one if array has 3 items
		if (this.contactPoints.length > this.options.maxContactPoints - 1) {
			this.contactPoints.shift();
		}

		this.contactPoints.push({
			'offset': offset,
			timeStamp: getNow()
		});

	};

	// since inflickity could be at angle, get the offset with that angle applied
	// http://jsfiddle.net/desandro/2GMYn/
	Inflickity.prototype.getCursorOffset = function (cursor) {
		var dx = cursor.pageX - this.originPoint.x;
		var dy = cursor.pageY - this.originPoint.y;
		// distance of cursor from origin point
		var cursorDistance = Math.sqrt(dx * dx + dy * dy);
		// angle of cursor from origin point
		var cursorAngle = Math.atan2(dy, dx);
		var relativeAngle = Math.abs(cursorAngle - this.offsetAngle);
		var offset = cursorDistance * Math.cos(relativeAngle);
		return offset;
	};

	// -------------------------- event handling -------------------------- //

	Inflickity.prototype.handleEvent = function (event) {

		var handler = 'handle' + event.type;
		if (this[handler]) {
			this[handler](event);
		}

	};

	Inflickity.prototype.handlemousedown = function (event) {
		this.cursorStart(event, event);
	};

	Inflickity.prototype.handletouchstart = function (event) {
		// disregard additional touches
		if (this.cursorIdentifier) {
			return;
		}

		this.cursorStart(event.changedTouches[0], event);
	};

	Inflickity.prototype.cursorStart = function (cursor, event) {

		this.cursorIdentifier = cursor.identifier || 1;

		this.originPoint = {
			x: cursor.pageX,
			y: cursor.pageY
		};

		this.offsetOrigin = this.offset;

		window.addEventListener(cursorMoveEvent, this, false);
		window.addEventListener(cursorEndEvent, this, false);

		this.stopAnimation();
		var offset = this.getCursorOffset(cursor);
		this.pushContactPoint(offset);

		// reset isDragging flag
		this.isDragging = false;

		this.wasScrollingBeforeCursorStart = this.velocity && Math.abs(this.velocity) > 3;

		event.preventDefault();

	};


	Inflickity.prototype.handlemousemove = function (event) {
		this.cursorMove(event, event);
	};

	Inflickity.prototype.handletouchmove = function (event) {
		var touch;
		for (var i = 0, len = event.changedTouches.length; i < len; i++) {
			touch = event.changedTouches[i];
			if (touch.identifier === this.cursorIdentifier) {
				this.cursorMove(touch, event);
				break;
			}
		}
	};

	Inflickity.prototype.cursorMove = function (cursor, event) {

		var offset = this.getCursorOffset(cursor);

		this.setOffset(this.offsetOrigin + offset);

		this.pushContactPoint(offset);

		var movedX = Math.abs(cursor.pageX - this.originPoint.x);
		var movedY = Math.abs(cursor.pageY - this.originPoint.y);

		// cancel click event if moved further than 6x6 pixels
		if (!this.isDragging && (movedX > 3 || movedY > 3)) {
			this.isDragging = true;
		}

	};

	Inflickity.prototype.handlemouseup = function (event) {
		this.cursorEnd(event, event);
	};

	Inflickity.prototype.handletouchend = function (event) {
		var touch;
		for (var i = 0, len = event.changedTouches.length; i < len; i++) {
			touch = event.changedTouches[i];
			if (touch.identifier === this.cursorIdentifier) {
				this.cursorEnd(touch, event);
				break;
			}
		}

	};


	Inflickity.prototype.cursorEnd = function (cursor, event) {

		window.removeEventListener(cursorMoveEvent, this, false);
		window.removeEventListener(cursorEndEvent, this, false);

		var offset = this.getCursorOffset(cursor);
		this.pushContactPoint(offset);
		this.release();

		// reset contact points
		this.contactPoints = [];
		// reset cursor identifier
		delete this.cursorIdentifier;

		// if not dragging, click event fired
		if (!this.isDragging && !this.wasScrollingBeforeCursorStart &&
  typeof this.options.onClick === 'function') {
			this.options.onClick.call(this, event, cursor);
		}

		// not dragging any more
		this.isDragging = false;

	};

	// -------------------------- animation -------------------------- //

	// after cursorEnd event, allow inertial scrolling
	Inflickity.prototype.release = function () {
		var contactPoints = this.contactPoints;
		var len = contactPoints.length;
		var lastContactPoint = contactPoints[len - 1];
		var firstContactPoint = contactPoints[0];
		// get time diff, at least 1 ms so don't divide by zero
		var timeDiff = lastContactPoint.timeStamp - firstContactPoint.timeStamp || 1;
		// get average time between first and last contact point
		var avgTime = timeDiff / len;
		var avgOffset = (lastContactPoint.offset - firstContactPoint.offset) / len;

		// 60 FPS in requestAnimationFrame
		this.velocity = ((1000 / 60) / avgTime) * avgOffset;

		this.animate({
			frameFn: this.releaseTick
		});

	};

	Inflickity.prototype.releaseTick = function () {
		this.setOffset(this.offset + this.velocity);
		// decay velocity
		this.velocity *= 1 - this.options.friction;
		// if velocity is slow enough, stop animation
		if (Math.abs(this.velocity) < 0.5) {
			this.stopAnimation();
		} else {
			// keep on animating
			this.animationFrameTick();
		}

	};


	Inflickity.prototype.scrollTo = function (dest, duration) {
		var cw = this.contentWidth;
		dest = ((dest % cw) + cw) % cw;
		var diff = dest - this.offset;

		// adjust to closet destination
		if (Math.abs(diff) > cw / 2) {
			var sign = diff > 0 ? -1 : 1;
			diff = diff + cw * sign;
		}

		this.animate({
			duration: duration,
			origin: this.offset,
			diff: diff,
			frameFn: this.scrollToTick
		});
	};

	Inflickity.prototype.scrollToTick = function () {
		var ani = this.animation;
		var progress = (getNow() - ani.startTime) / ani.duration;
		var offset = this.options.easing(progress, null, ani.origin, ani.diff);

		this.setOffset(offset);

		if (progress >= 1) {
			this.stopAnimation();
		} else {
			// keep on animating
			this.animationFrameTick();
		}
	};

	// options should have options.frameFn,
	// which is the function ran each interval, gets `this` as argument
	Inflickity.prototype.animate = function (animation) {
		// stop previous animation
		this.stopAnimation();

		this.isScrolling = true;

		this.animation = animation;
		this.animation.startTime = getNow();
		this.animation.duration = this.animation.duration || this.options.animationDuration;
		// start animation
		this.animationFrameTick();
	};

	// triggered every animation frame, needed to re-set animation.id
	Inflickity.prototype.animationFrameTick = function () {
		var animationFrameFn = this.animation.frameFn.bind(this);
		this.animation.id = window.requestAnimationFrame(animationFrameFn);
	};

	Inflickity.prototype.stopAnimation = function () {
		this.isScrolling = false;
		if (this.animation && isFinite(this.animation.id)) {
			window.cancelAnimationFrame(this.animation.id);
			delete this.animation;
		}
	};

	window.Inflickity = Inflickity;

})(window);

/**
* Catepilla v1.0.00
* Make that image gallery get all wiggly
* https://github.com/nclud/catepilla
* Requires Modernizr 2.5 and requestAnimationFrame polyfill
*/

/*jshint asi: false, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

(function (window, undefined) {

	'use strict';

	// get global vars
	var document = window.document;
	var Modernizr = window.Modernizr;
	// get convienent vars
	var transformProp = Modernizr.prefixed('transform');
	var transformCSSProp = {
		'WebkitTransform': '-webkit-transform',
		'MozTransform': '-moz-transform',
		'msTransform': '-ms-transform',
		'OTransform': '-o-transform',
		'transform': 'transform'
	}[transformProp];
	var durationProp = Modernizr.prefixed('transitionDuration');
	var delayProp = Modernizr.prefixed('transitionDelay');
	var transitionProp = Modernizr.prefixed('transition');
	var transitionPropertyProp = Modernizr.prefixed('transition-property');

	var positionElem = Modernizr.csstransforms3d ? function (elem, x, y) {
		elem.style[transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
	} : Modernizr.csstransforms ? function (elem, x, y) {
		elem.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
	} : function (elem, x, y) {
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
	};

	var transEndEventName = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	}[transitionProp];


	var TWO_PI = Math.PI * 2;


	// -------------------------- Catepilla -------------------------- //


	/**
	* @class Creates a new Catepilla gallery
	* @param elem {Element} - The list element which contains images
	* @param options {Object} - Optional options
	*/
	function Catepilla(elem, options) {

		if (!elem) {
			return;
		}

		this.list = elem;

		this.options = {};

		for (var prop in Catepilla.defaults) {
			this.options[prop] = Catepilla.defaults[prop];
		}

		for (prop in options) {
			this.options[prop] = options[prop];
		}

		// default properties
		this.selectedIndex = -1;
		this.images = [];
		this.wiggleSpeed = 0;

		// used to keep track of images that have been loaded
		this.imagesData = {};

		this.create();

	}


	Catepilla.defaults = {
		segmentCount: 5,
		height: 300,
		segmentHeight: 0.55,
		transitionDuration: 0.2,
		perSegmentDelay: 0.05,
		wiggleAcceleration: 0.001,
		maxWiggleSpeed: 0.1,
		wiggleDelay: 1000,
		isAutoAdvancing: true,
		startAngle: Math.PI
	};


	/**
	* creates gallery
	*/
	Catepilla.prototype.create = function () {
		// create elem to hold segments
		this.elem = document.createElement('div');
		this.elem.className = 'catepilla';
		this.height = this.options.height;
		this.elem.style.height = this.height + 'px';
		// add elem to DOM
		this.list.parentNode.insertBefore(this.elem, this.list.nextSibling);
		// hide original list elem
		this.list.style.display = 'none';
		// get width
		this.width = this.elem.offsetWidth;

		this._createSegments();
		this.hide();

		// add images
		var images = this.list.getElementsByTagName('img');
		var src;
		for (var i = 0, len = images.length; i < len; i++) {
			src = images[i].src;
			this.addImage(src);
		}

		// show first image
		this.setSelectedIndex(0);

	};

	/**
	* @param {String} src - The src or URL of an image
	*/
	Catepilla.prototype.addImage = function (src) {
		// don't proceed if already added
		if (this.imagesData[src]) {
			return;
		}
		// load image
		var img = new Image();
		img.addEventListener('load', this, false);
		// create object to keep track of its properties
		this.imagesData[src] = {
			index: this.images.length // backwards reference for this.images
		};
		// add to images
		this.images.push(img);
		// set src, which will trigger ._loadHander()
		img.src = src;
	};

	Catepilla.prototype._createSegments = function () {

		var segmentCount = this.options.segmentCount;

		this.segmentWidth = Math.floor(this.width / segmentCount);

		this.segments = [];

		var segment;
		var frag = document.createDocumentFragment();
		for (var i = 0; i < segmentCount; i++) {
			segment = new CatepillaSegment({
				parent: this,
				width: this.segmentWidth,
				index: i
			});
			frag.appendChild(segment.elem);
			this.segments.push(segment);
		}

		this.elem.appendChild(frag);

	};

	/**
	* Trigger a method on each segment in the instance
	* @param {String} methodName
	*/
	Catepilla.prototype.segmentsEach = function (methodName) {
		var segment;
		// pass in any other arguments after methodName
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, len = this.segments.length; i < len; i++) {
			segment = this.segments[i];
			segment[methodName].apply(segment, args);
		}
	};

	/**
	* reveal
	* @param {integer} index
	*/
	Catepilla.prototype.setSelectedIndex = function (index) {
		// don't proceed if not a new index
		if (index === this.selectedIndex || index < 0 || index > this.images.length - 1) {
			return;
		}
		// console.log('⚑ setting selected index', index );

		// get img data of selected image
		var src = this.images[index].src;
		var imgData = this.imagesData[src];

		this.selectedIndex = index;

		// stop animation, if any
		this.stopAnimation();

		// do fun stuff async, after transition
		var _this = this;
		var setIndexAfterHidden = function () {
			// reset segments y position
			_this.theta = _this.options.startAngle;
			_this.segmentsEach('setWiggleY');

			if (imgData.isLoaded) {
				_this._setSelectedImage();
			} else {
				imgData.callback = _this._setSelectedImage;
			}
		};

		var delay = (this.options.transitionDuration +
	this.options.perSegmentDelay * this.segments.length) * 1000;

		if (this.isHidden) {
			// if already hidden, change to it now
			setIndexAfterHidden();
		} else {
			// hide, then change after hidden
			this.hide();
			setTimeout(setIndexAfterHidden, delay);
		}

	};

	Catepilla.prototype._setSelectedImage = function (index) {
		// console.log('★set selected image★');
		var img = this.images[this.selectedIndex];
		this.segmentsEach('setImage', img);
		this.show();

		// start animation
		this.setAnimationTimeout(this.options.wiggleDelay, this.startAnimation);
	};

	Catepilla.prototype.show = function () {
		if (!this.isHidden) {
			return;
		}
		this.segmentsEach('show');
		this.isHidden = false;
	};

	Catepilla.prototype.hide = function (callback) {
		if (this.isHidden) {
			return;
		}
		this.segmentsEach('hide');
		this.isHidden = true;
		this.stopAnimation();
	};

	/**
	* advance to next image
	**/
	Catepilla.prototype.next = function () {
		var index = (this.selectedIndex + 1) % this.images.length;
		this.setSelectedIndex(index);
	};

	// ----- animation ----- //


	/**
	* set a setTimeout for a frame of animation
	* @param {Integer} delay - Delay of animation in milliseconds
	* @param {Function} animation - Function triggered for a frame of animation
	*/
	Catepilla.prototype.setAnimationTimeout = function (delay, animation) {
		if (this.animationTimeout) {
			clearTimeout(this.animationTimeout);
		}
		this.animationTimeout = setTimeout(animation.bind(this), delay);
	};


	Catepilla.prototype.startAnimation = function () {
		if (this.isAnimating) {
			return;
		}
		this.isAnimating = true;
		this.isAccelerating = true;
		this.segmentsEach('setTransitionsEnabled', false);
		this.wiggle();
	};

	Catepilla.prototype.wiggle = function () {
		// console.log('wiggle');
		this.wiggleAcceleration = this.isAccelerating ? this.options.wiggleAcceleration : this.deceleration;

		this.wiggleSpeed += this.wiggleAcceleration;
		this.wiggleSpeed = Math.max(0, Math.min(this.options.maxWiggleSpeed, this.wiggleSpeed));

		// apply rotation
		this.theta += this.wiggleSpeed;
		// normalize angle
		this.theta = (this.theta + TWO_PI * 2) % TWO_PI;
		this.segmentsEach('setWiggleY');
		this.segmentsEach('position');

		// if speed has reach it's maximum
		if (this.isAccelerating && this.wiggleSpeed === this.options.maxWiggleSpeed) {
			this.startDeceleration();
		}

		if (!this.isAccelerating && this.wiggleSpeed === 0) {
			// if animation has stopped
			this.stopAnimation();
			// after wiggle ends, switch to the next image, after delay
			if (this.options.isAutoAdvancing) {
				this.setAnimationTimeout(this.options.wiggleDelay, this.next);
			}
		} else if (this.isAnimating) {
			// keep on wiggling
			this.animationFrameId = window.requestAnimationFrame(this.wiggle.bind(this));
		}

	};

	Catepilla.prototype.startDeceleration = function () {
		this.isAccelerating = false;
		var speed = this.wiggleSpeed;
		var rotations = Math.ceil(speed / 0.05);
		// return to original angle
		var destinationAngle = TWO_PI * rotations + this.options.startAngle;
		this.deceleration = -(speed * speed) / (2 * (destinationAngle - this.theta) + speed);
	};

	Catepilla.prototype.stopAnimation = function () {
		// console.log('stopping animation');
		this.isAccelerating = false;
		this.wiggleSpeed = 0;
		// disable css transtiions
		this.segmentsEach('setTransitionsEnabled', true);
		this.isAnimating = false;
		if (this.animationTimeout) {
			clearTimeout(this.animationTimeout);
		}
		if (isFinite(this.animationFrameId)) {
			window.cancelAnimationFrame(this.animationFrameId);
			delete this.animationFrameId;
		}
	};

	// ----- event handling ----- //

	Catepilla.prototype.handleEvent = function (event) {
		var handleMethod = '_' + event.type + 'Handler';
		if (this[handleMethod]) {
			this[handleMethod](event);
		}
	};

	// triggered after img loads
	Catepilla.prototype._loadHandler = function (event) {
		var img = event.target;
		var imgData = this.imagesData[img.src];
		imgData.isLoaded = true;

		// trigger callback
		if (imgData.callback) {
			imgData.callback.call(this);
			delete imgData.callback;
		}
	};

	// put in global namespace
	window.Catepilla = Catepilla;

	// -------------------------- CatepillaSegment -------------------------- //

	function CatepillaSegment(props) {
		// extend props over segment, width, imgSrc, index
		for (var prop in props) {
			this[prop] = props[prop];
		}

		var opts = this.parent.options;

		this.elem = document.createElement('div');
		this.elem.className = 'segment';
		this.elem.style.width = this.width + 'px';
		this.elem.style.height = (100 * opts.segmentHeight) + '%';
		this.elem.style[durationProp] = opts.transitionDuration + 's';
		this.elem.style[delayProp] = (opts.perSegmentDelay * this.index) + 's';

		this.img = new Image();

		this.position();
		this.setTransitionsEnabled(true);

		this.elem.appendChild(this.img);

	}

	CatepillaSegment.prototype.setWiggleY = function () {
		var parent = this.parent;
		this.y = (Math.sin(this.index * Math.PI / 2 + parent.theta) * 0.5 + 0.5) *
	parent.height * (1 - parent.options.segmentHeight);
	};

	CatepillaSegment.prototype.position = function () {
		positionElem(this.elem, this.width * this.index, this.y);
		positionElem(this.img, this.width * -this.index, -this.y + this.imgOffsetY);
	};

	CatepillaSegment.prototype.setImage = function (img) {
		this.img.src = img.src;
		this.img.width = this.parent.width;

		var sizeRatio = this.parent.width / img.width;
		this.imgOffsetY = (this.parent.height - img.height * sizeRatio) / 2;

		positionElem(this.img, this.width * -this.index, -this.y + this.imgOffsetY);

	};

	CatepillaSegment.prototype.hide = function () {
		this.elem.style.opacity = 0;
		var sign = Math.random() > 0.5 ? 1 : -1;
		var hideY = this.parent.height * 1.5 * sign + this.parent.height / 2;
		positionElem(this.elem, this.width * this.index, hideY);
	};

	CatepillaSegment.prototype.show = function () {
		this.elem.style.opacity = 1;
		this.position();
	};

	CatepillaSegment.prototype.setTransitionsEnabled = function (enabled) {
		this.elem.style[transitionPropertyProp] = enabled ? transformCSSProp + ', opacity' : 'none';
	};

})(window);

/**
* Undulate Net - bouncy particle field
* requires requestAnimationFrame polyfill
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function (window, $) {

	'use strict';

	var HALF_ROOT_3 = Math.sqrt(3) / 2;
	var isTouch = 'createTouch' in document;
	var cursorStartEvent = isTouch ? 'touchstart' : 'mousedown';
	var cursorMoveEvent = isTouch ? 'touchmove' : 'mousemove';
	var cursorEndEvent = isTouch ? 'touchend' : 'mouseup';

	/* ==================== EventHandler ==================== */

	function EventHandler() { }

	EventHandler.prototype.handleEvent = function (event) {
		if (this[event.type]) {
			this[event.type](event);
		}
	};


	// ======================= UndulateNode  ===============================

	function UndulateNode(settings) {
		// extend settings over constructor
		for (var key in settings) {
			this[key] = settings[key];
		}

		this.angle = 0;
		this.offsetX = 0;
		this.offsetY = 0;

	}

	UndulateNode.prototype.elasticizeProperty = function (prop, target) {
		var deltaProp = prop + 'Delta';
		var opts = this.parent.options;
		this[deltaProp] = (this[deltaProp] || 0) * opts.elasticity + (this[prop] - target) * opts.responsiveness;
		this[prop] -= this[deltaProp];
	};

	UndulateNode.prototype.update = function () {

		var cursor, identifier, distance, angle, dx, dy;
		var opts = this.parent.options;
		for (identifier in this.parent.cursors) {
			cursor = this.parent.cursors[identifier];
			dx = cursor.pageX - this.x - this.parent.offset.x;
			dy = cursor.pageY - this.y - this.parent.offset.y;
			distance = Math.sqrt(dx * dx + dy * dy);
			angle = Math.atan2(dy, dx);
		}

		this.angle = angle || this.angle;

		var targetD = distance ? (opts.displacementRadius - distance) : 0;
		targetD = Math.max(targetD, 0) * opts.displacementIntensity;

		var targetOffsetX = Math.cos(this.angle) * -targetD,
	  targetOffsetY = Math.sin(this.angle) * -targetD;

		this.elasticizeProperty('offsetX', targetOffsetX);
		this.elasticizeProperty('offsetY', targetOffsetY);

		this.x = this.origin.x + this.offsetX;
		this.y = this.origin.y + this.offsetY;

	};

	UndulateNode.prototype.render = function () {
		var ctx = this.parent.context;
		var opts = this.parent.options;
		// ctx.lineWidth = 4;

		// ctx.strokeStyle = 'white';
		// ctx.fillStyle = 'white';

		// ctx.fillStyle = '#8DC63F';
		ctx.fillStyle = 'hsl( 200, 95%, 80% )';

		// ctx.strokeStyle = '#013';

		if (opts.isRenderingDots) {
			var radius = 10,
		d = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY),
		scale = Math.max(0, 0.5 + d / opts.displacementRadius * 2) * this.parent.spacing * 0.07;

			var flipIt = (this.col + Math.floor(this.row / 2) % 2) % 2;

			scale = flipIt ? scale * 0.66 : scale;

			// render mask
			// ctx.save();
			// ctx.translate( this.x, this.y );
			// ctx.scale( scale * 1.3, scale * 1.3 );
			// ctx.rotate( flipIt ? Math.PI : 0 );
			// ctx.fillStyle = '#013';
			// renderNcludShape( ctx );
			// ctx.restore();


			ctx.save();
			ctx.translate(this.x, this.y);

			if (flipIt) {
				ctx.rotate(Math.PI);
				// ctx.fillStyle = '#B3D88C';
			}


			ctx.scale(scale, scale);

			// renderNcludShape( ctx );

			ctx.beginPath();
			ctx.moveTo(0, -8);
			ctx.bezierCurveTo(4.5, -8, 8, -4.5, 8, 0);
			ctx.bezierCurveTo(8, 4.5, 0, 12, 0, 12);
			ctx.bezierCurveTo(0, 12, -8, 4.5, -8, 0);
			ctx.bezierCurveTo(-8, -4.5, -4.5, -8, 0, -8);
			// ctx.stroke();
			ctx.fill();


			ctx.restore();
		}

	};

	// function renderNcludShape( ctx ) {
	// }

	UndulateNode.prototype.renderLineToNode = function (node) {
		// don't proceed if no node
		if (!node) {
			return;
		}

		var ctx = this.parent.context,
	  dx = node.x - this.x,
	  dy = node.y - this.y,
	  d = Math.sqrt(dx * dx + dy * dy);
		ctx.lineWidth = Math.max(1, d * -0.4 + 20);
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(node.x, node.y);
		ctx.stroke();

	};


	// ======================= UndulateNet  ===============================

	function UndulateNet(canvas, options) {

		this.canvas = canvas;

		// don't proceed if canvas is not supported
		if (!this.canvas.getContext || !this.canvas.getContext('2d')) {
			return;
		}

		this.options = {};

		for (var prop in UndulateNet.defaults) {
			this.options[prop] = UndulateNet.defaults[prop];
		}

		for (prop in options) {
			this.options[prop] = options[prop];
		}

		// get canvas context
		this.context = this.canvas.getContext('2d');

		// add nodes
		this.populate();

		this.cursors = {};

		this.canvas.addEventListener(cursorStartEvent, this, false);

		this.isAnimated = true;
		this.animate();

	}

	UndulateNet.defaults = {
		nodeCount: 550, // an approximate figure
		elasticity: 0.97,
		responsiveness: 0.06,
		displacementRadius: 400,
		displacementIntensity: -0.12,
		isRenderingGrid: true,
		isRenderingDots: true,
		verticalPadding: 100
	};

	UndulateNet.prototype.populate = function () {

		// HACK get 
		var offset = $(this.canvas).parents('#content').offset();

		this.offset = {
			x: offset.left,
			y: offset.top
		};

		// set size
		this.width = this.canvas.width = window.innerWidth - 20;
		this.height = this.canvas.height = window.innerHeight + this.options.verticalPadding * 2;

		var netHeight = this.height - this.options.verticalPadding * 2;

		this.spacing = Math.sqrt((this.width * netHeight) / (this.options.nodeCount * HALF_ROOT_3));

		this.nodes = [];

		this.cols = Math.ceil(this.width / this.spacing);
		this.rows = Math.ceil(netHeight / (this.spacing * HALF_ROOT_3));

		var nodeCount = this.cols * this.rows;

		var xAdjust = ((this.width % this.spacing) - this.spacing / 2) / 2,
	  yAdjust = (netHeight % (this.spacing * HALF_ROOT_3)) / 2 + this.options.verticalPadding,
	  origin,
	  y, x, row, col, rowAdjust, node,
	  rowNodes, index;


		var ctx = this.context;

		for (row = 0; row < this.rows; row++) {
			this.nodes[row] = [];
			y = row * this.spacing * HALF_ROOT_3 + yAdjust;
			index = 0;
			for (col = 0; col < this.cols; col++) {
				rowAdjust = (row % 2) * 0.5;
				origin = {
					x: (col + rowAdjust) * this.spacing + xAdjust,
					'y': y
				};

				// node for every 2nd, & 3rd col, switches each row
				// if ( col % 3 !== row % 2 ) {
				node = new UndulateNode({
					parent: this,
					'origin': origin,
					'row': row,
					'col': col,
					'i': index
				});
				index++;
				this.nodes[row].push(node);
				// }
			}
		}
	};

	UndulateNet.prototype.animate = function () {

		var ctx = this.context,
	  node, row, col,
	  rowNodes, len, i;

		ctx.clearRect(0, 0, this.width, this.height);

		for (row = 0; row < this.rows; row++) {
			rowNodes = this.nodes[row];
			len = rowNodes.length;
			for (i = 0; i < len; i++) {
				rowNodes[i].update();
				rowNodes[i].render();
			}
		}

		// animate next frame
		if (this.isAnimated) {
			this.animationId = window.requestAnimationFrame(this.animate.bind(this));
		}

	};

	// ======================= event handling ===============================

	UndulateNet.prototype.handleEvent = function (event) {
		if (this[event.type]) {
			this[event.type](event);
		}
	};

	UndulateNet.prototype.mousedown = function (event) {
		this.cursorStart(event);
		event.preventDefault();
	};

	UndulateNet.prototype.mousemove = function (event) {
		this.cursors.mouse = event;
	};

	UndulateNet.prototype.mouseup = function (event) {
		this.cursorEnd(event);
	};

	// TODO - add multi-touch
	UndulateNet.prototype.touchstart = function (event) {
		this.cursorStart(event.changedTouches[0]);
		event.preventDefault();

	};

	UndulateNet.prototype.touchend = function (event) {
		this.cursorEnd(event);
	};

	UndulateNet.prototype.cursorStart = function (cursor) {
		this.cursors.mouse = cursor;

		document.addEventListener(cursorMoveEvent, this, false);
		document.addEventListener(cursorEndEvent, this, false);

	};

	UndulateNet.prototype.cursorEnd = function (event) {
		delete this.cursors.mouse;

		document.removeEventListener(cursorMoveEvent, this, false);
		document.removeEventListener(cursorEndEvent, this, false);

	};


	window.UndulateNet = UndulateNet;

})(window, jQuery);

/**
* nclud v3 | common
*
* logic used throughout the site
* handles HTML5 push state, header navigation, and controllers
*/

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function (window, $, undefined) {

	'use strict';

	// global nclud v3 object
	var NCLUD = window.NCLUD || {};
	// convienence vars
	var document = window.document;
	var history = window.history;
	var location = window.location;
	var Modernizr = window.Modernizr;
	var $window = $(window);
	var $document = $(document);

	var utils = NCLUD.utils;
	var isSvgSpinnerEnabled = Modernizr.csstransforms && Modernizr.inlinesvg;

	var transformProp = utils.cssProps.transform;
	var sections = 'homepage work about team events contact'.split(' ');
	var $body;

	var transEndEventName = utils.transEndEventName;

	// RegExp
	var reHash = /#.+$/;
	var reQuery = /\?.+$/;

	// convienence
	var PI = Math.PI;
	var TWO_PI = PI * 2;

	/**
	* linear interpolation
	* @param {Number} a - first number
	* @param {Number} b - second number
	* @param {Number} i - decimal, position between 0...1
	*/
	function lerp(a, b, i) {
		return (b - a) * i + a;
	}

	// -------------------------- settings -------------------------- //

	var settings = NCLUD.settings = {
		isLogging: false,
		svgLogoSpinAcceleration: 0.008,
		svgLogoMaxSpeed: 0.38
	};

	// -------------------------- common -------------------------- //

	// site-wide logic

	var controller;

	var common = NCLUD.common = {

		// keep track of manipulated backgrounds
		bgImageDivs: {},

		// log wrapper, similiar to http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
		log: function () {
			if (settings.isLogging && window.console) {
				window.console.log(Array.prototype.slice.call(arguments));
			}
		},

		// initialization
		init: function () {

			// get jQuery objects
			$body = $('body');
			common.$contentHost = $('#content-host');
			common.$wrap = $('#wrap');
			common.$siteHeader = $('#site-header');
			common.$extra = $('#extra');
			// create #extra if not there
			if (!common.$extra.length) {
				common.$extra = $('<div id="extra" />').appendTo(common.$wrap);
			}

			// get SVG logo
			if (isSvgSpinnerEnabled) {
				common.getSvgLogo();
			}

			// keep track of loaded bgImageDivs
			common.$bgOverlay = $('#background-overlay');
			if (common.$bgOverlay.length) {
				common.$bgOverlay.children().each(function () {
					var url = this.getAttribute('data-url');
					if (url) {
						common.bgImageDivs[url] = this;
					}
				});
			}

			// clear out body classes
			$body.removeClass();

			// bind events

			// hover events
			if (!Modernizr.touch && !utils.isMobile) {
				// reveal site header on hover
				common.$siteHeader.hover(common.onSiteHeaderHoverOver, common.onSiteHeaderHoverOff);
				// fancy pants hover over logo
				common.$siteHeader.find('svg').hover(common.startSvgLogoSpin, common.stopSvgLogoSpin);
			}

			if (Modernizr.history) {
				// handle .push-to clicks
				$body.delegate('a.push-to', 'click', common.onPushToClick);

				// auto-pilot button
				common.$siteHeader.find('.nav-auto a').click(function (jQEvent) {
					if (NCLUD.autoPilot) {
						NCLUD.autoPilot.toggle();
					}
					jQEvent.preventDefault();
				});
			}

			// fullscreen button
			if (Modernizr.fullscreen) {
				common.$siteHeader.find('.nav-fullscreen a').click(function (jQEvent) {
					utils.toggleFullScreen();
					jQEvent.preventDefault();
				});
			}

			if (document.addEventListener) {
				// for keyboard navigation
				window.addEventListener('keydown', common.onKeydown, false);

				// bind popstate event for forward/back button navigation
				window.addEventListener('popstate', common.onPopState, false);
			}
			// save original history state for original popstate
			common.originalHistoryState = common.getStateFromHref(location.href);
			common.originalHistoryState.title = document.title;

			// don't pushState original state
			common.stateWasPopped = true;
			common.pushTo(common.originalHistoryState);

		},

		// ---- events ---- //

		onSiteHeaderHoverOver: function (event) {
			// bail out if hover is mysteriously in the top left pixel
			if (event.pageX === 0 && event.pageY === 0) {
				return;
			}
			$body.addClass('is-site-header-hovered');
		},

		onSiteHeaderHoverOff: function () {
			$body.removeClass('is-site-header-hovered');
		},

		// handler for keyboard navigation
		onKeydown: function (event) {
			if (NCLUD.autoPilot) {
				NCLUD.autoPilot.stop();
			}
			// don't trigger when in input
			// thx @madrobby https://github.com/madrobby/keymaster/blob/master/keymaster.js
			var tagName = (event.target || event.srcElement).tagName;
			var delta;
			if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
				return;
			}

			switch (event.keyCode) {
				case 38: // up
				case 40: // down
					delta = event.keyCode === 38 ? -1 : 1;
					common.goToPrevNextSection(delta);
					event.preventDefault();
					break;
				case 37: // left
				case 39: // right
					// left/right is handled by section controller
					if (controller.goToPrevNext) {
						delta = event.keyCode === 37 ? -1 : 1;
						controller.goToPrevNext(delta);
						event.preventDefault();
					}
					break;
				case 16: // shift
					common.isShiftKeyPressed = true;
					$body.addClass('is-shift-key-pressed');
					window.addEventListener('keyup', common.onKeyup, false);
					break;
			}
		},

		onKeyup: function (event) {
			// remove shift key flags
			if (event.keyCode === 16) {
				common.isShiftKeyPressed = false;
				$body.removeClass('is-shift-key-pressed');
				window.removeEventListener('keyup', common.onKeyup, false);
			}
		},

		// ajaxish navigation, triggered on internal links
		onPushToClick: function (event) {
			if (NCLUD.autoPilot) {
				NCLUD.autoPilot.stop();
			}
			common.pushToPath(this.href);
			event.preventDefault();
		},

		onPopState: function (event) {
			var state = event.state || common.originalHistoryState;

			common.log('state popped!', event.state, state);

			// set flag
			common.stateWasPopped = true;
			common.pushTo(state);
		},

		// ---- navigation ---- //

		// @returns state{ path, pathParts, section }
		getStateFromHref: function (href) {
			var state = {};
			// get relative path, i.e. /work or /work/mobile/aiga-50
			// removes domain from path
			state.path = href.replace(location.protocol + '//' + location.host, '');

			common.getPathProperty(state, 'hash', reHash);
			common.getPathProperty(state, 'query', reQuery);

			// parse path, get usable segments, i.e.  [ work, category, desktop, aiga ]
			var splitPath = state.path.split('/');
			var pathParts = [];
			// remove empty string parts
			for (var i = 0, len = splitPath.length; i < len; i++) {
				if (splitPath[i]) {
					pathParts.push(splitPath[i]);
				}
			}
			// set empty string to homepage
			pathParts[0] = pathParts[0] || 'homepage';
			state.pathParts = pathParts;

			// get section and contentSection
			// needed because RFP and contact are in the same section
			state.contentSection = pathParts[0];
			var section = state.contentSection;
			// convert rfp section to contact;
			section = section === 'rfp' ? 'contact' : section;
			// use 404 if not valid
			section = utils.is404 ? 'fourohfour' : section;
			state.contentSection = utils.is404 ? 'fourohfour' : state.contentSection;
			// disable 404 flag
			utils.is404 = false;

			state.section = section;
			return state;
		},

		// gets, then removes hash and query param from 
		getPathProperty: function (state, propName, regex) {
			var prop = regex.exec(state.path);
			if (!prop) {
				return;
			}
			// remove leading ? or # character
			state[propName] = prop[0].substr(1);
			// remove from path
			state.path = state.path.replace(regex, '');
		},

		// @param path String url to navigate to
		pushToPath: function (path) {
			// get state
			var state = common.getStateFromHref(path);
			common.pushTo(state);
		},

		// given a state object, navigate to content
		// @param state Object should have path, section, pathParts, & possibly title
		pushTo: function (state) {
			// don't proceed if no state, or same state
			if (!state || state === NCLUD.state) {
				delete common.stateWasPopped;
				return;
			}

			// save new state
			NCLUD.state = state;

			// set controller
			if (state.section) {
				common.previousSection = NCLUD.section;
				NCLUD.section = state.section;
				common.isNewSection = NCLUD.section !== common.previousSection;
				controller = NCLUD.controller = NCLUD[state.section];

				// ajax in section content if its not there
				if (!$('#' + state.contentSection).length) {
					var path = state.path || '/' + state.contentSection;
					// there is no /homepage page, just get index
					path = path === '/homepage' ? '/' : path;
					common.ajax(path, { done: common.sectionReady });
				} else {
					// section already present, switch to section
					common.sectionReady();
				}
			}

		},

		// changes to previous or next section
		// @param delta Integer -1 for previous, 1 for next
		goToPrevNextSection: function (delta) {
			var index = sections.indexOf(NCLUD.section);
			var nextSection = sections[index + delta];
			if (nextSection) {
				// convert 'homepage' -> ''
				nextSection = nextSection === 'homepage' ? '' : nextSection;
				// push to it
				common.pushToPath('/' + nextSection);
			}
		},

		initController: function (ctrlr) {
			if (!ctrlr || ctrlr.isInited) {
				return;
			}
			// init controller's init method, if its there
			if (ctrlr.init) {
				// common.log('init controler', NCLUD.section )
				ctrlr.init();
			}
			ctrlr.isInited = true;
		},

		// completes pushTo after ajax has loaded
		sectionReady: function () {

			// hide work if not visible

			if (common.isNewSection) {
				$body.removeClass('is-content-ready');
			}

			common.initController(controller);

			if (common.previousSection && common.isNewSection) {
				// add class after transition
				common.$contentHost[0].addEventListener(transEndEventName, common.onHostTransitionEnd, false);
			} else {
				$body.addClass('is-content-ready');
			}


			if (common.isSiteInited) {
				// do async, to resolve transitions
				setTimeout(common.changeContent, 10);
			} else {
				// if site hasn't been inited, change immediately
				common.changeContent();
			}

		},

		changeContent: function () {

			// go to section
			// toggle classes which will move section into place
			$body.removeClass(common.previousSection || '').addClass(NCLUD.section);

			// trigger previous controller's onExit method
			// triggered every time section is switched to
			var previousController = common.previousSection && NCLUD[common.previousSection];
			if (common.isNewSection && previousController && previousController.onExit) {
				previousController.onExit();
			}
			// trigger controller's onEnter method
			// triggered every time section is switched to
			if (common.isNewSection && controller.onEnter) {
				controller.onEnter();
			}
			// trigger controller's pushTo
			if (controller.pushTo) {
				controller.pushTo();
			}


			// set background
			var bg;
			if (controller.getBackground) {
				// get background from controller
				bg = controller.getBackground();
			}
			// if background was not set by controller
			if (!bg && common.isNewSection) {
				// get background image for section
				var sectionBgImages = NCLUD.siteData.bgImages[NCLUD.section];
				if (sectionBgImages) {
					bg = sectionBgImages[Math.floor(Math.random() * sectionBgImages.length)];
				}
			}
			common.setBackground(bg);

			var state = NCLUD.state;

			// set title
			state.title = state.title || controller.title || common.originalHistoryState.title;
			document.title = state.title;

			// HTML5 push state
			if (!common.stateWasPopped) {
				// add trailing slash
				var path = state.path + (state.path.substr(-1, 1) !== '/' ? '/' : '');
				// add hash if there
				path += (state.hash ? '#' + state.hash : '');
				history.pushState(state, state.title, path);
			}

			// reset flag
			delete common.stateWasPopped;


			// set site ready flag
			if (!common.isSiteInited) {
				common.isSiteInited = true;
				// async to trigger transition
				setTimeout(function () {
					$body.addClass('is-site-inited');
				});
			}

		},

		// triggered after content host movement transition has ended
		onHostTransitionEnd: function (event) {
			// disregard if transition end was not on host
			var contentHost = common.$contentHost[0];
			if (event.target !== contentHost) {
				return;
			}
			$body.addClass('is-content-ready');
			contentHost.removeEventListener(transEndEventName, common.onHostTransitionEnd, false);
		},

		// ---- AJAX ---- //

		// defferedMethods = { done: function(data){ $('body').append( $(data) ) } }
		ajax: function (path, defferedMethods) {
			common.log('ajaxing: ', path);
			common.startLoadingIndicator();

			common.ajaxPath = path;

			var jqXHR = $.get(path)
	  .done(common.ajaxDone, defferedMethods.done)
	  .fail(common.ajaxFail, defferedMethods.fail)
	  .always(common.stopLoadingIndicator, defferedMethods.always);

		},

		ajaxDone: function (data) {
			common.log("ajax done");
			var $data = $(data);
			// get controller title from HTML content
			controller.title = $data.filter('title').text();
			// append section content to content
			$data.find('#' + NCLUD.state.pathParts[0]).appendTo(common.$contentHost);

			// trigger controller's ajax success callback if needed
			if (controller.ajaxDone) {
				controller.ajaxDone($data);
			}
		},

		ajaxFail: function () {
			// debugger;
			// ajax didn't work, give up and go to page
			// window.location = common.ajaxPath;
		},

		// ----- svgLogo ----- //

		getSvgLogo: function () {
			var $svgLogo = common.$siteHeader.find('svg');
			common.svgLogo = {
				// get component elems
				elem: $svgLogo[0],
				bigShape: $svgLogo.find('.big-shape')[0],
				lilShape: $svgLogo.find('.lil-shape')[0],
				clipPath: $svgLogo.find('#nclud-clip path')[0],
				// properties
				angle: 0,
				speed: 0,
				isSpinning: false,
				isAccelerating: false
			};

		},

		startSvgLogoSpin: function () {
			var svgLogo = common.svgLogo;
			if (!svgLogo) {
				return;
			}
			svgLogo.isAccelerating = true;
			if (!svgLogo.isSpinning) {
				svgLogo.isSpinning = true;
				common.spinSvgLogo();
			}
		},

		spinSvgLogo: function () {
			var svgLogo = common.svgLogo;
			// accelerate or decelerate speed
			svgLogo.speed += svgLogo.isAccelerating ? settings.svgLogoSpinAcceleration : svgLogo.deceleration;
			svgLogo.speed = Math.max(0, Math.min(settings.svgLogoMaxSpeed, svgLogo.speed));
			// apply speed to angle
			svgLogo.angle += svgLogo.speed;
			// normalize angle
			svgLogo.angle = (svgLogo.angle + TWO_PI * 2) % TWO_PI;

			// rotate element
			svgLogo.elem.style[transformProp] = 'rotate(' + svgLogo.angle + 'rad)';

			// position SVG shapes
			var positionI = svgLogo.speed / settings.svgLogoMaxSpeed;

			var bigX = lerp(0, 6, positionI);
			var bigY = lerp(33, 0, positionI);
			svgLogo.bigShape.setAttribute('transform',
	  'translate(' + bigX + ' ' + bigY + ') rotate( 180, 16, 20 )');

			var lilX = lerp(19, 9.5, positionI);
			var lilY = lerp(13, 60, positionI);
			svgLogo.lilShape.setAttribute('transform',
	  'translate(' + lilX + ' ' + lilY + ') scale(0.78125 )');

			var clipX = lerp(-13, 0, positionI);
			var clipY = lerp(22, -48, positionI);
			// var clipX = -13;
			// var clipY = lerp( 22, 40, positionI );
			svgLogo.clipPath.setAttribute('transform', 'translate(' + clipX + ' ' + clipY + ') rotate( 180, 16, 20 )');

			svgLogo.isSpinning = svgLogo.speed > 0;
			if (svgLogo.isSpinning) {
				// keep spinning
				window.requestAnimationFrame(common.spinSvgLogo);
			}

		},

		stopSvgLogoSpin: function () {
			var svgLogo = common.svgLogo;
			var rotations = Math.ceil(svgLogo.speed / 0.2);
			// get deceleration http://stackoverflow.com/questions/1088088
			svgLogo.deceleration = -(svgLogo.speed * svgLogo.speed) /
	  (2 * (TWO_PI * rotations - svgLogo.angle + svgLogo.speed / 2));
			common.svgLogo.isAccelerating = false;
		},

		// ----- loading indicators ----- //

		startLoadingIndicator: function () {
			if (isSvgSpinnerEnabled) {
				common.startSvgLogoSpin();
			} else {
				// create loading indicator
				if (!common.$loading) {
					common.$loading = $('<div class="loading"><p>Loading</p></div>').appendTo(common.$siteHeader);
					common.$loading.activity({
						color: '#B3D88C',
						width: 5,
						space: 5,
						length: 12,
						speed: 1.7
					});
				}

				common.$loading.removeClass('is-invis');
			}

			$body.addClass('is-loading');
		},

		stopLoadingIndicator: function () {
			if (isSvgSpinnerEnabled) {
				common.stopSvgLogoSpin();
			}
			$body.removeClass('is-loading');
		},

		// ----- change background ----- //

		setBackground: function (url, isManipulatedImage) {
			// bail out if no url
			if (!url) {
				return;
			}

			if (common.bgImageDivs[url]) {
				// if bg image has already been loaded, change to it
				common.changeBackgroundDiv(url);
			} else {
				// otherwise, load image, manipulate it, then change to it
				var img = new Image();
				img.addEventListener('load', common.onBgImageLoad, false);
				common.loadingImageUrl = url;
				common.isManipulatedImage = isManipulatedImage;

				// forge image with PHP to get around canvas security
				/*
				img.src = !isManipulatedImage || hasSameOrigin( url ) ? url :
				'/wp-content/themes/nclud3/functions/image-forgery.php?url=' + url;
				*/
				img.src = url;
			}

		},

		onBgImageLoad: function (event) {
			// create background overlay
			if (!common.$bgOverlay.length) {
				common.$bgOverlay = $('<div id="background-overlay" />');
				var comment = document.createComment(' Background overlays use gigantic data URIs. Expand if you dare! ');
				common.$wrap.prepend(common.$bgOverlay).prepend($(comment));
			}

			/*
			var url = common.isManipulatedImage ?
			// manipulate background image, get a data url for it
			common.getManipulatedBackgroundImageDataUrl( event.target ) :
			// otherwise, just use the url
			common.loadingImageUrl;
			*/
			var url = common.loadingImageUrl;

			var div = document.createElement('div');
			div.className = 'image';
			div.setAttribute('data-url', common.loadingImageUrl);
			div.style.backgroundImage = 'url("' + url + '")';

			common.$bgOverlay[0].appendChild(div);

			// cache manipulated image data
			common.bgImageDivs[common.loadingImageUrl] = div;

			common.changeBackgroundDiv(common.loadingImageUrl);
			delete common.loadingImageUrl;
			delete common.isManipulatedImage;

		},


		/**
		* @returns String / Data URI url
		*/
		/*
		getManipulatedBackgroundImageDataUrl: function( img ) {
		// create canvas, get context
		if ( !common.bgCanvas ) {
		common.bgCanvas = document.createElement('canvas');
		common.bgCanvasContext = common.bgCanvas.getContext('2d');
		}

		var w = img.width;
		var h = img.height;
		var canvas = common.bgCanvas;
		var ctx = common.bgCanvasContext;

		canvas.width = w;
		canvas.height = h;

		// make background opaque
		// ctx.fillStyle = 'white';
		// ctx.fillRect( 0, 0, w, h );

		// draw image on to canvas
		ctx.drawImage( img, 0, 0 );
		// get its data
		var imgData = ctx.getImageData( 0, 0, w, h );
		var data = imgData.data;
		ctx.clearRect( 0, 0, w, h );

		// Make image black & white,
		// then apply dark blue overlay
		var gray;
		for (var i=0, len = data.length; i < len; i += 4 ) {
		gray = data[i] * 0.35 + data[i+1] * 0.45 + data[i+2] * 0.2;
		// gray = gray * 0.0 + 1;
		data[i] = gray * 0.2; // red
		data[i+1] = gray * 0.4; // green
		data[i+2] = gray * 0.6; // blue
		}
		// blur it
		imgData = stackBlurImageData( imgData, 10 );

		ctx.putImageData( imgData, 0, 0 );

		return canvas.toDataURL();
		},
		*/

		// once manipulate image has loaded, set it
		changeBackgroundDiv: function (url) {

			// use setTimeout to delay, and ensure that only 1 background change occurs
			if (common.bgChangeTimeout) {
				clearTimeout(common.bgChangeTimeout);
			}

			common.bgImgUrl = url;
			var delay = common.isShiftKeyPressed ? 6000 : 1000;
			common.bgChangeTimeout = setTimeout(common.hideRevealBackgrounds, delay);

		},

		// backgrounds are swapped right here
		hideRevealBackgrounds: function () {
			// get previous image div
			var $prevBgImageDiv = common.$bgOverlay.find('.is-selected')
	  .removeClass('is-selected').addClass('is-previous');
			var bgImageDiv = common.bgImageDivs[common.bgImgUrl];
			// reveal new bg img div
			$(bgImageDiv).addClass('is-selected')
			// use jQuery animation over transitions
			// transitions causing too many bugs
	  .animate({ opacity: 1 }, function () {
		  // hide previous img div, if not already selected
		  if (!$prevBgImageDiv.hasClass('is-selected')) {
			  $prevBgImageDiv.css({ opacity: 0 }).removeClass('is-previous');
		  }
	  });
		}

	};


	// by John Schulz, from Close Pixelate https://github.com/desandro/close-pixelate
	// checks if image is on the same domain
	/*
	var hasSameOrigin = (function() {

	var page = document.location,
	protocol = page.protocol,
	domain = document.domain,
	port = page.port ? ':' + page.port : '',
	sop_string = protocol + '//' + domain + port,
	sop_regex = new RegExp('^' + sop_string),
	http_regex = /^http(?:s*)/,
	data_regex = /^data:/,
	closure = function ( url )
	{
	var is_local = (!http_regex.test(url)) || data_regex.test(url),
	is_same_origin = sop_regex.test(url);

	return is_local || is_same_origin;
	};

	return closure;

	})();
	*/

	// -------------------------- doc ready -------------------------- //

	// start it off
	$document.ready(common.init);

	// publicize NCLUD
	window.NCLUD = NCLUD;

})(window, jQuery);

/**
* nclud v3 | homepage
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function (window, $, undefined) {

	'use strict';

	// get global vars
	var NCLUD = window.NCLUD;
	var Modernizr = window.Modernizr;

	var common = NCLUD.common;

	var homepage = NCLUD.homepage = {

		init: function () {

			// init work
			common.initController(NCLUD.work);

			// navigate to work when on homepage
			$('#work').on('click', '.homepage #work article .images li', homepage.onWorkItemClick);

		},

		onWorkItemClick: function () {
			if (Modernizr.history) {
				var state = common.getStateFromHref('/work');
				common.pushTo(state);
			} else {
				// get slug
				var slug = $('#work article').not('#dummy-article')[0].id;
				window.location.href = '/work/' + slug;
			}
		},

		ajaxDone: function ($data) {
			// also load work section
			if (!$('#work').length) {
				$data.find('#work').appendTo(common.$contentHost);
			}
		}


	};

})(window, jQuery);

/**
* nclud v3 | work
* handles 3D-ish work environment, navigation between projects
*/

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, Modernizr: true, addTap: true */

(function (window, $, undefined) {

	'use strict';

	// global nclud v3 object
	var NCLUD = window.NCLUD || {};
	// convienence vars
	var document = window.document;
	var location = window.location;
	var $window = $(window);
	var utils = NCLUD.utils;
	var is3d = Modernizr.csstransforms3d;
	var isEnvironment3d = is3d && !utils.isChrome && !utils.isBad3DFirefox;

	var cssProps = utils.cssProps;
	var $body = $('body');

	// http://www.modernizr.com/docs/#prefixed
	var transEndEventName = utils.transEndEventName;

	// reg ex for extracting url from url("example.com/img")
	var reBgImgUrl = /url\((["|']?)([^"']+)\1\)/;


	// ----- jQuery elems used ----- //

	var $categoryNav, $dummyItem, $navColumnsContainer, $navScroller, $nextNav, $prevNav, $previousProject, $resizeStyle, $selectedCategoryItem, $selectedNavItem, $workProjectsEnv;

	// -------------------------- settings -------------------------- //

	$.extend(NCLUD.settings, {
		perspective: 1000,
		projectDistance: 500,
		// when one project is selected, how many next/previous projects are loaded
		adjacentProjects: 1,
		// size of chrome, used to properly size screenshots
		chromeSizes: [
	{
		css: '.iphone.portrait',
		width: 412,
		height: 781
	},
	{
		css: '.desktop.landscape',
		width: 1236,
		height: 954
	},
	{
		css: '.desktop.portrait',
		width: 1036,
		height: 1335
	},
	{
		css: '.macbook.landscape',
		width: 1291,
		height: 700
	},
	{
		css: '.ipad.portrait',
		width: 682,
		height: 877
	},
	{
		css: '.ipad.landscape',
		width: 877,
		height: 682
	},
	{
		css: '.android.portrait',
		width: 412,
		height: 772
	}
  ],

		// used for dynamically sizing portfolio screenshots
		// within relative bounds of container
		specialLayoutSizes: [
	{
		layouts: ['corner-left', 'corner-right'],
		width: 0.6,
		height: 0.7
	},
	{
		layouts: ['side-left', 'side-right'],
		width: 0.7,
		height: 1
	},
	{
		layouts: ['top'],
		width: 1,
		height: 0.85
	}
  ]

	});

	var settings = NCLUD.settings;
	var common = NCLUD.common;

	// ----- keep track of ----- //

	var loadedChromeImages = [];
	var loadingProjectQueue = [];

	// -------------------------- work -------------------------- //

	var workData = NCLUD.siteData.work;

	// controller object
	var work = NCLUD.work = {};

	// props to keep track of
	work.$projects = {};

	work.init = function () {

		// get jQuery objects
		work.$host = $('#work-projects-host');
		work.$selectedProject = work.$host.find('article').eq(0);
		// create dummy item, used for styling
		$dummyItem = $('<article id="dummy-article"><ul class="images"><li />' +
	  '</ul></article').appendTo(work.$host).find('li');

		// get original project ID
		var id = work.$selectedProject[0].id;
		// determine original category
		var pathParts = NCLUD.state.pathParts;
		work.category = pathParts[1] === 'category' && pathParts[2] ? pathParts[2] : 'all';
		// get original selectedIndex and selected ID
		work.selectedIndex = work.getProjectIndexFromID(id);
		work.selectedID = id;

		var projectData = workData.projects[id];

		// start up 3d
		$workProjectsEnv = $('#work-projects-env');
		work.getSize();
		work.layoutEnvironment();

		updateNavigation();

		// window resize logic
		$resizeStyle = $('<style media="screen" />').appendTo('head');
		// trigger resize stuff on init
		work.onWindowResize();

		// load the initial project
		work.loadProject(id);

		if (!utils.isMobile) {
			initWithNav();
		}
	};


	function initWithNav() {

		work.$nav = $('#work-nav');

		if (work.$nav.length) {
			setupNav();
		} else {
			$.get('/work').done(getNavSuccess);
		}

	}

	// triggered every time work is switched to
	work.onEnter = function () {
		// do window resize stuff when window is resized
		$window.on('smartresize', work.onWindowResize).smartresize();

		var prevSection = common.previousSection;
		if (prevSection && prevSection !== 'work') {
			navReady();
		}
	};

	work.onExit = function () {
		// disable window resizing events
		$window.off('smartresize', work.onWindowResize);

		// hide nav if fully visible
		if (work.$nav) {
			work.$nav.removeClass('is-visible');
		}
	};

	function getNavSuccess(data) {
		appendNav($(data));
		setupNav();
	}

	function setupNav() {
		// set up isotopes
		// each group, within each column
		work.$navLists = work.$nav.find('.project-list');
		work.$navLists.isotope({
			layoutMode: 'straightDown',
			itemSelector: 'li',
			resizesContainer: false
		}).css({
			// overwrite isotope style
			overflow: 'visible'
		});

		// container for all the columns
		work.$navColumnsContainer = work.$nav.find('.filterable-columns-container');
		work.$navColumnsContainer.isotope({
			layoutMode: 'straightAcross',
			itemSelector: '.col',
			filter: ':not(.is-empty)',
			resizesContainer: false
		}).css({
			// overwrite isotope style
			overflow: 'visible'
		});

		// get jQuery objects
		$categoryNav = work.$nav.find('.categories');
		$selectedCategoryItem = $categoryNav.find('.is-selected');
		$navScroller = work.$nav.find('.scroller');
		work.$navHost = $('#work-nav-host');

		// trigger isotope relayouts a second later, after fonts have loaded
		// to resolve overlapping
		setTimeout(function () {
			work.$navLists.isotope('reLayout');
		}, 1000);

		// bind touch events for nav
		if (Modernizr.touch) {
			addTap(work.$nav[0], onNavTap);
		}

		// bind scroll button click
		work.$nav.on('click', '.scroll-button', onNavScrollButtonClick);

	}

	// delay revealing the work-nav
	function navReady() {
		// bail out if no work nav
		if (!work.$nav) {
			return;
		}
		// add a class, which has a transition delay
		work.$nav.addClass('is-ready')
		// after transition ends, remove the delay
	  .one(transEndEventName, function () {
		  work.$nav.removeClass('is-ready');
	  });
	}

	// ----- project methods ----- //

	work.getProjectIndexFromID = function (id) {
		return workData.categoryIDs[work.category].indexOf(id);
	};

	// @returns jQuery object of new content
	// @param id String slug/id of the project
	work.loadProject = function (id) {
		// don't proceed if already added
		if (work.$projects[id]) {
			// console.warn('already loaded', id )
			work.loadNextProjectInQueue();
			return;
		}
		// if unloaded, let's add it
		common.log('Loading Project ⚑ ', id);

		var $project = $('#' + id);
		// check if project is already on the page
		if (!$project.length) {
			// create jQuery object from projectData
			var projectData = workData.projects[id];
			$project = getProjectContent(projectData);
		}

		positionProjectSprite($project[0]);
		loadProjectImages($project);

		// keep track of loaded projects
		work.$projects[id] = $project;

		// append to host
		work.$host.append($project);

		// init new ProjectScene
		var scene = new NCLUD.ProjectScene($project);
		// save scene internally
		$project.data('projectScene', scene);

	};

	// keeps track of all the images in a project
	function loadProjectImages($project) {
		var unloadedImages = 0;
		var loadedImages = 0;

		// callback triggered after an image loads
		var projectImgLoaded = function () {
			loadedImages++;
			// if all images have been loaded
			if (loadedImages >= unloadedImages) {
				// remove class, stop activity indicator
				$project.removeClass('is-loading');
				work.loadNextProjectInQueue();
				// stop activity indicator
				setTimeout(function () {
					// in setTimeout to resolve bug
					$project.activity(false);
				});
				// common.log('project loaded', $project )
			}
		};

		// go through items and load chromes, if necessary
		$project.find('li').each(function (i, item) {
			// set dummy's class to match item's class
			$dummyItem[0].className = item.className;
			var bgImg = $dummyItem.css('backgroundImage');
			// remove `url("")` cruft, to get just the URL
			var bgImgUrl = reBgImgUrl.exec(bgImg);
			var imgUrl = bgImgUrl && bgImgUrl[2];
			// check if img is a loaded chrome image
			if (imgUrl && loadedChromeImages.indexOf(imgUrl) === -1) {
				// common.log('unloaded chrome', imgUrl )
				unloadedImages++;
				loadProjectImage(imgUrl, projectImgLoaded);
			}
		});

		// load images
		$project.find('img').each(function (i, img) {
			unloadedImages++;
			loadProjectImage(this.src, projectImgLoaded);
		});

		if (unloadedImages) {
			$project.addClass('is-loading');
			// use activity indicator to show spinning loading animation
			// setTimeout so project is loaded, as activity requires element to be in DOM
			setTimeout(function () {
				$project.activity({
					width: 5,
					space: 5,
					length: 12,
					speed: 1.7
				});
			});
		}
		// common.log( $project.attr('id'), unloadedImages )
	}

	work.loadNextProjectInQueue = function () {
		// load next project in queue
		if (!loadingProjectQueue.length) {
			return;
		}
		var nextId = loadingProjectQueue.pop();
		common.log('load next project', nextId);
		work.loadProject(nextId);
	};

	function loadProjectImage(srcUrl, callback) {
		var img = $('<img />').one('load', callback)[0];
		img.src = srcUrl;
	}

	// on a page with a project, add other projects
	function addSiblingProjects(id) {
		// common.log('add siblings next to', id )
		var index = work.getProjectIndexFromID(id);
		var categoryIDs = workData.categoryIDs[work.category];

		// get next and previous projects
		index = Math.max(0, index - settings.adjacentProjects);
		var maxI = Math.min(categoryIDs.length, index + 1 + settings.adjacentProjects * 2);
		var idsToLoad = categoryIDs.slice(index, maxI);
		// add ids to load, if they're not already in the queue
		var idToLoad;
		for (var i = 0, len = idsToLoad.length; i < len; i++) {
			idToLoad = idsToLoad[i];
			if (!work.$projects[idToLoad] && loadingProjectQueue.indexOf(idToLoad) === -1) {
				// common.log('➫➫ Adding to Loading Queue', idToLoad )
				loadingProjectQueue.push(idToLoad);
			}
		}

	}

	// returns HTML content, from siteData project object
	function getProjectContent(data) {
		var title = data.highlightedTitle && data.highlightedTitle.length ?
	  data.highlightedTitle : data.title;

		var html =
	'<article id="' + data.url + '" class="is-invis layout-' + data.layout + '" ' +
		'" data-layout="' + data.layout + '">' +
	  '<div class="copy">' +
		'<h1>' + title + '</h1>' +
		'<div class="description">' +
		  data.desc +
		'</div>' +
	  '</div>' +
	  '<ul class="images">';
		var image;
		for (var i = 0, len = data.images.length; i < len; i++) {
			image = data.images[i];
			html += '<li class=" ' + image.device + ' ' + image.orientation + '">' +
		  '<img src="' + image.file + '" /></li>';
		}

		html += '</ul>' +
	'</article>';

		return $(html);
	}

	// ---- Environment ---- //

	// positions host and sprites
	work.layoutEnvironment = function () {
		positionHost();
		var $project;
		for (var id in work.$projects) {
			$project = work.$projects[id];
			positionProjectSprite($project[0]);
		}
	};

	function positionProjectSprite(projectElem) {
		var index = work.getProjectIndexFromID(projectElem.id);
		// common.log( 'position project sprite', projectElem.id, index )
		positionSprite(projectElem, index * -1);
	}

	function positionHost() {
		positionSprite(work.$host[0], work.selectedIndex);
	}

	function positionSprite(elem, index) {
		var position, transform;
		if (isEnvironment3d) {
			position = settings.projectDistance * index;
			transform = 'translate3d( 0, 0, ' + position + 'px )';
		} else {
			position = work.size.width * index * -1;
			transform = 'translate(' + position + 'px, 0 )';
		}
		elem.style[cssProps.transform] = transform;
	}



	// ---- events ---- //

	// dynamically size chrome and screenshots to fit in window
	function fitImages() {

		var backslash = '/';
		var styleText = '/* Dynamically generated styles so images fit *';
		// HACK scriptbuild.sh looks for `*/` and adds new lines chars
		styleText += backslash + ' ' + "\n";
		// base
		styleText += createFitImageStyle();

		var specialLayoutSize;
		for (var i = 0, len = settings.specialLayoutSizes.length; i < len; i++) {
			specialLayoutSize = settings.specialLayoutSizes[i];
			styleText += createFitImageStyle(specialLayoutSize);
		}

		$resizeStyle.text(styleText);

	}

	function createFitImageStyle(specialLayoutSizes) {
		var styleText = '';
		var containerW = work.size.width * (specialLayoutSizes && specialLayoutSizes.width || 1);
		var containerH = work.size.height * (specialLayoutSizes && specialLayoutSizes.height || 1);
		var containerRatio = containerW / containerH;
		var chromeSize, w, h, chromeRatio, selector, layout;

		for (var i = 0, len = settings.chromeSizes.length; i < len; i++) {
			chromeSize = settings.chromeSizes[i];
			chromeRatio = chromeSize.width / chromeSize.height;

			if (chromeRatio <= containerRatio) {
				// item too tall, max out height
				h = Math.min(chromeSize.height, containerH);
				w = h * chromeRatio;
			} else {
				// item too wide, max out width
				w = Math.min(chromeSize.width, containerW);
				h = w / chromeRatio;
			}

			// build complex selector for special layout sizes
			selector = '';
			if (specialLayoutSizes && specialLayoutSizes.layouts) {
				for (var j = 0, len2 = specialLayoutSizes.layouts.length; j < len2; j++) {
					layout = specialLayoutSizes.layouts[j];
					selector += ' #work article.layout-' + layout + ' .images li' + chromeSize.css;
					selector += j < len2 - 1 ? ',' + "\n" : '';
				}
			} else {
				selector = ' #work article .images li' + chromeSize.css;
			}

			styleText += selector + ' { ' +
		'width: ' + w + 'px; ' +
		'height: ' + h + 'px; }' + "\n";

		}

		return styleText;
	}

	work.getSize = function () {
		work.size = {
			width: $workProjectsEnv.width(),
			height: $workProjectsEnv.height()
		};
	};

	work.onWindowResize = function (event) {
		work.getSize();

		fitImages();

		// fit selected project images in article
		var projectScene = work.$selectedProject && work.$selectedProject.data('projectScene');
		if (projectScene) {
			projectScene.reLayout();
		}

		// re position projects to fit with new window dimensions
		if (!isEnvironment3d) {
			work.layoutEnvironment();
		}
	};

	// ----- touch events for nav ----- //

	function onNavTap() {
		work.$nav.addClass('is-visible');
		document.addEventListener('touchstart', onWindowTouchstart, false);
	}

	// triggered after nav was touched, made visible
	// hide nav again after something else is touched
	function onWindowTouchstart(event) {
		var touch = event.changedTouches[0];
		if (touch.pageY < work.$nav.offset().top) {
			work.$nav.removeClass('is-visible');
			document.removeEventListener('touchstart', onWindowTouchstart, false);
		}
	}

	// scroll work nav on button click
	function onNavScrollButtonClick(jQEvent) {
		var navW = work.$nav.width();
		var hostW = utils.isTouchNonScrolling ? work.$navHost.width() + 200 : work.$navHost.outerWidth(true);
		var $target = $(jQEvent.target);
		// get scroll button, as we may click a child psuedo element
		var $scrollButton = $target.is('.scroll-button') ? $target : $target.parents('.scroll-button');
		var delta = navW * ($scrollButton.hasClass('right') ? 1 : -1);
		var x = $navScroller.scrollLeft() + delta;
		x = Math.max(0, Math.min(hostW - navW, x));

		$navScroller.animate({ scrollLeft: x });
	}

	// ---- navigation ---- //

	work.pushTo = function () {
		var state = NCLUD.state;

		// check if hash
		var isFilter = state.hash && workData.categories.indexOf(state.hash) !== -1;
		// set category to the hash value or just work
		var category = isFilter ? state.hash : 'all';
		common.log('push to', category, state.pathParts[1]);
		work.filter(category, state.pathParts[1]);
	};

	// changes the selected project
	work.goToProject = function (id) {

		var previousIndex = work.selectedIndex;
		var index = workData.categoryIDs[work.category].indexOf(id);

		if (index === work.selectedIndex) {
			// same project & category, don't proceed
			return;
		}
		// save properties
		work.selectedIndex = index;
		work.selectedID = id;

		common.log('go to project: ', id, work.selectedIndex);

		addSiblingProjects(id);

		work.loadProject(id);

		$previousProject = work.$selectedProject;

		// set new selected Project

		// if ( !work.$projects[id] ) { debugger; }

		work.$selectedProject = work.$projects[id]
	  .addClass('is-selected').removeClass('is-invis is-previous');

		// remove previous selected project
		if ($previousProject && $previousProject.length &&
		!$previousProject.is(work.$selectedProject)) {
			$previousProject.addClass('is-previous').removeClass('is-selected');
			work.$host.one(transEndEventName, hidePreviousProject);
		}

		// position
		positionHost();
		// position screenshots just in case
		work.$selectedProject.data('projectScene').reLayout();

		var projectData = workData.projects[id];

		updateNavigation();

		// update work nav
		if (!utils.isMobile) {
			// update selected column
			var selectedColClass = projectData.isCollage ? 'collages' : 'year' + projectData.year;
			work.$nav.find('.col.is-selected-col').removeClass('is-selected-col');
			work.$nav.find('.col.' + selectedColClass).addClass('is-selected-col');

			// toggle selected class in nav
			if (work.$navLists) {
				if ($selectedNavItem) {
					$selectedNavItem.removeClass('is-selected');
				}
				$selectedNavItem = work.$navLists.find('a[data-slug="' + id + '"]').parent().addClass('is-selected');
			}
		}

		// update state for pushState
		var path = work.getProjectPath(projectData.url);

		NCLUD.state = common.getStateFromHref(path);
		NCLUD.state.title = projectData.title + ' | nclud';

	};

	function hidePreviousProject() {
		// hide any previous projects
		// multiples may occur multiple new articles were selected before transition end
		work.$host.find('article.is-previous').removeClass('is-previous').addClass('is-invis');
	}

	// navigate to previous or next project, given -1 for previous, 1 for next
	work.goToPrevNext = function (delta) {
		var categoryProjects = workData.categoryIDs[work.category];
		var nextProject = categoryProjects[(work.selectedIndex + delta) % categoryProjects.length];
		if (nextProject) {
			var hash = location.hash || '';
			common.pushToPath('/work/' + nextProject + hash);
		}
	};

	// updates prev/next nav links 
	function updateNavigation() {
		$prevNav = $prevNav || $('#work-nav-prev');
		$nextNav = $nextNav || $('#work-nav-next');

		var categoryIDs = workData.categoryIDs[work.category];
		var prevID = categoryIDs[work.selectedIndex - 1];
		var nextID = categoryIDs[(work.selectedIndex + 1) % categoryIDs.length];
		updateNavLink($prevNav, prevID);
		updateNavLink($nextNav, nextID);

		// if at last project, change next nav
		if (work.selectedIndex + 1 === categoryIDs.length) {
			$nextNav.addClass('is-at-last').find('b').text('First project');
			work._isAtLastProject = true;
		} else if (work._isAtLastProject) {
			$nextNav.removeClass('is-at-last').find('b').text('Next project');
			work._isAtLastProject = false;
		}

	}

	// if there's a project to link to, do it, otherwise disable link
	function updateNavLink($link, id) {
		var project = workData.projects[id];
		var slug = project && project.url;
		var path = project && work.getProjectPath(slug);
		if (project) {
			$link.removeClass('is-invis')
		.attr('href', path)
		.attr('data-slug', slug);
		} else {
			$link.addClass('is-invis').removeAttr('href').removeAttr('data-slug');
		}
	}

	work.getProjectPath = function (slug) {
		// add category/filter/ if necessary
		var category = work.category === 'all' ? '' : '/#' + work.category;
		return '/work/' + slug + category;
	};

	// callback when work section is ajaxed in
	work.ajaxDone = function ($ajaxData) {
		if (utils.isMobile) {
			return;
		}
		// nav needs to be added to page as well
		appendNav($ajaxData);
	};

	// get nav from ajaxed content and append to page
	function appendNav($data) {
		// nav may need to be filtered, or found, depending on if
		// its a direct child of the data, or descendent child
		var $navByFilter = $data.filter('#work-nav');
		work.$nav = $navByFilter.length ? $navByFilter : $data.find('#work-nav');
		work.$nav.appendTo(common.$extra);
	}

	// -------------------------- filtering -------------------------- //

	work.setCategory = function (category) {
		// don't proceed if not a new category
		if (category === work.category) {
			return;
		}

		common.log('setting new category ', category);
		// set new category
		work.category = category;

		// don't do nav stuff if in mobile
		if (utils.isMobile) {
			return;
		}
		var categoryIDs = workData.categoryIDs[category];
		// filter isotope in work nav
		var isAll = category === 'all';
		var selector = isAll ? '*' : '.' + category;
		work.$navLists.isotope({ filter: selector });

		// set filtered href values in work nav
		work.$navLists.each(updateNavList);

		// show/hide columns if necessary
		selector = isAll ? '*' : ':not(.is-empty)';
		work.$navColumnsContainer.isotope({ filter: selector });

		// size nav host width
		selector = isAll ? '.col' : '.col:not(.is-empty)';
		var visibleCols = work.$navHost.find(selector).length;
		work.$navHost.width(visibleCols * 220 + 200);
	};


	// go through each nav list and then each item within in that
	// and set href to match filter
	function updateNavList(i, list) {
		var $filteredAtoms = $.data(list, 'isotope').$filteredAtoms;
		var isEmpty = false;
		if ($filteredAtoms.length) {
			$filteredAtoms.each(function (i, item) {
				// micro optimization, use DOM traversal over jQuery
				// since we do this operation 30+ times
				var link = item.getElementsByTagName('a')[0];
				var slug = link.getAttribute('data-slug');
				link.href = work.getProjectPath(slug);
			});
		} else {
			isEmpty = true;
		}
		// add class for columns isotope
		var addOrRemoveClass = isEmpty ? 'addClass' : 'removeClass';
		$(list).parents('.col')[addOrRemoveClass]('is-empty');
	}

	work.filter = function (category, id) {

		var isNewCategory = category !== work.category;
		work.setCategory(category);

		var categoryIDs = workData.categoryIDs[category];

		// check if selected project is in filtered projects
		id = id || work.selectedID;

		var index = work.getProjectIndexFromID(id);
		// use the first ID, if selected project is not in category
		if (index === -1) {
			// current project is not in current category
			// go to first project in category
			id = categoryIDs[0];
		}

		// ensure that project is selected
		work.selectedIndex = -1;
		work.goToProject(id);

		// reset project positions
		if (isNewCategory) {
			work.layoutEnvironment();

			// toggle selected class
			if ($selectedCategoryItem) {
				$selectedCategoryItem.removeClass('is-selected');
			}
			$selectedCategoryItem = $categoryNav.find('.' + category).addClass('is-selected');
		}

	};

})(window, jQuery);

/**
* nclud v3 | about
* handles the item navigation & Catepilla widget
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function (window, $, undefined) {

	'use strict';

	// get global vars
	var NCLUD = window.NCLUD;
	var Modernizr = window.Modernizr;
	var Catepilla = window.Catepilla;

	var transformProp = Modernizr.prefixed('transform');

	var common = NCLUD.common;

	var about = NCLUD.about = {

		selectedIndex: 0,

		init: function () {

			// get jQuery objects
			var $aboutSection = $('#about');
			var $aboutPics = $('#about-pics');
			var $copy = $aboutSection.find('.copy');
			about.copy = $copy[0];
			about.$copyItems = $copy.find('li');

			// position each item
			about.$copyItems.each(function (i, item) {
				item.style.left = (110 * i) + '%';
			});

			// add navigation
			var navHTML = '<nav>' +
	  '<a class="prev-next-button prev push-to is-invis" href="#5"></a>' +
	  '<a class="prev-next-button next push-to" href="#2"></a>' +
	'</nav>';
			about.$nav = $(navHTML).insertBefore($aboutPics);
			about.$prevNav = about.$nav.find('.prev');
			about.$nextNav = about.$nav.find('.next');

			// get initial selected index

			// start Catepilla gallery
			if ($aboutPics.length) {
				// can't use .innerHeight() because border-box sizing messes it up.
				var sectionHeight = $aboutSection.height();
				var catH = Math.min(660, sectionHeight - $aboutPics.position().top);
				about.catepilla = new Catepilla($aboutPics[0], {
					height: catH,
					wiggleDelay: 3000,
					transitionDuration: 0.25,
					isAutoAdvancing: false
				});
			}

		},

		setSelectedIndex: function (index) {
			if (index === this.selectedIndex) {
				return;
			}
			// common.log('set about index', index );
			this.selectedIndex = index;

			about.catepilla.setSelectedIndex(index);

			// move about copy, percentage based
			var x = 110 * -index;
			about.copy.style[transformProp] = 'translate(' + x + '%, 0)';
			// hide/reveal necessary items
			about.$copyItems.filter('.is-selected').removeClass('is-selected');
			about.$copyItems.eq(index).addClass('is-selected');

			// update navigation
			var len = about.$copyItems.length;
			about.$prevNav[0].href = '#' + ((index - 1 + len) % len + 1);
			about.$nextNav[0].href = '#' + ((index + 1 + len) % len + 1);

			about.$prevNav.removeClass('is-invis');
			about.$nextNav.removeClass('is-invis');

			if (index === 0) {
				about.$prevNav.addClass('is-invis');
			} else if (index === len - 1) {
				about.$nextNav.addClass('is-invis');
			}

		},

		pushTo: function () {
			var hashIndex = parseInt(NCLUD.state.hash, 10);

			if (isFinite(hashIndex) && hashIndex !== null) {
				// minus one, zero based
				about.setSelectedIndex(hashIndex - 1);
			}
		},

		onExit: function () {
			if (about.catepilla) {
				about.catepilla.stopAnimation();
			}
		},

		goToPrevNext: function (delta) {
			var len = about.$copyItems.length;
			// normalize, between 1 and len
			var index = (about.selectedIndex + delta) + 1;
			index = Math.max(1, Math.min(len, index));
			// only push if its a new index
			if (index !== about.selectedIndex + 1) {
				NCLUD.common.pushToPath('/about/#' + index);
			}
		}

	};


})(window, jQuery);

/**
* nclud v3 | team
* handles navigation between team member articles & Inflickity widget
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, Modernizr: true, Inflickity: true */

(function (window, $, undefined) {

	'use strict';

	// global nclud v3 object
	var NCLUD = window.NCLUD || {};

	var $window = $(window);

	var teamData = NCLUD.siteData.team;

	var common = NCLUD.common;
	var utils = NCLUD.utils;

	var team = NCLUD.team = {

		init: function () {

			common.log('team begin');

			team.getJQElems();

			if (team.$nav.length) {
				team.setupNav();
			} else {
				$.get('/team').done(team.getNavSuccess);
			}

		},

		// get jQuery objects when DOM is ready
		getJQElems: function () {
			team.$section = $('#team');
			team.$article = team.$section.find('article');
			team.$h1 = team.$article.find('h1');
			team.$description = team.$article.find('.description');
			team.$nav = $('#team-nav');
		},

		// ---- navigation ---- //

		pushTo: function () {
			var state = NCLUD.state;
			team.goToPerson(state.pathParts[1]);
		},

		goToPerson: function (slug) {
			// if no slug, go to team page
			slug = slug || 'team';

			common.log('going to person ', slug);

			var personData = teamData[slug];

			if (!personData) {
				return;
			}

			team.personData = personData;

			team.revealPerson(slug, personData);

			// scroll flickity to selected person
			var $personItems = team.$nav.find('.' + slug);


			var flickity = team.navFlickity;

			if ($personItems.length && flickity) {
				var itemOffset = $personItems.position().left - (team.$nav.width() * 0.5 - team.itemWidth / 2);
				var duration = common.isShiftKeyPressed ? 5000 : 500;
				flickity.scrollTo(flickity.contentWidth - itemOffset, duration);

				$personItems.addClass('is-selected');
			}

		},

		revealPerson: function (slug) {

			if (slug === team.selectedPerson) {
				return;
			}

			team.selectedPerson = slug;

			var personData = team.personData;
			team.titleHtml = personData.highlightedTitle.length ?
	  personData.highlightedTitle : personData.title;

			// create dummy article for transition
			if (team.$dummyArticle && team.$dummyArticle.length) {
				team.$dummyArticle.remove();
			}
			team.$dummyArticle = team.$article.clone().addClass('dummy');
			team.$dummyArticle.find('h1').html(team.titleHtml);
			team.$dummyArticle.find('.description').html(personData.content);
			team.$dummyArticle.appendTo(team.$section);

			// do it async to wait for dummy to be added
			setTimeout(function () {
				team.$section.addClass('is-transitioning')
		.one(NCLUD.utils.transEndEventName, team.onArticleTransitionEnd);
			});

			// update title
			NCLUD.state.title = personData.title + ' | nclud';

			team.$nav.find('.is-selected').removeClass('is-selected');

		},

		getBackground: function () {
			var backgrounds = team.personData && team.personData.background;
			if (backgrounds && backgrounds.length) {
				var bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
				return '/wp-content' + bg;
			}
		},

		onArticleTransitionEnd: function (jQEvent) {
			team.$h1.html(team.titleHtml);
			team.$description.html(team.personData.content);
			team.$section.removeClass('is-transitioning');
			team.$dummyArticle.remove();
		},

		// ---- nav ---- //

		// callback when work section is ajaxed in
		ajaxDone: function ($ajaxData) {
			// nav needs to be added to page as well
			team.appendNav($ajaxData);
			team.getJQElems();
		},

		// get nav from ajaxed content and append to page
		appendNav: function ($data) {
			if (team.$nav && team.$nav.length) {
				return;
			}
			// nav may need to be filtered, or found, depending on if
			// its a direct child of the data, or descendent child
			var $navByFilter = $data.filter('#team-nav');
			team.$nav = $navByFilter.length ? $navByFilter : $data.find('#team-nav');
			team.$nav.appendTo(common.$extra);
		},

		getNavSuccess: function (data) {
			common.log('got team nav');
			team.appendNav($(data));
			team.setupNav();
		},

		setupNav: function () {
			// get array of team member slugs
			team.memberSlugs = []; // *giggles at property name*
			team.$nav.find('a').each(function () {
				team.memberSlugs.push(this.getAttribute('data-slug'));
			});

			team.itemWidth = team.$nav.find('li').width();
			team.$nav.find('ul').width(team.itemWidth * team.memberSlugs.length);

			// set up inflickity
			team.navFlickity = new Inflickity(team.$nav[0], {
				offsetAngle: utils.isMobile ? 0 : -0.25, // radians
				animationDuration: 500,
				onClick: team.onFlickityClick
			});

			team.$nav.on('click', 'a', team.onNavClick);
		},

		// force a push-to click, but let Inflickity handle it
		onFlickityClick: function (event, cursor) {
			var $target = $(event.target);
			var $link = $target.is('a') ? $target : $target.parents('a');

			if (Modernizr.history) {
				common.onPushToClick.call($link[0], event);
			} else {
				// force go to link href
				window.location = $link.attr('href');
			}
		},

		// dismiss all clicks on nav
		// handled in Inflickity, see above
		onNavClick: function (jQEvent) {
			return false;
		},

		goToPrevNext: function (delta) {
			if (!team.selectedPerson) {
				return;
			}
			var index = team.memberSlugs.indexOf(team.selectedPerson);
			var len = team.memberSlugs.length;
			index = (index + delta + len) % len;
			var slug = team.memberSlugs[index];
			common.pushToPath('/team/' + slug);
		}


	};

})(window, jQuery);

/**
* nclud v3 | events
* events object for sitedata.js
*/

/*jshint asi: false, browser: true, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, Modernizr: true, Inflickity: true */

(function (window, $, undefined) {

	'use strict';

	// global nclud v3 object
	var NCLUD = window.NCLUD || {};

	var $window = $(window);

	var eventsData = NCLUD.siteData.events;

	var common = NCLUD.common;
	var utils = NCLUD.utils;

	var events = NCLUD.events = {

		init: function () {

			events.getJQElems();

			events.getEventData();

		},

		getEventData: function () {
			for (events in eventsData) {
				var singleEventData = eventsData[events];
				// events.createPost(singleEventData);
			}
		},

		createPost: function (singleEvent) {
			var postTitle = singleEvent.title;
			var postDescription = singleEvent.event_description;
			var postDate = singleEvent.event_start_day;
			var postMonth = singleEvent.event_start_month;
			var postConstruct = '';
		},

		// get jQuery objects when DOM is ready
		getJQElems: function () {
			events.$section = $('#events');
		},

		// ---- navigation ---- //

		pushTo: function () {
			var state = NCLUD.state;
		},

		// callback when events section is ajaxed in
		ajaxDone: function ($ajaxData) {
			//events.getJQElems();
		}


	};

})(window, jQuery);

/**
* nclud v3 | contact
* handles navigation between contact & RFP, & Google Maps integration
*/

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, google: true, addTap: true */

(function (window, $, undefined) {

	'use strict';

	// get global vars
	var NCLUD = window.NCLUD;
	var Modernizr = window.Modernizr;
	var $window = $(window);


	var transformProp = NCLUD.utils.cssProps.transform;

	var common = NCLUD.common;

	var $body;

	// ----- settings ----- //

	var settings = $.extend(NCLUD.settings, {
		// zoom level for google map
		mapZoom: 16,
		mapLat: 38.905954,
		mapLng: -77.043294
	});

	// contact controller
	var contact = NCLUD.contact = {};

	contact.isMapEnabled = Modernizr.csstransforms && !NCLUD.utils.isMobile && Modernizr.pointerevents;

	// map object with map properties
	var map = contact.map = {};

	contact.init = function () {

		$body = $('body');

		setupAjaxForm($('.wpcf7 > form'));

		getFormContainers();
		bindBudgetChange();


		// Google Maps async call
		if (contact.isMapEnabled) {
			NCLUD.utils.addScript('http://maps.googleapis.com/maps/api/js?' +
	  'key=AIzaSyBcNltQ-VnwpoLQmi91YReNiDLwBqGE448&sensor=false&callback=NCLUD.contact.initMap');
		}

	};

	function getFormContainers() {
		contact.$formContainers = $('.contact-form-container');
	}


	// bind budget change fun
	var isBudgetChangeBinded = false;

	function bindBudgetChange() {
		var $budgetSelect = $('#rfp-budget');
		// don't proceed if already binded or #rfp is not on page
		if (isBudgetChangeBinded || !$budgetSelect.length) {
			return;
		}

		$budgetSelect.on('change', onBudgetSelectChange);
		isBudgetChangeBinded = true;
	}

	contact.ajaxDone = function ($data) {
		// setup ajax form on newly appended form
		var $form = $('#' + NCLUD.state.contentSection).find('.wpcf7 > form');
		setupAjaxForm($form);
		getFormContainers();
		bindBudgetChange();
		sizeFormContainers();
	};


	// triggered from Google Maps API call
	contact.initMap = function () {

		// create necessary DOM
		map.$host = $('<div id="contact-map" />');
		map.$mask = $('<div class="mask" />');
		map.$canvas = $('<div class="canvas" />');
		var $canvasHolder = $('<div class="holder" />').appendTo(map.$canvas);
		map.$closeButton = $('<div class="close-button">✕</div>').appendTo(map.$canvas);

		map.$host.append(map.$mask.append(map.$canvas));

		map.ncludCoords = new google.maps.LatLng(settings.mapLat, settings.mapLng);

		map.options = {
			zoom: settings.mapZoom,
			center: map.ncludCoords,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		// create map
		map.googleMap = new google.maps.Map($canvasHolder[0], map.options);

		map.$canvas.append(map.$closeButton);

		var zeroPoint = new google.maps.Point(0, 0);
		var ncludAnchorPoint = new google.maps.Point(14, 48);
		var imgDir = '/wp-content/themes/nclud3/images/';


		// marker image
		var ncludIcon = new google.maps.MarkerImage(
	imgDir + 'nclud-shapes-map-icon.png', // image
	new google.maps.Size(36, 48), // size
	zeroPoint, // origin
	ncludAnchorPoint // anchor
  );

		var ncludIconShadow = new google.maps.MarkerImage(
	imgDir + 'nclud-shapes-map-icon-shadow.png', // image
	new google.maps.Size(52, 48), // size
	zeroPoint, // origin
	ncludAnchorPoint // anchor
  );

		// add marker
		map.marker = new google.maps.Marker({
			position: map.ncludCoords,
			map: map.googleMap,
			title: 'nclud',
			icon: ncludIcon,
			shadow: ncludIconShadow
		});

		// add info box
		map.infoWindow = new google.maps.InfoWindow({
			content: '<b>nclud</b> <br />' +
	  '1203 19<sup>th</sup> St. NW, 3<sup>rd</sup> Floor <br />' +
	  'Washington, DC 20036'
		});

		google.maps.event.addListener(map.marker, 'click', onMarkerClick);

		common.$extra.append(map.$host);

		// position map mask
		mapResize();
		positionMapMask(0.8);

		// expand map when tapped
		addTap(map.$mask[0], onMaskTap);

		map.$closeButton.click(contact.contractMap);

		// bind hover
		if (!Modernizr.touch) {
			map.$mask.hover(onMaskHoverOver, onMaskHoverOff);
		}

		// add class async to enable transitions
		setTimeout(function () {
			map.$host.addClass('is-ready');
		}, 100);

	};

	function mapResize() {
		//  don't proceed if map is not on page yet
		if (!map.$host) {
			return;
		}

		var windowW = $window.width();
		// HACK arbitrarily set siteHeaderWidth, could break if these values change in CSS
		var siteHeaderWidth = windowW <= 1100 || $window.height() <= 768 ? 80 : 100;

		var w = windowW - siteHeaderWidth;
		var h = $window.height();

		map.$host.width(w).height(h);
		map.$canvas.width(w).height(h);

		map.maskSize = (w + h) / 2 * Math.SQRT2;

		var maskWidth = Math.max(w, map.maskSize);

		map.$mask.width(map.maskSize).height(map.maskSize);

		map.centerMaskX = (w - map.maskSize) / 2;
		map.centerMaskY = (h - map.maskSize) / 2;

		if (!contact.isMapExpanded) {
			// offset center so marker is in bottom right corner
			var centerOffsetLng = w * 0.35;
			var centerOffsetLat = h * 0.35;
			// convert to lat / lng, this is imprecise, but it'll work
			centerOffsetLng *= Math.pow(2, 9 - settings.mapZoom) / 375;
			centerOffsetLat *= Math.pow(2, 9 - settings.mapZoom) / 425;

			map.googleMap.setCenter(new google.maps.LatLng(
	  settings.mapLat + centerOffsetLat,
	  settings.mapLng - centerOffsetLng
	));
		}

		// save size
		map.width = w;
		map.height = h;

	}

	contact.pushTo = function () {
		var state = NCLUD.state;
		// add/remove rfp class
		contact.isRFP = state.pathParts[0] === 'rfp';
		var classMethod = contact.isRFP ? 'addClass' : 'removeClass';
		$body[classMethod]('rfp');
	};

	contact.onEnter = function () {
		onWindowResize();
		$window.on('smartresize', onWindowResize);
	};

	// always contract map
	contact.onExit = function () {
		$body.removeClass('rfp');

		if (!contact.isMapEnabled) {
			return;
		}
		$window.off('smartresize', onWindowResize);
		if (contact.isMapExpanded) {
			contact.contractMap();
		}
	};

	contact.goToPrevNext = function (delta) {
		var path;
		if (contact.isRFP && delta === -1) {
			// if in RFP and left key was pressed, go to contact
			path = '/contact';
		} else if (!contact.isRFP && delta === 1) {
			// if in contact and right key was pressed, go to RFP
			path = '/rfp';
		}

		if (path) {
			common.pushToPath(path);
		}
	};

	/**
	* @param {Number} offset - decimal [ 0...1 ]
	*/
	function positionMapMask(offset) {

		// put in diagonal terms
		offset *= map.maskSize / Math.SQRT2;

		var maskX = Math.round(map.centerMaskX + offset);
		var maskY = Math.round(map.centerMaskY + offset);

		var canvasX = Math.round((map.maskSize - map.width) / 2 - (offset * Math.SQRT2));
		var canvasY = Math.round(-map.centerMaskY);

		map.$mask[0].style[transformProp] = getTranslateTransform(maskX, maskY) + ' rotate(45deg)';
		map.$canvas[0].style[transformProp] = getTranslateTransform(canvasX, canvasY) + ' rotate(-45deg)';

	}

	// use 3d transforms to help with acceleration
	var getTranslateTransform = Modernizr.csstransforms3d ? function (x, y) {
		return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
	} : function (x, y, angle) {
		return 'translate(' + x + 'px, ' + y + 'px)';
	};


	contact.expandMap = function () {
		// remove transform after transition
		map.$mask.one(NCLUD.utils.transEndEventName, onMapExpandTransitionEnd);
		positionMapMask(0);
		openInfoWindow();
		contact.isMapExpanded = true;
	};

	contact.contractMap = function () {
		// re-apply transforms
		positionMapMask(0);
		// do it async to trigger transition
		if (NCLUD.utils.isFirefox) {
			// why this works in firefox, is beyond me
			map.$host.removeClass('is-expanded');
		}
		setTimeout(contractMapTimeout, 20);
	};

	function contractMapTimeout() {
		map.$host.removeClass('is-expanded');
		positionMapMask(0.8);
		map.marker.setAnimation(null);
		map.infoWindow.close();
		contact.isMapExpanded = false;
	}

	function openInfoWindow() {
		map.infoWindow.open(map.googleMap, map.marker);
	}

	// ----- events ----- //

	function onMaskTap(event) {
		if (!contact.isMapExpanded) {
			contact.expandMap();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	function onMaskHoverOver() {
		if (!contact.isMapExpanded) {
			positionMapMask(0.75);
		}
	}

	function onMaskHoverOff() {
		if (!contact.isMapExpanded) {
			positionMapMask(0.8);
		}
	}


	function onMapExpandTransitionEnd() {
		// disable transition with adding class name
		map.$host.addClass('is-expanded');
		// remove transforms
		map.$mask[0].style[transformProp] = 'none';
		map.$canvas[0].style[transformProp] = 'none';
	}

	function onWindowResize() {
		if (contact.isMapEnabled && map.$host) {
			var positionI = contact.isMapExpanded ? 0 : 0.8;
			mapResize();
			positionMapMask(positionI);
		}

		// set height in case there is overflow we need to scroll for
		sizeFormContainers();
	}

	function sizeFormContainers() {
		if (!contact.$formContainers || !contact.$formContainers.length) {
			return;
		}

		contact.$formContainers.each(function (i, container) {
			var $container = $(container);
			// var currentHeight = $container.css({ height: 'auto' }).height();
			var sectionHeight = $container.parents('section').height();
			var availableHeight = sectionHeight - $container.position().top;
			$container.height(availableHeight);
		});

	}

	function onMarkerClick() {
		openInfoWindow();
		// toggle bounce
		var animation = map.marker.getAnimation() ? null : google.maps.Animation.BOUNCE;
		map.marker.setAnimation(animation);
	}

	// create more budget item

	var isMoreBudgetVisible = false;

	var alertOptionIndex = 0;

	function onBudgetSelectChange(jQEvent) {
		//budget widget
		var $this = $(jQEvent.target);
		var $selected = $this.find('option:selected');
		var $moreBudgetItem = $('#rfp li.budget-more');
		if ($selected.index() === alertOptionIndex && !isMoreBudgetVisible) {
			// if budget selected was the first, low budget option
			// show more budget item
			$moreBudgetItem.css({ opacity: 0 })
	  .slideDown(150, function () {
		  $moreBudgetItem.fadeTo(1000, 1);
	  });
			isMoreBudgetVisible = true;
		} else if ($selected.index() !== alertOptionIndex && isMoreBudgetVisible) {
			// hide more budget
			$moreBudgetItem.fadeTo(250, 0).slideUp(250, function () {
				// $moreBudgetItem.remove();
			});
			isMoreBudgetVisible = false;
		}

	}

	// -------------------------- contact form plugin script -------------------------- //

	var _wpcf7 = window._wpcf7 = window._wpcf7 || {};

	_wpcf7 = $.extend({ cached: 0 }, _wpcf7);

	// Contact Form 7 methods
	var CF7 = {};

	CF7.toggleSubmit = function ($form) {
		$form.each(function () {
			var form = $(this);
			if (this.tagName.toLowerCase() != 'form') {
				form = form.find('form').first();
			}

			if (form.hasClass('wpcf7-acceptance-as-validation')) {
				return;
			}

			var submit = form.find('input:submit');
			if (!submit.length) {
				return;
			}

			var acceptances = form.find('input:checkbox.wpcf7-acceptance');
			if (!acceptances.length) {
				return;
			}

			submit.removeAttr('disabled');
			acceptances.each(function (i, n) {
				n = $(n);
				if (n.hasClass('wpcf7-invert') && n.is(':checked') ||
		!n.hasClass('wpcf7-invert') && !n.is(':checked')) {
					submit.attr('disabled', 'disabled');
				}
			});
		});

	};

	CF7.notValidTip = function ($items, message) {
		$items.each(function () {
			var into = $(this);
			into.append('<span class="wpcf7-not-valid-tip">' + message + '</span>');
			$('span.wpcf7-not-valid-tip').mouseover(function () {
				$(this).fadeOut('fast');
			});
			into.find(':input').mouseover(function () {
				into.find('.wpcf7-not-valid-tip').not(':hidden').fadeOut('fast');
			});
			into.find(':input').focus(function () {
				into.find('.wpcf7-not-valid-tip').not(':hidden').fadeOut('fast');
			});
		});
	};

	CF7.onloadRefill = function ($elems) {
		$elems.each(function () {
			var $this = $(this);
			var url = $this.attr('action');
			if (0 < url.indexOf('#')) {
				url = url.substr(0, url.indexOf('#'));
			}

			var id = $this.find('input[name="_wpcf7"]').val();
			var unitTag = $this.find('input[name="_wpcf7_unit_tag"]').val();

			$.getJSON(url,
	  { _wpcf7_is_ajax_call: 1, _wpcf7: id },
	  function (data) {
		  var $elem = $('#' + unitTag);
		  if (data && data.captcha) {
			  CF7.refillCaptcha($elem, data.captcha);
		  }

		  if (data && data.quiz) {
			  CF7.refillQuiz($elem, data.quiz);
		  }
	  }
	);
		});
	};

	CF7.refillCaptcha = function ($elems, captcha) {
		$elems.each(function () {
			var form = $(this);

			$.each(captcha, function (i, n) {
				form.find(':input[name="' + i + '"]').clearFields();
				form.find('img.wpcf7-captcha-' + i).attr('src', n);
				var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
				form.find('input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]').attr('value', match[1]);
			});
		});
	};

	CF7.refillQuiz = function ($elems, quiz) {
		$elems.each(function () {
			var form = $(this);

			$.each(quiz, function (i, n) {
				form.find(':input[name="' + i + '"]').clearFields();
				form.find(':input[name="' + i + '"]').siblings('span.wpcf7-quiz-label').text(n[0]);
				form.find('input:hidden[name="_wpcf7_quiz_answer_' + i + '"]').attr('value', n[1]);
			});
		});
	};

	CF7.clearResponseOutput = function ($elems) {
		$elems.each(function () {
			var $this = $(this);
			$this.find('div.wpcf7-response-output').hide().empty().removeClass('wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked');
			$this.find('span.wpcf7-not-valid-tip').remove();
			$this.find('img.ajax-loader').css({ visibility: 'hidden' });
		});
	};



	function setupAjaxForm($formToSetup) {
		// bail out if no forms to setup
		if (!$formToSetup.length) {
			return;
		}

		// use jQuery form plugin
		$formToSetup.ajaxForm({
			beforeSubmit: function (formData, jqForm, options) {
				CF7.clearResponseOutput(jqForm);
				jqForm.find('img.ajax-loader').css({ visibility: 'visible' });
				return true;
			},
			beforeSerialize: function (jqForm, options) {
				jqForm.find('.wpcf7-use-title-as-watermark.watermark').each(function (i, n) {
					$(n).val('');
				});
				return true;
			},
			data: { '_wpcf7_is_ajax_call': 1 },
			dataType: 'json',
			success: function (data) {
				var $into = $(data.into);
				var ro = $into.find('div.wpcf7-response-output');
				CF7.clearResponseOutput($into);

				if (data.invalids) {
					$.each(data.invalids, function (i, n) {
						CF7.notValidTip($into.find(n.into), n.message);
					});
					ro.addClass('wpcf7-validation-errors');
				}

				if (data.captcha) {
					CF7.refillCaptcha($into, data.captcha);
				}

				if (data.quiz) {
					CF7.refillQuiz($into, data.quiz);
				}

				if (data.spam == 1) {
					ro.addClass('wpcf7-spam-blocked');
				}

				if (data.mailSent == 1) {
					$into.find('form').resetForm().clearForm();
					ro.addClass('wpcf7-mail-sent-ok');

					if (data.onSentOk) {
						common.log('data has onSentOk callback, but it has been disabled');
						// $.each(data.onSentOk, function(i, n) { eval(n); });
					}
				} else {
					ro.addClass('wpcf7-mail-sent-ng');
				}

				if (data.onSubmit) {
					common.log('data has onSubmit, but it has been disabled');
					// $.each(data.onSubmit, function(i, n) { eval(n); });
				}

				$into.find('.wpcf7-use-title-as-watermark.watermark').each(function (i, watermark) {
					var $watermark = $(watermark);
					$watermark.val($watermark.attr('title'));
				});

				ro.append(data.message).slideDown('fast');
			}
		});

		$formToSetup.each(function (i, form) {
			var $form = $(form);

			if (_wpcf7.cached) {
				CF7.onloadRefill($form);
			}

			CF7.toggleSubmit($form);

			$form.find('.wpcf7-acceptance').click(function () {
				CF7.toggleSubmit($form);
			});

			$form.find('.wpcf7-exclusive-checkbox').each(function (i, checkbox) {
				var $checkbox = $(checkbox);
				$checkbox.find('input:checkbox').click(function () {
					$checkbox.find('input:checkbox').not(this).removeAttr('checked');
				});
			});

			$form.find('.wpcf7-use-title-as-watermark').each(function (i, n) {
				var input = $(n);
				input.val(input.attr('title'));
				input.addClass('watermark');

				input.focus(function () {
					var $this = $(this);
					if ($this.hasClass('watermark')) {
						$this.val('').removeClass('watermark');
					}
				});

				input.blur(function () {
					var $this = $(this);
					if ($this.val() === '') {
						$this.val($this.attr('title')).addClass('watermark');
					}
				});
			});
		});
	}


})(window, jQuery);

/**
* nclud v3 | fourohfour
*/

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function (window, $, undefined) {

	'use strict';

	// get global vars
	var NCLUD = window.NCLUD;
	var Modernizr = window.Modernizr;
	var $window = $(window);

	var transformProp = NCLUD.utils.cssProps.transform;

	var common = NCLUD.common;

	var $body;

	// ----- settings ----- //

	// var settings = $.extend( NCLUD.settings, {
	// });

	// contact controller
	var fourohfour = NCLUD.fourohfour = {};

	var canvas;

	fourohfour.init = function () {

		if (Modernizr.canvas) {
			initUndulateNet();
		}

	};

	fourohfour.onEnter = function () {
		if (fourohfour.net) {
			fourohfour.net.isAnimated = true;
		}
	};

	fourohfour.onExit = function () {
		// stop net animation
		if (fourohfour.net) {
			fourohfour.net.isAnimated = false;
		}
	};

	function getDiagonal(w, h) {
		return Math.sqrt(w * w + h * h);
	}


	function initUndulateNet() {

		var $section = $('#fourohfour');
		var w = $section.width();
		var h = $section.height();

		fourohfour.canvas = document.createElement('canvas');

		fourohfour.canvas.width = w;
		fourohfour.canvas.height = w;

		$section.append(fourohfour.canvas);

		fourohfour.net = new UndulateNet(fourohfour.canvas, {
			nodeCount: Math.floor(getDiagonal(w, h) * 0.4),
			verticalPadding: 0,
			displacementIntensity: -0.3,
			displacementRadius: 300
		});


	}


})(window, jQuery);
/**
* nclud v3 | auto-pilot
* screensaver mode. automatically navigates through site
*/

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function (window, $, undefined) {

	'use strict';

	// convienence vars
	var Modernizr = window.Modernizr;

	// settings
	var cycleSections = 'homepage work about team contact'.split(' ');

	// how many interior pages within each section should we cycle thru
	var sectionInteriorMax = {
		work: 10,
		about: 5,
		team: 12
	};

	var NCLUD = window.NCLUD;

	// -------------------------- autoPilot controller -------------------------- //

	var autoPilot = NCLUD.autoPilot = {};

	autoPilot.isActive = false;

	autoPilot.start = function () {
		// only auto-pilot if history is supported
		if (!Modernizr.history) {
			return;
		}

		// get current section
		autoPilot.sectionIndex = cycleSections.indexOf(NCLUD.state.section);
		autoPilot.isActive = true;
		$('body').addClass('is-auto-pilot-active');
		autoPilot.sectionInteriorCount = 0;
		autoPilot.nextOnTimeout();
	};

	autoPilot.nextOnTimeout = function () {
		autoPilot.timeout = setTimeout(autoPilot.next, 3500);
	};

	autoPilot.next = function () {
		var section = NCLUD.state.section;
		var interiorMax = sectionInteriorMax[section];

		// go to next interior if we can
		if (interiorMax && autoPilot.sectionInteriorCount < interiorMax) {
			// console.log('auto pilot next interior', autoPilot.sectionInteriorCount );
			autoPilot.sectionInteriorCount++;
			NCLUD[section].goToPrevNext(1);
		} else {
			// go to next section
			autoPilot.sectionIndex = (autoPilot.sectionIndex + 1) % cycleSections.length;
			autoPilot.sectionInteriorCount = 0;
			var nextSection = cycleSections[autoPilot.sectionIndex];
			nextSection = nextSection === 'homepage' ? '' : nextSection;
			// console.log('auto pilot next section', nextSection, autoPilot.sectionIndex );
			NCLUD.common.pushToPath('/' + nextSection);
		}

		autoPilot.nextOnTimeout();
	};

	autoPilot.stop = function () {
		// console.log('stopping auto pilot');
		if (!autoPilot.isActive) {
			return;
		}
		clearTimeout(autoPilot.timeout);
		$('body').removeClass('is-auto-pilot-active');
		autoPilot.isActive = false;
	};

	autoPilot.toggle = function () {
		if (autoPilot.isActive) {
			autoPilot.stop();
		} else {
			autoPilot.start();
		}
	};

})(window, jQuery);
