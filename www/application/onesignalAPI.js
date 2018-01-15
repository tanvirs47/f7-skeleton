var onesignalAPI = {};

onesignalAPI.init = function() {

    if(!window.plugins) {
        return false;
    }
    if(window.plugins.OneSignal) {
        

        if(!config.onesignal.appID) {
            application.alert(translations.translateKeyIfExist('lbl.pushNotification',"Push Notifications are not configured!"));
            return false;
        }
        window.plugins.OneSignal.startInit(config.onesignal.appID).handleNotificationOpened(onesignalAPI.didReceiveRemoteNotificationCallBack).endInit();
        
        /*window.plugins.OneSignal.init(config.onesignal.appID,
                                   {googleProjectNumber: config.googleProjectNumber,
                                   autoRegister: true},
                                   onesignalAPI.didReceiveRemoteNotificationCallBack);*/

        window.plugins.OneSignal.enableVibrate(true);
        window.plugins.OneSignal.enableSound(true);
        window.plugins.OneSignal.setSubscription(true);

        window.plugins.OneSignal.getIds(function(ids) {
            //send player id to server
            uc.updateApplicantOneSignal(ids);

            window.plugins.OneSignal.sendTag("APP", "STC");
            window.plugins.OneSignal.sendTag("Type", "APPLICANT");
            

            //var applicantBO = $.jStorage.get("applicantBO");
            //onesignalAPI.updateTags(applicantBO);
        });
    }
}


onesignalAPI.didReceiveRemoteNotificationCallBack = function(payload) {
    //application.alert(payload.message);
    //alert(JSON.stringify(payload));

    var notificationContext = payload.additionalData;
    notificationContext._message = payload.message;

    if(payload.additionalData.stacked_notifications) {
        $.each(payload.additionalData.stacked_notifications, function(i, e) {
            notificationContext.action = false;
            onesignalAPI.appPayload(e);
        });
    } else if(notificationContext.type) {
        notificationContext.action = false;
        onesignalAPI.appPayload(notificationContext);
    } else {
        application.cordovaAPI.toast({
            text : payload.message
        });
    }
};

onesignalAPI.appPayload = function(notificationContext) {
    if(notificationContext.type) {

        if(notificationContext.type == "P2P") {

            if(notificationContext.fromPlayerID == uc.chatToPlayerID) {
                var myMessages = application.messages('.messages', {
                    autoLayout: true
                });

                myMessages.addMessage({
                    text: notificationContext._message,
                    type: 'received',
                    //date: 'Now'
                });

            } else {
                application.cordovaAPI.toast({
                    text : notificationContext._message
                });
            }

        } else {
            application.cordovaAPI.toast({
                text : notificationContext._message
            });
        }



    } else {
        application.cordovaAPI.toast({
            text : notificationContext._message
        });
    }

    /*// Actions
    if(notificationContext.action) {
        if(notificationContext.caseID) {
            mainView.router.loadPage("fragments/editor.html?caseID="+Number(notificationContext.caseID));
        }

        if(notificationContext.caseCommentID) {
            mainView.router.loadPage("fragments/case-comments.html?caseID="+Number(notificationContext.caseCommentID));
        }

        // Player ID
    }*/
}

onesignalAPI.updateTags = function(applicantBO) {
    if(applicantBO.applicant.avtar) {
        window.plugins.OneSignal.sendTag("Avtar", applicantBO.applicant.avtar);
    }

    if(applicantBO.applicant.name) {
        window.plugins.OneSignal.sendTag("Name", applicantBO.applicant.name);
    }
}

/*onesignalAPI.createNotification = function(params) { //headings, contents, include_player_ids, actions, data
    var requestObject = {
        "app_id" : config.onesignal.appID,
        "isIos" : true,
        "isAndroid" : true,
        "isWP" : true,
        "headings": {
            "en":"iCOM"
        },
        "contents":{
            "en": "New message"
        },
        "ios_sound":"default"
    };
    //"content_available":1

    for (var param in params) {
        requestObject[param] = params[param];
    }

    //console.log(requestObject);
    return requestObject;
}*/
