Input Tokenizer
===============

jQuery widget that allows a user to type keywords, which will be broken up into tokens/tags and displayed separately. It's what you'd expect to see when tagging a post on Tumblr or Stack-Overflow.

My implementation is pretty simple - there are admittedly some more robust and/or customizable jQuery plugins out there that do this. Mostly, I just wanted to take a shot at doing this myself, from scratch.

Screenshot:

![A screenshot of the input form.](http://www.donmccurdy.net/sandbox/tag_editor/demo/screenshot3.png)

For a live demo, check here: http://www.donmccurdy.net/sandbox/tag_editor/demo/

- - -

To get started, here are the steps:

* First, you'll need jQuery and (very optionally) this one font that I like. Put these lines in your HTML header.

```html
    <link href='http://fonts.googleapis.com/css?family=Quicksand:300,400' rel='stylesheet' type='text/css'>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" ></script>
```

* Next, download the .CSS and .JS files from GitHub, and include them as well:

```html
    <link rel="stylesheet" type="text/css" href="input_style.css" />
    <script type="text/javascript" src="scripts.js"></script>
```

* Finally, add the input form to your page. Like this:

```html
    <div class="inputWrapper">
        <span class="tokenListLabel">Tags:</span>
        <div class="tokenList"></div>
        <input type="text" class="tokenInput" />
    </div>
```

* You're done! Mess around with the CSS if you want to restyle things a bit.

- - -

If this is a bit more basic than you need, there are some great plugins others have put together available. Try these, for starters:

* http://aehlke.github.com/tag-it/ (recommended)
* http://xoxco.com/projects/code/tagsinput/
* http://loopj.com/jquery-tokeninput/
* http://tagedit.webwork-albrecht.de/

- - -

Created by Don McCurdy. Do feel free to use this for whatever you want, although I'd appreciate it if you'd either cite me or let me know if you find a cool use for my code. Thanks! 
