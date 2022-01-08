/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';
var aria = aria || {};
aria.Utils = aria.Utils || {};
(function () {
	aria.Utils.IgnoreUtilFocusChanges = false;
	aria.Utils.dialogOpenClass = 'has-dialog';
	aria.Utils.focusFirstDescendant = function (element) {
		for (var i = 0; i < element.childNodes.length; i++) {
			var child = element.childNodes[i];
			if (
				aria.Utils.attemptFocus(child) ||
				aria.Utils.focusFirstDescendant(child)
			) {
				return true;
			}
		}
		return false;
	}; // end focusFirstDescendant
	aria.Utils.focusLastDescendant = function (element) {
		for (var i = element.childNodes.length - 1; i >= 0; i--) {
			var child = element.childNodes[i];
			if (
				aria.Utils.attemptFocus(child) ||
				aria.Utils.focusLastDescendant(child)
			) {
				return true;
			}
		}
		return false;
	}; // end focusLastDescendant

	aria.Utils.attemptFocus = function (element) {
		if (!aria.Utils.isFocusable(element)) {
			return false;
		}
		aria.Utils.IgnoreUtilFocusChanges = true;
		try {
			element.focus();
		} catch (e) {
			// continue regardless of error
		}
		aria.Utils.IgnoreUtilFocusChanges = false;
		return document.activeElement === element;
	}; // end attemptFocus
	aria.OpenDialogList = aria.OpenDialogList || new Array(0);
	aria.getCurrentDialog = function () {
		if (aria.OpenDialogList && aria.OpenDialogList.length) {
			return aria.OpenDialogList[aria.OpenDialogList.length - 1];
		}
	};
	aria.closeCurrentDialog = function () {
		var currentDialog = aria.getCurrentDialog();
		if (currentDialog) {
			currentDialog.close();
			return true;
		}
		return false;
	};
	aria.handleEscape = function (event) {
		var key = event.which || event.keyCode;
		if (key === aria.KeyCode.ESC && aria.closeCurrentDialog()) {
			event.stopPropagation();
		}
	};
	document.addEventListener('keyup', aria.handleEscape);
	aria.Dialog = function (dialogId, focusAfterClosed, focusFirst) {
		this.dialogNode = document.getElementById(dialogId);
		if (this.dialogNode === null) {
			throw new Error('No element found with id="' + dialogId + '".');
		}

		var validRoles = ['dialog', 'alertdialog'];
		var isDialog = (this.dialogNode.getAttribute('role') || '')
			.trim()
			.split(/\s+/g)
			.some(function (token) {
				return validRoles.some(function (role) {
					return token === role;
				});
			});
		if (!isDialog) {
			throw new Error(
				'Dialog() requires a DOM element with ARIA role of dialog or alertdialog.'
			);
		}
		var backdropClass = 'dialog-backdrop';
		if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
			this.backdropNode = this.dialogNode.parentNode;
		} else {
			this.backdropNode = document.createElement('div');
			this.backdropNode.className = backdropClass;
			this.dialogNode.parentNode.insertBefore(
				this.backdropNode,
				this.dialogNode
			);
			this.backdropNode.appendChild(this.dialogNode);
		}
		this.backdropNode.classList.add('active');

		// Disable scroll on the body element
		document.body.classList.add(aria.Utils.dialogOpenClass);

		if (typeof focusAfterClosed === 'string') {
			this.focusAfterClosed = document.getElementById(focusAfterClosed);
		} else if (typeof focusAfterClosed === 'object') {
			this.focusAfterClosed = focusAfterClosed;
		} else {
			throw new Error(
				'the focusAfterClosed parameter is required for the aria.Dialog constructor.'
			);
		}

		if (typeof focusFirst === 'string') {
			this.focusFirst = document.getElementById(focusFirst);
		} else if (typeof focusFirst === 'object') {
			this.focusFirst = focusFirst;
		} else {
			this.focusFirst = null;
		}

		// Bracket the dialog node with two invisible, focusable nodes.
		// While this dialog is open, we use these to make sure that focus never
		// leaves the document even if dialogNode is the first or last node.
		var preDiv = document.createElement('div');
		this.preNode = this.dialogNode.parentNode.insertBefore(
			preDiv,
			this.dialogNode
		);
		this.preNode.tabIndex = 0;
		var postDiv = document.createElement('div');
		this.postNode = this.dialogNode.parentNode.insertBefore(
			postDiv,
			this.dialogNode.nextSibling
		);
		this.postNode.tabIndex = 0;

		// If this modal is opening on top of one that is already open,
		// get rid of the document focus listener of the open dialog.
		if (aria.OpenDialogList.length > 0) {
			aria.getCurrentDialog().removeListeners();
		}

		this.addListeners();
		aria.OpenDialogList.push(this);
		this.clearDialog();
		this.dialogNode.className = 'default_dialog'; // make visible

		if (this.focusFirst) {
			this.focusFirst.focus();
		} else {
			aria.Utils.focusFirstDescendant(this.dialogNode);
		}

		this.lastFocus = document.activeElement;
	}; // end Dialog constructor

	aria.Dialog.prototype.clearDialog = function () {
		Array.prototype.map.call(
			this.dialogNode.querySelectorAll('input'),
			function (input) {
				input.value = '';
			}
		);
	};
	aria.Dialog.prototype.close = function () {
		aria.OpenDialogList.pop();
		this.removeListeners();
		aria.Utils.remove(this.preNode);
		aria.Utils.remove(this.postNode);
		this.dialogNode.className = 'dn';
		this.backdropNode.classList.remove('active');
		this.focusAfterClosed.focus();

		// If a dialog was open underneath this one, restore its listeners.
		if (aria.OpenDialogList.length > 0) {
			aria.getCurrentDialog().addListeners();
		} else {
			document.body.classList.remove(aria.Utils.dialogOpenClass);
		}
	}; // end close
	aria.Dialog.prototype.replace = function (
		newDialogId,
		newFocusAfterClosed,
		newFocusFirst
	) {
		aria.OpenDialogList.pop();
		this.removeListeners();
		aria.Utils.remove(this.preNode);
		aria.Utils.remove(this.postNode);
		this.dialogNode.className = 'dn';
		this.backdropNode.classList.remove('active');

		var focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed;
		new aria.Dialog(newDialogId, focusAfterClosed, newFocusFirst);
	}; // end replace

	aria.Dialog.prototype.addListeners = function () {
		document.addEventListener('focus', this.trapFocus, true);
	}; // end addListeners

	aria.Dialog.prototype.removeListeners = function () {
		document.removeEventListener('focus', this.trapFocus, true);
	}; // end removeListeners

	aria.Dialog.prototype.trapFocus = function (event) {
		if (aria.Utils.IgnoreUtilFocusChanges) {
			return;
		}
		var currentDialog = aria.getCurrentDialog();
		if (currentDialog.dialogNode.contains(event.target)) {
			currentDialog.lastFocus = event.target;
		} else {
			aria.Utils.focusFirstDescendant(currentDialog.dialogNode);
			if (currentDialog.lastFocus == document.activeElement) {
				aria.Utils.focusLastDescendant(currentDialog.dialogNode);
			}
			currentDialog.lastFocus = document.activeElement;
		}
	}; // end trapFocus
	window.openDialog = function (dialogId, focusAfterClosed, focusFirst) {
		new aria.Dialog(dialogId, focusAfterClosed, focusFirst);
	};

	window.closeDialog = function (closeButton) {
		var topDialog = aria.getCurrentDialog();
		if (topDialog.dialogNode.contains(closeButton)) {
			topDialog.close();
		}
	}; // end closeDialog

	window.replaceDialog = function (
		newDialogId,
		newFocusAfterClosed,
		newFocusFirst
	) {
		var topDialog = aria.getCurrentDialog();
		if (topDialog.dialogNode.contains(document.activeElement)) {
			topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
		}
	}; // end replaceDialog
})();

