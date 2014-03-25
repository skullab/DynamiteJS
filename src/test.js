Dynamite.alias();

var Browser = new Class(
		{
			modifier : 'final'
		},
		{
			constructor : function() {
				var nVer = navigator.appVersion;
				var nAgt = navigator.userAgent;
				var browserName = navigator.appName;
				var fullVersion = '' + parseFloat(navigator.appVersion);
				var majorVersion = parseInt(navigator.appVersion, 10);
				var nameOffset, verOffset, ix;
				var mobilePattern = new RegExp(
						/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i);
				if (mobilePattern.test(nAgt.toLowerCase())) {
					this.mobile = {};
					if (/android/i.test(nAgt.toLowerCase()))
						this.mobile.android = true;
					if (/webos/i.test(nAgt.toLowerCase()))
						this.mobile.webos = true;
					if (/iphone/i.test(nAgt.toLowerCase())) {
						this.mobile.iphone = true;
						this.mobile.apple = true ;
					}
					if (/ipad/i.test(nAgt.toLowerCase())){
						this.mobile.ipad = true;
						this.mobile.apple = true ;
					}						
					if (/ipod/i.test(nAgt.toLowerCase())){
						this.mobile.ipod = true;
						this.mobile.apple = true ;
					}
					if (/blackberry/i.test(nAgt.toLowerCase()))
						this.mobile.blackberry = true;
					if (/iemobile/i.test(nAgt.toLowerCase())){
						this.mobile.iemobile = true;
						this.mobile.windows = true ;
					}	
					if (/opera mini/i.test(nAgt.toLowerCase()))
						this.mobile.opera = true;
				}
				
				if ((verOffset = nAgt.indexOf("Opera")) != -1) {
					browserName = "opera";
					this.opera = true;
					fullVersion = nAgt.substring(verOffset + 6);
					if ((verOffset = nAgt.indexOf("Version")) != -1)
						fullVersion = nAgt.substring(verOffset + 8);
				}

				else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
					browserName = "msie";
					this.msie = true;
					fullVersion = nAgt.substring(verOffset + 5);
				}

				else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
					browserName = "chrome";
					this.chrome = true;
					fullVersion = nAgt.substring(verOffset + 7);
				}

				else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
					browserName = "safari";
					this.safari = true;
					fullVersion = nAgt.substring(verOffset + 7);
					if ((verOffset = nAgt.indexOf("Version")) != -1)
						fullVersion = nAgt.substring(verOffset + 8);
				}

				else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
					browserName = "firefox";
					this.firefox = true;
					fullVersion = nAgt.substring(verOffset + 8);
				}

				else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt
						.lastIndexOf('/'))) {
					browserName = nAgt.substring(nameOffset, verOffset)
							.toLowerCase();
					fullVersion = nAgt.substring(verOffset + 1);
					if (browserName == '') {
						browserName = navigator.appName.toLowerCase();
					}
				}

				if ((ix = fullVersion.indexOf(";")) != -1)
					fullVersion = fullVersion.substring(0, ix);
				if ((ix = fullVersion.indexOf(" ")) != -1)
					fullVersion = fullVersion.substring(0, ix);

				majorVersion = parseInt('' + fullVersion, 10);
				if (isNaN(majorVersion)) {
					fullVersion = '' + parseFloat(navigator.appVersion);
					majorVersion = parseInt(navigator.appVersion, 10);
				}

				this.name = browserName;
				this.fullVersion = fullVersion;
				this.majorVersion = majorVersion;
			},
			static_geolocation : navigator.geolocation,
			static_webkitPersistentStorage : navigator.webkitPersistentStorage,
			static_webkitTemporaryStorage : navigator.webkitTemporaryStorage,
			static_doNotTrack : navigator.doNotTrack,
			static_onLine : navigator.onLine,
			static_product : navigator.product,
			static_appCodeName : navigator.appCodeName,
			static_userAgent : navigator.userAgent,
			static_platform : navigator.platform,
			static_appVersion : navigator.appVersion,
			static_appName : navigator.appName,
			static_vendorSub : navigator.vendorSub,
			static_vendor : navigator.vendor,
			static_productSub : navigator.productSub,
			static_cookieEnabled : navigator.cookieEnabled,
			static_mimeTypes : navigator.mimeTypes,
			static_plugins : navigator.plugins,
			static_language : navigator.language,
			static_javaEnabled : navigator.javaEnabled,
			static_getStorageUpdates : navigator.getStorageUpdates,
			static_registerProtocolHandler : navigator.registerProtocolHandler,
			static_webkitGetGamepads : navigator.webkitGetGamepads,
			static_webkitGetUserMedia : navigator.webkitGetUserMedia,
			static_vibrate : navigator.vibrate
		});

		
var response = repository('code.txt','test',null,function(response){
	if(response.error == 0){
		console.log('OK');
		test();
	}else{
		alert('repository error - status : '+response.status+' response '+response.response);
	}
});
console.log(response);

