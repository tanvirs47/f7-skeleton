var apiservices = {};
apiservices.appversion = config.buildversion;
apiservices.url = config.server;

apiservices.login = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'app/login',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": "Basic RE9OT1RERUxFVEU6RE9OT1RERUxFVEUx=" //DONOTDELETE:DONOTDELETE1
            //"X-Forwarded-Proto":"localhost"
        },
        success: function(r) {  
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};

/*------------------- Get hotspot list --------------*/ 
apiservices.getHotspotsList = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url+'util/hotspot',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*------------------- Get township list --------------*/ 
apiservices.getTownshipList = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url+'facility/getcitylist',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*------------------- Get state list --------------*/ 
apiservices.getStateList = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    
   var requestEnvelope = {
       url  : 'application/states.json',//apiservices.url+'facility/getstatelist',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*------------------- Get Centers list --------------*/ 
apiservices.getTestingCentersList = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url+'util/getfacility',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}

/*------------------- Check is user online --------------*/ 
apiservices.checkOnline = function(instance, successCallback, failureCallback) {
    var instance = {};
    var requestEnvelope = {
        url  : apiservices.url+'util//online',
        type : 'POST',
        timeout: 20000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": $.jStorage.get("authparam")
            //"X-Forwarded-Proto":"localhost"
        },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};

apiservices.register = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    if(instance.instanceBOs.length > 0){
        $.each(instance.instanceBOs,function(i,v){
            //console.log(i,v);
            if(v.entityBO){
                $.each(v.entityBO,function(key,val){
                    if(key == 'k2x7u7ygYd5_1' && v.entityBO.k2x7u7ygYd5_1.length > 0){
                        v.entityBO.k2x7u7ygYd5 = "2";
                    }else if(key == 'k2x7u7ygYd5' && v.entityBO.k2x7u7ygYd5.length > 0){
                        v.entityBO.k2x7u7ygYd5 = "1";
                    }else if(key == 'mLOtu6ftELJ' && v.entityBO.mLOtu6ftELJ.length > 0){
                        v.entityBO.mLOtu6ftELJ= "1";
                    }
                });
            }
        });
    }
    // console.log(instance);return;
    var requestEnvelope = {
        url  : apiservices.url+'app/register',
        type : 'POST',
        timeout: 40000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": $.jStorage.get("authparam")
            //"X-Forwarded-Proto":"localhost"
        },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};

/* ------------------- Search Patient -------------------------- */
apiservices.search = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'search/search',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        // callback:'callback',
        dataType: "json",
        contentType : 'application/json;charset=UTF-8',
        headers: {
            "Authorization": $.jStorage.get("authparam")
            //"X-Forwarded-Proto":"localhost"
        },
        success: function(r) {
           // console.log(r);
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        } 
    };
   $.ajax(requestEnvelope);
};

/* ---------------get client list ----------------------*/
apiservices.patientList = function(instance, successCallback, failureCallback) {
    application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'client/clientlist',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            
            application.hidePreloader();
            successCallback(r);
        
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        } 
    };
    $.ajax(requestEnvelope);
    
};
/* ---------------get referred client list ----------------------*/
apiservices.referredPatientList = function(instance, successCallback, failureCallback) {
    application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'client/getreferrals',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            
            application.hidePreloader();
            successCallback(r);
        
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
    $.ajax(requestEnvelope);
    
};
/* ---------------------Get messages list ----------------------- */
apiservices.getMessagesList = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'communication/mymessages',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};

/* ---------------------Get users list ----------------------- */
apiservices.getUsersList = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'user/getlist',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        } 
    };
   $.ajax(requestEnvelope);
};
/* --------- Get dashboard indicators -------------------*/
apiservices.getIndicatorData =  function (instance, successCallback, failureCallback) {
    instance.appversion = apiservices.appversion;
    instance.preflanguage = $.jStorage.get("appLocale");
   var requestEnvelope = {
       url  : apiservices.url+'util/mobile/dashboard',
       type : 'POST',
        timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}

/* --------- Get ORW dashboard indicators -------------------*/
apiservices.getORWIndicatorData =  function (instance, successCallback, failureCallback) {
    instance.appversion = apiservices.appversion;
    instance.preflanguage = $.jStorage.get("appLocale");
   var requestEnvelope = {
       url  : apiservices.url+'util/orw/app/dashboard',
       type : 'POST',
        timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}


/* ---------------------Broadcast message----------------------- */    
apiservices.broadcastMessage = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'communication/broadcast',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};
/*------------------- Case History --------------*/ 
apiservices.casehistory = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url+'client/casehistory',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*------------------- check QR Code Association  --------------*/ 
apiservices.checkQRAssociation = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url+'util/check/qrcode',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}

apiservices.getHTCandSTIValidations = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'util/checkrefservice',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": $.jStorage.get("authparam")
            //"X-Forwarded-Proto":"localhost"
        },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        }  
    };
   $.ajax(requestEnvelope);
};

/*--------------------- Alerts Page ---------------*/ 
apiservices.alerts = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   var requestEnvelope = {
       url  : apiservices.url +'alert/duealertorw',
       // url: 'json/alerts.json',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*---------------------[ not in use ] Referral Alerts Page ---------------*/ 
apiservices.referralAlerts = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   //console.log(JSON.stringify(instance));
   var requestEnvelope = {
       url  : apiservices.url +'alert/refalertorw',
       // url: 'json/alerts.json',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}
/*--------------------- Health Education validations ---------------*/ 
apiservices.getHealthEducationValidation = function (instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
   //console.log(JSON.stringify(instance));
   var requestEnvelope = {
       url  : apiservices.url +'client/servicedata',
       // url: 'json/alerts.json',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e,exception) {
            failureCallback(e,exception);
        } 
   };
  $.ajax(requestEnvelope);  
}

/* ------------- Update one signal id ------------------ */
apiservices.updateOpenid = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'user/updateopenid',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": $.jStorage.get("authparam")
        },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        } 
    };
   $.ajax(requestEnvelope);
};