aria.KeyCode = {
	BACKSPACE: 8,
	TAB: 9,
	RETURN: 13,
	SHIFT: 16,
	ESC: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	DELETE: 46,
};

aria.Utils = aria.Utils || {};

aria.Utils.matches = function (element, selector) {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function (s) {
				var matches = element.parentNode.querySelectorAll(s);
				var i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {
					// empty
				}
				return i > -1;
			};
	}

	return element.matches(selector);
};
aria.Utils.remove = function (item) {
	if (item.remove && typeof item.remove === 'function') {
		return item.remove();
	}
	if (
		item.parentNode &&
		item.parentNode.removeChild &&
		typeof item.parentNode.removeChild === 'function'
	) {
		return item.parentNode.removeChild(item);
	}
	return false;
};
aria.Utils.isFocusable = function (element) {
	if (element.tabIndex < 0) {
		return false;
	}

	if (element.disabled) {
		return false;
	}

	switch (element.nodeName) {
		case 'A':
			return !!element.href && element.rel != 'ignore';
		case 'INPUT':
			return element.type != 'hidden';
		case 'BUTTON':
		case 'SELECT':
		case 'TEXTAREA':
			return true;
		default:
			return false;
	}
};
aria.Utils.getAncestorBySelector = function (element, selector) {
	if (!aria.Utils.matches(element, selector + ' ' + element.tagName)) {
		// Element is not inside an element that matches selector
		return null;
	}

	// Move up the DOM tree until a parent matching the selector is found
	var currentNode = element;
	var ancestor = null;
	while (ancestor === null) {
		if (aria.Utils.matches(currentNode.parentNode, selector)) {
			ancestor = currentNode.parentNode;
		} else {
			currentNode = currentNode.parentNode;
		}
	}
	return ancestor;
};
aria.Utils.hasClass = function (element, className) {
	return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
};
aria.Utils.addClass = function (element, className) {
	if (!aria.Utils.hasClass(element, className)) {
		element.className += ' ' + className;
	}
};
aria.Utils.removeClass = function (element, className) {
	var classRegex = new RegExp('(\\s|^)' + className + '(\\s|$)');
	element.className = element.className.replace(classRegex, ' ').trim();
};
aria.Utils.bindMethods = function (object /* , ...methodNames */) {
	var methodNames = Array.prototype.slice.call(arguments, 1);
	methodNames.forEach(function (method) {
		object[method] = object[method].bind(object);
	});
};
(function () {
	var tablist = document.querySelectorAll('[role="tablist"]')[0];
	var tabs=[];
	var panels;
	var delay;

	if(tablist!=undefined){
		delay = determineDelay();
		generateArrays();
	}


	function generateArrays() {
		tabs = document.querySelectorAll('[role="tab"]');
		panels = document.querySelectorAll('[role="tabpanel"]');
	}

	// For easy reference
	var keys = {
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		delete: 46,
	};

	// Add or subtract depending on key pressed
	var direction = {
		37: -1,
		38: -1,
		39: 1,
		40: 1,
	};

	// Bind listeners
	for (var i = 0; i < tabs.length; ++i) {
		addListeners(i);
	}

	function addListeners(index) {
		tabs[index].addEventListener('click', clickEventListener);
		tabs[index].addEventListener('keydown', keydownEventListener);
		tabs[index].addEventListener('keyup', keyupEventListener);

		// Build an array with all tabs (<button>s) in it
		tabs[index].index = index;
	}

	// When a tab is clicked, activateTab is fired to activate it
	function clickEventListener(event) {
		var tab = event.target;
		activateTab(tab, false);
	}

	// Handle keydown on tabs
	function keydownEventListener(event) {
		var key = event.keyCode;

		switch (key) {
		case keys.end:
			event.preventDefault();
			// Activate last tab
			activateTab(tabs[tabs.length - 1]);
			break;
		case keys.home:
			event.preventDefault();
			// Activate first tab
			activateTab(tabs[0]);
			break;

		// Up and down are in keydown
		// because we need to prevent page scroll >:)
		case keys.up:
		case keys.down:
			determineOrientation(event);
			break;
		}
	}

	// Handle keyup on tabs
	function keyupEventListener(event) {
		var key = event.keyCode;

		switch (key) {
		case keys.left:
		case keys.right:
			determineOrientation(event);
			break;
		case keys.delete:
			determineDeletable(event);
			break;
		}
	}

	// When a tablist’s aria-orientation is set to vertical,
	// only up and down arrow should function.
	// In all other cases only left and right arrow function.
	function determineOrientation(event) {
		var key = event.keyCode;
		var vertical = tablist.getAttribute('aria-orientation') == 'vertical';
		var proceed = false;

		if (vertical) {
		if (key === keys.up || key === keys.down) {
			event.preventDefault();
			proceed = true;
		}
		} else {
		if (key === keys.left || key === keys.right) {
			proceed = true;
		}
		}

		if (proceed) {
		switchTabOnArrowPress(event);
		}
	}

	// Either focus the next, previous, first, or last tab
	// depending on key pressed
	function switchTabOnArrowPress(event) {
		var pressed = event.keyCode;

		for (var x = 0; x < tabs.length; x++) {
		tabs[x].addEventListener('focus', focusEventHandler);
		}

		if (direction[pressed]) {
		var target = event.target;
		if (target.index !== undefined) {
			if (tabs[target.index + direction[pressed]]) {
			tabs[target.index + direction[pressed]].focus();
			} else if (pressed === keys.left || pressed === keys.up) {
			focusLastTab();
			} else if (pressed === keys.right || pressed == keys.down) {
			focusFirstTab();
			}
		}
		}
	}

	// Activates any given tab panel
	function activateTab(tab, setFocus) {
		setFocus = setFocus || true;
		// Deactivate all other tabs
		deactivateTabs();

		// Remove tabindex attribute
		tab.removeAttribute('tabindex');

		// Set the tab as selected
		tab.setAttribute('aria-selected', 'true');
		tab.setAttribute('class', 'on');

		// Get the value of aria-controls (which is an ID)
		var controls = tab.getAttribute('aria-controls');

		// Remove dn class from tab panel to make it visible
		document.getElementById(controls).classList.remove('dn');

		// Set focus when required
		if (setFocus) {
		tab.focus();
		}
	}

	// Deactivate all tabs and tab panels
	function deactivateTabs() {
		for (var t = 0; t < tabs.length; t++) {
		tabs[t].setAttribute('tabindex', '-1');
		tabs[t].setAttribute('aria-selected', 'false');
		tabs[t].setAttribute('class', '');
		tabs[t].removeEventListener('focus', focusEventHandler);
		}

		for (var p = 0; p < panels.length; p++) {
		panels[p].classList.add('dn');
		}
	}

	// Make a guess
	function focusFirstTab() {
		tabs[0].focus();
	}

	// Make a guess
	function focusLastTab() {
		tabs[tabs.length - 1].focus();
	}

	// Detect if a tab is deletable
	function determineDeletable(event) {
		var target = event.target;

		if (target.getAttribute('data-deletable') !== null) {
		// Delete target tab
		deleteTab(event, target);

		// Update arrays related to tabs widget
		generateArrays();

		// Activate the closest tab to the one that was just deleted
		if (target.index - 1 < 0) {
			activateTab(tabs[0]);
		} else {
			activateTab(tabs[target.index - 1]);
		}
		}
	}

	// Deletes a tab and its panel
	function deleteTab(event) {
		var target = event.target;
		var panel = document.getElementById(target.getAttribute('aria-controls'));

		target.parentElement.removeChild(target);
		panel.parentElement.removeChild(panel);
	}

	// Determine whether there should be a delay
	// when user navigates with the arrow keys
	function determineDelay() {
		var hasDelay = tablist.hasAttribute('data-delay');
		var delay = 0;

		if (hasDelay) {
		var delayValue = tablist.getAttribute('data-delay');
		if (delayValue) {
			delay = delayValue;
		} else {
			// If no value is specified, default to 300ms
			delay = 300;
		}
		}

		return delay;
	}

	//
	function focusEventHandler(event) {
		var target = event.target;

		setTimeout(checkTabFocus, delay, target);
	}

	// Only activate tab on focus if it still has focus after the delay
	function checkTabFocus(target) {
		var focused = document.activeElement;

		if (target === focused) {
		activateTab(target, false);
		}
	}
})();

