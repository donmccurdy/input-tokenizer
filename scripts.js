// Author: Don McCurdy
// Date: July, 2012


/*********** INITIALIZATION ************/
 
$(document).ready(function() {  
    $('input[type="text"]').parent().addClass("idleField"); 

    /*********** FOCUS/BLUR INPUTS ************/

    $('input[type="text"]').focus(function() {  
        $(this).parent().removeClass("idleField").addClass("focusField"); 
    });  
    $('input[type="text"]').blur(function() { 
    	addToken($(this), $(this).parent());
    	addToken($(this), $(this).parent());
        $(this).parent().removeClass("focusField").addClass("idleField");
    }); 
    
    /*********** OTHER EVENT BINDINGS ************/
    
    //When containing div is clicked, focus on the actual input element
    $('.inputWrapper').click(function() {
		$(this).children('.tokenInput').focus();
	});

	//When key is lifted, check and parse any new words
	$('.tokenInput').bind('keyup', function(event) { 
		if (event.which == 13 || event.which == 188 || event.which == 32) {
			if (this.value.length > 0) { addToken($(this), $(this).parent()); }
		} 
	});
	
	//Delete previous tag when backspace is pressed in empty input
	$('.tokenInput').bind('keydown', function(event) {
		if (event.which == 8 && ! this.value) {
			$(this).parent().children('.tokenList').children().last().remove();
		}
	});

});

/*********** FUNCTIONS ************/

function appendToken(text, wrapper) {
	wrapper.children(".tokenList").append($("#tokenTemplate").clone().attr("id", "").children(".tokenLabel").append(text).parent());
}

function addToken(input, wrapper) {
	if (input.val() != "") {
		input.attr("value", input.val().replace(/[ ,\n]+/g, " ").trim());
		var	tokens = input.val().split(" ");
		for (i = 0; i < tokens.length - 1; i++) {
			appendToken(tokens[i], wrapper)
		}
		if (tokens.length > 1) {
			input.attr("value",tokens[tokens.length - 1]);
		} else {
			appendToken(tokens[tokens.length - 1], wrapper);
			input.attr("value","");
		}
	}
}

function removeToken(item) {
	item.parent().remove();
}

