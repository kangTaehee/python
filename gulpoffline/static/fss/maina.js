var ismobile = false;
if (window.innerWidth < 1024) {
	ismobile = true;
}
$(window).resize(function () {
	if (window.innerWidth < 1024) {
		ismobile = true;
	} else {
		ismobile = false;
	}
});

function gridAutoFlow(target) {
	// var items = $('.depth2');
	var items;
	if (typeof target == 'string') {
		items = $(target);
	} else {
		items = target;
	}
	items.each(function () {
		if ($(this).attr('id') == 'nav200353') {
			// "국가중앙센터" 메뉴는 스타일에서만 처리됨.
			return false;
		}
		_this = $(this);
		var item;
		item = _this.find('.set>ul>li');
		var sl = item.innerWidth();
		var h = 0;
		var x = 0;
		var y = 0;
		for (var index = 0; index < item.length; index++) {
			item.eq(index).innerHeight();
			h += item.eq(index).innerHeight();
			var _parentH = _this.find('.set>ul').innerHeight();
			if (_parentH != 0) _parentH -= 10;
			if (h <= (_parentH || _this.innerHeight() - 10)) {
				y = h - item.eq(index).innerHeight();
				if (index == 0) {
					y = 0;
				}
			} else {
				h = item.eq(index).innerHeight();
				x += item.eq(index - 1).innerWidth();
				y = 0;
			}
			if (index == 0) {
				// console.log(index)
				x = 0;
				y = 0;
			}
			item.eq(index).css({
				top: y,
				left: x,
			});
		}
	});
}
$(function () {
	// 키보드 마우스 오버 대응 포커스
	$('.js-hover').bind('focus', function (e) {
		$(this).addClass('hover').siblings().removeClass('hover');
	});
	$('.js-hover').hover(
		function () {
			// over
			$(this).addClass('hover').siblings().removeClass('hover');
		},
		function () {
			// out
			$(this).removeClass('hover');
		}
	);
	// 라디오 버튼 스타일
	$('input:radio.d')
		// .not('.sm')
		// .not('.c')
		.each(function (index, element) {
			// element == this
			$(this).addClass('d');
			// console.log($(this).next()[0].tagName)
			$(this).after('<i>');
			if ($(this).next()[0].tagName != 'I') {
			}
		});

	$('.js-active').click(function (e) {
		$(this).addClass('active').attr('title', '선택됨').parent().siblings().find('.js-active').removeClass('active').removeAttr('title');
	});
});
var LayoutGo2Top = (function () {
	var handle = function () {
		// console.log("currentWindowPosition")
		var currentWindowPosition = $(window).scrollTop(); // current vertical position

		if (currentWindowPosition > 300) {
			$('.gotoTop').show();
		} else {
			$('.gotoTop').hide();
		}
	};
	return {
		init: function () {
			if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
				$(window).bind('touchend touchcancel touchleave', function (e) {
					handle();
				});
			} else {
				$(window).scroll(function () {
					handle();
				});
			}
			$('.gotoTop').on('click', function (e) {
				e.preventDefault();
				$('html, body').animate(
					{
						scrollTop: 0,
					},
					600
				);
			});
		},
	};
})();

$(function () {
	$(window).on('load', function () {
		gridAutoFlow('.depth2'); // 초기 메뉴 활성화 요청시 세팅함.
	});
	// gnb pc 마우스 이벤트
	$('#gnb .set>ul>li').mouseover(function () {
		$(this).addClass('active').siblings().removeClass('active');
		gridAutoFlow($(this).find('.depth2'));
	});
	$('#gnb .depth2').mouseleave(function () {
		$(this).parent().removeClass('active');
	});

	$('#gnb .set>ul>li>a').focus(function (e) {
		$(this).parent().addClass('active').siblings().removeClass('active');
		gridAutoFlow($(this).parent().find('.depth2'));
	});

	var mobileNav = $('#mobile-gnb');
	$(mobileNav)
		.find('.depth1 a')
		.click(function (e) {
			if ($(this).parent().find('>div,>ul').length > 0) {
				e.preventDefault();
				$(this).parent().toggleClass('on');
			}
		});

	$('.mobile-gnb-close').click(function (e) {
		e.preventDefault();
		mobileNav.removeClass('active');
	});

	$('.all-nav-toggle').click(function (e) {
		e.preventDefault();
		if (ismobile == false) {
			$('#all-gnb').toggleClass('active');
			// console.log('all-nav-toggle', ismobile);
		} else {
			mobileNav.toggleClass('active');
			// console.log('all-nav-toggle', ismobile);
		}
	});

	LayoutGo2Top.init();
	$('.menuNavOpener').on('click', function () {
		$(this).parent().toggleClass('menuNavOpen');
		if ($(this).parent().hasClass('menuNavOpen')) {
			$(this).find('.hidden').text('메뉴 닫기');
		} else {
			$(this).find('.hidden').text('메뉴 열기');
		}
	});

	var sTop;
	function goToScroll() {
		sTop = $(window).scrollTop();
		//console.log(sTop);
		/*if(sTop > 85){
      $("#header").addClass("onFixed");
    }else{
      $("#header").removeClass("onFixed");
    }*/
	}

	$('#gotoTop').bind('click', function () {
		$(window).animate({ scrollTop: 0 }, 500);
	});

	$(window).on('scroll', function () {
		goToScroll();
	});
	goToScroll();

	function throttle(method, scope) {
		clearTimeout(method.tId);
		method.tId = setTimeout(function () {
			method.call(scope);
		}, 50);
	}
	function resizeDiv(event) {
		//모바일 경우
		if (window.innerWidth < 768) {
		} else if (window.innerWidth < 1000) {
		}
		gridAutoFlow('#gnb .active .depth2');
	}

	throttle(resizeDiv); //초기실행
	window.onresize = function () {
		throttle(resizeDiv);
	};
});

