$(document).ready(function(){
	$('.sb-search-input').keyup(function (event){
		if ($('.results').css('display') == 'none'){
			if (event.which == 13 || event.keyCode == 13) {

			}
			else {
				$(".results").slideDown();
			}
		}
		else {
			if (event.which == 13 || event.keyCode == 13){
				$(".results").slideUp(); 
			}
			if (event.keyCode == 46 || event.keyCode == 8){
				if ($.trim($('.sb-search-input').val()) == ''){
					$(".results").slideUp();
				}
			}
		}
	});
});
