import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;

gsap.defaults({
	overwrite: 'auto',
});

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};

		const countBtns = document.querySelectorAll('.js-count-btn');
		const countInputs = document.querySelectorAll('.js-count-input');
		const subcost = document.querySelector('.js-subcost');
		const total = document.querySelector('.js-total');
		const tax = document.querySelector('[data-tax]');
		const shipping = document.querySelector('[data-shipping]');
		const deleteBtns = document.querySelectorAll('.js-delete');
		const emptyMessage = document.querySelector('.js-empty-message');

		function disableCountBtn(btn) {
			btn.setAttribute('disabled', 'disabled');
		}

		function enableCountBtn(parent) {
			parent.querySelector('[data-type="decrease"]').removeAttribute('disabled');
		}

		function decrease(count, btn) {
			count -= 1;
			if (count === 0) {
				disableCountBtn(btn);
			}
			return count;
		}

		function increase(count, parent) {
			count += 1;
			if (count > 0) {
				enableCountBtn(parent);
			}
			return count;
		}

		function countItemPrice(itemPrice, count) {
			const itemPriceVal = parseInt(itemPrice.getAttribute('data-price'), 10);
			itemPrice.innerHTML = '$ ' + itemPriceVal * count;
		}

		function countTotal() {
			const prices = document.querySelectorAll('[data-price]');
			let subcostVal = 0;
			const taxVal = parseInt(tax.getAttribute('data-tax'), 10);
			const shippingVal = parseInt(shipping.getAttribute('data-shipping'), 10);
			prices.forEach(price => {
				subcostVal += parseInt(price.innerHTML.substring(2), 10);
			});
			subcost.innerHTML = '$ ' + subcostVal;
			total.innerHTML = '$ ' + (subcostVal + taxVal + shippingVal);
		}

		function countCost() {
			const parent = this.parentNode;
			const type = this.getAttribute('data-type');
			const input = parent.querySelector('.js-count-input');
			const itemPrice = parent.parentNode.querySelector('[data-price]');
			let count = parseInt(input.value, 10);
			if (count <= 0) {
				input.value = 0;
				count = 0;
				disableCountBtn(parent.querySelector('[data-type="decrease"]'));
			}
			if (type === 'decrease') {
				count = decrease(count, this);
			}
			if (type === 'increase') {
				count = increase(count, parent);
			}
			input.value = count;
			countItemPrice(itemPrice, count);
			countTotal();
		}

		function deleteItem() {
			const parent = this.parentNode;
			parent.remove();
			countTotal();
			const basketItems = document.querySelectorAll('.js-basket-item');
			if (basketItems.length === 0) {
				emptyMessage.removeAttribute('hidden');
			}
		}

		document.addEventListener('DOMContentLoaded', () => {
			countTotal();
			document.documentElement.classList.remove('_loading');
		});

		countBtns.forEach(btn => {
			btn.addEventListener('click', countCost);
		});
		countInputs.forEach(input => {
			input.addEventListener('change', countCost);
		});
		deleteBtns.forEach(btn => {
			btn.addEventListener('click', deleteItem);
		});

		if (module.hot) {
			module.hot.dispose(() => {
				countBtns.forEach(btn => {
					btn.removeEventListener('click', countCost);
				});
				countInputs.forEach(input => {
					input.removeEventListener('change', countCost);
				});
				deleteBtns.forEach(btn => {
					btn.removeEventListener('click', deleteItem);
				});
			});
		}
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}
