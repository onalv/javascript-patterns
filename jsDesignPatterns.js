/*
*
*	// function argument pattern
*
*/

/*
function myFunc() {
	var x = 0;
	for (var i = 0; i < arguments.length; i++) {
		x = x + arguments[i];
	}
	return x;
}

console.log(myFunc(1,2,3,4)); //10
console.log(myFunc(45,98)); //143
*/

/*
*
*	// Chaining design pattern
*
*/

/*
var Calc = function (start) {
	var that = this;
	this.add = function (x) {
		start = start + x;
		return this;
	};

	this.multiply = function (x) {
		start = start * x;
		return this;
	}
	this.equals = function (callback) {
		callback(start);
		return this;
	}
}

new Calc(0)
	.add(1)
	.add(2)
	.multiply(3)
	.equals(function (result) {
		console.log(result);
	});
*/

/*
*
*	// Observable properties
*
*/

/*
var Book = function (name, price) {
	var priceChanging = [],
		priceChanged = []
	this.name = function (val) {
		return name;
	};

	this.price = function (val) {
		if (val !== undefined && val !== price) {
			for (var i = 0; i < priceChanging.length; i++) {
				if (!priceChanging[i](this, val)) {
					return price;
				}
			}
			price = val;
			for (var i = 0; i < priceChanged.length; i++) {
				priceChanged[i](this);
			}
		}
		return price;
	};

	this.onPriceChanging = function (callback) {
		priceChanging.push(callback);
	};

	this.onPriceChanged = function (callback) {
		priceChanged.push(callback);
	};
};

var book = new Book('Javascript: The Good Parts', 23.99);

console.log('The name is: ' + book.name());
console.log('The price is: $' + book.price());

book.onPriceChanging(function (b, price) {
	if (price > 100) {
		console.log('System error, price has gone unexpectedly high');
		return false;
	}
	return false;
});

book.onPriceChanged(function (b) {
	console.log('The book price has changed to: $' + b.price());
});

book.price(19.99);
book.price(200);
*/

/*
*
*	// Defining properties with getters and setters in ECMAScript 5
*
*/

/*
function Book () {
	var name = '';
	Object.defineProperty(this, 'name', {
		get: function () {
			return name;
		},
		set: function (val) {
			console.log(val);
			name = val;
		}
	});
}
*/

/*
*
*	// Asynchronous Execution pattern
*
*/

/*
*
*	// Recursive setTimeout pattern
*
*/

/*
$(document).ready(function () {
	var ul = $('ul.log'),
		index = 0;

	setTimeout(function getDate() {
		var started = new Date(),
			i = index;

		index++;

		$.get('/home/date', function (date) {
			var end = new Date();
			ul.append('<li>Request ' + i + 'started at ' + started.getHours() + 'smth more....');
		});
	}, 5000);
})
*/

/*
*
*	// Node.js modules
*
*/

/*
//calc.js
var Calc = function (start) {
	var self = this;

	this.add = function (x) {
		start = start + x;
		return self;
	};

	this.multiply = function (x) {
		start = start * x;
		return self;
	}
	this.equals = function (callback) {
		callback(start);
		return self;
	}
}

module.exports = {
	add: function (x, y) {
		return new Calc(x).add(y || 0);
	},
	multiply: function (x, y) {
		return new Calc(x).multiply(y || 1);
	}
};

//app.js
var Calc = require('./calc.js');

Calc(0)
	.add(1, 2)
	.multiply(3)
	.equals(function (result) {
		console.log(result);
	});
*/

/*
*
*	// Asynchronous Module Definitios (AMD) with RequireJS
*
*/

/*
// in head's html
<script data-main="/scripts/main" src="@Url.Content("~/Scripts/require.js")" type="text/javascript"></script>

//main.js
require(['jquery', 'twitter/api'], function ($, api) {
	$(document).ready(function () {
		$('.load-tweets').submit(function (e) {
			e.preventDefault();

			var user = $(this).find('input').val();

			api.timeline(user)
				.done(function (tweets) {
					var el = $('.twitter').empty(),
						lis = [];

					for (var i = 0, il = tweets.length; i < il; i++) {
						lis.push($('<li><strong>@' + user + '</strong>: ' + tweets[i].text + 'shalala'));
					}

					el.append(lis);0
				});
		});
	});
});

// api.js
define(['jquery'], function ($) {
	return {
		timeline: function (user) {
			return $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?id=' + user + 'shalalala');
		}
	}
})
*/

/*
*
*	// Pub/Sub Pattern
*
*/

