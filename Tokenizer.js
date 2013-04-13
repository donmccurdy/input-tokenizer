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
  			options = $.extend({
  				foo: 'bar',
  				classSpace: 'tknz',
  				eventSpace: 'tknz',
  				label: 'Tags:',
  				separators: [13,188,32]
  			}, argOpts);

		// PRIVATE METHODS
  		var init, buildHTML, bindEvents, push, pop, get, empty, destroy;

  		init = function () {
  			input = argElement;
  			buildHTML();
  			bindEvents();
  		};
  		buildHTML = function () {
  			// classSpaceing!
  			wrap = $('<div class="inputWrapper"></div>');
  			list = $('<div class="tokenList"></div>');
  			input.wrap(wrap);
  			wrap
  				.prepend(list)
  				.prepend('<span class="tokenListLabel">'+options.label+'</span>');
  		};
  		bindEvents = function () {
  			wrap.on('focus.'+options.eventSpace, 'input', function () {
  				wrap.addClass('focusField');
  			}).on('blur.'+options.eventSpace, 'input', function () {
  				wrap.removeClass('focusField');
  			}).on('keyup.'+options.eventSpace, 'input', function (event) {
  				if (options.separators.indexOf(event.which) > -1 && input.val()) {
					push(input.val());
					input.val('');
  				} else if (event.which === 8 && !input.val()) {
  					pop();
  				}
  			}).on('click.'+options.eventSpace, function () {
  				input.focus();
  			});
  		};
  		push = function (value) {
  			list.append('<div class="tokenLabel">'+value+'</div>');
  			return input;
  		};
  		pop = function () {
  			return list.children().last().remove().html();
  		};
  		empty = function () {
  			list.empty();
  			return input;
  		};
  		get = function () {
  			return [1,3,4];
  		};
  		destroy = function () {
  			wrap.off('.'+options.eventSpace);

  			return input;
  		};

  		
  		init (argElement);
  		return {
  			push: push,
  			pop: pop,
  			empty: empty,
  			get: get,
  			destroy: destroy
  		};
  	};


	// PUBLIC METHODS
  	var methods = {
	   init: function( options ) { 
	   	// check that this[0].nodeName === 'INPUT'
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
	   }
  	};


  	// EXPORT PLUGIN
  	$.fn.tokenizer = function( method ) {
	   if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	   } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	   } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.tokenizer' );
	   }    
  };
})(jQuery);