// 테이블 모바일 스타일 - 해딩 th td안에 타이틀 추가]
$('.bd-list').each(function () {
	_this = $(this);
	$(this)
		.find('tbody tr')
		.not('._noData')
		.each(function () {
			for (var index = 0; index < $(this).find('td').length; index++) {
				// console.log(_this.find('thead th').eq(index).text())

				var _temptxt = '<span class=mobile>' + _this.find('thead th').eq(index).text() + '</span>';
				td = $(this).find('td').eq(index);
				if (!td.hasClass('_nocustom')) {
					td.html(_temptxt + '<div class=cell>' + td.html() + '</div>');
				}
			}
		});
});

$(document).ready(function () {
	$('.content-ctrl button.print').on('click', function () {
		window.print();
	});
	// ovy 스크롤 영역 포커스 추가
	$('.ovy').each(function (index, element) {
		if ($(this).attr('tabindex') != '0') {
			$(this).attr('tabindex', 0);
		}
	});
	$(window).scroll(function () {
		// 연혁 아이콘
		if ($('.history').length > 0) {
			if (Utils.isElementHide('.depth4-tab', 'tophide')) {
				var top = $(window).scrollTop() - $('.history').offset().top + 103;
				$('.history>i').css('top', top);
			} else {
				$('.history>i').removeAttr('style');
			}
			if (Utils.isElementHide('.history', 'bottomhide', -163)) {
				$('.history>i').addClass('bottom-fix');
			} else {
				$('.history>i').removeClass('bottom-fix');
			}
		}

		// gnb stiky
		var h = 80;
		if ($('.ad-pop:visible').height() != null) {
			h += $('.ad-pop:visible').height();
		}
		if ($(window).width() < 1024) {
			h = $('.ad-pop:visible').height();
		}
		if ($(window).scrollTop() > h) {
			$('body').addClass('gnb-stiky');
		} else {
			$('body').removeClass('gnb-stiky');
		}

		// top버튼 이동 제어
		if (Utils.isElementHide('.footer-sitemap', 100)) {
			var _top = $('.footer-sitemap').offset().top - 20 - 51;
			$('.wrap-top a').addClass('fix').css('top', _top);
		} else {
			$('.wrap-top a').removeClass('fix').removeAttr('style');
		}
	});
	$('#content a').each(function (index, element) {
		// element == this
		if ($(this).attr('target') == '_blank' && $(this).attr('title') != '') {
			$(this).attr('title', '새창열림');
		}
	});
});

/*
 * Function Name : popupW
 * Description   : 팝업창 띄운다
 * Parameters    : u - 주소, n - 이름, w - 넓이, h - 높이, s - 스크롤여부(yes, no), r - 창크기조절여부(yes, no), m - (1:일반, 2:위쪽모서리, 3:정중앙)
 */
function popupW(u, n, w, h, s, r, m) {
	var o;
	var lP = screen.availWidth;
	var tP = screen.availHeight;
	var p = '';

	if (s == undefined) s = 'no';
	if (m == undefined) m = 1;

	if (m == 2)
		//- 위쪽모서리
		p = ',left=0,top=0';
	else if (m == 3)
		//- 정중앙
		p = ',left=' + (lP - w) / 2 + ',top=' + (tP - h) / 2;

	o = window.open(u, n, 'status=yes,toolbar=no,location=no,scrollbars=' + s + ',resizable=' + r + ',width=' + w + ',height=' + h + p);
	o.focus();
}

