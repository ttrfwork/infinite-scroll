function scroller(id, backend, register, ruler) {
	if (!id) throw 'no id!';
	if (!backend) throw 'no backend!';
	if (!register) throw 'no register!';
	if (!ruler) throw 'no ruler!';

	var container = document.getElementById(id);

	if (!container) throw 'no container!';
	if (!container.dataset.current) throw 'no current!';
	if (!container.dataset.total) throw 'no total!';
	if (!container.dataset.link) throw 'no link!';
	if (!container.dataset.selector) throw 'no selector!';

	var indicator = container.lastChild;

	indicator.style.display = 'none';

	function handler_callback(htmlString) {
		indicator.style.display = 'none';
		var wrapper = document.createElement('div');
		wrapper.innerHTML = htmlString;

		var cont = wrapper.querySelector(container.dataset.selector);

		[].forEach.call(cont.childNodes, function (kid) {
			container.insertBefore(kid, indicator);
		});
	}

	var handler = function (event) {
		if (ruler.isBottom()) {
			indicator.style.display = 'block';
			backend(container.dataset.link, handler_callback);
		}
	};

	register(window, 'scroll', handler);
}