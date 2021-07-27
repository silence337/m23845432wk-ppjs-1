/*********************************
 *  Number Keypad prototype
 * 
 * @param {string} el 키패드 HTML을 추가시킬 element class or id
 * @param {Function} opt.complete 넘버 입력시 complete callback
 * 
**********************************/
export class SecurityKeypad {

    constructor(el, opt) {
        this.addElementTarget = document.querySelector(el);
        this.hiddenKey = document.querySelector('[data-hidden-key]');
        this.keypadNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (this.hiddenKey == null) {
            console.error('input element insert html <input type="hidden" data-hidden-key>');
        }
        var defaults = {
            complete : null,
        }
        this.opt = this._extend(defaults, opt);
        
        this._Init();
    }

    _Init () {
		this._addEvent();

		let showTimer;
		clearTimeout(showTimer);
		showTimer = setTimeout(() => {
			this._ShowPad();
			clearTimeout(showTimer);
		},10);
	}

	_extend (defaults,options) {
		let extended = {};
		let prop;
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
	}

	_addEvent () {
		this.keyPad = document.createElement('div');
		this.addElementTarget.appendChild(this.keyPad);
		this.keyPad.setAttribute('data-keypad','');
		this.keyPad.classList.add('security-keypad');

		this._ControllInsert();
		this._RandomInsert();
		this._NumberHandler();
		this._PasswordUI();
	}

	_Shuffle (arr) {
		for (let i = arr.length - 1; i >= 0; i--) {
			let randomIndex = Math.floor(Math.random() * i);
			let itemAtIndex = arr[randomIndex];
	
			arr[randomIndex] = arr[i];
			arr[i] = itemAtIndex;
		}
		return arr;
	}

    _RandomInsert () {
		let result = "";
		this.keypadNum = this._Shuffle(this.keypadNum);

		for(let i = 0; i < this.keypadNum.length; i ++){
			result += '<li><button type="button" data-key-number="'+ this.keypadNum[i] +'">'+ this.keypadNum[i] + '</button></li>';
		}
		let html =  '<ul data-insert></ul>';

		this.keyPad.insertAdjacentHTML('beforeend', html);

		this.keyInsert = this.keyPad.querySelector('[data-insert]')
		const child = this.keyInsert.querySelectorAll('li');
		if(child !== null) {
			child.forEach((node) => {
				node.remove();
			});
		}
		this.keyInsert.insertAdjacentHTML('beforeend', result);
		result = null; 
		html = null;
	}

    _ControllInsert () {
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
	}

    _Keyon (e) {
		e.preventDefault();
		const sortValue = this.hiddenKey.value;
		let n = sortValue + e.currentTarget.dataset.keyNumber;
		let max = 7;

		if(n.length < max)  {
			this.hiddenKey.value = n;
			this.circleIdx = (n.length - 1);
			this.circleElement[this.circleIdx].classList.add('keyon');
		}
		if(n.length == (max - 1)){
			return this.opt.complete();
		}
	}

	_NumberHandler () {
		this.keyNumber = document.querySelectorAll('[data-key-number]');

		this.IntKeyon = this._Keyon.bind(this);

		this.keyNumber.forEach((el) => {
			el.removeEventListener('click', this.IntKeyon);
			el.addEventListener('click', this.IntKeyon);
		});
	}
    
	_PasswordUI () {
		let circle = '<div class="keypad-circle">';
		for(let i = 0; i < 6; i ++){
			circle += '<i></i>';
		}
		circle += '</div>';
		this.hiddenKey.insertAdjacentHTML('beforebegin', circle);
		circle = null;
		this.circleParent = document.querySelector('.keypad-circle');
		this.circleElement = this.circleParent.querySelectorAll('i');
	}

	Reload () {
		let timer;
		clearTimeout(timer);
		timer = setTimeout(() => {
			this.keyPad.remove();
			this.circleParent.remove();
			this.keyPad = null;
			this.hiddenKey.value = null;
			this.keyRandom.removeEventListener('click', this.IntRandom);
			this.keyBack.removeEventListener('click', this.IntkeyBack);
			this._addEvent();
			this.keyPad.classList.add('show');
			clearTimeout(timer);
		},100);
	}

	Hide () {
		this.keyPad.remove();
		this.circleParent.remove();
		this.keyPad = null;
		this.circleParent = null;
		this.hiddenKey.value = null;
	}

	_RandomKey (e) {
		e.preventDefault();
		this.keyInsert.remove();
		this.hiddenKey.value = null;
		this.circleParent.querySelectorAll('i').forEach((elem) => {
			elem.classList.remove('keyon');
		});
		this._RandomInsert();
		this._NumberHandler();
	}

	_RemoveKey (e) {
		e.preventDefault();
		if(this.hiddenKey.value.length < 1){
			return;
		}
		this.hiddenKey.value = this.elem.value.slice(0,-1);
		this.circleElement[this.circleIdx].classList.remove('keyon');
		this.circleIdx--;
		return;
	}

	_ShowPad () {
		this.keyPad.classList.add('show');
	}
}
