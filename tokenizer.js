// Author: Don McCurdy
// Date: July, 2012

/*********** INITIALIZATION ************/

(function ($) {

	var Tokenizer = function (argElement, argOpts) {

		// PRIVATE VARS
		var
			input, 
			list,
			wrap,
			suggestions,
			options = $.extend({
				xContent: '&times;',
				namespace: 'tknz',
				label: 'Tags:',
				separators: [',', ' ', '.'],
				callback: null,
				source: ['one','two','three','four','five'],
				allowUnknownTags: true,
				numToSuggest: 5
			}, argOpts);

		// PRIVATE METHODS
		var init, buildHTML, bindEvents, push, pop, get, empty, 
			destroy, callback, suggest, getMatch, tryPush;

		init = function () {
			input = argElement;
			buildHTML();
			bindEvents();
		};
		buildHTML = function () {
			var ns = options.namespace;
		  	list = $('<div class="'+ns+'-list"></div>');
		  	suggestions = $('<div class="'+ns+'-suggest"><ul></ul></div>');
			wrap = input
				.addClass(ns+'-input')
			 	.wrap('<div class="'+ns+'-wrapper"></div>')
			 	.parent()
				.prepend(list)
				.prepend('<span class="'+ns+'-wrapper-label">'+options.label+'</span>')
				.append(suggestions);
		};
		bindEvents = function () {
			var ns = options.namespace;
			wrap
				.on('focus.'+ns, 'input', function () {  // On focus, stylize wrapper.
					wrap.addClass(ns+'-focus');
				}).on('blur.'+ns, 'input', function () { // On blur, un-stylize.
					wrap.removeClass(ns+'-focus');
					if (input.val()) { 
						push(input.val()); 
						input.val('');
						callback();
					}
				}).on('keydown.'+ns, 'input', function () { // Backspace handler.
			 		if (event.which === 8 && !input.val()) {
						pop();
						callback();
					}
		  		}).on('keypress.'+ns, 'input', function (event) { // Input listener to create tokens.
			 		var val = input.val();
					if (options.separators.indexOf(String.fromCharCode(event.which)) > -1 || event.which === 13) {
						event.preventDefault();
						tryPush(val);
					} else if (event.which === 38) { // Up
						console.log('up');
					} else if (event.which === 40) { // Down
						console.log('down');
					}
				}).on('keyup.'+ns, 'input', function (event) {
					if ($.isArray(options.source)) { // Autosuggest from list
						suggest(input.val(), options.source);
					} else if (options.source) { // Autosuggest from function
						options.source(input.val(), suggest);
					}
				}).on('click.'+ns, function () {	// On click, focus the input.
					input.focus();
				}).on('click.'+ns, '.'+ns+'-token-x', function () {
					$(this).closest('.'+ns+'-token').remove();
					callback();
				}).on('click.'+ns, '.'+ns+'-suggest-li', function () {
					input.val('');
					push($(this).text());
					suggestions.children('ul').empty().removeClass('.'+ns+'-vis');
					callback();
				});
		};

		tryPush = function (value) {
			var match = getMatch();
			if (value && (options.allowUnknownTags || match)) { 
				push(match || value); 
				input.val('');
				callback();
			}
		};
		push = function (value) {
		  	var
		  		ns = options.namespace, 
		  		token = '<div class="'+ns+'-token" data-token="'+value+'">'+
						'<span class="'+ns+'-token-label">'+value.trim()+'</span>'+
						'<span class="'+ns+'-token-x">'+options.xContent+'</span>'+
			 		'</div>';
			list.append(token);
			return input;
		};
		pop = function () {
			return list.children().last().detach().data('token') || null;
		};
		empty = function () {
			list.empty();
			return input;
		};
		get = function () {
			var 
				i, 
				tokenList = [], 
				tokens = list.children();
			for (i = 0; i < tokens.length; i++) {
				tokenList.push(tokens.eq(i).data('token').toString());
			}
			return tokenList;
		};
		destroy = function () {
			wrap.after(input).remove();
			return input.removeClass(options.namespace+'-input');
		};
		callback = function () {
			(options.callback || $.noop)(input);
			return input;
		};
		suggest = function (word, words) {
			var 
				i, 
				ns = options.namespace,
				re1 = new RegExp(word, 'i'),
				re2 = new RegExp('^'+word+'$', 'i'),
				limit = options.numToSuggest || 1000,
				list = '';
			for (i = 0; word && i < words.length && i < limit; i++) {
				if (!words[i].match(re1)) { continue; }
				list += '<li class="'+ns+'-suggest-li'+
					(words[i].match(re2) ? ' '+ns+'-sel' : '')+'">'+words[i]+'</li>';
			}
			suggestions.children('ul')
				.html(list)
				[list ? 'addClass' : 'removeClass']('.'+ns+'-vis');
		};
		getMatch = function () {
			return suggestions.find('.'+options.namespace+'-sel').eq(0).text();
		};
		
		init (argElement);
		return {
			push: push,
			pop: pop,
			empty: empty,
			get: get,
			destroy: destroy,
			callback: callback
		};
	};


	// PUBLIC METHODS
	var methods = {
		init: function( options ) { 
		if (this[0].nodeName !== 'INPUT') {
		  $.error('Tokenizer must be set up with an <input type="text"> tag.');
		  return this;
		}
			return this.data('tokenizer', Tokenizer(this, options));
		},
		push: function(value) {
			return this.data('tokenizer').push(value);
		},
		pop: function() { 
		 	return this.data('tokenizer').pop();
		},
		empty : function( content ) { 
		 	return this.data('tokenizer').empty(); },
		get: function () {
			return this.data('tokenizer').get();
		},
		destroy: function () {
			return this.data('tokenizer').destroy();
		},
		callback: function () {
			return this.data('tokenizer').callback();
		}
	};


	// EXPORT PLUGIN
	$.fn.tokenizer = function( method ) {
		if ( methods[method] ) {
			if (!this.data('tokenizer')) { $.error('Cannot call method "'+method+'" - Tokenizer has not been initialized on this input.'); }
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tokenizer' );
		}    
  };
})(jQuery);
