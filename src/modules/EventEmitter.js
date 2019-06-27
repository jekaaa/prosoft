/**
 * Класс, описывающий создание своих событий
 */
export default class EventEmitter {
	/**
	 * Объявление пустого объекта с событиями
	 */
	constructor() {
		this.events = {};
	}

	/**
	 * Создание трансляции события
	 * 
	 * @param {string} eventName   название события
	 * @param {*} data   данные, которые будут транслироваться при подписке на событие
	 */
	emit(eventName, data) {
		const event = this.events[eventName];
		if (event) {
			event.forEach(fn => {
				fn.call(null, data);
			});
		}
	}

	/**
	 * Подписка на событие
	 * 
	 * @param {string} eventName   название события
	 * @param {function} fn   функция, которая вызывается при трансляции события
	 */
	subscribe(eventName, fn) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}

		this.events[eventName].push(fn);
		return () => {
			this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
		}
	}


}