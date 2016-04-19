Tag / Token Input
===============

*Features*: Optional autosuggest, custom callbacks, easy setup, custom CSS prefixing.

*Demo*: [donmccurdy.github.io/input-tokenizer/](https://donmccurdy.github.io/input-tokenizer/)

*Size*: 1.7kb gzipped, 4.1kb minified.

*Dependencies*: jQuery 1.8-2.0+. (I haven't tested below 1.8, but it might work...)

jQuery plugin that stylizes an input and allows a user to type keywords, which will be broken up into tokens/tags and displayed separately. It's what you'd expect to see when tagging a post on Tumblr or Stack-Overflow. Mostly, I just wanted to do this myself, from scratch.

Screenshot:

![A screenshot of the input form.](https://cloud.githubusercontent.com/assets/1848368/7214289/eec96300-e559-11e4-92f2-3859b9f3fc00.png)

## Getting Started

To get started, here are the steps:

* First, you'll need jQuery and my plugin. jQuery should be included first,
and the path to the plugin will depend on where you put it.
For example, put this between the \<head\>\</head\> tags of your HTML:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
<script type="text/javascript" src="tokenizer.js"></script>
```

* Next, copy my sample CSS or tweak it to your needs, then include it as well:

```html
<link rel="stylesheet" type="text/css" href="input_style.css" />
```

* Finally, call the plugin on your input at the end of your \<body\>\</body\> tag
contents or once the page has loaded. If you've added the ".myTokenInput" class
to yours, you might do something like this:

```html
<script type="text/javascript">
	var tokenInput = $('input.myTokenInput').tokenizer({ /* options */ });
</script>
```

* You're done! Mess around with the CSS if you want to restyle things a bit.

## Methods and Options

* If you need to do real work with this plugin, you'll probably want to know the
methods and options. Here they are:

```javascript
// Initialize with default options
var $input = $(input).tokenizer({});

// Initialize with some custom options:
var options = {
	/* custom options here */
}
$input2 = $(input2).tokenizer(options);

```

Available options:

```javascript
{
	source: null, 	// autosuggest options. May be an array or a function.
					// If a function is given, it should take two parameters:
					// the first will be the input word, the second is a function which should be called
					// with a list of terms to suggest. (If you're using Ajax, call this function after your
					// response from the server is received, passing an array as the only parameter.)

	allowUnknownTags: true, // if false, prevents user from creating tags not on the autosuggest list
	numToSuggest: 5, //number of options to show in autosuggest list. If 0, all results are shown.


	xContent: '&times;', 	// content of the delete button
	namespace: 'tknz', 		// used as class prefix for your CSS-styling pleasure.
	label: 'Tags:', 		// label at top of input
	placeholder: '', 		// placeholder text shown inside the input


	separators: [',', ' ', '.'],	// trigger characters to separate tokens.
				  					// 	Use [',', '.'] to allow multiple words per tag.

	callback: function ($input) {}, 	// function to call when the token list changes.

	onclick: function (word) {} 	// Function to call when a token is clicked.
									// Token text is passed as only parameter.
}
```


Available methods:

```javascript

// 'get' - return list of tokens
var list = $input.tokenizer('get'); 	// ['unbought','stuffed','dogs']

// 'push' - Manually add a token
$input.tokenizer('push', 'YOLO'); // adds 'YOLO' as a token.

// 'pop' - Get the most recent token
var lastToken = $input.tokenizer('pop'); // returns last token in list.

// 'remove' - Manually remove a token
$input.tokenizer('remove', 'YOLO'); // removes 'YOLO' from list.

// 'empty' - Clear the input
$input.tokenizer('empty'); // token list is now empty.

// 'destroy' - Un-tokenize the input (returns everything to pre-plugin state)
$input.tokenizer('destroy'); // just an everyday input now.

// 'callback' - Manually trigger the callback function
$input.tokenizer('callback'); // triggers provided callback, if any.
```

## Other Notes

If this isn't what you need, there are other great options out there. Try these:

* http://aehlke.github.com/tag-it/ (recommended)
* http://xoxco.com/projects/code/tagsinput/
* http://loopj.com/jquery-tokeninput/
* http://tagedit.webwork-albrecht.de/

## Contributors

- Don McCurdy
- Adam Skowron
- Bob Frost

## Open Source License

The MIT License (MIT)
Copyright (c) 2013 Don McCurdy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
