Framework7.prototype.plugins.CordovaAPI = function (app, globalPluginParams) {
    'use strict';
    
    var MediaAPI = function () {
        var self = this;
        
        this.capturePhoto = function(uploadPhotoCallback) {
            navigator.camera.getPicture(uploadPhotoCallback, function(message) { 
                application.alert(message); 
            }, {
                            
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                quality: 60,
                targetWidth: 300,
                targetHeight: 300
            });
        }
        
        this.galleryPhoto = function(uploadPhotoCallback) {
            navigator.camera.getPicture(uploadPhotoCallback, function(message) { 
                application.alert(message); 
            }, {                
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                quality: 90,
                targetWidth: 500,
                targetHeight: 500,
            });
        }
        
        return this;
    };
    
    var CordovaAPI = function () {
        var self = this;
        
        this.toast = function(params) {
            if($('.notification-item').length > 0) {
                $('.notification-item').hide();
            }
            
            if(self.cordova) {
                window.plugins.toast.showShortBottom(params.text, function(a) {
                    console.log('toast success: ' + a);
                }, function(b) {
                    //alert('toast error: ' + b);
                    application.addNotification({
                        message : params.text
                    });
                });
            } else {
                application.addNotification({
                    message : params.text
                });
            }
        };
        
        this.backKeyDown = function() {
            application.hideIndicator();
            application.confirm(translations.translateKey('app.exitConfirmation'), function () {
                navigator.app.exitApp();
            });
        };
        
        this.deviceready = function() {
            //self.launchnavigator = true;
            self.cordova = true;
            globalPluginParams.isAPP = true;
            console.log("device ready!");
            //notificationServices.init();
			//sendDeviceId();
            if($.jStorage.get('appLocale')) {
                translations.loadTranslations($.jStorage.get('appLocale'));
            } else {
                $.jStorage.set('appLocale', 'en');
                translations.loadTranslations('en');
            }
            
            if($.jStorage.get("userObject")) {
                uc.backToHome();
            }else{
                mainView.loadPage("fragments/signin.html"); 
            }
            
            //online event management
            //document.addEventListener("online", ux.onlineNow, false);
        }
        
        if(globalPluginParams.support) {
            document.addEventListener("deviceready", this.deviceready, true);
            document.addEventListener("backbutton", this.backKeyDown, true);
        }
        
                
        return this;
    };
        
    app.cordovaAPI = (function () {
        var cordovaAPI = new CordovaAPI()
        cordovaAPI.mediaAPI = new MediaAPI();
        return cordovaAPI;
    })();
    
    return this;
};
