
(function($) {

	$.sKakao = {
		image_url : null,
		photo_id : null,
		me_uid : null,
		me_name : null,


		initialize : function(settings) {
			var obj = this;
			settings = jQuery.extend(true, {
				clickBtn : 'kakaoBtn',
				appId : '',
				image_url : '',
				me_photo_target : '#profile_photo',
				me_name_target : '#profile_name',
				me_id_target : '#kakaoSnsId',
				me_kakao_login_target : '#kakaoLoginImg',
				me_image_url : '#me_image_url',
				me_sns_name : '#snsName',
				authResponse : false,
				fnData : function() {}

			}, settings);

			this.appId = settings.appId;
			this.image_url = settings.image_url;
			this.me_photo_target = settings.me_photo_target;
			this.me_name_target = settings.me_name_target;
			this.me_id_target = settings.me_id_target;
			this.me_kakao_login_target = settings.me_kakao_login_target;
			this.me_image_url = settings.me_image_url;
			this.me_sns_name = settings.me_sns_name;
			this.authResponse = settings.authResponse;

			// 사용할 앱의 Javascript 키를 설정해 주세요.
		    Kakao.init(settings.appId);

		    $("#"+settings.clickBtn).click(function() {
				obj.login(settings.fnData);
				return false;
			});


			this.me_profile(function() {});
		},



		me_profile : function(fnData) {

			Kakao.Auth.getStatus(function(objData){
				if(objData.status=="connected"){


					//jQuery(obj.me_photo_target).attr("src", objData.user.properties.thumbnail_image);
					//Query(obj.me_image_url).val(objData.user.properties.thumbnail_image);
					//jQuery(obj.me_id_target).val(objData.user.id);


					//console.log("objData.user.id : " + objData.user.id);
					//console.log("objData.user.properties.nickname : " + objData.user.properties.nickname);

					fnData(objData.user.id, objData.user.properties.nickname);

					//jQuery(obj.me_sns_name).val(objData.user.properties.nickname);

					/*
					if (jQuery("#gubun") && jQuery("#gubun").val() != "H") {
						jQuery("#gubun").val("K");
					}


					loginTargetImg = jQuery(obj.me_kakao_login_target).attr("src");
					loginTargetImg = loginTargetImg.replace('kakao_story.png', 'kakao_story_on.png');
					jQuery(obj.me_kakao_login_target).attr("src", loginTargetImg);
					*/

				}else{
					return false;
				}
			});

		},

		login : function(fnData) {
			var obj = this;

			Kakao.Auth.login({
		        success: function(authObj) {

		        	obj.me_profile(fnData);

		        },
		        fail: function(err) {
					alert("로그인에 실패하였습니다.");
		        }
		      });

		},

		logout : function() {
			Kakao.Auth.logout(function(){

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


			Kakao.Auth.getStatus(function(obj) {

				if (obj.status == "connected") {
					Kakao.API.request({

						url     : '/v1/api/story/post/note',
						data    : {content:subject + "\n\n" + text +"\n\n"+ URL},
						success : function(obj){

							/* 추후 개발시 사용
							 * 아래의 obj.id는 카카오스토리에 글장석이 완료되고 난 후 카카오스토리의 게시글 아이디 정보임
							 * $.cookie("kakaoStory_id", obj.id);
							 */
							//alert("등록 되었습니다.");
				    	}
				   });


				}else{
					alert("로그인후 사용해주세요.");
				}
			});

			return false;
		},

		// 댓글 작성용
		comment_feed : function(content, shortUrl) {

			var text = jQuery(content).val();
			var text_count = new String(text);
			if (text_count.length == 0) {
				alert("내용을 입력하세요.");
				jQuery(content).focus();
				return;
			}

			var snsTitle = "";
			if ($(".snsTitle")) snsTitle = $(".snsTitle").text();
			else snsTitle = document.title;

			Kakao.Auth.getStatus(function(obj) {

				if (obj.status == "connected") {
					Kakao.API.request({
						url     : '/v1/api/story/post/note',
						data    : {content:snsTitle + "\n\n" + text +"\n"+ document.URL},
						success : function(obj){
							/* 추후 개발시 사용
							 * 아래의 obj.id는 카카오스토리에 글장석이 완료되고 난 후 카카오스토리의 게시글 아이디 정보임
							 * $.cookie("kakaoStory_id", obj.id);
							 */
							alert("글 등록 완료");
				    	}
					});

				}else{
					alert("로그인후 사용해주세요.");
				}
			});

			return false;
		},

		delete_feed : function() {


			Kakao.Auth.getStatus(function(obj) {

				if (obj.status == "connected") {
					Kakao.API.request({
						url     : '/v1/api/story/delete/mystory',
						data    : {id:$.cookie("kakaoStory_id")},
						success : function(obj){
							alert("글 삭제 완료");
						}
					});

				}else{
					alert("로그인후 사용해주세요.");
				}
			});

			return false;
		}
	};

})(jQuery);

