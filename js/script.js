var board = [];
var boardTiles = [];
var totalTiles = 0;
var score = 0;
var highscore = 0;
var showWin = false;
var showLose = false;


(function () {
// initializes touch and scroll events
    var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
 
    // handles swipe up and swipe down
    $.event.special.swipeupdown = {
        setup: function () {
            var thisObject = this;
            var $this = $(thisObject);
 
            $this.bind(touchStartEvent, function (event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ],
                        origin: $(event.target)
                    },
                    stop;
 
                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
 
                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };
 
                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
 
                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function (event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };
 
//Adds the events to the jQuery events special collection
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function (event, sourceEvent) {
        $.event.special[event] = {
            setup: function () {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });
 
})();

function addTile(){
	var addToTile = Math.floor(Math.random() * (16-totalTiles));
	console.log('totalTiles');
	var count = 0;
	for (var i=0; i<4; i++){
		for (var j=0; j<4; j++){
			if (board[i][j] == 0){
				if (count == addToTile){
					board[i][j] = 2;
					$('#tile-container').append('<div class="r'+(j+1)+' c'+(i+1)+' game-tile tile2">2</div>');
					boardTiles[i][j] = $('.r'+(j+1)+'.c'+(i+1));
					totalTiles ++;
				}
				count ++;
			}
		}
	}
}

function prepareBoard(){
	console.log('prepare');
	highscore = 0;
	totalTiles = 0;
	$('#tile-container').html('');
	score = 0;
	$('#score').html(0);
	board = [];
	boardTiles = [];
	for (var i=0; i<4; i++){
		board.push([]);
		boardTiles.push([]);
		for (var j=0; j<4; j++){
			board[i].push(0);
			boardTiles[i].push(null);
		}
	}
	addTile();
	addTile();
	$('#score').html(score);
}

function doubleVal(tile){
	if (tile != null){
		if (tile.hasClass('tile2')){
			tile.removeClass('tile2');
			tile.addClass('tile4');
			tile.html('4');
			score += 4;
		}
		else if (tile.hasClass('tile4')){
			tile.removeClass('tile4');
			tile.addClass('tile8');
			tile.html('8');
			score += 8;
		}
		else if (tile.hasClass('tile8')){
			tile.removeClass('tile8');
			tile.addClass('tile16');
			tile.html('16');
			score += 16;
		}
		else if (tile.hasClass('tile16')){
			tile.removeClass('tile16');
			tile.addClass('tile32');
			tile.html('32');
			score += 32;
		}
		else if (tile.hasClass('tile32')){
			tile.removeClass('tile32');
			tile.addClass('tile64');
			tile.html('64');
			score += 64;
		}
		else if (tile.hasClass('tile64')){
			tile.removeClass('tile64');
			tile.addClass('tile128');
			tile.html('128');
			score += 128;
		}
		else if (tile.hasClass('tile128')){
			tile.removeClass('tile128');
			tile.addClass('tile256');
			tile.html('256');
			score += 256;
		}
		else if (tile.hasClass('tile256')){
			tile.removeClass('tile256');
			tile.addClass('tile512');
			tile.html('512');
			score += 512;
		}
		else if (tile.hasClass('tile512')){
			tile.removeClass('tile512');
			tile.addClass('tile1024');
			tile.html('1024');
			score += 1024;
		}
		else if (tile.hasClass('tile1024')){
			tile.removeClass('tile1024');
			tile.addClass('tile2048');
			tile.html('2048');
			score += 2048;
			win();
		}
		if (score > highscore){
			localStorage.highscore = score;
			$('#best').html(score);
		}
		$('#score').html(score);
	}
}

function moveUp(){
	var moved = false;
	for (var i=0; i<4; i++){
		savedTile = -1;
		savedZero = -1;
		for (var j=0; j<4; j++){
			if (board[i][j] == 0){
				if (savedZero == -1){
					savedZero = j;
				}
			}
			else {

				if (savedTile != -1 && board[i][j] == board[i][savedTile]){
					doubleVal(boardTiles[i][savedTile]);
					board[i][savedTile] *= 2;
					board[i][j] = 0;
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].removeClass('r4');
					boardTiles[i][j].addClass('r'+(savedTile+1)).delay(100).remove();
					totalTiles--;
					boardTiles[i][j] = null;
					savedZero = savedTile + 1;
					savedTile = -1;
					moved = true;
					
				}
				else if(savedZero != -1){
					board[i][savedZero] = board[i][j];
					board[i][j] = 0;
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].removeClass('r4');
					boardTiles[i][j].addClass('r'+(savedZero+1));
					boardTiles[i][savedZero] = boardTiles[i][j];
					boardTiles[i][j] = null;
					savedTile = savedZero;
					savedZero += 1;
					moved = true;
				}
				else {
					savedTile = j;
					savedZero = -1;
				}
			}
		}
	}
	return moved;
}

function moveDown(){
	var moved = false;
	for (var i=0; i<4; i++){
		savedTile = -1;
		savedZero = -1;
		for (var j=3; j>=0; j--){
			if (board[i][j] == 0){
				if (savedZero == -1){
					savedZero = j;
				}
			}
			else {

				if (board[i][j] == board[i][savedTile]){
					doubleVal(boardTiles[i][savedTile]);
					board[i][savedTile] *= 2;
					board[i][j] = 0;
					boardTiles[i][j].removeClass('r1');
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].addClass('r'+(savedTile+1)).delay(100).remove();
					totalTiles--;
					boardTiles[i][j] = null;
					savedZero = savedTile - 1;
					savedTile = -1;
					moved = true;
					
				}
				else if(savedZero != -1){
					board[i][savedZero] = board[i][j];
					board[i][j] = 0;
					boardTiles[i][j].removeClass('r1');
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].addClass('r'+(savedZero+1));
					boardTiles[i][savedZero] = boardTiles[i][j];
					boardTiles[i][j] = null;
					savedTile = savedZero;
					savedZero -= 1;
					moved = true;
				}
				else {
					savedTile = j;
					savedZero = -1;
				}
			}
		}
	}
	return moved;
}

