
(function($) {

	$.sFacebook = {
		image_url : null,
		photo_id : null,
		me_uid : null,
		me_name : null,

		initialize : function(settings) {

			settings = jQuery.extend(true, {
				clickBtn : 'facebookBtn',
				appId : '',
				cookie : true,
				status : true,
				xfbml : true,
				image_url : 'http://graph.facebook.com/{image}/picture',
				me_photo_target : '#facebook-me-photo',
				me_name_target : '#facebook-me-name',
				me_id_target : '#facebook-me-id',
				facebook_close_target : '#facebook-close',
				me_fb_login_target : "#fbLoginImg",
				me_image_url : '#me_image_url',
				me_sns_name : '#snsName',
				fnData : function() {}

			}, settings);

			this.image_url = settings.image_url;
			this.me_photo_target = settings.me_photo_target;
			this.me_name_target = settings.me_name_target;
			this.me_id_target = settings.me_id_target;
			this.facebook_close_target = settings.facebook_close_target;
			this.me_fb_login_target = settings.me_fb_login_target;
			this.me_image_url = settings.me_image_url;
			this.me_sns_name = settings.me_sns_name;

			var obj = this;

			FB.init({
				appId : settings.appId,
				cookie : settings.cookie,
				status : settings.status,
				xfbml : settings.xfbml
			});

			$("#"+settings.clickBtn).click(function() {
				obj.login(settings.fnData);
				return false;
			});


			FB.Event.subscribe('auth.login', function(response) {
				// do something with response
				//obj.reload();
			});

			FB.Event.subscribe('auth.logout', function(response) {
				// do something with response
				//obj.reload();
			});

			//obj.reload();
		},

		reload : function() {
			var obj = this;

			this.me_profile();
			FB.getLoginStatus(function(response) {

				if (response.authResponse) {
					// logged in and connected user, someone you know
					jQuery(obj.facebook_close_target).show();
				} else {
					jQuery(obj.facebook_close_target).hide();
				}

			});
		},

		me_profile : function(fnData) {
			var obj = this;
			FB.getLoginStatus(function(response) {
				if (response.authResponse) {
					FB.api('/me?fields=id,name,email', function(user) {
						if (user != null) {

							var image = obj.image_url.replace('{image}',user.id);

							obj.me_uid = user.id;
							obj.me_name = user.name;

							jQuery(obj.me_photo_target).attr("src", image);
							jQuery(obj.me_image_url).val(image);
							//jQuery(obj.me_name_target).text(obj.me_name);
							//jQuery(obj.me_sns_name).val(user.name);
							jQuery(obj.me_id_target).val(obj.me_uid);

							//console.log("user.id : " + user.id);
							//console.log("user.name : " + user.name);
							//console.log("user.email : " + user.email);

							fnData(user.id, user.name, user.email);

							/*var loginTargetImg = jQuery(
									obj.me_fb_login_target).attr("src");
							loginTargetImg = loginTargetImg.replace(
									'facebook.png', 'facebook_on.png');

							jQuery(obj.me_fb_login_target).attr("src", loginTargetImg);*/

						}

					});

				} else {

					//obj.me_uid = null;
					//obj.me_name = null;
					//jQuery(obj.me_photo_target).attr("src", '');
					//jQuery(obj.me_name_target).empty();

				}

			});
			return obj;
		},

		login : function(fnData) {
			var obj = this;
			FB.getLoginStatus(function(response) {

				if (response.authResponse) {
					obj.me_profile(fnData);
				} else {
					FB.login(function(response) {
						obj.me_profile(fnData);
					},{scope : 'user_about_me,email'});
				}
			});
		},

		logout : function() {
			FB.logout(function(response) {
				alert("로그아웃 되었습니다.");
				window.location.reload();
			});
		},

		// 원글 작성용
		post_feed : function(title, content, URL, shortUrl) {
			var subject = jQuery(title).val();
			var text = jQuery(content).val();

			var text_count = new String(text);
			if (text_count.length == 0) {
				alert("내용을 입력하세요.");
				jQuery(content).focus();
				return;
			}

			var params = {
					message : text,
					link : URL,
					name : subject
					//description: subject
					//picture:"https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAKJAAAAJDk4ZWVlNWFjLTQ2ZmEtNDFjYy04MDllLWU3MWE0YTUwZjc5YQ.jpg"
					//tags : "junmo1770"
			};

			FB.api('/me/feed', 'post', params, function(response) {

				if (!response || response.error) {

					//alert('Error occured');
				} else {
					/* 추후 개발시 사용
					 * 아래의 obj.id는 카카오스토리에 글장석이 완료되고 난 후 카카오스토리의 게시글 아이디 정보임
					 * $.cookie("facebook_id", response.id);
					 */


				}
			});

		},

		// 댓글작성용
		comment_feed : function(content, shortUrl) {

			var text = jQuery(content).val();

			var text_count = new String(text);
			if (text_count.length == 0) {
				alert("내용을 입력하세요.");
				jQuery(target).focus();
				return;
			}

			var snsTitle = "";
			if ($(".snsTitle")) snsTitle = $(".snsTitle").text();
			else snsTitle = document.title;

			var params = {
					message : text,
					link : document.URL,
					name : snsTitle
					//picture:"https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAKJAAAAJDk4ZWVlNWFjLTQ2ZmEtNDFjYy04MDllLWU3MWE0YTUwZjc5YQ.jpg"
			};

			FB.api('/me/feed', 'post', params, function(response) {
				if (!response || response.error) {
					alert('Error occured');
				} else {

					alert("등록 되었습니다.");
					$.cookie("facebook_id", response.id);
					//alert('Post ID: ' + response.id);
					//document.reload();
				}
			});

		},

		update_feed : function(target, shortUrl) {
			var text = jQuery(target).val();

			var text_count = new String(text);
			if (text_count.length == 0) {
				alert("내용을 입력하세요.");
				jQuery(target).focus();
				return;
			}

			var snsTitle = "";
			if ($(".snsTitle")) snsTitle = $(".snsTitle").text();
			else snsTitle = document.title;

			var id = $.cookie("facebook_id");

			var params = {
					message : text,
					link : document.URL,
					name : snsTitle,
					description: "내용이 들어가는 부분",
					picture:"https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAKJAAAAJDk4ZWVlNWFjLTQ2ZmEtNDFjYy04MDllLWU3MWE0YTUwZjc5YQ.jpg"
				};

			FB.api("/"+id, 'POST', params, function(response) {

				if (!response || response.error) {
					alert('Error occured');
				} else {

					alert("수정 되었습니다.");

				}
			});

		},

		delete_feed : function() {

			var id = $.cookie("facebook_id");

			FB.api("/"+id, 'DELETE', function(response) {


				if (!response || response.error) {
					alert('Error occured');
				} else {

					alert("삭제 되었습니다.");
				}
			});

		},

		select_user_name : function(user_id) {
			var query = FB.Data.query(
					'select name, uid from user where uid={0}', user_id);
			query.wait(function(rows) {
				return rows[0].name;
			});
		}
	};

})(jQuery);

