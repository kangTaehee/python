var agent = navigator.userAgent.toLocaleLowerCase();
if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || agent.indexOf('msie') != -1) {
	$('html').addClass('ie');
}

var ismobile = false;
if (window.innerWidth < 1278) {
	ismobile = true;
}
$(window).resize(function () {
	if (window.innerWidth < 1278) {
		ismobile = true;
	} else {
		ismobile = false;
	}
});
function isMobile() {
	var UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
		return true;
	} else {
		return false;
	}
}

$('.familySetOpen').click(function (event) {
	$('.familySet').addClass('mobileOn');
});
$('.familySetClose').click(function (event) {
	$('.familySet').removeClass('mobileOn');
});

// top global sitelink
var topnavlink = $('#top-nav .top-navlink').clone();
var topnavcloser = $('#nav-toplink-m .closer');
$('.toplink-m').html(topnavlink.clone());
$('.all-site-toggle').on('click', function () {
	$('#mobile-gnb .set>.nav').addClass('hide');
	$('#nav-toplink-m').addClass('active');
	$(this).addClass('on').siblings().removeClass('on');
	$('#nav-toplink-m .f1 a').focus();
});
$('.all-navmenu-toggle').on('click', function () {
	$('#mobile-gnb .set>.nav').removeClass('hide');
	$('#nav-toplink-m').removeClass('active');
	$(this).addClass('on').siblings().removeClass('on');
	$('.dp1.menu1>a').focus();
});
topnavcloser.on('click', function () {
	$(this).parent().parent().removeClass('active');
});

var topnavlinker = $('#nav-toplink-m .top-navlink>ul>li.f4>a');
topnavlinker.on('click', function () {
	$(this).next().slideToggle().parent().toggleClass('active');
	return false;
});

// 로그인 회원가입 언어선택
var topGlobalm = $('#top-nav .top-nav-right').clone();
$('.global-m').html(topGlobalm.clone());

var navhtml = $('#gnb .gnb-set > ul').clone();
navhtml.find('div').removeAttr('id');
$('.gnb-all-nav').html(navhtml.clone()).attr('tabindex', '0');
$('.all-nav-toggle-close').click(function (e) {
	e.preventDefault();
	$('#all-gnb').removeClass('active');
});

// 모바일
$('.menu-toggle').on('click', function (e) {
	e.preventDefault();
	$('#mobile-gnb').addClass('active');
	$('body').addClass('ovh');
});
$('#mobile-gnb .nav').html(navhtml);
// 레이어팝업
var currentfocus = null;
function lpopOpen(trigger, target) {
	$(target).addClass('active');
	$(target).attr('tabindex', 0).focus();
	currentfocus = trigger;
	$('body').addClass('popupOpened');
}