function moveLeft(){
	var moved = false;
	for (var j=0; j<4; j++){
		savedTile = -1;
		savedZero = -1;
		for (var i=0; i<4; i++){
			if (board[i][j] == 0){
				if (savedZero == -1){
					savedZero = i;
				}
			}
			else {
				if (savedTile != -1 && board[i][j] == board[savedTile][j]){
					doubleVal(boardTiles[savedTile][j]);
					board[savedTile][j] *= 2;
					board[i][j] = 0;
					boardTiles[i][j].removeClass('c2');
					boardTiles[i][j].removeClass('c3');
					boardTiles[i][j].removeClass('c4');
					boardTiles[i][j].addClass('c'+(savedTile+1)).delay(100).remove();
					totalTiles--;
					boardTiles[i][j] = null;
					savedZero = savedTile + 1;
					savedTile = -1;
					moved = true;
				}
				else if(savedZero != -1){
					board[savedZero][j] = board[i][j];
					board[i][j] = 0;
					boardTiles[i][j].removeClass('c2');
					boardTiles[i][j].removeClass('c3');
					boardTiles[i][j].removeClass('c4');
					boardTiles[i][j].addClass('c'+(savedZero+1));
					boardTiles[savedZero][j] = boardTiles[i][j];
					boardTiles[i][j] = null;
					savedTile = savedZero;
					savedZero += 1;
					moved = true;
				}
				else {
					savedTile = i;
					savedZero = -1;
				}
			}
		}
	}
	return moved;
}

function moveRight(){
	var moved = false;
	for (var j=0; j<4; j++){
		savedTile = -1;
		savedZero = -1;
		for (var i=3; i>=0; i--){
			if (board[i][j] == 0){
				if (savedZero == -1){
					savedZero = i;
				}
			}
			else {
				if (savedTile != -1 && board[i][j] == board[savedTile][j]){
					doubleVal(boardTiles[savedTile][j]);
					board[savedTile][j] *= 2;
					board[i][j] = 0;
					boardTiles[i][j].removeClass('c1');
					boardTiles[i][j].removeClass('c2');
					boardTiles[i][j].removeClass('c3');
					boardTiles[i][j].addClass('c'+(savedTile+1)).delay(100).remove();
					totalTiles--;
					boardTiles[i][j] = null;
					savedZero = savedTile - 1;
					savedTile = -1;
					moved = true;
				}
				else if(savedZero != -1){
					board[savedZero][j] = board[i][j];
					board[i][j] = 0;
					boardTiles[i][j].removeClass('c1');
					boardTiles[i][j].removeClass('c2');
					boardTiles[i][j].removeClass('c3');
					boardTiles[i][j].addClass('c'+(savedZero+1));
					boardTiles[savedZero][j] = boardTiles[i][j];
					boardTiles[i][j] = null;
					savedTile = savedZero;
					savedZero -= 1;
					moved = true;
				}
				else {
					savedTile = i;
					savedZero = -1;
				}
			}
		}
	}
	return moved;
}

function checkLose() {
	if (totalTiles == 16){
		for (var i=0; i<4; i++){
			for (var j=0; j<4; j++){
				if (board[i][j] != 0 && ((j+1 <= 3 && board[i][j] == board[i][j+1]) || (i+1 <= 3 && board[i][j] == board[i+1][j]))){
					return false;
				}
			}
		}
		lose();
		return true;
	}
	return false;
}

function win(){
	$('#win').show();
	showWin = true;
}

function lose(){
	$('#lose').show();
	showLose = true;
}

$(document).ready(function(){
	if (localStorage.highscore){
		$('#best').html(localStorage.highscore);
		highscore = localStorage.highscore;
	}
	else{
		highscore = 0;
		$('#best').html(0);
	}
	prepareBoard();

	$('#new-wrapper').click(function(){
		prepareBoard();
	});

	$('html').click(function(){
		if (showWin){
			$('#win').hide();
			showWin = false;
		}
		if (showLose){
			$('#lose').hide();
			showLose = false;
		}
	});

	$(function(){
		$(document).keyup(function(e){
			if (e.which == 38){
				if (moveUp()) addTile();
				checkLose();
			}
			else if (e.which == 40){
				if (moveDown()) addTile();
				checkLose();
			}
			else if (e.which == 39){
				if (moveRight()) addTile();
				checkLose();
			}
			else if (e.which == 37){
				if (moveLeft()) addTile();
				checkLose();
			}
		});
		$('html').on('swipeleft', function(){
			if (showWin){
				$('#win').hide();
				showWin = false;
			}
			if (showLose){
				$('#lose').hide();
				showLose = false;
			}
			if (moveLeft()) addTile();
		});
		$('html').on('swiperight', function(){
			if (showWin){
				$('#win').hide();
				showWin = false;
			}
			if (showLose){
				$('#lose').hide();
				showLose = false;
			}
			if (moveRight()) addTile();
		});
		$('html').on('swipeup', function(){
			if (showWin){
				$('#win').hide();
				showWin = false;
			}
			if (showLose){
				$('#lose').hide();
				showLose = false;
			}
			if (moveUp()) addTile();
		});
		$('html').on('swipedown', function(){
			if (showWin){
				$('#win').hide();
				showWin = false;
			}
			if (showLose){
				$('#lose').hide();
				showLose = false;
			}
			if (moveDown()) addTile();
		});
	});
});