// if (!console)
// console = {log: function() {}};
// console = {warn: function() {}};
var currentMainSection = 0;
var mainSection = $('.wheel');
var mainSectionMoveing = function (direction) {
	mainSection.each(function (index, element) {
		// element == this
		if ($(this).offset().top > $(window).scrollTop() && Utils.isElementInView($(this), 50)) {
			currentMainSection = index;
		}
	});
	if (direction == 'down' && currentMainSection < 4) {
		currentMainSection++;
	} else if (direction == 'up' && currentMainSection > 0) {
		currentMainSection--;
	}
	$('html, body')
		.stop()
		.animate({ scrollTop: mainSection.eq(currentMainSection).offset().top }, 650);
};

// 휠 컨트롤
var whellTimer;
$('#wrap').on('wheel', function (event) {
	// console.log(event.target)
	if ($(event.target).parents('.fsite').length) return;

	if (!ismobile) {
		event.preventDefault();
		if (whellTimer) clearTimeout(whellTimer);
		whellTimer = setTimeout(function () {
			// console.log(event.originalEvent.deltaY);
			mainSectionMoveing(event.originalEvent.deltaY > 0 ? 'down' : 'up');
		}, 99);
	} else {
	}
});

$(document).ready(function () {
	$(window).scroll(function () {
		// top버튼 이동 제어
		if (Utils.isElementHide('#footer', 95)) {
			$('.footer-quick-service-link').addClass('stiky');
		} else {
			$('.footer-quick-service-link').removeClass('stiky');
		}
	});
});

var timer;
var lastScrollTop = 0;
var scrollDiection;
$(window).on('scroll', function (event) {
	scrollDiectionCheck(event);

	mainSection.each(function (index, element) {
		if (Utils.isElementInView($(this), 50)) {
			$('.section-nav a').removeClass('active').removeAttr('title').eq(index).addClass('active').attr('title', '선택 됨');
		}
	});
});

// 섹션 메뉴
$('.section-nav a').each(function (index) {
	$(this).on('click', function (event) {
		event.preventDefault();
		$('html, body')
			.stop()
			.animate({ scrollTop: mainSection.eq(index).offset().top }, 650);
	});
});

function scrollDiectionCheck(e) {
	var st = window.pageYOffset || document.documentElement.scrollTop;
	// if(Math.abs(lastScrollTop - st) <= 5)
	// return;

	if (st >= lastScrollTop) {
		// downscroll code
		scrollDiection = 'down';
	} else {
		// upscroll code
		scrollDiection = 'up';
	}
	lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

	var delta = 150;
	clearTimeout(timer);
	timer = setTimeout(resizeDone, delta);
}

$(function () {
	// $(window).trigger('scroll')
	$(window).on('load', function () {
		$(window).trigger('scroll');
	});
});

var resizeDone = function () {
	if (ismobile) {
	} else {
	}
	for (var index = 1; index <= mainSection.length; index++) {
		var element = mainSection[index - 1];
		target = element;

		if (scrollDiection == 'down') {
			isElementInView = Utils.isElementInView(target, 80);
			// console.log(Utils.isElementInView(target, 80),target)
		} else {
			// scoll up
			isElementInView = Utils.isElementInView(target, 20);
			// console.log(isElementInView,' 엘스 타입 ')
		}

		// 섹션이 변경됨.
		// if(index==14){index == 14;}else if(index==)
		// console.log(isElementInView)
		// console.log('windowscroll',scrollDiection,isElementInView,  typeof isElementInView,mainSection.length)
		if (isElementInView) {
			// console.log(index,' => 섹션')
			currentMainSection = index - 1;
			//window['s' + index].play();
		} else {
			// window['s'+(index)].reverse()
		}
	}
};
//
var noticestyle = function () {
	$('.notice .title').each(function (index, element) {
		$(this).height() > 30 ? $(this).addClass('l') : null;
	});
};
var noticeInit = function () {
	$('.notice span.text *').removeAttr('style');
};
$(window).on('load', function () {
	noticeInit();
	noticestyle();
});
$('.notice button').each(function (index, element) {
	$(this).on('click', function () {
		$(this).parent().parent().addClass('active').attr('title', '선택됨').siblings().removeClass('active').find('button').removeAttr('title');
		noticestyle();
	});
});
