
(function($) {

	$.sGooglePlus = {
		image_url : null,
		photo_id : null,
		me_uid : null,
		me_name : null,


		initialize : function(settings) {

			obj = this;
			settings = jQuery.extend(true, {
				clickBtn : 'googleBtn',
				appId : '',
				image_url : '',
				me_photo_target : '#profile_photo',
				me_name_target : '#profile_name',
				me_id_target : '#googlePlusSnsId',
				me_googlePlus_login_target : '#googlePlusLoginImg',
				me_image_url : '#me_image_url',
				me_sns_name : '#snsName',
				authResult : 'fail',
				fnData : function() {}

			}, settings);

			this.appId = settings.appId;
			this.clickBtn = settings.clickBtn;
			this.image_url = settings.image_url;
			this.me_photo_target = settings.me_photo_target;
			this.me_name_target = settings.me_name_target;
			this.me_id_target = settings.me_id_target;
			this.me_googlePlus_login_target = settings.me_googlePlus_login_target;
			this.me_image_url = settings.me_image_url;
			this.me_sns_name = settings.me_sns_name;
			this.authResult = settings.authResult;

			this.startApp(settings.appId, settings.clickBtn, settings.fnData);

		},

		startApp : function(appId, clickBtnId, fnData) {
			var btnId = clickBtnId;
			var attachSignIn = this.attachSignIn;
			gapi.load('auth2', function(){
				// Retrieve the singleton for the GoogleAuth library and set up the client.
				auth2 = gapi.auth2.init({
					client_id: appId,
			    	cookiepolicy: 'single_host_origin',
			    	// Request scopes in addition to 'profile' and 'email'
			    	scope: 'https://www.googleapis.com/auth/plus.login'
				});
				if (document.getElementById(btnId)) {
					attachSignIn(document.getElementById(btnId), fnData);
				}
			});
		},

		attachSignIn : function(element, fnData) {
			auth2.attachClickHandler(
				element,
				{},
				function(googleUser) {
		   			var profile = googleUser.getBasicProfile();

		   			fnData(profile.getId(), profile.getName(), profile.getEmail());
		       	},
		       	function(error) {
		         	alert(JSON.stringify(error, undefined, 2));
		       	}
			);
		 }
	};

})(jQuery);




