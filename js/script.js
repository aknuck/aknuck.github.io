$(document).ready(function(){
	console.log("ready");
	$('#main').on('swipedown',function(){$('body').append("swipedown..");} );
	$('#main').on('swipeup',function(){$('body').append("swipeup..");} );
});