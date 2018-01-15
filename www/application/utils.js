var deviceConfig = {};
var pushNotification;

var successHandler = function(result) {
	alert("sucessHandler"+result);
}
var successHandler1 = function(error) {
	//alert(error);
}
var errorHandler = function(error) {
	alert(error);
}

var tokenHandler = function(status){
    //alert("Device id in token handler: "+status);
    $.jStorage.set("PNRegistrationID", status);
	deviceConfig.uuid = $.jStorage.get("PNRegistrationID");
    deviceConfig.platform = device.platform;
    deviceConfig.model = device.model;
    deviceConfig.version = device.version;
    var logindata = $.jStorage.get('userObject');
    logindata.deviceBO = {};
    logindata.deviceBO = deviceConfig;
    $.jStorage.set('userObject',logindata);

    var instanceBo = {};
    instanceBo.userBO = $.jStorage.get("userObject");
    instanceBo.openid = deviceConfig;

    apiservices.updateOpenid(instanceBo,function(){
    },ux.fail);
}
var onNotificationAPN = function(event) {
	var pushNotification = window.plugins.pushNotification;
	if (event.alert) {
		if(event.alert != ''){
			//alert(event.alert);
            navigator.notification.beep(1);
            navigator.notification.alert(event.alert, function(){}, 'RTCM Notifications','OK');
		}
		//addToNotificationList(new Date().getTime(), event.alert);
		//navigator.notification.alert(event.alert);
	}
	if (event.badge) {
		pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
	}
	if (event.sound) {
		var snd = new Media(event.sound);
		snd.play();
	}
}


var onNotification = function(e){
    
    //alert("in notification");
	//$.jStorage.set('NotificationData',e);
    //alert("notification jstorage : " + JSON.stringify($.jStorage.get('NotificationData')));
	switch(e.event){
        
        case 'registered':
            //alert('in device registration');
            if(e.regid.length > 0 ){
                $.jStorage.set("PNRegistrationID", e.regid);
                //alert("PNR : "+$.jStorage.get("PNRegistrationID", e.regid));

                deviceConfig.uuid = $.jStorage.get("PNRegistrationID");
                deviceConfig.platform = device.platform;
                deviceConfig.model = device.model;
                deviceConfig.version = device.version;
                var logindata = $.jStorage.get('userObject');
                logindata.deviceBO = {};
                logindata.deviceBO = deviceConfig;
                $.jStorage.set('userObject',logindata);

                var instanceBo = {};
                instanceBo.userBO = $.jStorage.get("userObject");
                instanceBo.openid = deviceConfig;

                apiservices.updateOpenid(instanceBo,function(){
                },ux.fail);
            }
        break;
        case 'message':
            if(e.message != ''){
                //alert(e.message);
                navigator.notification.beep(1);
                navigator.notification.alert(e.message, function(){}, 'RTCM Notifications','OK');
            }
            //addToNotificationList(new Date().getTime(), e.message);
        break;
        case 'error':
            alert('GCM error = '+e.msg);
        break;

        default:
            alert('An unknown GCM event has occurred');
        break;
    }
}

/**
 * Function to send device id to server
 * @auther : Tanvir 
 */
function sendDeviceId(){
	//alert("in sendDeviceId Function");
	pushNotification = window.plugins.pushNotification;
    if(device.platform == 'android' || device.platform == 'Android'){
        //alert("in android");
        pushNotification.register(
            successHandler1,
            errorHandler,
            {
                "senderID":"926710118903",
                "ecb":"onNotification"
            });
    }else{
        //alert("in IOS");
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
	   			"badge":"true",
	   			"sound":"true",
	   			"alert":"true",
	   			"ecb":"onNotificationAPN"
	   		}
	    );
    }
	
}

var addToNotificationList = function(id, message){
	var notification = {};
	notification.id = id;
	notification.message = message;
	
	var notificationList = $.jStorage.get('NotificationList');
	window.localStorage.setItem('Notifications', JSON.stringify(notificationList));
	
	if(notificationList != undefined || notificationList != null ){ // add service to existing list
		notificationList.push(notification);
		$.jStorage.set('NotificationList',notificationList);
		window.localStorage.setItem('Notifications', JSON.stringify(notificationList));
	}
	else{ // create list if doesn't exist
		var notifList = [];
		notifList.push(notification);
		$.jStorage.set('NotificationList',notifList);
		window.localStorage.setItem('Notifications', JSON.stringify(notifList));
	}
	//setNotificationCount();
	//alert("From loacal : "+window.localStorage.getItem('Notifications'));
}