/* --------------Notifications API--------------------------- */
apiservices.getNotificationsList = function(instance, successCallback, failureCallback) {
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'communication/mynotification',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};

/* --------------update user language API--------------------------- */
apiservices.updateUserLanguage = function(instance, successCallback, failureCallback) {
    
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'util/updatelanguage',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};

/* --------------get orw users list--------------------------- */
apiservices.getOrwusersList = function(instance, successCallback, failureCallback) {
    
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : config.serverService+'dashboard/stc/user/getlist/orw',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};

/* --------------get orw targets--------------------------- */
apiservices.getOrwTargets = function(instance, successCallback, failureCallback) {
    
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'util/get/target',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};
/* --------------update orw targets--------------------------- */
apiservices.updateOrwTargets = function(instance, successCallback, failureCallback) {
    
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'util/target/update',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};





// thai apis

// get notifications list

apiservices.updateUserProfile = function(instance, successCallback, failureCallback) {
    
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'user/update',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
};

apiservices.rrttrChart = function (instance, successCallback, failureCallback) {
    
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url: apiservices.url + 'dashboard/thai/indicator/getlist',
        //url: "application/bar.json",
        type: 'POST',
        timeout: 30000,
        data: JSON.stringify(instance),
        headers: { "Authorization": $.jStorage.get("authparam") },
        contentType: 'application/json',
        success: function (r) {
            successCallback(r);
        },
        error: function (e) {
            failureCallback(e);
        }
    };
    $.ajax(requestEnvelope);  
};

    

apiservices.loadFacilities = function(instance, successCallback, failureCallback) {
    
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'dashboard/common/nearme',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            //console.log(JSON.stringify(r));
            successCallback(r);
        },
        error: function(e) {
            //console.log(e);
            failureCallback(e);
        } 
    };
   $.ajax(requestEnvelope);
}
/*apiservices.loadFacilities = function(params, successCallback, failureCallback) {    
    var query = '?latitude='+params.latitude+"&longitude="+params.longitude+"&facilityid="+params.facilityid+"&programid="+params.programid+"&callback="+successCallback;
    //

    var requestEnvelope = {
        url  : 'http://rtm.duredemos.com/sanac/api/core/nearme/getfacilities'+query,
        type : 'GET',
        dataType: 'jsonp'
    };
    $.ajax(requestEnvelope);    
};*/

apiservices.checkoutNearme = function() {
    application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
    navigator.geolocation.getCurrentPosition(function(pos) {
        application.hidePreloader();
        application.nmPosition = pos;
        
        var latlng = pos.coords.latitude+","+pos.coords.longitude;        
        var getUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&sensor=false';
        //console.log(getUrl);
        var requestEnvelope = {
            url  : getUrl,
            type : 'GET',
            success: function(r) {
                //console.log(r.results[0].formatted_address);
                $('.mylocation').html('<i class="ion-android-locate"></i> ' + r.results[0].formatted_address);
                
                //successCallback(JSON.parse(r));
                apiservices.loadFacilities({
                    latitude : pos.coords.latitude,//"12.937583"
                    longitude : pos.coords.longitude //"100.886535"
                    //facilityid : null,
                    //programid : $.jStorage.get("userObject").programId
                }, nmMAP.markerView, ux.fail);
            },
            error: function(jqXHR, textStatus, e) {
                //failureCallback(JSON.parse(e));
                console.log(JSON.parse(e));
            }
        };
    $.ajax(requestEnvelope);
        
    },ux.gpsFail,{timeout : 30000});
    
}
// default for HTML5API
apiservices.revergeoGoogleAPI = function(latlng, successCallback, errorCallback) {
    var request = {
  url : 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&&language=th&sensor=false',
  type: 'GET',
        success : successCallback,
        error : errorCallback
 };
 $.ajax(request);
}

//get registration summary
apiservices.getRegistrationSummary = function(instance, successCallback, failureCallback) {
    
    application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
    
    
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'dashboard/thai/indicator/getsummary',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: {
            "Authorization": $.jStorage.get("authparam")
        },
        success: function(r) {
            application.hidePreloader();
            successCallback(r);
        },
        error: function(e) {
            application.hidePreloader();
            failureCallback(e);
        }
    };
   $.ajax(requestEnvelope);
};

apiservices.getQRCode = function (instance, successCallback, failureCallback) {
   var requestEnvelope = {
       url  : 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UC%E0%B8%84345678' ,
       // url: 'json/alerts.json',
       type : 'POST',
       timeout: 30000,
       data:JSON.stringify(instance),
       contentType : 'application/json',
       headers: {
           "Authorization": $.jStorage.get("authparam")
       },
       success: function(r) {
         successCallback(r)
       },
       error: function(e) {
         failureCallback(e);
       }
   };
  $.ajax(requestEnvelope);  
}

apiservices.loadNmFacilities = function(instance, successCallback, failureCallback) {
    application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    var requestEnvelope = {
        url  : apiservices.url+'util/nearme/type',
        type : 'POST',
        timeout: 30000,
        data:JSON.stringify(instance),
        contentType : 'application/json',
        headers: { "Authorization": $.jStorage.get("authparam") },
        success: function(r) {
            
            application.hidePreloader();
            successCallback(r);
        
        },
        error: function(e,exception) {
            failureCallback(e,exception);
        } 
    };
    $.ajax(requestEnvelope);
    
};