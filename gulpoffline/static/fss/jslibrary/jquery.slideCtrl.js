//메인화면 비주얼 슬라이드 
jQuery.fn.slideCtrl = function(options, configs) {

	opt = jQuery.extend({
		photo_list       : jQuery(this).find(".area li"),
		photo_list_left  : jQuery(this).find(".prev"),
		photo_list_right : jQuery(this).find(".next"),
		photo_list_play  : jQuery(this).find(".play"),
		photo_list_stop  : jQuery(this).find(".stop"),
		photo_list_current_p : 0,
		FXconfig:true,
		d_time:3000,
		debug:false
		},options);

	var photo_list = opt.photo_list;
	// console.log(photo_list)
	var photo_list_left=opt.photo_list_left;
	var photo_list_right = opt.photo_list_right;
	var photo_list_play=opt.photo_list_play;
	var photo_list_stop=opt.photo_list_stop;
	var photo_list_current_p=opt.photo_list_current_p;
	var FXconfig=opt.FXconfig;
	var d_time=opt.d_time;
	var debug=opt.debug;

	var photo_paging = jQuery(photo_list).length;
	var clearenter;
	// photo_list_play.hide();
	photo_list.find('.view').hide();
	jQuery(photo_list[0]).find('.view').show();
	for ( var i = 0 ; i < photo_paging ; i ++ )
	{
		// jQuery(photo_list[i]).show()
	}
	currentItem = jQuery(photo_list[photo_list_current_p]).find('.view')
	nextItem = jQuery(photo_list[photo_list_current_p]).find('.view')

	photo_list.find('.num').on('click keyup mouseenter' , function(){ //팝업리스트 아이콘
		var i = photo_list_current_p
		photo_list_current_p = jQuery(photo_list).find('.num').index(this);
		if (photo_list_current_p != i){
		clearInterval(clearenter);
		ctrlStop();
		currentItem = $(this).parents('ul').find('.on .view');// 액션이전의 데이터
		nextItem=jQuery(photo_list[photo_list_current_p]).find('.view')
		CrossFade(currentItem,nextItem);
		// console.log(photo_list_current_p);
		}
		return false;
	})



	function leftViewPlay (argument) {
		clearInterval(clearenter)
		ctrlStop()
		if (photo_list_current_p <= 0)
		{
			photo_list_current_p = jQuery(photo_list).length-1
			currentItem = jQuery(photo_list[0]).find('.view')
			nextItem = jQuery(photo_list[jQuery(photo_list).length-1]).find('.view')
		}else{
			photo_list_current_p -= 1
			currentItem = jQuery(photo_list[photo_list_current_p+1]).find('.view')
			nextItem = jQuery(photo_list[photo_list_current_p]).find('.view')
		}
		CrossFade(currentItem,nextItem);
	}
	function rightViewPlay(){
		clearInterval(clearenter);
		ctrlStop()
		photo_list_current_p += 1
		if ( photo_list_current_p > photo_paging-1)
		{
			photo_list_current_p = 0
			currentItem = jQuery(photo_list[jQuery(photo_list).length-1]).find('.view')
			nextItem = jQuery(photo_list[0]).find('.view')
		}else{
			currentItem = jQuery(photo_list[photo_list_current_p-1]).find('.view')
			nextItem = jQuery(photo_list[photo_list_current_p]).find('.view')
		}
		CrossFade(currentItem,nextItem);
	}
	photo_list_right.on('click' , function(){
		rightViewPlay();
	})
	photo_list_left.on('click' , function(){
		leftViewPlay();
	})
	photo_list_play.on('click',function(){
		clearInterval(clearenter);
		clearenter = setInterval(photolist_play,d_time);
		// jQuery(this).hide();
		// photo_list_stop.show();
		photo_list_stop.focus();
	})
	photo_list_stop.on('click',function(){
		clearInterval(clearenter);
		ctrlStop();
		photo_list_play.focus();
	})
	function ctrlStop(){
		// photo_list_stop.hide();
		// photo_list_play.show();
	}
	function CrossFade(currentItem,nextItem){
		if (FXconfig)
		{
			if (debug) {console.log(currentItem.html(),nextItem.html())}
			jQuery(currentItem).css({
				display:'block',
				opacity:1,
				zIndex:51
			}).stop().animate({opacity: 0},1000,function(){
					$(this).hide();
				});
			jQuery(nextItem).stop().css({
				display:'block',
				opacity:1,
				zIndex:50
			})
		}else{
			jQuery(currentItem).stop().css({
				display:'none',
				opacity:1,
				zIndex:51
			});
			jQuery(nextItem).stop().css({
				display:'block',
				opacity:1,
				zIndex:50
			})
		}
		classCtrl();
	}
	function classCtrl(){
		photo_list.removeClass("on");
		jQuery(photo_list[photo_list_current_p]).addClass("on");
		// mobileVisualPosition();
	}
	function photolist_play(){
		if (photo_list_current_p < photo_paging-1)
		{
			photo_list_current_p +=1
			currentItem = jQuery(photo_list[photo_list_current_p-1]).find('.view')
			nextItem = jQuery(photo_list[photo_list_current_p]).find('.view')
		}else{
			photo_list_current_p = 0
			currentItem = jQuery(photo_list[photo_paging-1]).find('.view')
			nextItem = jQuery(photo_list[photo_list_current_p]).find('.view')
		}
		CrossFade(currentItem,nextItem);

	}
	// clearenter = setInterval(photolist_play,d_time)

	return {
			left: function() {
				leftViewPlay();
			},
			right:function(){
				rightViewPlay();
			}
		}
};