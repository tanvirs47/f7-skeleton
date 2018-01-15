var uc = {};
//uc.quickMenu = true;
uc.commingFromSearch = false;
uc.instanceBO = {};


// Device WIFI & Location Services - State variables
uc.deviceState = {};
uc.deviceState.gps = false;
uc.deviceState.online = false;

// Location services API - Option variables
uc.locationOptions = {};
uc.locationOptions.timeout = 180000;
uc.locationOptions.maximumAge = 30000;
uc.locationOptions.enableHighAccuracy = false;

//pouchDB _id selected for EDIT.
uc.editClientId = "";


uc.commonComponentHandler = function(){
    /* gender selector */
    if($('input[name="IClOfxEogHN"]').is(":checked")){
                
        $("span[for='gender-female']").css("background-color","#d32f2f");
        $("span[for='gender-male']").css("background-color","");
    }else{
        $("span[for='gender-male']").css("background-color","#d32f2f");
        $("span[for='gender-female']").css("background-color","");
    }
    
    $('input[name="IClOfxEogHN"]').on('change', function () {
        if($(this).is(":checked")){
            
            $("span[for='gender-female']").css("background-color","#d32f2f");
            $("span[for='gender-male']").css("background-color","");
        }else{
            
            $("span[for='gender-male']").css("background-color","#d32f2f");
            $("span[for='gender-female']").css("background-color","");
        }
    
    });
    
    $$("span[for='gender-female']").on('taphold', function () {
      $('input[name="IClOfxEogHN"]').trigger("click");
    });
     $$("span[for='gender-male']").on('taphold', function () {
      $('input[name="IClOfxEogHN"]').trigger("click");
    });
    /* gender selector end */
    
    // fill year of birth dropdown list 
    for (i = new Date().getFullYear(); i > 1917; i--)
    {
        $('select[name="DaNLHNTlMFK"]').append($('<option />').val(i).html(i));
    }
}
uc.clearInstance = function() {
    uc.instanceBO = {};
}

uc.buildPatientInstanceBO = function(params,mode) {
    
    uc.draftForms = {};
    uc.draftForms.mode = mode; 
    if(uc.commingFromSearch && ux.selectedPatient != undefined){
        uc.draftForms.registerForm = ux.selectedPatient;
    }else{
        
        uc.draftForms.registerForm = application.formGetData('registration');
        if(!$.isEmptyObject(params)){
            $.extend(true, uc.draftForms.registerForm, params);
        }
    }
    return uc.draftForms;
}


uc.registerPatient = function(params,mode) {
    //var formID = $('.page').find('form').prop("id");
    //uc.buildPatientInstanceBO(params,mode);
    uc.draftForms = {};
    uc.draftForms.mode = mode;
    uc.draftForms.registerForm = application.formGetData('registration');
    
    if(!$.isEmptyObject(params)){
        $.extend(true, uc.draftForms.registerForm, params);
    }
        
    if(mode == "DRAFT"){
        appDB.saveEntity(uc.draftForms,function(e){
            mainView.loadPage("fragments/home.html");
            application.formDeleteData('registration');
            //if offline
            application.cordovaAPI.toast({
                text : translations.translateKey('register.patientReg')
            });
            application.hidePreloader();
        });
    }else{
         appDB.saveEntity(uc.draftForms, ux.patientPersistedOfflineCallback);
    }
}

uc.registerPatientAndContinue = function(params) {
    //uc.buildPatientInstanceBO(params);
    ///console.log(uc.instanceBO);
    ux.patientPersistedOfflineAndContinueCallback();
    
    //appDB.saveEntity(uc.instanceBO, ux.patientPersistedOfflineAndContinueCallback);
}

uc.saveStageDetails = function(params,mode) {
    
    //uc.buildPatientInstanceBO(params,mode); 
    
    uc.draftForms = {};
    uc.draftForms.mode = mode; 
    uc.draftForms.registerForm = ux.selectedPatient;
    
    // get Stages data from Framework7 storage
   
    /*$(ux.stages).each(function(i, e) {
        var stageData = {};
        if(application.formGetData(e) != undefined){
            $.extend(true, stageData, application.formGetData(e));
            uc.draftForms[e] = stageData;
        }
    });*/
    
    uc.draftForms[params] = application.formGetData(params)
    
    if(mode == "DRAFT"){
        appDB.saveEntity(uc.draftForms, function(){
            
            $(ux.stages).each(function(i, e) {
                application.formDeleteData(e);
            });
            uc.editClientId = "";
            mainView.router.loadPage("fragments/services-home.html");
            application.cordovaAPI.toast({
                text : translations.translateKey('register.patientReg')
            });
        });
        
    }else{
        //console.log(uc.draftForms);return;
        appDB.saveEntity(uc.draftForms, ux.saveStageCallback);
    }
    
    application.hidePreloader();
}


uc.updateApplicantOneSignal = function(id){
    //update API TODO
    var instanceBo = {};
    instanceBo.username = $.jStorage.get("userObject").username;
    instanceBo.openid = id;
    instanceBo.appversion = config.buildversion;
    instanceBo.preflanguage = $.jStorage.get("appLocale");
    
    //alert(JSON.stringify(instanceBo));
    apiservices.updateOpenid(instanceBo,function(r){
        //alert(JSON.stringify(r));
    },ux.fail);
}

