$(document).ready(function(){
	document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
	console.log("ready");
	$('#main').on('swipedown',function(){alert('test');$('#main').append("swipedown..");} );
	$('#main').on('swipeup',function(){$('#main').append("swipeup..");} );
});