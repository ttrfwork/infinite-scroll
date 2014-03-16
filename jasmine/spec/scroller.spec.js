describe('scroller js', function () {
	var uberContainer, container, items, backend, register, registeredEvents = [], ruler;

	beforeEach(function () {
		uberContainer = document.createElement('div');
		document.body.appendChild(uberContainer);

		container = document.createElement('div');

		items = [];

		items.push(document.createElement('div'));
		items.push(document.createElement('div'));
		items.push(document.createElement('div'));
		items.push(document.createElement('div'));
		items.push(document.createElement('div'));


		container.style.background = 'gray';
		container.style.height = '2000px';
		container.setAttribute('id', 'c');

		items[0].style.width = '100px';
		items[0].style.height = '100px';
		items[0].style.background = 'yellow';
		items[0].style.margin = '1em 1em';
		items[1].style.width = '100px';
		items[1].style.height = '100px';
		items[1].style.background = 'pink';
		items[1].style.margin = '1em 1em';
		items[2].style.width = '100px';
		items[2].style.height = '100px';
		items[2].style.background = 'red';
		items[2].style.margin = '1em 1em';
		items[3].style.width = '100px';
		items[3].style.height = '100px';
		items[3].style.background = 'tomato';
		items[3].style.margin = '1em 1em';
		items[4].style.width = '200px';
		items[4].style.height = '10px';
		items[4].className = 'indicator';
		items[4].style.background = 'aquamarine';
		items[4].style.display = 'none';

		items.forEach(function (item) { container.appendChild(item); });
		uberContainer.appendChild(container);

		container.dataset.current = 1;
		container.dataset.total = 10;
		container.dataset.link = 'a link to some place';
		container.dataset.selector = '.container'

		backend = function (url, callback) {
			expect(url).toEqual(container.dataset.link);

			callback('<div class="container"><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div></div>');
		};

		register = function (obj, event, handler) {
			registeredEvents.push({obj: obj, event: event, handler: handler});
		};

		ruler = {
			isBottom: function () {
				return false;
			}
		}
	});

	afterEach(function () {
		document.body.removeChild(uberContainer);
		registeredEvents = [];
	});

	describe('what is invalid', function () {
		it('not specifying current is invalid', function () {
			delete container.dataset.current;

			expect(function () {
				new scroller('c', backend, register, ruler);
			}).toThrow('no current!');
		});

		it('not specifying total is invalid', function () {
			delete container.dataset.total;

			expect(function () {
				new scroller('c', backend, register, ruler);
			}).toThrow('no total!');
		});

		it('not specifying link is invalid', function () {
			delete container.dataset.link;

			expect(function () {
				new scroller('c', backend, register, ruler);
			}).toThrow('no link!');
		});

		it('not specifying selector is invalid', function () {
			delete container.dataset.selector;

			expect(function () {
				new scroller('c', backend, register, ruler);
			}).toThrow('no selector!');
		});

		it('not specifying id is invalid', function () {
			expect(function () {
				new scroller(void 0, backend, register, ruler);
			}).toThrow('no id!');
		});

		it('not specifying backend is invalid', function () {
			expect(function () {
				new scroller('c', void 0, register, ruler);
			}).toThrow('no backend!');
		});

		it('not specifying correct id is invalid', function () {
			expect(function () {
				new scroller('c1', backend, register, ruler);
			}).toThrow('no container!');
		});

		it('not specifying a register is invalid', function () {
			expect(function () {
				new scroller('c', backend, void 0, ruler);
			}).toThrow('no register!');
		});

		it('not specifying a ruler is invalid', function () {
			expect(function () {
				new scroller('c', backend, register, void 0);
			}).toThrow('no ruler!');
		});
	});

	it('registers onscroll event listener on window with register', function () {
		expect(registeredEvents.length).toEqual(0);

		var scroller0 = new scroller('c', backend, register, ruler);

		expect(registeredEvents.length).toEqual(1);
		expect(registeredEvents[0].obj).toEqual(window);
		expect(registeredEvents[0].event).toEqual('scroll');
	});

	it('hides indicator if it is not hidden', function () {
		items[4].style.display = 'block';
		expect(items[4].style.display).toEqual('block');

		var scroller0 = new scroller('c', backend, register, ruler);
		expect(items[4].style.display).toEqual('none');
	});

	describe('when the onscroll is dispatched on window, it consults ruler for whether the bottom is reached (sync)', function () {
		it('if not it does nothing', function () {
			register = function (obj, event, handler) {
				obj.addEventListener(event, handler);
			}

			var scroller0 = new scroller('c', backend, register, ruler);

			window.dispatchEvent(new Event('scroll'));

			expect(container.childNodes.length).toEqual(5);
			expect(container.childNodes[0]).toEqual(items[0]);
			expect(container.childNodes[1]).toEqual(items[1]);
			expect(container.childNodes[2]).toEqual(items[2]);
			expect(container.childNodes[3]).toEqual(items[3]);
			expect(container.childNodes[4]).toEqual(items[4]);
			expect(items[4].style.display).toEqual('none');
		});

		it('otherwise it asks backend for new data', function () {
			register = function (obj, event, handler) {
				obj.addEventListener(event, handler);
			};
			ruler.isBottom = function () { return true; };

			var scroller0 = new scroller('c', backend, register, ruler);

			window.dispatchEvent(new Event('scroll'));

			expect(container.childNodes.length).toEqual(7);
			expect(container.childNodes[0]).toEqual(items[0]);
			expect(container.childNodes[1]).toEqual(items[1]);
			expect(container.childNodes[2]).toEqual(items[2]);
			expect(container.childNodes[3]).toEqual(items[3]);
			expect(container.childNodes[container.childNodes.length - 1]).toEqual(items[4]);
			expect(items[4].style.display).toEqual('none');
		});
	});

	describe('when the onscroll is dispatched on window, it consults ruler for whether the bottom is reached (async)', function (done) {
		it('if not it does nothing', function (done) {
			register = function (obj, event, handler) {
				obj.addEventListener(event, handler);
			};

			backend = function (url, callback) {
				expect(url).toEqual(container.dataset.link);

				setTimeout(function () {
					callback('<div class="container"><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div></div>');
				}, 400);
			};

			var scroller0 = new scroller('c', backend, register, ruler);

			window.dispatchEvent(new Event('scroll'));

			expect(container.childNodes.length).toEqual(5);
			expect(container.childNodes[0]).toEqual(items[0]);
			expect(container.childNodes[1]).toEqual(items[1]);
			expect(container.childNodes[2]).toEqual(items[2]);
			expect(container.childNodes[3]).toEqual(items[3]);
			expect(container.childNodes[4]).toEqual(items[4]);
			expect(items[4].style.display).toEqual('none');

			var id = setTimeout(function () {
				expect(container.childNodes.length).toEqual(5);
				expect(container.childNodes[0]).toEqual(items[0]);
				expect(container.childNodes[1]).toEqual(items[1]);
				expect(container.childNodes[2]).toEqual(items[2]);
				expect(container.childNodes[3]).toEqual(items[3]);
				expect(container.childNodes[4]).toEqual(items[4]);
				expect(items[4].style.display).toEqual('none');

				clearTimeout(id);
				done();
			}, 500);
		});

		it('otherwise it asks backend for new data', function (done) {
			register = function (obj, event, handler) {
				obj.addEventListener(event, handler);
			};

			backend = function (url, callback) {
				expect(url).toEqual(container.dataset.link);

				setTimeout(function () {
					callback('<div class="container"><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div><div style="height: 100px; width: 100px; background: black; margin: 1em 1em;"></div></div>');
				}, 400);
			};

			ruler.isBottom = function () { return true; };

			var scroller0 = new scroller('c', backend, register, ruler);

			window.dispatchEvent(new Event('scroll'));

			expect(items[4].style.display).toEqual('block');

			var id = setTimeout(function () {
				expect(container.childNodes.length).toEqual(7);
				expect(container.childNodes[0]).toEqual(items[0]);
				expect(container.childNodes[1]).toEqual(items[1]);
				expect(container.childNodes[2]).toEqual(items[2]);
				expect(container.childNodes[3]).toEqual(items[3]);
				expect(container.childNodes[container.childNodes.length - 1]).toEqual(items[4]);

				expect(items[4].style.display).toEqual('none');

				clearTimeout(id);
				done();
			}, 500);
		});
	});
});