uc.formArrayToJSON = function ($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

uc.actionButtons = function(objectid){
    
    var buttons = [/*{
        text: translations.translateKey("menu.edit"),
       
        onClick: function () {
            
            //application.editorMode = 'EDIT';
            appDB.getSingleEntity(objectid,function(doc){
                
                uc.editClientId = objectid;
                
                application.formStoreData('registration',doc.data.registerForm);
                                
                
                $(ux.stages).each(function(i, e) {
                    if(doc.data.hasOwnProperty(e)){
                        application.formStoreData(e,doc.data[e]);
                    }
                });
                
                console.log(Object.keys(doc.data.registerForm).length);
                // this is for services 
                if(Object.keys(doc.data.registerForm).length > 2){
                    ux.selectedPatient = doc.data.registerForm;
                    mainView.loadPage("fragments/register.html");
                }else{
                    mainView.loadPage("fragments/services-home.html");
                }
                                
            });
            
        }
    },*/ {
        text: translations.translateKey("menu.delete"),
        onClick: function () {
            application.confirm(translations.translateKey("app.confirm"), function () {
                //application.editorMode = '';
                appDB.deleteEntity(objectid);
                
                //mainView.router.refreshPage();
                            
                application.alert(translations.translateKey("app.recordRemoved"),function(){
                    application.showOfflineClientList();
                })
                //alert("1");
                
                
            });                    
        }
    }, {
        text: translations.translateKey("menu.cancel"),
        color: 'red'
    }];
    application.actions(buttons);
}

/*---------------- Calendar --------------*/ 
uc.calendar = function(){
    var objDate = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            maxDate: moment().format('M/D/YYYY')
            // value: []
    }

    if($('#dob')){
        objDate.input = "#dob"; 
        var myCalendar = application.calendar(objDate);
    }
     
}

uc.dateThaiToEnglish = function(dateInstance){
    var d = new Date(dateInstance);
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    if(year > 2200){
        year= parseInt(year) - 543;
        return moment(month+"-"+day+"-"+year,"MM-DD-YYYY").format("YYYY-MM-DD");
    }else{
        return dateInstance;
    }    
}

uc.calculateDOBFromAge = function(age){
    var d = moment().format('YYYY-MM-DD');
    var check = moment(d, 'YYYY-MM-DD');
    var day   = check.format('DD');
    var month = check.format('MM');
    var year  = check.format('YYYY');
    year = parseInt(year) - parseInt(age);
    var dateInstance = year+"-"+month+"-"+day;
    return uc.dateThaiToEnglish(dateInstance);
    
}

/*----------- MERGE TWO OBJECTS --------------*/ 

uc.mergeObj = function(result, val1, r) {
    try{
        $.each(val1, function (i, v) {
            var j = i;
            var objval = v;
            $.each(result.schema.properties, function (i, v) {
                if(result.schema.properties[j].title){
                    var key = result.schema.properties[j].title;
                    //console.log(key);
                    r[key] = objval; 

                    if(result.options.fields[j].optionLabels && objval != ""){
                        var aps = parseInt(objval);
                        r[key] = result.options.fields[j].optionLabels[(aps - 1)];
                    }

                }else if(result.options.fields[j].rightLabel && objval.length > 0){
                    var key = result.options.fields[j].rightLabel;
                    r[key] = "";
                }

            });
            return r;
        });
    }catch(e){
        
    }
    
};

//fuction to check whether services is pending to publish for selected client 

uc.checkInLocalServices = function(successCallback){
    var isServiceDataAvailable = false;
    appDB.getLocalPatientCount(function(result){
        
        if(result.total_rows > 0){
            
            $.each(result.rows,function(i,v){
                console.log("3");
                //console.log(i+":"+v.doc._id);
                if(v.doc.data.registerForm.fGXTEjd8amT === ux.selectedPatient.fGXTEjd8amT){
                    console.log("4");
                    isServiceDataAvailable = true;
                    return false;
                }
            });
            successCallback(isServiceDataAvailable);
        }else{
            //console.log("6");
            successCallback(isServiceDataAvailable);
        }
    });
}

uc.backToHome = function(){
    
    switch($.jStorage.get("userObject").userrole) {
        case 'ORW':
            application.mainView.loadPage("fragments/home.html");
            application.mainView.reloadPage("fragments/home.html")
        break;
        case 'HTC_P':
            application.mainView.loadPage("fragments/htc-home.html");
        break;
        case 'STI_P':
            application.mainView.loadPage("fragments/htc-home.html");
        break;
        case 'ART_P':
            application.mainView.loadPage("fragments/htc-home.html");
        break;
        case 'SUP':
            application.mainView.loadPage("fragments/sup-home.html");
        
        break;
        default:
    };
    /*if($.jStorage.get("userObject").userrole == "HTC_P" || $.jStorage.get("userObject").userrole == "STI_P"){
       application.mainView.loadPage("fragments/htc-home.html");
    }else{
        application.mainView.loadPage("fragments/home.html");
        application.mainView.reloadPage("fragments/home.html")

    }*/
}

uc.roleBaseLeftPanel = function(){
    switch($.jStorage.get("userObject").userrole) {
        case 'ORW':
            $(".side-panel-alert, .btn-client-profile").show();
            $(".btn-targets").hide();
        break;
        case 'HTC_P':
            $(".side-panel-alert, .btn-client-profile, .btn-targets").hide();
        break;
        case 'STI_P':
            $(".side-panel-alert, .btn-client-profile, .btn-targets").hide();
        break;
        case 'TB_P':
            $(".side-panel-alert, .btn-client-profile, .btn-targets").hide();
        break;
        case 'ART_P':
            $(".side-panel-alert, .btn-client-profile, .btn-targets").hide();
        break;
        case 'SUP':
            $(".side-panel-alert, .btn-targets").show();
            $(".btn-client-profile").hide();
        break;
    };
}