$(function(){ 
	function htmlEncode(value) {
		//create a in-memory div, set it's inner text(which jQuery automatically encodes)
		//then grab the encoded contents back out.  The div never exists on the page.
		return $('<div/>').text(value).html();
	}
	
	function htmlDecode(value) {
		return $('<div/>').html(value).text();
	}
	function cursorAnimation() {
		$("#cursor").animate({
			opacity: 0
		}, 'fast', 'swing').animate({
			opacity: 1
		}, 'fast', 'swing');
	}

	if ($.browser.webkit) {
		$("body").addClass("webkit-body");
	}

	var txtInput = $("#txtInput");
	var main = $('#main');
	var console = $('#console');
	var input = $("#input");
	var cursor = $("#cursor");

	function moveCursor() {
		// move input and cursor to the bottom
		console.append(input);
		console.append(cursor);

		// animate scrolling to the bottom of the div
		console.animate({ scrollTop: console[0].scrollHeight+22 }, 1000);
	}
	function updateCursor() {
		// clear inputs
		txtInput.val('');
		input.html('#&nbsp;&nbsp;');

		moveCursor();
	}
	function scrollToBottom() {
		// animate scrolling to the bottom of the div
		console.scrollTop(console[0].scrollHeight+22);
	}
	function resize() {
		var h = window.innerHeight - 20;
		var w = window.innerWidth - 20;
		main.width(w).height(h);
		console.width(w + 20).height(h+20);
		scrollToBottom();
		txtInput.focus();
	}
	$(window).resize(function () {
		resize();
	});
	resize();
	updateCursor();

	// prevent lost focus
	txtInput.blur(function () {
		setTimeout(function () { txtInput.focus(); }, 0);
	}).focus();

	function processInput()
	{
			var inp = txtInput.val().split(" ");
			var tokens = inp.length;
			var firstarg = inp[0].toLowerCase();
			if (firstarg == "new" || firstarg == "login") {

				if (tokens > 2) {
					var c = '*'; // bullet
					var n = inp[2].length;
					for (var e = ''; e.length < n; )
						e += c;

					inp[2] = e;
				}
			}
			var out = '';
			for (var i = 0; i < tokens; i++) {
				out += htmlEncode(inp[i]) + '&nbsp;';
			}
			input.html('#&nbsp;' + out);
			scrollToBottom();

			// move caret
			//var caretPos = txtInput.caret().start;
			var len = txtInput.val().length;
			txtInput.caret(len, len);
			//cursor.position("left: " + caretPos + "px");
	}

	// start a timer so we can force update if the user is holding down a key.
	var keyDownTimeout;
	var keyDownInterval;
	txtInput.keydown(function () {
		keyDownTimeout = window.setTimeout(function() {
			keyDownInterval = window.setInterval(function() {
				processInput(); 
			},250);
		}, 300);
	});

	// on start focus on input box. on enter click submit
	txtInput.keyup(function (e) {
		window.clearTimeout(keyDownTimeout); // clear keydown
		window.clearInterval(keyDownInterval);

		if (e.keyCode == 13) {

			// prevent null entries
			var inp = txtInput.val().trim();
			if (inp.length  > 0) {		
				debugger;		
				console.append(('<p>you said: '+ inp +'</p><p></p>'));
				updateCursor();					
			}
		}
		else {
			processInput();
		}
	});

	// cursor animation
	setInterval(cursorAnimation, 600);		
});