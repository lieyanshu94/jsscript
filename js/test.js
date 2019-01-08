$(function () {
	$(".modal_body .left .list div").bind("click",function(){
		var $div = $(this);
		var dival = $div.text();
		var $content = $(".content");
		$(".modal_body").find(".title").each(function(index){
			var $title = $(this);
			var titval = $title.find("div").text();
			if (dival == titval) {
				$content.scrollTop($title.offset().top);
			}
		});
	})
})