function lpopClose(target) {
	$('body').removeClass('popupOpened');
	$(target).removeClass('active');
	if (currentfocus !== null) currentfocus.focus();
}
$(function () {
	// 레이어 닫기
	$('.parent-close').on('click', function () {
		lpopClose();
		$(this).parent().parent().removeClass('active');
	});
});
// layout
var backBtn = $('a.top');
$(function () {
	// top-nav
	var topNavLink = $('.top-navlink>ul>li>a');
	var tapNavSet = $('#top-nav');
	var topNavLinkActive = $('.top-navlink>ul>li.active').index();
	topNavLink.on('mouseenter keyup', function () {
		topNavLink.removeClass('on');
		$(this).addClass('on').parent().addClass('active').siblings().removeClass('active');
	});
	tapNavSet.on('mouseleave blur', function () {
		topNavLink.removeClass('on').parent().removeClass('active').eq(topNavLinkActive).addClass('active');
	});

	// 스크롤 이벤트
	var sTop;
	function goToScroll() {
		// 큅메뉴
		sTop = $(window).scrollTop();
		if (sTop > 85) {
			$('body').addClass('onFixed');
			backBtn.fadeIn('slow');
		} else {
			$('body').removeClass('onFixed');
			backBtn.fadeOut('slow');
		}
		// 주 메뉴
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
	}
	$(window).on('scroll', function () {
		goToScroll();
	});
	goToScroll();
	backBtn.on('click', function () {
		$(window).animate({ scrollTop: 0 }, 500);
	});
	// 피씨 메뉴
	$('#gnb .dp1>a').on('mouseover focusin', function (e) {
		$(this).parent().addClass('active').siblings().removeClass('active');
		return false;
	});
	$('#gnb .dp2-set').on('mouseleave', function () {
		$(this).parent().parent().removeClass('active');
	});

	/* $('#gnb .dp1>a')
	.focus(function (e) { 
		$(this).parent().addClass('active').siblings().removeClass('active');
	});
	$('#gnb .dp3 a:last')
	.on('focusout',function(){
		$('#gnb .dp1>a')
		.parent().removeClass('active').siblings().removeClass('active');
	}) */
	$('#gnb .menu5 .dp2>a').on('click', function () {
		$(this).next().addClass('current').parent().siblings().find('.dp3-set').removeClass('current');
		return false;
	});

	// 모바일 메뉴
	var mobileNav = $('#mobile-gnb');
	mobileNav.find('ul').each(function () {
		if ($(this).find('li').length == 0) {
			$(this).remove();
		}
	});
	$(mobileNav)
		.find('.dp1 a')
		.on('click', function (e) {
			if ($(this).parent().find('>div,>ul').length > 0) {
				e.preventDefault();
				$(this).parent().toggleClass('on');
			}
		});

	$('.mobile-gnb-close').on('click', function (e) {
		e.preventDefault();
		mobileNav.removeClass('active');
		$('#nav-toplink-m').removeClass('active');
		$('body').removeClass('ovh');
	});

	$('.all-nav-toggle').on('click', function (e) {
		e.preventDefault();
		if (ismobile == false) {
			$('#all-gnb').toggleClass('active');
			$('body').toggleClass('ovh');
		} else {
			mobileNav.toggleClass('active');
			$('.all-navmenu-toggle').trigger('click');
		}
	});
	$('.all-nav-toggle-close').on('click', function (e) {
		e.preventDefault();
		$('#all-gnb').removeClass('active');
		$('body').removeClass('ovh');
	});
	// 모바일 탭메뉴 토글
	$('button.tab-nav-toggle').on('click', function () {
		$(this).toggleClass('active');
	});
	// sns
	$('button.sns-toggle').on('focus', function () {
		$(this).next().removeClass('active');
	});
	$('button.sns-toggle').on('click', function () {
		$(this).next().toggleClass('active');
	});
	$('button.sns-closer').on('click', function () {
		$(this).parent().removeClass('active');
		$('button.sns-toggle').focus();
	});
	// 윈도우 프린트
	$('button.print').on('click', function () {
		window.print();
	});
});
// 콘텐츠 서비스
$(function () {
	// 스크롤 접근성
	$('.agg-set .ovy').attr('tabindex', 0);
	// 링크 접근성
	$('#content a').each(function () {
		if ($(this).attr('target') == '_blank' && $(this).attr('title') != '') {
			$(this).attr('title', '새창열림');
		}
	});
	// 달력 언어설정
	if (typeof $.fn.datepicker != 'undefined') {
		$.fn.datepicker.dates.ko = {
			days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
			daysShort: ['일', '월', '화', '수', '목', '금', '토'],
			daysMin: ['일', '월', '화', '수', '목', '금', '토'],
			months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			today: '오늘',
			clear: '삭제',
			format: 'yyyy-mm-dd',
			titleFormat: 'yyyy년mm월',
			weekStart: 0,
		};
	}
	// 달력
	if (!isMobile() && typeof $.fn.datepicker != 'undefined') {
		$('input.sdate,input.edate,input.date')
			.datepicker({
				format: 'yyyy-mm-dd',
				language: 'ko',
				todayHighlight: true,
				autoclose: true,
			})
			.attr('placeholder', '연도 - 월 - 일');
	}
	// 모바일에서 이미지 원본보기
	$('.img-box')
		.not('.n')
		.on('click', function (event) {
			if ($(window).width() < 767) {
				_this = $(this).find('img');
				if (_this.data().ori != undefined) {
					window.open(_this.data().ori, 'ivimg');
				} else {
					window.open(_this.attr('src'), 'ivimg');
				}
			}
		});

	// 대상으로 스크롤
	$('a[href^="#m"], area[href^="#"]').on('click', function (event) {
		event.preventDefault();
		var y = $($(this).attr('href')).offset().top - 70;
		$('html, body').animate(
			{
				scrollTop: y,
			},
			300
		);
		return false;
	});
	//첨부파일
	var filesOv = $('.filegroup>a');
	$(filesOv).on('click', function (event) {
		$('.filegroup>a').not($(this)).next().hide();
		$(this).next().slideDown();
		event.preventDefault();
	});
	$('.filegroup--box .filegroup--box--close').on('click focusout', function () {
		$(this).parent().hide();
	});
	$(filesOv).bind('keydown', function (e) {
		if (e.shiftKey && e.keyCode == 9) {
			$('.filegroup--box').hide();
		}
	});

	// 탭 활성화
	$('.js-tab button').on('click', function () {
		var $parent = $(this).closest('.js-tab');
		var index = $(this).parent().index();
		$(this).attr('aria-pressed', true).parent().addClass('on').siblings().removeClass('on').find('button').attr('aria-pressed', false);
		$parent.siblings('.tab-content').find('.con').hide().eq(index).show();
	});
	// 콘텐츠 상단 디자인
	$('.info-box').each(function () {
		if ($(this).find('.deco').length > 0) {
			$(this).addClass('has-deco');
		}
	});
	// 이미지맵 반응형
	if (typeof $.fn.rwdImageMaps != 'undefined') {
		$('img[usemap]').rwdImageMaps();
	}
	// 한글파라미터 인코딩
	$('.linkencode area').each(function (e) {
		_href = encodeURIComponent($(this).attr('href').split('searchWrd=')[1]);
		$(this).attr('href', $(this).attr('href').split('searchWrd=')[0] + 'searchWrd=' + _href);
	});

	//footer
	$('.selectBox .close').removeClass('active');
	$('.selectBox .open').on('click', function () {
		$('.selectBox ul').show();
		$(this).removeClass('active');
		$('.selectBox .close').addClass('active');
		$('.selectBox').focus();
	});
	$('.selectBox .close').on('click', function () {
		$('.selectBox ul').hide();
		$(this).removeClass('active');
		$('.selectBox .open').addClass('active');
		$('.selectBox').focus();
	});

	/* $('.selectBox ul a').on('click',function(){
		var urlLi = $(this).html();
		var linkUrl = $(this).attr('linkurl');
		$('.selectBox').html(urlLi);
		$('.selectBox ul').hide();
		$('.selectBox .open').show();
		$('.selectBox .close').hide();
		//$('.selectBox .goBtn').attr('href', linkUrl).attr('target','_blank')
		$('.selectBox').focus();
	}); */

	// scrollBar
	/* $(".tab-nav2").mCustomScrollbar({
		axis:"x",
		theme:"dark-3",
		advanced:{
			autoExpandHorizontalScroll:true //optional (remove or set to false for non-dynamic/fss elements)
		}
	}); */
});

