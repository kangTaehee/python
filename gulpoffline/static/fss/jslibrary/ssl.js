// ssl제외 대상 url
var nonSslUriPattern = [];

//nonSslUriPattern.push("/edu/onlineEdu/");
//nonSslUriPattern.push("/ckl/bbs/view");
//sslUriPattern.push("member/loginPage.do");

var httpURL = window.location.hostname+window.location.pathname;
var domain = "gongu.copyright.or.kr";
var chkurl = location.href;

if (chkurl.indexOf(domain) > -1 ) {
	if(location.protocol == "https:"){
		for (var i=0; nonSslUriPattern.length > i; i++) {
			if (httpURL.indexOf(nonSslUriPattern[i]) > -1) {
				window.location.href=xssre(location.href.replace("https","http"));
				break;
			}
		}

	}
	else if(location.protocol == "http:"){
		var sslFlag = false;
		for (var i=0; nonSslUriPattern.length > i; i++) {
			if (httpURL.indexOf(nonSslUriPattern[i]) > -1) {
				sslFlag = true;
			}
		}
		if (!sslFlag) window.location.href=xssre(location.href.replace("http","https"));
	}
}


/*
// 도메인 전환 처리
var url = location.href;
if (url.indexOf("kr/ckl/") > -1) {
	if (location.hostname != "wtest.ckl.or.kr")
	location.href = url.replace(location.hostname,"wtest.ckl.or.kr");
}
else if (url.indexOf("kr/edu/") > -1) {
	if (location.hostname != "edutest.kocca.kr")
	location.href = url.replace(location.hostname,"edutest.kocca.kr");
}
else if (url.indexOf("kr/sso/") > -1) {
	if (location.hostname != "sso.ckl.or.kr")
	location.href = url.replace(location.hostname,"sso.ckl.or.kr");
}
else if (url.indexOf("kr/cklmobile/") > -1) {
	if (location.hostname != "mtest.ckl.or.kr")
	location.href = url.replace(location.hostname,"mtest.ckl.or.kr");
}
else if (url.indexOf("kr/edumobile/") > -1) {
	if (location.hostname != "medutest.kocca.kr")
	location.href = url.replace(location.hostname,"medutest.kocca.kr");
}
*/

function xssre(val){
	val = val.replace("<", "&lt;").replace(">", "&gt;");
	val = val.replace("'", "&quot;").replace('"', '&#39;');
	return val;
}

