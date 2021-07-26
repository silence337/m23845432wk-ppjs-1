'use strict';

/*********************************
 *  Number Keypad prototype
 * 
 * @param {string} el 키패드 HTML을 추가시킬 element class or id
 * @param {Function} opt.complete 넘버 입력시 complete callback
 * 
**********************************/
var SecurityKeypad = function (el, opt) {
	var me = this;
	this.addElementTarget = document.querySelector(el);
	this.elem = document.querySelector('[data-hidden-key]');
	this.keypadNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	if (this.elem == null) {
		console.error('input element insert html <input type="hidden" data-hidden-key>');
	}
	var defaults = {
		complete : null,
	}
	this.opt = this._extend(defaults, opt);

	me._Init();
}
SecurityKeypad.prototype = {
	_Init : function () {
		var me = this;
		this._addEvent();

		var showTimer;
		clearTimeout(showTimer);
		showTimer = setTimeout(function () {
			me._ShowPad();
			clearTimeout(showTimer);
		},10);
	},
	_extend : function ( defaults, options ) {
		var extended = {};
		var prop;
		for (prop in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
				extended[prop] = defaults[prop];
			}
		}
		for (prop in options) {
			if (Object.prototype.hasOwnProperty.call(options, prop)) {
				extended[prop] = options[prop];
			}
		}
		return extended;
	},
	_addEvent : function () {
		this.keyPad = document.createElement('div');
		this.addElementTarget.appendChild(this.keyPad);
		this.keyPad.setAttribute('data-keypad','');
		this.keyPad.classList.add('security-keypad');

		this._ControllInsert();
		this._RandomInsert();
		this._NumberHandler();
		this._PasswordUI();
	},
	_Shuffle : function (arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			var randomIndex = Math.floor(Math.random() * i);
			var itemAtIndex = arr[randomIndex];
	
			arr[randomIndex] = arr[i];
			arr[i] = itemAtIndex;
		}
		return arr;
	},
	_RandomInsert : function () {
		var result = "";
		this.keypadNum = this._Shuffle(this.keypadNum);

		for(var i = 0; i < this.keypadNum.length; i ++){
			result += '<li><button type="button" data-key-number="'+ this.keypadNum[i] +'">'+ this.keypadNum[i] + '</button></li>';
		}
		var html =  '<ul data-insert></ul>';

		this.keyPad.insertAdjacentHTML('beforeend', html);

		this.keyInsert = this.keyPad.querySelector('[data-insert]')
		var child = this.keyInsert.querySelectorAll('li');
		if(child !== null) {
			child.forEach(function(node){
				node.remove();
			});
		}
		this.keyInsert.insertAdjacentHTML('beforeend', result);
		result = null; 
		html = null;
	},
	_ControllInsert : function () {
		this.html =
		'<button type="button" class="key-random" data-random>재배열</button>'+
		'<button type="button" class="key-back" data-back><span>backspace</span></button>';
		
		this.keyPad.insertAdjacentHTML('beforeend', this.html);
		this.keyRandom = this.keyPad.querySelector('[data-random]');
		this.keyBack = this.keyPad.querySelector('[data-back]');
		
		this.IntRandom = this._RandomKey.bind(this);
		this.IntkeyBack = this._RemoveKey.bind(this);

		this.keyRandom.addEventListener('click', this.IntRandom);
		this.keyBack.addEventListener('click', this.IntkeyBack);
	},
	_Keyon : function (e) {
		e.preventDefault();
		var sortValue = this.elem.value;
		var n = sortValue + e.currentTarget.dataset.keyNumber;
		var max = 7;

		if(n.length < max)  {
			this.elem.value = n;
			this.circleIdx = (n.length - 1);
			this.circleElement[this.circleIdx].classList.add('keyon');
		}
		if(n.length == (max - 1)){
			return this.opt.complete();
		}
	},
	_NumberHandler : function () {
		var me = this;
		this.keyNumber = document.querySelectorAll('[data-key-number]');

		this.IntKeyon = this._Keyon.bind(this);

		this.keyNumber.forEach(function(el) {
			el.removeEventListener('click', me.IntKeyon);
			el.addEventListener('click', me.IntKeyon);
		});
	},
	_PasswordUI : function () {
		var circle = '<div class="keypad-circle">';
		for(var i = 0; i < 6; i ++){
			circle += '<i></i>';
		}
		circle += '</div>';
		this.elem.insertAdjacentHTML('beforebegin', circle);
		circle = null;
		this.circleParent = document.querySelector('.keypad-circle');
		this.circleElement = this.circleParent.querySelectorAll('i');
	},
	Reload : function () {
		var me = this;
		var timer;
		clearTimeout(timer);
		timer = setTimeout(function () {
			me.keyPad.remove();
			me.circleParent.remove();
			me.keyPad = null;
			me.elem.value = null;
			me.keyRandom.removeEventListener('click', this.IntRandom);
			me.keyBack.removeEventListener('click', this.IntkeyBack);
			me._addEvent();
			me.keyPad.classList.add('show');
			clearTimeout(timer);
		},100);
	},
	Hide : function () {
		this.keyPad.remove();
		this.circleParent.remove();
		this.keyPad = null;
		this.circleParent = null;
		this.elem.value = null;
	},
	_RandomKey : function (e) {
		e.preventDefault();
		this.keyInsert.remove();
		this.elem.value = null;
		this.circleParent.querySelectorAll('i').forEach(function (elem) {
			elem.classList.remove('keyon');
		});
		this._RandomInsert();
		this._NumberHandler();
	},
	_RemoveKey : function (e) {
		e.preventDefault();
		//console.log(this.elem.value.length);
		if(this.elem.value.length < 1){
			return;
		}
		this.elem.value = this.elem.value.slice(0,-1);
		this.circleElement[this.circleIdx].classList.remove('keyon');
		this.circleIdx--;
		return;
	},
	_ShowPad : function () {
		this.keyPad.classList.add('show');
	},
}
