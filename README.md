Input Tokenizer
===============

jQuery plugin that stylizes an input and allows a user to type keywords, which will be broken up into tokens/tags and displayed separately. It's what you'd expect to see when tagging a post on Tumblr or Stack-Overflow.

Mostly, I just wanted to take a shot at doing this myself, from scratch.

Screenshot:

![A screenshot of the input form.](http://www.donmccurdy.net/sandbox/tag_editor/demo/screenshot3.png)

For a live demo, check here: http://www.donmccurdy.com/sandbox/tag_editor/demo/

- - -

To get started, here are the steps:

* First, you'll need jQuery and my plugin. jQuery should be included first, and the path to the plugin will depend on where you put it. For example, put this in the <head></head> tags of your HTML:

```html
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
	<script type="text/javascript" src="tokenizer.js"></script>
```

* Next, copy my sample CSS or tweak it to your needs, then include it as well:

```html
	<link rel="stylesheet" type="text/css" href="input_style.css" />
```

* Finally, call the plugin on your input(s). If you've added the ".myTokenInput" class to yours, you might do something like this:

```html
	<script type="text/javascript">
		var tokenInput = $('input.myTokenInput').tokenizer({ /* options */ });
	</script>
```

* You're done! Mess around with the CSS if you want to restyle things a bit.

* If you need to do real work with this plugin, you'll probably want to know the methods and options. Here they are:

```javascript
	// Initialize with default options
	$(input).tokenizer({});

	// Default options:
	{
		xContent: '&times;', // content of the delete button
		namespace: 'tknz', // used as CSS prefix and event namespace
		label: 'Tags:', // label at top of input
		separators: [',', ' ', '.'], // trigger characters to separate tokens. Use [',', '.'] to allow multiple words per tag.
		callback: null // function to call when the token list changes. The $(input) element is included as a parameter.
	}

	// Initialize with some custom options:
	var options = {
		label: 'Genres:',
		callback: function (input) {
			alert('Your genres: ' + input.tokenizer('get').join(', ') + '.');
		}
	}
	$(input).tokenizer(options);
	
	// Get list of tokens
	var list = $(input).tokenizer('get'); 	// ['unsought','stuffed','dogs']

	// Manually add a token
	$(input).tokenizer('push', 'YOLO'); // adds 'YOLO' as a token.

	// Get the most recent token
	var lastToken = $(input).tokenizer('pop'); // returns last token in list.
	
	// Clear the input
	$(input).tokenizer('empty'); // token list is now empty.

	// Un-tokenize the input (returns everything to pre-plugin state)
	$(input).tokenizer('destroy'); // just an everyday input now.

	// Manually trigger the callback function
	$(input).tokenizer('callback'); // triggers provided callback, if any.


```

- - -

If this isn't what you need, there are other great ones out there. Try these, for starters:

* http://aehlke.github.com/tag-it/ (recommended)
* http://xoxco.com/projects/code/tagsinput/
* http://loopj.com/jquery-tokeninput/
* http://tagedit.webwork-albrecht.de/

- - -

Created by Don McCurdy. Do feel free to use this for whatever you want, although I'd appreciate it if you'd cite me in the comments. Or let me know if you find a cool use for my code. Thanks! 
