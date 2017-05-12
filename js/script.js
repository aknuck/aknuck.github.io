$(document).ready(function(){
	document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
	console.log("ready");
	$('#main').on('swipedown',function(){$('body').append("swipedown..");} );
	$('#main').on('swipeup',function(){$('body').append("swipeup..");} );
});