$(function () {
	$('.bd-list').each(function (i, element) {
		_ = $(element);
		$(this)
			.find('tr')
			.each(function () {
				$(this)
					.find('td')
					.each(function (index) {
						if ($(this).hasClass('title') || $(this).hasClass('no') || $(this).text().trim() == '') {
						} else {
							var txt = '<span class="only-m">' + _.find('th').eq(index).text() + '</span>';
							$(this).prepend(txt);
						}
					});
			});
	});
});

var pageNav = {
	pagination: null,
	pagingBtnWidth: 40,
	pagingCtrlWidth: 40 * 4,
	// minimumPaging: 3,
	pagingCtrlView: false,
	pagingType: null,
	visiblePagingNum: null,
	item: null,
	totalPaging: null,
	currentPage: null,
	prevBtn: null,
	nextBtn: null,
	firstBtn: null,
	endBtn: null,
	paginationClone: null,
	href: null,
	lastpage: null,
	debug: true,
	from: null,
	to: null,
	init: function (t) {
		this.pagination = $(t);
		this.item = this.pagination.find('li').not('.i');
		this.totalPaging = this.item.length;
		this.currentPage = this.item.index(this.item.parent().find('.active'));
		this.prevBtn = this.pagination.find('.prev');
		this.nextBtn = this.pagination.find('.next');
		this.firstBtn = this.pagination.find('.first');
		this.endBtn = this.pagination.find('.end');
		this.paginationClone = $('.pagination').clone();
		this.href = this.item.find('a').eq(0).attr('href');
		if (this.endBtn.hasClass('disabled')) {
			this.lastpage = this.item.eq(-1).text();
		} else {
			var pt = /(pageIndex\=)\d+/i;
			this.lastpage = pt.exec(this.endBtn.find('a').attr('href'));
			pt = /\d+/i;
			this.lastpage = pt.exec(this.lastpage);
		}

		// this.option(t)
		this.resizeDiv();
	},
	option: function (t) {
		this.pagination = t;
	},
	/**
	 * 마크업 컨트롤 실제 동작 함수
	 */
	resizeDiv: function () {
		var windowWith = $('.paginationSet').width();
		// if (windowWith <= 360) {
		// 	this.visiblePagingNum = this.minimumPaging;
		// } else {
		// }
		this.visiblePagingNum = Math.floor((windowWith - this.pagingCtrlWidth) / this.pagingBtnWidth);
		if (this.visiblePagingNum > this.totalPaging) {
			this.visiblePagingNum = this.totalPaging;
		}
		this.from = 0;
		this.to = 9;
		for (var i = 1; i < this.visiblePagingNum; i++) {
			if (this.visiblePagingNum - 1 == this.to - this.from) {
				break;
			}
			temp = this.currentPage + i * -1;
			if (0 < temp && temp <= 9) {
				this.from = temp;
				console.log('from', this.from);
			}

			if (this.visiblePagingNum - 1 == this.to - this.from) {
				break;
			}
			temp = this.currentPage + i;
			if (0 < temp && temp <= 9) {
				this.to = temp;
				console.log('to', this.to);
			}
			if (this.visiblePagingNum == this.to - this.from) {
				this.to--;
				break;
			}
		}
		if (this.visiblePagingNum == 1) {
			this.from = this.to = this.currentPage;
		}
		if (this.debug) {
			console.log(' 시작=', this.from, ' 끝=', this.to);
		}
		if (this.debug) console.log('from=', this.from, 'item.length=', this.item.length, 'this.visiblePagingNum=', this.visiblePagingNum, 'currentPage=', this.currentPage);
		if (this.debug) console.log('this.totalPaging', this.totalPaging);
		this.item.hide();
		for (var i = 0; i < this.totalPaging; i++) {
			if (i >= this.from && i <= this.to) {
				this.item.eq(i).show();
			}
		}
		function linkreplace(target, argument) {
			target.find('a').attr('href', pageNav.href.replace(/(pageIndex=)\w+/, 'pageIndex=' + argument));
			//target.removeClass('disabled');
		}
		// 페이징 갯 수가 1이하인 경우 조건
		if (this.item.find('a').length > 0) {
			//이전 페이징 링크변경
			if (this.currentPage > 0 && this.item.eq(0).css('display') == 'none') {
				if (this.debug) console.log('이전버튼 활성화');
				this.prevBtn.html(this.item.find('a').eq(0).clone().html('<span class="s"><span>이전 <span class="t">목록으로 이동</span></span></span>'));
				linkreplace(this.prevBtn, Number(this.item.eq(this.from).text()) - 1);
			} else {
				this.prevBtn.html($(this.paginationClone).find('.prev').html());
			}
			//다음버튼
			if (this.item.eq(-1).css('display') == 'none') {
				if (this.debug) console.log('다음버튼 활성화');
				this.nextBtn.html(this.item.find('a').eq(0).clone().html('<span class="s"><span>다음 <span class="t">목록으로 이동</span></span></span>'));
				linkreplace(this.nextBtn, Number(this.item.find('a:visible').eq(-1).text()) + 1);
			} else {
				this.nextBtn.html(this.paginationClone.find('.next').html());
			}
			//처음버튼
			if (this.item.eq(0).css('display') == 'none') {
				this.firstBtn.html(this.item.find('a').eq(0).clone().html('<span class="s"><span>처음 <span class="t">목록으로 이동</span></span></span>'));
				linkreplace(this.firstBtn, 1);
			} else {
				this.firstBtn.html(this.paginationClone.find('.first').html());
			}
			//마지막버튼
			if (this.item.eq(-1).css('display') == 'none') {
				this.endBtn.html(this.item.find('a').eq(0).clone().html('<span class="s"><span>끝 <span class="t">목록으로 이동</span></span></span>'));
				linkreplace(this.endBtn, this.lastpage);
			} else {
				this.endBtn.html(this.paginationClone.find('.end').html());
			}
		}
		//this.pagination.find('.i').addClass('disabled').has('a').removeClass('disabled');
	},
	run: function (t) {
		// if (this.pagination.length) {
		this.init(t);
		// }
		$(window).on('resize', function () {
			pageNav.resize();
		});
	},
	resize: function () {
		var _ = window;
		if ($(window).width() !== _.windowWidth) {
			clearTimeout(_.windowDelay);
			_.windowDelay = window.setTimeout(function () {
				_.windowWidth = $(window).width();
				pageNav.resizeDiv();
			}, 50);
		}
	},
};
