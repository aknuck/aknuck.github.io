
board = [];
boardTiles = [];


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

function prepareBoard(){
	for (var i=0; i<4; i++){
		board.push([]);
		boardTiles.push([]);
		for (var j=0; j<4; j++){
			board[i].push(0);
			boardTiles[i].push(null);
		}
	}
	board[1][2] = 2;
	boardTiles[1][2] = $('.r3.c2');
	board[1][3] = 2;
	boardTiles[1][3] = $('.r4.c2');
}

function increaseRow(tile){
	if (tile != null){
		if (tile.hasClass('r2')){
			tile.removeClass('r2');
			tile.addClass('r1');
		}
		else if (tile.hasClass('r3')){
			tile.removeClass('r3');
			tile.addClass('r2');
		}
		else if (tile.hasClass('r4')){
			tile.removeClass('r4');
			tile.addClass('r3');
		}
	}
}

function decreaseRow(tile){
	if (tile != null){
		if (tile.hasClass('r1')){
			tile.removeClass('r1');
			tile.addClass('r2');
		}
		else if (tile.hasClass('r2')){
			tile.removeClass('r2');
			tile.addClass('r3');
		}
		else if (tile.hasClass('r3')){
			tile.removeClass('r3');
			tile.addClass('r3');
		}
	}
}

function increaseColumn(tile){
	if (tile != null){
		if (tile.hasClass('c2')){
			tile.removeClass('c2');
			tile.addClass('c1');
		}
		else if (tile.hasClass('c3')){
			tile.removeClass('c3');
			tile.addClass('c2');
		}
		else if (tile.hasClass('c4')){
			tile.removeClass('c4');
			tile.addClass('c3');
		}
	}
}

function decreaseColumn(tile){
	if (tile != null){
		if (tile.hasClass('c1')){
			tile.removeClass('c1');
			tile.addClass('c2');
		}
		else if (tile.hasClass('c2')){
			tile.removeClass('c2');
			tile.addClass('c3');
		}
		else if (tile.hasClass('c3')){
			tile.removeClass('c3');
			tile.addClass('c3');
		}
	}
}

function doubleVal(tile){
	if (tile != null){
		if (tile.hasClass('tile2')){
			tile.removeClass('tile2');
			tile.addClass('tile4');
			tile.html('4');
		}
		else if (tile.hasClass('tile4')){
			tile.removeClass('tile4');
			tile.addClass('tile8');
			tile.html('8');
		}
		else if (tile.hasClass('tile8')){
			tile.removeClass('tile8');
			tile.addClass('tile16');
			tile.html('16');
		}
		else if (tile.hasClass('tile16')){
			tile.removeClass('tile16');
			tile.addClass('tile32');
			tile.html('32');
		}
		else if (tile.hasClass('tile32')){
			tile.removeClass('tile32');
			tile.addClass('tile64');
			tile.html('64');
		}
		else if (tile.hasClass('tile64')){
			tile.removeClass('tile64');
			tile.addClass('tile128');
			tile.html('128');
		}
		else if (tile.hasClass('tile128')){
			tile.removeClass('tile128');
			tile.addClass('tile256');
			tile.html('256');
		}
		else if (tile.hasClass('tile256')){
			tile.removeClass('tile256');
			tile.addClass('tile512');
			tile.html('512');
		}
		else if (tile.hasClass('tile512')){
			tile.removeClass('tile512');
			tile.addClass('tile1024');
			tile.html('1024');
		}
		else if (tile.hasClass('tile1024')){
			tile.removeClass('tile1024');
			tile.addClass('tile2048');
			tile.html('2048');
		}
	}
}

function moveUp(){
	savedTile = -1;
	savedZero = -1;
	for (var i=0; i<4; i++){
		for (var j=0; j<4; j++){
			console.log("cur "+board[i][j]);
			if (board[i][j] == 0){
				if (savedZero == -1){
					savedZero = j;
				}
			}
			else {

				if (board[i][j] == board[i][savedTile]){
					doubleVal(boardTiles[i][savedTile]);
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].removeClass('r4');
					boardTiles[i][j].addClass('r'+savedTile).delay(100).remove();
					boardTiles[i][j] = null;
					savedTile = -1;
					savedZero += 1;
				}
				else if(savedZero != -1){
					board[i][savedZero] = board[i][j];
					console.log(i);
					console.log(j);
					boardTiles[i][j].removeClass('r2');
					boardTiles[i][j].removeClass('r3');
					boardTiles[i][j].removeClass('r4');
					boardTiles[i][j].addClass('r'+(savedZero+1));
					boardTiles[i][savedZero] = boardTiles[i][j];
					boardTiles[i][j] = null;
					savedTile = savedZero;
					savedZero += 1;
				}
				else {
					savedTile = j;
					savedZero = -1;
				}
			}
			/*	board[i][j] = board[i][j+1];
				board[i][j+1] = 0;
				boardTiles[i][j] = boardTiles[i][j+1];
				increaseRow(boardTiles[i][j+1]);
			}
			else if (board[i][j] == board[i][j+1]){

				board[i][j] = board[i][j+1]*2;
				board[i][j+1] = 0;
				doubleVal(boardTiles[i][j]);
				increaseRow(boardTiles[i][j+1]);
			}*/
		}
	}
}

$(document).ready(function(){
	prepareBoard();
	$(function(){
		$('html').on('swipeleft', function(){
			alert('left');
		});
		$('html').on('swiperight', function(){
			alert('right');
		});
		$('html').on('swipeup', function(){
			moveUp();
		});
		$('html').on('swipedown', function(){
			alert('down');
		});
	});
});



