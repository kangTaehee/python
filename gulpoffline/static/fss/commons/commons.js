//dateTypeCheck
var date_regex = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;
function dateTypeCheck(testDate){
	if(!(date_regex.test(testDate)))
	{
		return false;
	}else{
		return true
	}
}
function today(){
	var date = new Date();
	var year  = date.getFullYear();
	var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
	var day   = date.getDate();
	if (("" + month).length == 1) { month = "0" + month; }
	if (("" + day).length   == 1) { day   = "0" + day;   }
	return year+'-'+month+'-'+ day;
}
var dateValidatorTarget
var delay = 2;
var tuttimer = [];
function showtooltip(){
	clearTuttimer();
	tuttimer.push(setTimeout(function(){
		dateValidatorTarget.focus();
	},delay));
}
function clearTuttimer(){
	for (var i = 0; i < tuttimer.length; i++) {
		clearTimeout(tuttimer[i]);
	}
}
$(document).on('focusout','.sdate,.edate,.date',function(index, el) {
	if (!dateTypeCheck($(this).val()) && $(this).val()!="") {
		showtooltip();
		
		var title=$(this).attr('title')
		if ($(this)[0].id!='') {
			labelTitle=true;
		}else{labelTitle=false}
		if (title!=undefined) {
			alert(title+'형식이 올바르지 않습니다. 입력예 '+today());
		}else if(labelTitle){
			alert($('label[for='+$(this)[0].id+']').text()+'형식이 올바르지 않습니다. 입력예 '+today());
		}else{
			alert('날짜형식이 올바르지 않습니다. 입력예 '+today());
		}
		$(this).val('')
		dateValidatorTarget=$(this)
	}
});

// 팝업호출
function openPop(argument) {
	$('.js-pop, .b-pop').click(function(event) {
		event.preventDefault();
		// window.open(URL,name,specs,replace)
		var size = $(this).data().size.split(',')
		var scrollbars='';
		if (size[2]!==undefined) {scrollbars=',scrollbars='+size[2]}
		var myWindow = window.open($(this).attr('href'), $(this).attr('href'), "width="+size[0]+'",height='+size[1]+'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes'+'"');
		
		// var myWindow = window.open($(this).attr('href'), $(this).attr('href'), "width="+size[0]+'",height='+size[1]+scrollbars+'"');
	});
}
$(function () {
	openPop();

	$('label').each(function(index, el) {
		if ($(this).attr('for')==undefined) {
			$(this).find('input').attr('title',$.trim($(this).text()))
		}
	});
	$('.js-pop').attr('title','새창열림')
	$('.scrolly').attr('tabindex',0)
});

// function chk
function getNumber(fCss, vali_str){
	var temp = trim(fCss.substr(fCss.indexOf(vali_str), fCss.length));
	if (temp.indexOf(" ")>-1){temp = temp.substr(0,temp.indexOf(" "));}
	if (temp.indexOf("-")>-1){
		var arr = temp.split("-");
		temp = arr[1];
	} else {temp=0;}
	try{temp=parseInt(temp);} catch (e){temp=0;}
	return temp;
}
// 앞/뒤에서 White Space가 제거된 값반환
function trim(value) {
	return value.replace(/^\s+|\s+$/g,"");
}
// autoWidth
$(function() {
	var time=new Date();
	// console.log(time)
	$('[class*=w-]').each(function(index, el) {
		w=getNumber(this.className,'w-')
		$(this).css('width',w)
	});
	var endTime=new Date();
	// console.log(endTime-time)
})

$(function () {
	// 폰트 크기 설정
	var fontsizeMax = 3;
	var fontsizeCurrent = 0;
	var fontsizeStep = 2;

	$('#content>*:not(.adm), #content>*:not(.adm) *')
	.each(function (index, element) {
		$(this).data().fontsize = $(this).css('font-size').replace('px','')
	});
	$('.view-minus').click(function (e) { 
		--fontsizeCurrent;
		if(0 <= fontsizeCurrent ){

			$('#content>*:not(.adm), #content>*:not(.adm) *')
			.each(function (index, element) {
				_fontsize = $(this).data().fontsize
				$(this).css('font-size',(_fontsize - 0 + (fontsizeCurrent*fontsizeStep))+'px')
			});								
		}else{
			fontsizeCurrent=0
		}
	});
	$('.view-plus').click(function (e) { 
		++fontsizeCurrent;

		if(fontsizeMax >= fontsizeCurrent ){
			$('#content>*:not(.adm), #content>*:not(.adm) *')
			.each(function (index, element) {
				_fontsize = $(this).data().fontsize
				$(this).css('font-size',(_fontsize-0+(fontsizeCurrent*fontsizeStep))+'px')
			});
		}else{
			fontsizeCurrent = 3
		}
	});
});
