// Input Tokenizer
// Author: Don McCurdy

(function (factory) {
	if(typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = factory(require('jquery'), window);
	} else {
		factory(jQuery, window);
	}
}(function ($, window, undefined) {
	var tokenizer = 'tokenizer';

	var Tokenizer = function (argElement, argOpts) {

		// PRIVATE VARS
		var
		input,
		list,
		wrap,
		suggestions,
		eventQueue = $({}),
		options = $.extend({
			xContent: '&times;',
			namespace: 'tknz',
			label: 'Tags:',
			placeholder: '',
			separators: [',', ' ', '.'],
			callback: null,
			source: null,
			selectedKeys: null,
			allowUnknownTags: true,
			numToSuggest: 5,
			onclick: null,
			allowDuplicates: false,
			suggestDuplicates: false,
			allowFullSearch: true,
			fullSearchChar: '*'
		}, argOpts);

		// PRIVATE METHODS
		var init, buildHTML, bindEvents, push, pop, remove, get, empty,
		destroy, callback, suggest, getMatch, tryPush, escapeRegExp;

		init = function () {
			input = argElement;
			buildHTML();
			bindEvents();
			displaySelectedElements();
		};
		buildHTML = function () {
			var ns = options.namespace;
			list = $('<div class="'+ns+'-list"></div>');
			if (options.placeholder) { input.attr('placeholder', options.placeholder); }
			suggestions = $('<div class="'+ns+'-suggest"><ul></ul></div>');
			wrap = input
			.addClass(ns+'-input')
			.wrap('<span class="'+ns+'-input-wrapper"></span>')
			.parent()
			.wrap('<div class="'+ns+'-wrapper"></div>')
			.parent()
			.prepend(list)
			.prepend('<span class="'+ns+'-wrapper-label">'+options.label+'</span>')
			.find('.'+ns+'-input-wrapper').append(suggestions).end();
		};
		displaySelectedElements = function () {
		    if ($.isArray(options.selectedKeys)) {
		        for (var i = 0; i < options.selectedKeys.length; i++) {
		        	var key = options.selectedKeys[i];
		            if ($.isArray(options.source)) {
		            	push(key, i);
		            } else if(typeof options.source == 'object') {		            	
		            	push(options.source[key], key);
		            }
		            
		        }
		    }
		};
		bindEvents = function () {
			var ns = options.namespace;
			wrap
				.on('focus', 'input', function () {  // On focus, stylize wrapper.
					wrap.addClass(ns+'-focus');
				})
                .on('blur', 'input', function () { // On blur, un-stylize.
					wrap.removeClass(ns+'-focus');
					eventQueue.delay(200).queue().push(function () {
						// On blur, tag remaining text only if autocomplete is disabled.
						if (options.source) {
							suggest([], '');
						} else {
							tryPush(input.val());
						}
						$.dequeue(this);
					});
				}).on('keydown', 'input', function (event) { // Backspace handler.
					event = event || window.event;
					event.which = event.which || event.keyCode || event.charCode;
					if (event.which === 8 && !input.val()) {
						pop();
						callback();
						return;
					}
					var
					selectClass = ns+'-sel',
					selected = suggestions.find('.'+selectClass);

					if (event.which === 38) { // Up
						event.preventDefault();
						if (selected.length) {
							selected.removeClass(selectClass)
							.prev('li').add(selected.siblings().last()).eq(0).addClass(selectClass);
							scrollToView(selected);
						} else {
							suggestions.find('li').last().addClass(selectClass);
						}
					} else if (event.which === 40) { // Down
						event.preventDefault();
						if (selected.length) {
							selected.removeClass(selectClass)
							.next('li').addClass(selectClass);
							scrollToView(selected);
						} else {
							suggestions.find('li').first().addClass(selectClass);
						}
					}
				}).on('keypress', 'input', function (event) { // Input listener to create tokens.					
					if (options.separators.indexOf(String.fromCharCode(event.which)) > -1 || event.which === 13) {
						event.preventDefault();
						tryPush(input.val());
					}
				}).on('keyup', 'input', function (event) {
					event = event || window.event;
					event.which = event.which || event.keyCode || event.charCode;
					if (event.which === 38 || event.which === 40) { return; }
					if ($.isArray(options.source)) { // Autosuggest from list
						suggest(options.source);
					} else if(typeof options.source == 'object') {
						suggestMap(options.source);
					} else if (options.source) { // Autosuggest from function
						options.source(input.val(), suggest);
					}
				}).on('click', function () { // On click, focus the input.
					input.focus();
				}).on('click', '.'+ns+'-token-x', function (event) {
					event.stopPropagation();
					$(this).closest('.'+ns+'-token').remove();
					callback();
				}).on('mousedown', '.'+ns+'-suggest-li', function (e) {
					e.preventDefault(); // Prevent blur event
					input.val('');
					push($(this).text());
					suggest([]);
					callback();
				}).on('click', '.'+ns+'-token', function (event) {
					if (options.onclick) {
						event.stopPropagation();
						options.onclick($(this).children('.'+ns+'-token-label').text());
					}
				});
			};

			tryPush = function (value) {
				var match = getMatch();
				if (value && (options.allowUnknownTags || match)) {
					var ele = match || value;
					push(ele.text(), ele.attr('data'));
					input.val('');
					callback();
				}
				suggest([], '');
			};
			push = function (value, data) {
				var firstOccurrence = isFirstOccurrence(value, data);
	            if(options.allowDuplicates || firstOccurrence) {	            	
	            	value = value || data;   
	            	data = data || value;
					var
					ns = options.namespace,
					pre = ns+'-token',
					token = '<div class="'+pre+'" data-token="'+ data +'">'+
					'<span class="'+pre+'-label">'+value.trim()+'</span>'+
					'<span class="'+pre+'-x">'+options.xContent+'</span>'+
					'</div>';
					list.append(token);
	            }
				return input;
			};
			pop = function () {
				return list.children().last().detach().data('token') || null;
			};
			remove = function (value) {
				var tokens = list.children().filter(function() {
					return $(this).data('token') == value; // jshint ignore:line
				}).detach();
				return tokens.length > 0 ? (tokens.length === 1 ? tokens.data('token') : tokens.length) : null;
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
				if (options.placeholder) { input.attr('placeholder', ''); }
				return input.removeClass(options.namespace+'-input');
			};
			callback = function () {
				(options.callback || $.noop)(input);
				return input;
			};
			suggest = function (words, word) {
				word = word === undefined ? input.val() : word;
				var
				i,
				ns = options.namespace,
				re1 = new RegExp(escapeRegExp(word), 'i'),
				re2 = new RegExp('^'+escapeRegExp(word)+'$', 'i'),
				limit = options.numToSuggest || 1000,
				list = [];
				for (i = 0; word && i < words.length && list.length < limit; i++) {
					if ((!words[i].match(re1) && !(options.allowFullSearch && word == options.fullSearchChar))
						|| (!options.suggestDuplicates && !isFirstOccurrence(words[i], i))) { continue; }
					list.push('<li class="'+ns+'-suggest-li'+
						(words[i].match(re2) ? ' '+ns+'-sel' : '')+'">'+words[i]+'</li>');
				}
				suggestions.children('ul')
				.html(list.join(''))
				.end()
				[list.length ? 'addClass' : 'removeClass']('.'+ns+'-vis');
			};
			suggestMap = function (words, word) {
			    word = word === undefined ? input.val() : word;
			    var
                i,
                ns = options.namespace,
                re1 = new RegExp(escapeRegExp(word), 'i'),
                re2 = new RegExp('^'+escapeRegExp(word)+'$', 'i'),
                limit = options.numToSuggest || 1000,
                list = [];

                var keys = Object.keys(words);
                for (i = 0; word && i < keys.length && list.length < limit; i++) {
                    if ((!words[keys[i]].match(re1)
                        && !(options.allowFullSearch && word == options.fullSearchChar))
                        || (!options.suggestDuplicates && !isFirstOccurrence(words[keys[i]], keys[i]))) { continue; }
                    list.push('<li data="'+keys[i]+'" class="'+ns+'-suggest-li'+
                        (words[keys[i]].match(re2) ? ' '+ns+'-sel' : '')+'">'+words[keys[i]]+'</li>');
                }
                suggestions.children('ul')
                .html(list.join(''))
                .end()
                [list.length ? 'addClass' : 'removeClass'](''+ns+'-vis');
			};
			getMatch = function () {
				return suggestions.find('.'+options.namespace+'-sel').eq(0);
			};
			escapeRegExp = function (str) {
				return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			};
			isFirstOccurrence = function(str, data) {
			    var tokens = get();
			    for (var i = 0; i < tokens.length; i++) {
			        if (tokens[i] == str || tokens[i] == data) {
			            return false;
			        }
			    }
				return true;
			};
			scrollToView = function(selected) {
                parent = selected.parent();

                var selectClass = options.namespace+'-sel',
                suggestionHeight = suggestions.find('li').first().outerHeight(),
                selectedIdx = $('.'+options.namespace+'-suggest ul li.'+selectClass).index(),
                selectedOffset = selectedIdx * suggestionHeight,
                offset = selectedOffset + parent.scrollTop(),
                offset_end = offset + selected.outerHeight();

                var visible_area_start = parent.scrollTop();
                var visible_area_end = visible_area_start + parent.outerHeight();

                if (selectedOffset < visible_area_start) {
                    selected.parent()[0].scrollTop = selectedOffset;
                } else if ((selectedOffset + suggestionHeight) > visible_area_end) {
                    selected.parent()[0].scrollTop = offset_end - visible_area_end;
                }
                return true;
			};

			init (argElement);
			return {
				push: push,
				pop: pop,
				remove: remove,
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
				console.error('Tokenizer requires an <input type="text"> tag.');
				return this;
			}
			return this.data(tokenizer, Tokenizer(this, options)); // jshint ignore:line
		},
		push: function(value) {
			return this.data(tokenizer).push(value);
		},
		pop: function() {
			return this.data(tokenizer).pop();
		},
		remove: function(value) {
			return this.data(tokenizer).remove(value);
		},
		empty : function() {
			return this.data(tokenizer).empty();
		},
		get: function () {
			return this.data(tokenizer).get();
		},
		destroy: function () {
			return this.data(tokenizer).destroy();
		},
		callback: function () {
			return this.data(tokenizer).callback();
		}
	};


	// EXPORT PLUGIN
	$.fn[tokenizer] = function( method ) {
		if ( methods[method] ) {
			if (!this.data(tokenizer)) { console.error('Cannot call "'+method+'" - Tokenizer not initialized.'); }
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			console.error( 'Unknown tokenizer method ' +  method + '.' );
		}
	};

	return $.fn[tokenizer];
}));