/*
//pubsub.js
define(function () {
	var cache = {};

	return {
		pub: function (id) {
			var args = [].slice.call(arguments, 1);

			if (!cache[id]) {
				cache[id] = {
					callbacks: [],
					args: [args]
				};
			}

			for (var i = 0, il = cache[id].callbacks.length; i < il; i++) {
				cache[id].callbacks[i].apply(null, args);
			}
		},
		sub: function (id, fn) {
			if (!cache[id]) {
				cache[id] = {
					callbacks:  [fn],
					args: []	
				};
			} else {
				cache[id].callbacks.push(fn);
			}

			for (var i = 0, il = cache[id].args.length; i < il; i++) {
				fn.apply(null, cache[id].args[i]);
			}
		},
		unsub: function (id, fn) {
			var index;
			if (!id) {
				return;
			}

			if (!fn) {
				cache[id] = {
					callbacks: [],
					args: []
				};
			} else {
				index = cache[id].callbacks.indexOf(fn);
				if (index > -1) {
					cache[id].callbacks = cache[id].callbacks.slice(0, index).concat(cache[id].callbacks.slice(index + 1));
				}
			}
		}
	};
});

//product-list.js
define(['./pubsub', 'jquery'], function (pubsub, $) {
	return  {
		init: function () {
			var productList = $('.products');

			productList.on('click', 'i', function () {
				var $this = $(this),
					item = {
						id: this,
						name: $this.parents('section:first').find('h1').html()
					};

				if ($this.hasClass('icon-plus')) {
					pubsub.pub('add-to-cart', item);

					$this.removeClass('icon-plus')
						.addClass('icon-minus')
						.attr('title', 'Remove from cart');
				} else {
					pubsub.pub('remove-from-cart', item);

					$this.addClass('icon-plus')
						.removeClass('icon-minus')
						.attr('title', 'Remove from cart');
				}  
			})
		}
	};
});

// big-cart.js
define(['./pubsub', 'jquery'], function (pubsub, $) {
	var cart, count = 0;

	pubsub.sub('add-to-cart', function (item) {
		count++;

		cart.find('h1').html(count);

		var li = $('<li />')
			.html(item.name)
			.data('key', item.id);

		cart.find('ul').append(li);
	});

	pubsub.sub('remove-from-cart', function (item) {
		count--;

		cart.find('h1').html(count);

		cart.find('li').filter(function () {
			return $(this).data('key') == item.id;
		}).remove();
	});

	return {
		init: function () {
			cart = $('.big-cart');
		}
	};
});

//mini-cart.js
define(['./pubsub', 'jquery'], function (pubsub, $) {
	var cart, count = 0;

	pubsub.sub('add-to-cart', function () {
		count++;
		cart.find('span').html(count);
	});

	pubsub.sub('remove-from-cart', function () {
		count--;
		cart.find('span').html(count);
	});

	return {
		init: function () {
			cart = $('.mini-cart');
		}
	};
});

//products.js
define(['jquery', './big-cart', './mini-cart', './product-list'], function ($, bigCart, miniCart, productList) {
	$(document).ready(function () {
		bigCart.init();
		miniCart.init();
		productList.init();
	});
});
*/

/*
*
*	// A promise API
*
*/

/*
//app.js
var Promise = require('./promise.js');

var promise = new Promise();

setTimeout(function () {
	promise.resolve();
}, 1000);

setTimeout(function() {
	promise.done(function (data) {
		console.log('Handler added after deferred object is done');
	});
}, 2000);

promise.done(function (data) {
	console.log('Deferred object has completed');
});

var promise2 = new Promise();

promise2.failed(function () {
	console.log('Promise #2 failed');
}).done(function () {
	console.log('Promise #2 has completed');
});

setTimeout(function () {
	promise2.fail();
}, 1000);

console.log('application completed');

//promise.js
var Promise = function () {
	var data,
		done = [],
		fail = [],
		status = 'progress';

	this.done = function (fn) {
		done.push(fn);

		if (status === 'done') {
			fn(data);
		}

		return this;
	};

	this.failed = function (fn) {
		failed.push(fn);

		if (status === 'failed') {
			fn(data);
		}

		return this;
	};

	this.resolve = function (result) {
		if (status !== 'progress') {
			throw 'Promise has already completed with a status of ' + status + 'and';
		}

		status = 'done';
		data = result;

		for (var i = 0, il = done.length; i < il; i++) {
			done[i](data);
		}

		return this;
	};

	this.fail = function (reason) {
		if (status !== 'progress') {
			throw 'Promise has already completed with a status of ' + status + 'and';
		}

		status = 'failed';
		data = reason;

		for (var i = 0, il = fail.length; i < il; i++) {
			fail[i](data);
		}

		return this;
	};
};

module.exports = Promise;

// console -->
// application completed
// Deferred object has completed
// Promise #2 failed
// Handler added after deferred object is one

*/

/*
*
*	// jquery Promise
*
*/

//main.js
require(['jquery', 'twitter/api'], function ($, api) {
	$.fn.blinky = function (args) {
		var opts = { frequency: 1000, count: -1 };
		args = $.extend(true, opts, args);

		var i = 0,
			that = this;
			dfd = $.Deferred();

		function go() {
			if (that.length === 0) {
				return dfd.reject();
			}

			if (i === args.count) {
				return dfd.resolve();
			}

			i++;
			$(that).fadeOut(args.frequency / 2).fadeIn(args.frequency / 2);
			setTimeout(go, args.frequency);
		}

		return dfd.promise();
	};

	$(document).ready(function () {
		$('.load-tweets').submit(function (e) {
			e.preventDefault();

			var user = $(this).find('input').val();

			$.when(api.timeline(user), $(this).find('input').blinky({ count: 2}))
				.done(function (args) {
					var el = $('.twitter').empty(),
						lis = [],
						tweets = args[0];

					for (var i = 0, il = tweets.length; i < il; i++) {
						lis.push($('<li><strong>@' + user + '</strong>: ' + tweets[i].text + 'shalala'));
					}

					el.append(lis);
				}).fail(function () {
					alert('Something has gone wrong!');
				});
		});
	});
});