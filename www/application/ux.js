var ux = {};
ux.searchResultBO = {};
ux.hotspotImages = [];
ux.cloudinaryResponseUrls = [];
ux.stages = ["REF_HIV", "REF_STI", "REF_TB", "SR_COMM", "SR_HTC", "SR_STI", "SR_TB","SR_HE","SR_IEC","SR_ART"];
ux.area = '';
ux.areaLat = ''; 
ux.areaLng = '';
ux.serviceValidations = {};
ux.selectedUserFlow = "";

ux.clearLocalFormsData = function(){
    application.formDeleteData('registration');
    $(ux.stages).each(function(i, e) {
        application.formDeleteData(e);
    });
    //ux.searchResultBO = {};
}

// Update forms data on inputs change
ux.updateFormData = function(formId){
    if (!formId) return;
    var formJSON = application.formToJSON('#'+formId);
    if (!formJSON) return;
    application.formStoreData(formId, formJSON);
    $('form').trigger('store', {data: formJSON});
}

// Function to quick publish client record with registrationForm
ux.patientPersistedOfflineCallback = function(r) {
    apiservices.checkOnline({},function(s){
        
        //If Online - then save API and on success callback remove from pouchDB
        var finalInstanceBO = {};
        finalInstanceBO.user = $.jStorage.get("userObject").username;
        finalInstanceBO.authparam = $.jStorage.get("authparam");
        finalInstanceBO.appversion = apiservices.appversion;
        finalInstanceBO.preflanguage = $.jStorage.get("appLocale");
        finalInstanceBO.instanceBOs = [];

        //console.log(r);
        //get single record to publish
        appDB.getSingleEntity(r.id,function(doc){
            //console.log(doc);
            var instanceBO = {};
            instanceBO.instanceID = r.id; // pauchdb id
            instanceBO.entityBO = doc.data.registerForm; 
            
            if(doc.data.allowduplicate != undefined){
                instanceBO.allowduplicate = doc.data.allowduplicate;
            }
            finalInstanceBO.instanceBOs.push(instanceBO);
            //console.log(JSON.stringify(finalInstanceBO));
            //return;

            apiservices.register(finalInstanceBO,function(rdata){
                if(rdata.status == "fail"){
                    application.alert(rdata.message);
                }else{
                    var duplicateFlag = false;
                    // remove record from pauchdb
                    //console.log(rdata);
                    var uics = Object.keys(rdata);
                    $.each(uics,function(i,v){
                        //console.log(v);
                        if(rdata[v].GHIjkEcm2NN == "duplicate"){
                            duplicateFlag = true;
                        }else{
                            if(v == r.id){
                                appDB.deleteEntity(v);
                            }
                        }
                    });

                    if(duplicateFlag){
                      ux.duplicateUICPopup(rdata);  
                    }else{
                        //mainView.loadPage("fragments/home.html");
                        ux.selectedPatient = rdata[r.id];
                        application.formDeleteData('registration');
                        document.getElementById("registration").reset();
                        ux.resetRegistrationRadioButtons();
                        uc.editClientId = "";
                        
                        application.showTab('#tab2');
                        application.alert(translations.translateKey('register.registered')+"<br />UIC : "+rdata[r.id].GHIjkEcm2NN);
                        $(".selected-uic").html("UIC : "+rdata[r.id].GHIjkEcm2NN.slice(0,10));
                        /*application.cordovaAPI.toast({
                            text : translations.translateKey('register.registered')
                        });*/
                        /*$.get('templates/generated-uic.html', function(data) {
                            var compiled = Template7.compile(data);
                            
                            application.popup('<div class="popup uicQR-popup tablet-fullscreen">'+compiled({"title":"register.registered"})+'</div>');
                            $('.uicQR-popup').on('opened', function () {
                                console.log('qr popup open');
                                translations.loadTranslations($.jStorage.get('appLocale'));
                                //rdata[r.id];
                                $('.generated-uic').html(compiled({"uic": rdata[r.id]}));

                                $('.trigger-close-qr').off('click');
                                $('.trigger-close-qr').on('click', function() {
                                    application.closeModal();
                                });
                                
                                
                            });
                        });*/
                    }
                }
            },ux.registerFail);
        });
    },function(e){
        application.formDeleteData('registration');
        document.getElementById("registration").reset();
        //if offline
        application.cordovaAPI.toast({
            text : translations.translateKey('register.patientReg')
        });
        mainView.router.loadPage("fragments/home.html");
    });
    application.hidePreloader();
}

// Function to send for stages form filling  
ux.patientPersistedOfflineAndContinueCallback = function(r) {
    //console.log(r);
    uc.commingFromSearch = false;
    mainView.loadPage("fragments/profile.html");
}

// Function to publish client data with stages
ux.saveStageCallback = function(r) {
    //console.log(r);
    ux.selectedFacility = '';
    apiservices.checkOnline({},function(s){ 
        //successcallback
        // Save API and on success remove from pouchDB
        var finalInstanceBO = {};
        finalInstanceBO.user = $.jStorage.get("userObject").username;
        finalInstanceBO.authparam = $.jStorage.get("authparam");
        finalInstanceBO.appversion = apiservices.appversion;
        finalInstanceBO.preflanguage = $.jStorage.get("appLocale");
        finalInstanceBO.instanceBOs = [];

        //console.log(r.id);
        //get single record to publish
        appDB.getSingleEntity(r.id,function(doc){

            //console.log(doc);return;
            var instanceBO = {};
            instanceBO.instanceID = r.id; // pauchdb id
            instanceBO.entityBO = doc.data.registerForm; 
            instanceBO.stages = {};
        
            
            $(ux.stages).each(function(i, e) {
                if(doc.data.hasOwnProperty(e)){
                    instanceBO.stages[e] = doc.data[e];
                }
            });
            
            
            finalInstanceBO.instanceBOs.push(instanceBO);
            //console.log(JSON.stringify(finalInstanceBO));return;

            //send data to server
            apiservices.register(finalInstanceBO,function(rdata){

                //console.log(rdata);
                if(rdata.status == "fail"){
                    application.alert(rdata.message);
                }else{
                    var duplicateFlag = false;
                    // remove record from pauchdb
                    var uics = Object.keys(rdata);
                    $.each(uics,function(i,v){
                        //console.log(v);
                        if(rdata[v] == "duplicate"){
                            duplicateFlag = true;
                        }else{
                            if(v == r.id){
                                appDB.deleteEntity(v);
                            }
                        }
                    });

                    if(duplicateFlag){
                      ux.duplicateUICPopup(rdata);  
                    }else{
                        ///console.log("clear forms");
                        ux.clearLocalFormsData();
                        //hide loader
                        
                        if($.jStorage.get("userObject").userrole == "ORW"){
                            application.cordovaAPI.toast({
                                text : translations.translateKey('profile.sent')
                            });
                            mainView.router.loadPage("fragments/services-home.html?backto=services-home");
                            
                        }else if($.jStorage.get("userObject").userrole == "SUP"){
                            //mainView.router.loadPage("fragments/sup-home.html");
                            application.cordovaAPI.toast({
                                text : translations.translateKey('profile.serviceProvided')
                            });
                            mainView.router.loadPage("fragments/services-home.html?backto=services-home");
                        }else{
                            application.cordovaAPI.toast({
                                text : translations.translateKey('profile.serviceProvided')
                            });
                            mainView.router.loadPage("fragments/htc-home.html");
                        }
                        
                        
                        uc.editClientId = "";
                    }
                }
            },ux.registerFail);

        });
    },function(e){
        
        ux.clearLocalFormsData();
        if($.jStorage.get("userObject").userrole == "ORW"){
            mainView.router.loadPage("fragments/services-home.html");
        }else if($.jStorage.get("userObject").userrole == "SUP"){
            mainView.router.loadPage("fragments/sup-home.html");
        }else{
            mainView.router.loadPage("fragments/htc-home.html");
        }
        application.cordovaAPI.toast({
            text : translations.translateKey('register.patientReg')
        });
    });
   
}

// Sync all records
ux.syncPatients = function(){
    apiservices.checkOnline({},function(s){ 
            
        var finalInstanceBO = {};
        finalInstanceBO.user = $.jStorage.get("userObject").username;
        finalInstanceBO.authparam = $.jStorage.get("authparam");
        finalInstanceBO.appversion = apiservices.appversion;
        finalInstanceBO.preflanguage = $.jStorage.get("appLocale");
        finalInstanceBO.instanceBOs = [];

        appDB.getLocalPatientCount(function(result){
            if(result.total_rows > 0){
                $.each(result.rows,function(i,v){
                    //console.log(i+":"+v.doc._id);
                    if(v.doc.data.mode == "COMPLETE"){
                        
                        //get single record to publish
                        if(v.doc.data.registerForm != undefined || !$.isEmptyObject(v.doc.data.registerForm)){
                            
                            var instanceBO = {};
                            instanceBO.instanceID = v.doc._id; // pauchdb id
                            
                            instanceBO.entityBO = v.doc.data.registerForm;
                            
                            if(v.doc.allowduplicate != undefined){
                                instanceBO.allowduplicate = v.doc.allowduplicate;
                            }

                            instanceBO.stages = {};

                            $(ux.stages).each(function(i, e) {
                                if(v.doc.data.hasOwnProperty(e)){
                                    instanceBO.stages[e] = v.doc.data[e];
                                }
                            });

                            finalInstanceBO.instanceBOs.push(instanceBO);   
                            
                        }else{
                            appDB.deleteEntity(v.doc._id);
                        }
                        //console.log(JSON.stringify(finalInstanceBO));
                    }
                    
                });
                //console.log(JSON.stringify(finalInstanceBO));
                //send data to server
                apiservices.register(finalInstanceBO,function(rdata){

                    //console.log(rdata);
                    if(rdata.status == "fail"){
                        application.hidePreloader();
                        application.alert(rdata.message);
                    }else {
                        var duplicateFlag = false;
                        // remove record from pauchdb
                        var uics = Object.keys(rdata);
                        $.each(uics,function(i,v){
                            //console.log(v);
                            if(rdata[v] == "duplicate"){
                                duplicateFlag = true;
                            }else{
                                appDB.deleteEntity(v);
                            }
                        });
                        
                        
                        if(duplicateFlag){
                            ux.duplicateUICPopup(rdata);  
                        }else{
                            application.hidePreloader();
                            application.alert(translations.translateKey('app.sync'),function(){
                                ux.getSyncCount();
                                application.showOfflineClientList();
                                
                            });
                            
                        }
                    }
                },ux.registerFail);
            }
            
        });
    },function(e){
        
        appDB.getLocalPatientCount(function(result){
            $(".patientCount").html(result.total_rows);
        });
        application.cordovaAPI.toast({
            text : translations.translateKey('app.noInternet')
        });
        
    });
}  

ux.loginSuccessCallback = function(r) {
   // console.log(r);
    if(r.status == "success") {
        $.jStorage.set("userObject", r);
        // roles management
        uc.backToHome();
        
        onesignalAPI.init(); 
        if($.jStorage.get("PNRegistrationID") == null && config.isApp){
            // get device registration id and send it to our server 
            //sendDeviceId();
        }
        
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }
}
// function to check duplicate uics
ux.duplicateUICPopup = function(rdata){
    application.hidePreloader();
    
    //$.getJSON('application/duplicate.json', function(rdata) {
        //console.log(rdata);
        var duplicateLocaldata = [];
        $.get('templates/duplicate-uic.html', function(data) {
            $.each(rdata,function(k,v){
                if(v['GHIjkEcm2NN'] == "duplicate"){
                    appDB.getSingleEntity(k,function(r){
                        var instance = {};
                        instance.id = r._id;
                        instance.nickName = r.data.registerForm.yjsuldl4RAA;
                        instance.dob = r.data.registerForm.DaNLHNTlMFK;
                        instance.gender = r.data.registerForm.IClOfxEogHN;
                        duplicateLocaldata.push(instance);
                    });
                }
            });
            var compiled = Template7.compile(data);  
            
            application.popup('<div class="popup duplicate-popup tablet-fullscreen">'+compiled({"title":"register.syncPartial"})+'</div>');

            $('.duplicate-popup').on('opened', function () {
                
                translations.loadTranslations($.jStorage.get('appLocale'));
                $('.duplicate-list').html(compiled(duplicateLocaldata));
                
                $('.trigger-close-dup').off('click');
                $('.trigger-close-dup').on('click', function() {
                    application.closeModal();
                    //application.closeModal('.duplicate-popup');
                    //application.closeModal('.popup-publish');
                    ux.clearLocalFormsData();
                    mainView.loadPage("fragments/register.html");
                });
                
                $('.trigger-show-duplicates').off('click');
                $('.trigger-show-duplicates').on('click',function(){
                    //console.log(rdata.data[$(this).data('pouchid')]);
                    var r = rdata.data[$(this).data('pouchid')];
                    
                    //console.log($(this).data('pouchid'));
                    var pouch_id = $(this).data('pouchid');
                    
                    $.get('templates/duplicate-uic-details.html', function(data) {
                        var compiled = Template7.compile(data);  
                        
                        application.popup('<div class="popup duplicate-popup1 tablet-fullscreen">'+compiled({"title":"register.duplicateDetails"})+'</div>');
                        
                        $('.duplicate-popup1').on('opened', function () {
                            
                            $('.trigger-close-popup').off('click');
                            $('.trigger-close-popup').on('click', function() {
                                application.closeModal('.duplicate-popup1');
                            });
                                                                
                            $('.trigger-create-new').off('click');
                            $('.trigger-create-new').on('click', function() {
                                //alert(pouch_id);
                                appDB.getSingleEntity(pouch_id,function(r){
                                    //console.log(r);
                                    return db.put({
                                        _id: pouch_id,
                                        _rev: r._rev,
                                        data: r.data,
                                        allowduplicate: true
                                    });  
                                });
                                application.closeModal();
                                mainView.router.loadPage("fragments/home.html");
                                // sync all complete records
                                ux.syncPatients();
                                //application.closeModal();
                                
                                //application.alert("saved!");
                            });
                            
                            ux.searchResultBO = r;
                            $.get('templates/search-results1.html', function (data) {
                                //application.accordionToggle('li.accordion-item');
                                //console.log(r);
                                translations.loadTranslations($.jStorage.get('appLocale'));
                                var compiled = Template7.compile(data);
                                //console.log(compiled(r));
                                $('.patienstList-container1').html(compiled(r)); 

                                $('.trigger-show-details').off('click');
                                $('.trigger-show-details').on('click', function() {
                                    
                                    uc.commingFromSearch = true;
                                    //console.log($(this).data('sysuic'));
                                    var clientInstance = {};
                                    clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                                    clientInstance.GHIjkEcm2NN = $(this).data('uic');
                                    ux.selectedPatient = clientInstance;
                                    
                                    appDB.deleteEntity(pouch_id);
                                    application.closeModal();
                                    mainView.router.loadPage("fragments/services-home.html");

                                });
                            });
                           
                        });
                    });
                })

            });
        });
    //});
    
}
ux.searchSuccessCallback = function(r){
//console.log(r);
    if(r.status == 'success'){
        //console.log(r);
        if(r.instanceBOs.length > 0){
            
            ux.roleWiseRegistrationButton();
            
            ux.searchResultBO = r;
            $.get('templates/search-results.html', function (data) {
                application.accordionToggle('#'+$$('.tab.active')[0].id+' li.accordion-item');
                
                var compiled = Template7.compile(data);
                $('#'+$$('.tab.active')[0].id+' .patienstList-container').html(compiled(r)); 
                
                translations.loadTranslations($.jStorage.get('appLocale'));
                
                // show history popup
                var patientInfo = r;
                $('.trigger-case-history').off('click');
                $('.trigger-case-history').on('click', function() {
                    var instance = {};
                    instance.preflanguage = $.jStorage.get('appLocale');
                    instance.appversion = apiservices.appversion;
                    instance.sysuic = $(this).data('sysuic');
                    var index = $(this).data('index');
                    instance.userrole = $.jStorage.get("userObject").userrole;
                    apiservices.casehistory(instance,function (r) {
                        $.get('templates/casehistory.html', function (data) {
                            
                            var compiled = Template7.compile(data);
                            r.patientInfo = patientInfo.instanceBOs[index];
                            //console.log(r);
                            var popupHTML = compiled(r);
                            application.popup(popupHTML);
                            translations.loadTranslations($.jStorage.get('appLocale'));
                        });

                    }, ux.fail);
                });
                    
                $('.trigger-show-details').off('click');
                $('.trigger-show-details').on('click', function() {
                    uc.commingFromSearch = true;
                    //console.log($(this).data('sysuic'));
                    var clientInstance = {};
                    clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                    clientInstance.GHIjkEcm2NN = $(this).data('uic');
                    ux.selectedPatient = clientInstance;
                    
                    if(ux.selectedUserFlow != ""){
                        mainView.router.loadPage("fragments/services-home.html");
                    }else{
                        /*if($.jStorage.get("userObject").userrole == 'HTC_P'){
                            mainView.router.loadPage("fragments/htc-services.html");
                        }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                            mainView.router.loadPage("fragments/sti-services.html");
                        }else if($.jStorage.get("userObject").userrole == 'ART_P'){
                            mainView.router.loadPage("fragments/art-services.html");
                        }*/
                        mainView.router.loadPage("fragments/services-home.html");
                    }
                });
            });
        }else{
            //$('.patienstList-container').html(translations.translateKey('search.noRecords'));
            if($.jStorage.get("userObject").userrole == 'ORW'){
                application.confirm(translations.translateKey("search.noRecordsWithRegister"), function () {
                    if($(".tab-link.active")[0].hash == "#tab1"){
                        $("#btn-register1").show();
                    }else if($(".tab-link.active")[0].hash == "#tab2"){
                        $("#btn-register2").show();
                    }else if($(".tab-link.active")[0].hash == "#tab3"){
                        $("#btn-register").show();
                    }
                
                });
            }else{
                application.alert(translations.translateKey('search.noRecords'));
            }
        }
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }
}
ux.refreshSummary = function(){
    appDB.getLocalPatientCount(function(result){
       $(".patientCount").html(result.total_rows);
    });
    //load users survey summary
    apiservices.getRegistrationSummary({
        "userName" : $.jStorage.get('userObject').userName
    }, function(r){
        //$.jStorage.set("surveySummery",r);
        if(r.status == "success"){
            $('.regTotal').html(r.total);
            $('.regToday').html(r.today);
            $('.alert-count').html(r.alertcount);
        }else if(r.status == "fail") {
            if(r.appversion != undefined){
                application.alert(r.message,function(){
                    window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
                });
            }else{
                application.alert(r.message);
            }
        }

    },ux.fail);
};

// patient list successcallback
ux.patientList = function(r){
    //application.hidePreloader();
    if(r.status == "success" && r.data.length > 0){
        //console.log(r);//return;
        $.get('templates/clients-list.html', function (data) {
            var compiled = Template7.compile(data);
            $('.infinite-scroll .list-block ul').append(compiled(r)); 
            
            translations.loadTranslations($.jStorage.get('appLocale'));
            
            var instance = {};
            instance.username = $.jStorage.get("userObject").username;
            instance.orgid = $.jStorage.get("userObject").orgid;
            instance.preflanguage = $.jStorage.get("appLocale");
            instance.appversion = apiservices.appversion;
            
            // Loading trigger
            var loading = false;

            // Last loaded index, we need to pass it to script
            var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            
            instance.start = lastLoadedIndex;
            if(lastLoadedIndex >= 10){
                // Attach 'infinite' event handler
                $$('.infinite-scroll').on('infinite', function () {
                    // Exit, if loading in progress
                    if (loading) return;
                    // Set loading trigger
                    loading = true;
                    // Request some file with data

                    apiservices.patientList(instance, ux.patientList, ux.fail);

                });
            }
            
            var patientInfo = r;
            //console.log(patientInfo);
            $('.trigger-case-history').off('click');
            $('.trigger-case-history').on('click', function() {
                var instance = {};
                instance.preflanguage = $.jStorage.get('appLocale');
                instance.appversion = apiservices.appversion;
                instance.sysuic = $(this).data('sysuic');
                var index = $(this).data('index');
                instance.userrole = $.jStorage.get("userObject").userrole;
                apiservices.casehistory(instance,function (r) {
                    $.get('templates/casehistory.html', function (data) {
                        var info = {};
                        info.uic = patientInfo.data[index].uic;
                        /*info.th_gender = patientInfo.data[index].gender;
                        info.th_dob = patientInfo.data[index].dob;
                        info.th_uic_pwid = patientInfo.data[index].uicpwid;*/
                        
                        var compiled = Template7.compile(data);
                        r.patientInfo = info;
                        //console.log(r);
                        var popupHTML = compiled(r);
                        application.popup(popupHTML);
                        translations.loadTranslations($.jStorage.get('appLocale'));
                    });

                }, ux.fail);
            });
            $('.trigger-show-details').off('click');
            $('.trigger-show-details').on('click', function() {
                uc.commingFromSearch = true;
                ux.searchResultBO = {};
                //console.log($(this).data('sysuic'));
                var clientInstance = {};
                clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                clientInstance.GHIjkEcm2NN = $(this).data('uic');
                
                ux.selectedPatient = clientInstance;
                mainView.router.loadPage("fragments/services-home.html");
                
            });
            
        });
    }else if(r.status == "fail"){
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
        
    }else{
        application.detachInfiniteScroll($$('.infinite-scroll'));
    }
};
ux.referredPatientList = function(r){
    //application.hidePreloader();
    if(r.status == "success" && r.data.length > 0){
        //console.log(r);//return;
        $.get('templates/clients-list.html', function (data) {
            var compiled = Template7.compile(data);
            $('.infinite-scroll .list-block ul').append(compiled(r)); 
            
            translations.loadTranslations($.jStorage.get('appLocale'));
            
            var instance = {};
            instance.username = $.jStorage.get("userObject").username;
            instance.orgid = $.jStorage.get("userObject").orgid;
            instance.preflanguage = $.jStorage.get("appLocale");
            instance.appversion = apiservices.appversion;
            
            // Loading trigger
            var loading = false;

            // Last loaded index, we need to pass it to script
            var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            
            instance.start = lastLoadedIndex;
            if(ux.selectedUserFlow != ""){
                instance.type = ux.selectedUserFlow;
            }else{
                if($.jStorage.get("userObject").userrole == 'HTC_P'){
                    instance.type = 'HTC';
                }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                    instance.type = 'STI';
                }else if($.jStorage.get("userObject").userrole == 'ART_P'){
                    instance.type = 'ART';
                }
            }
            if(lastLoadedIndex >= 10){
                // Attach 'infinite' event handler
                $$('.infinite-scroll').on('infinite', function () {
                    // Exit, if loading in progress
                    if (loading) return;
                    // Set loading trigger
                    loading = true;
                    // Request some file with data

                    apiservices.referredPatientList(instance, ux.referredPatientList, ux.fail);

                });
            }
            
            var patientInfo = r;
            //console.log(patientInfo);
            $('.trigger-case-history').off('click');
            $('.trigger-case-history').on('click', function() {
                var instance = {};
                instance.preflanguage = $.jStorage.get('appLocale');
                instance.appversion = apiservices.appversion;
                instance.sysuic = $(this).data('sysuic');
                var index = $(this).data('index');
                instance.userrole = $.jStorage.get("userObject").userrole;
                apiservices.casehistory(instance,function (r) {
                    $.get('templates/casehistory.html', function (data) {
                        var info = {};
                        info.uic = patientInfo.data[index].uic;
                        /*info.th_gender = patientInfo.data[index].gender;
                        info.th_dob = patientInfo.data[index].dob;
                        info.th_uic_pwid = patientInfo.data[index].uicpwid;*/
                        
                        var compiled = Template7.compile(data);
                        r.patientInfo = info;
                        //console.log(r);
                        var popupHTML = compiled(r);
                        application.popup(popupHTML);
                        translations.loadTranslations($.jStorage.get('appLocale'));
                    });

                }, ux.fail);
            });
            $('.trigger-show-details').off('click');
            $('.trigger-show-details').on('click', function() {
                uc.commingFromSearch = true;
                ux.searchResultBO = {};
                //console.log($(this).data('sysuic'));
                var clientInstance = {};
                clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                clientInstance.GHIjkEcm2NN = $(this).data('uic');
                
                ux.selectedPatient = clientInstance;
                
                if(ux.selectedUserFlow != ""){
                    mainView.router.loadPage("fragments/services-home.html");
                    
                }else{
                    /*if($.jStorage.get("userObject").userrole == 'HTC_P'){
                        mainView.router.loadPage("fragments/htc-services.html");
                    }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                        mainView.router.loadPage("fragments/sti-services.html");
                    }else if($.jStorage.get("userObject").userrole == 'ART_P'){
                        mainView.router.loadPage("fragments/art-services.html");
                    }*/
                    mainView.router.loadPage("fragments/services-home.html");
                    
                }
            });
            
        });
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }else{
        application.detachInfiniteScroll($$('.infinite-scroll'));
    }
};
ux.messageListSuccessCallback = function(r){
    console.log(r);
    application.hidePreloader();
    if(r.status == "success" && r.data.length > 0){
        $.get('templates/message-list.html', function (data) {
            var compiled = Template7.compile(data);
            $('.messages-container').html(compiled(r)); 
        });
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }
};
ux.notificationsListSuccessCallback = function(r){
    //console.log(r);
    application.hidePreloader();
    if(r.status == "success"){
        $.get('templates/notifications-list.html', function (data) {
            var compiled = Template7.compile(data);
            $('.notifications-container').html(compiled(r)); 
        });
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }
};

//update user profile success callback
ux.updateProfileSuccess = function(r){
    application.cordovaAPI.toast({
        text : translations.translateKey('userProfile.msgProfileUpdated')
    });

};

// cloudinary upload files
ux.upload2ImageServer = function(encodedFileData, successCallback, failureCallback) {
    //alert(encodedFileData);
    application.showIndicator();

    var upImage = encodedFileData;
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = upImage; //FIXME - fileURI.substr(fileURI.lastIndexOf('/') + 1)
    options.file = upImage;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {
        Connection: "close"
    };
    
    var params = {};
    params.cloud_name = config.cloudinary.cloudName;
    params.upload_preset = config.cloudinary.uploadPreset;
    /*timestamp: ts,
    signature: signature,
    api_key: apiKey*/
    options.params = params;
    
    // Confirm and Preview if possible and then publish    
    var ft = new FileTransfer();
    ft.upload(upImage, encodeURI(config.cloudinary.endPoint), successCallback, failureCallback, options);    
};

ux.publishHotspotPics = function(r) {
    application.hideIndicator();
        
    var response = JSON.stringify(r);
    var responseEscape = response.replace(/\\/gi,"");
    /* commented because not working in IOS
    responseEscape = responseEscape.replace('"{','{');
    responseEscape = responseEscape.replace('}"','}');
    var responseJSON = $.parseJSON(responseEscape);
    var publicURL = JSON.stringify(responseJSON.response.url);
    publicURL = publicURL.replace(/"/g, "");*/
    
    var publicURL = '';
    
    if(r)
    {
        var indexofURL = responseEscape.indexOf("url");
        var indexofSecureURL = responseEscape.indexOf("secure_url");
        
        //alert(indexofURL +" "+ indexofSecureURL)
        
        
        if(indexofURL > 0 && indexofSecureURL && indexofSecureURL > indexofURL)
        {
            publicURL = responseEscape.substr(indexofURL + 6, responseEscape.length);
            
            var indexofSecureURL = publicURL.indexOf("secure_url");
            publicURL = publicURL.substr(0, indexofSecureURL - 3);
            
        }
        ux.cloudinaryResponseUrls.push(publicURL);  
        ux.hotspotImages.splice(0, 1);
        ux.requestCallback.requestComplete(true);
        
        alert("cloudinary arr : "+JSON.stringify(ux.cloudinaryResponseUrls));
        alert("local arr : "+JSON.stringify(ux.hotspotImages));
    }
      
}

ux.imagePublishFailed = function(e) {
    application.hideIndicator();
    alert(JSON.stringify(e));
}

ux.appendHotspotImage = function(imageURI){
    $('.site-images').append($('<img>', {
        src : imageURI,
        width: "85px",
        style: "padding:1px;border:1px solid #ccc;float:left;margin:2px 2px 15px 2px;width:85px;height:85px;"
    }));
    ux.hotspotImages.push(imageURI);
}

ux.fail = function(jqXHR,exception) {
    application.closeModal();
    application.hidePreloader();
    //application.alert("Failed. Please try again");
    if (jqXHR.status === 0) {
        application.alert (translations.translateKey('app.noInternet'));
    } else if (jqXHR.status == 404) {
        application.alert (translations.translateKey('app.pageNotFound'));
    } else if (jqXHR.status == 500) {
        application.alert (translations.translateKey('app.internalServerError'));
    } else if (exception === 'parsererror') {
        application.alert (translations.translateKey('app.jsonParseFailed'));
    } else if (exception === 'timeout') {
        application.alert(translations.translateKey('app.msgOnAjaxTimeout'));
    } else if (exception === 'abort') {
        application.alert(translations.translateKey('app.msgOnAjaxFailure'));
    } else {
        application.alert (translations.translateKey('app.internalServerError')+ jqXHR.responseText);
    }
}
ux.registerFail = function(e){
    application.closeModal();
    application.hidePreloader();
    if(e.statusText == 'timeout'){
        application.alert(translations.translateKey('app.msgRegistrationTimeout'),function(){
            ux.clearLocalFormsData();
            mainView.loadPage("fragments/my-clients.html");
        });
    }else{
        application.alert(translations.translateKey('app.msgOnAjaxFailure'));
    }
}
ux.gpsFail = function(e){
    application.hidePreloader();
    application.alert(translations.translateKey('app.msgGpsFailure')); 
}


ux.rrttrChart = function (r) {
    statistics.rrttrChart(r.data);
};


ux.getSyncCount = function(){
    
    appDB.getLocalPatientCount(function(result){
       var readyForSync = 0;
        if(result.total_rows > 0){
            $.each(result.rows,function(i,v){
               if(v.doc.data.mode === "COMPLETE"){
                   readyForSync++;
                }
            });
        }
        $(".patientCount").html(readyForSync);
    });
}
/*------------------- Alerts Page ----------------*/ 
ux.alerts = function(r){
    console.log(r);
    application.hidePreloader();
    if(r.status == "success" && r.data.length > 0){
        $.get('templates/alerts.html', function (data) {
            var compiled = Template7.compile(data);
            translations.loadTranslations($.jStorage.get('appLocale'));
            $('.alert-container').html(compiled(r)); 
        });
    }else if(r.status == "fail") {
        if(r.appversion != undefined){
            application.alert(r.message,function(){
                window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
            });
        }else{
            application.alert(r.message);
        }
    }
};

ux.getIndicatorData = function(r) {
    //console.log(r);
    var indicator = {
        register: {
            "totalregistered": r.data.totalregistered,
            "todayregister": r.data.todayregister
        },
        completed: {
            "HTCreferralcompleted": r.data.HTCreferralcompleted,
            "STIreferralcompleted": r.data.STIreferralcompleted,
            "TBreferralcompleted": r.data.TBreferralcompleted
        },
        pending: {
            "HTCreferralpending": r.data.HTCreferralpending,
            "STIreferralpending": r.data.STIreferralpending,
            "TBreferralpending": r.data.TBreferralpending
        }
    }

    $.get('templates/dashboard-indicator.html', function (data) {
        var compiled = Template7.compile(data);
        $('#dashboardIndicator').html(compiled(indicator)); 
        translations.loadTranslations($.jStorage.get('appLocale'));
    });
}

ux.roleWiseRegistrationButton = function(){
    //user role wise show hide 
    switch($.jStorage.get("userObject").userrole) {
        case 'ORW':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        case 'HTC_P':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        case 'STI_P':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        case 'TB_P':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        case 'ART_P':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        case 'SUP':
            $("#btn-register,#btn-register1,#btn-register2").hide();
        break;
        default:
    };
}
ux.dashboardORW = function(r){
    //console.log(r);
    $.get('templates/dashboard-indicator.html', function (data) {
            var compiled = Template7.compile(data);
            $('#dashboardIndicator').html(compiled({})); 
            translations.loadTranslations($.jStorage.get('appLocale'));


            if (!$.isEmptyObject(r.data)) {
                var pointObj = [{
                        name: 'Target(Reached)',
                        color: 'rgba(165,170,217,1)',
                        data: [0],
                        pointPadding: 0.3,
                        pointPlacement: -0.2
                    }, {
                        name: 'Reached',
                        color: 'rgba(126,86,134,.9)',
                        data: [0],
                        pointPadding: 0.4,
                        pointPlacement: -0.2
                    }, {
                        name: 'Target(Referred)',
                        color: 'rgba(248,161,63,1)',
                        data: [0],
                        pointPadding: 0.3,
                        pointPlacement: 0.2,
                        yAxis: 1
                    }, {
                        name: 'Referred',
                        color: 'rgba(186,60,61,.9)',
                        data: [0],
                        pointPadding: 0.4,
                        pointPlacement: 0.2,
                        yAxis: 1
                    }];
                
                $.each(r.data,function(i,v){
                    $.each(pointObj,function(idx,val){
                        if(val.name === i){
                            pointObj[idx].data.pop();
                            pointObj[idx].data.push(parseInt(v[0]));
                        }
                    });
                });
        
               var chartObj =  {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: translations.translateKey('dashboard.summary')
                    },
                    xAxis: {
                        categories: [
                        ],
                        enabled:false
                    },
                    yAxis: [{
                        min: 0,
                        title: {
                            text: translations.translateKey('dashboard.count')
                        }
                    }, {
                        title: {
                            text: translations.translateKey('dashboard.count')
                        },
                        opposite: true
                    }],
                    legend: {
                        shadow: false
                    },
                    tooltip: {
                        shared: true,
                        enabled: false

                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        },
                        series: {
                         dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },

                    series: pointObj
                };
                //console.log(JSON.stringify(chartObj));
                $("#registerChart").highcharts(chartObj)
            }
    });
    
    
}
ux.getMobileDashboardChartData = function(r) {
    
    if(r.chart != undefined){
    
        $.get('templates/dashboard-indicator.html', function (data) {
            var compiled = Template7.compile(data);
            $('#dashboardIndicator').html(compiled({})); 
            translations.loadTranslations($.jStorage.get('appLocale'));


            if (!$.isEmptyObject(r.chart.register.data)) {
                var chartTyape = "bar";
                var pWidth = 30;
                if($.jStorage.get("userObject").userrole == 'SUP'){
                    chartTyape = "column";
                    pWidth = 15;
                }
                var chartArr = [];
                var color = ["#9843f3", "#1c90f3", "#7cb5ec", "#8ed6d7", "antiquewhite", "#978bea", "#9ae6bd", "#c79ae6", "#e69ad1", "#9abee6", "#e0e69a"]
                $.each(r.chart.register.data,function(i,v){
                    // r.chart.register[i].y = Number(r.chart.register[i].y);
                    v.data = [Number(r.chart.register.data[i].y)];
                    v.color = color[i];
                    chartArr.push(v);
                });
                var chartObj = {
                    chart: {
                        type: chartTyape
                    },
                    title: {
                        text: r.chart.register.title
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            enabled: false
                        },
                        gridLineWidth: 0
                    },
                    credits: {
                        enabled:false
                    },
                    legend: {
                        enabled: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            },
                            pointWidth: pWidth,
                            events: {
                                legendItemClick: function () {
                                    return false;
                                }
                            }
                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                    },

                    series: chartArr
                }
                //console.log(JSON.stringify(chartObj));
                $("#registerChart").highcharts(chartObj)
            }

            if (r.chart.refer) {
                if (!$.isEmptyObject(r.chart.refer.data)) {

                var finalChartArr = [];
                var color = ["#FF9D98", "#958AD3", "#8F7166"];

                $.each(r.chart.refer.data,function (i, v) {
                    var obj = {};
                    obj.name = i, obj.y = parseInt(v);
                    finalChartArr.push(obj);
                });
                $.each(color, function(i, v) {
                    finalChartArr[i].color = color[i];
                })
                //console.log(finalChartArr)
                var seriesArr = [{
                    name: r.chart.refer.title,
                    colorByPoint: false,
                    data: finalChartArr
                }]
                var chartObj = {
                    chart: {
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        // plotBackgroundColor: "#f9f9f9",
                        // backgroundColor: "#f9f9f9"

                    },
                    title: {
                        text: "",
                        align: 'center'
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px;display:none;"></span>',
                        pointFormat: '<span style="color: #fff; font-size: 16px; padding:5px 20px;">{point.y}</span><br/>',
                        backgroundColor: '#4ed8da'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true
                        },
                        series: {
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                }
                            }
                        }
                    },
                    series: seriesArr
                }

                $('#referChart').highcharts(chartObj);
            }
            } else {
                $("#referChart").hide();
            }
            if(r.chart.pendingservices){
                if (!$.isEmptyObject(r.chart.pendingservices.data)) {

                var finalChartArr = [];
                var color = ["#958AD3", "#F8C98E", "#8ED6D7"];

                $.each(r.chart.pendingservices.data, function(i, v)  {
                    var obj = {};
                    obj.name = i, obj.y = parseInt(v);
                    finalChartArr.push(obj);
                });
                //console.log(finalChartArr);
                $.each(color, function(i, v) {
                    console.log(i, v);
                    finalChartArr[i].color = color[i];
                })
                //console.log(finalChartArr)
                var seriesArr = [{
                    name: r.chart.pendingservices.title,
                    colorByPoint: false,
                    data: finalChartArr
                }]
                var chartObj = {
                    chart: {
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        // plotBackgroundColor: "#f9f9f9",
                        // backgroundColor: "#f9f9f9"
                    },
                    title: {
                        // text: 'TB Risk Assessment ',
                        text: "",
                        align: 'center'
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px;display:none;"></span>',
                        pointFormat: '<span style="color: #fff; font-size: 16px; padding:5px 20px;">{point.y}</span><br/>',
                        backgroundColor: '#f3822f'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<span style="font-size:14px;"><b>{point.y}</b></span>',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true
                        },
                        series: {
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                }
                            }
                        }
                    },
                    series: seriesArr
                }

                $('#pendingservicesChart').highcharts(chartObj);
            }
            } else {
                $("#pendingservicesChart").hide();
            }

        });
    }
}

ux.updateLanguage = function(language_code){
    var instance = {};
    instance.username = $.jStorage.get("userObject").username;
    instance.preflanguage = language_code;
    apiservices.updateUserLanguage(instance,function(r){
        console.log('language change success: '+JSON.stringify(r));

        $.jStorage.set('appLocale', language_code);
        translations.loadTranslations($.jStorage.get('appLocale'));
        application.closeModal();
    },function(){
        $.jStorage.set('appLocale', language_code);
        translations.loadTranslations($.jStorage.get('appLocale'));
        application.closeModal();
    });
}

ux.onlineNow = function(){
    //application.showOfflineClientList();
    var networkState = navigator.connection.type;
        //alert('networkState'+networkState);

    if(networkState !== Connection.NONE){
        //alert("step1")
        
        if($('.view-main').data('page') == 'my-clients'){
        var instance = {};
        instance.username = $.jStorage.get("userObject").username;
        instance.orgid = $.jStorage.get("userObject").orgid;
        instance.preflanguage = $.jStorage.get("appLocale");
        instance.appversion = apiservices.appversion;
        instance.start = 0;
          apiservices.patientList(instance, ux.patientList, ux.fail);            
        //mainView.refreshPage();
        }
    }
}
/*
ux.onlineNow = function(){
    //alert('online');
    var networkState = navigator.connection.type;
    if(networkState !== Connection.NONE){
        if($('.view-main').data('page') == 'my-clients'){
            mainView.refreshPage();
        }
    }
}*/
ux.resetRegistrationRadioButtons = function(){
    // gender radio
    $('input[type=radio][name=IClOfxEogHN]').parent().parent().siblings().children("span").each(function(i,v){
        if($(this).hasClass('bg-red')){
            $(this).removeClass('bg-red').addClass('bg-gray');
        }
    });
    
    // key pop checkbox
    $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
    $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
    
    //ovp
    $('input[type=checkbox][name=mLOtu6ftELJ]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
    
}

ux.getWeekByMonthAndYears = function (year, month_number, startDayOfWeek) {
  // month_number is in the range 1..12

  // Get the first day of week week day (0: Sunday, 1: Monday, ...)
  var firstDayOfWeek = startDayOfWeek || 0;

  var firstOfMonth = new Date(year, month_number-1, 1);
  var lastOfMonth = new Date(year, month_number, 0);
  var numberOfDaysInMonth = lastOfMonth.getDate();
  var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  var used = firstWeekDay + numberOfDaysInMonth;

  return Math.ceil( used / 7);
}

ux.nmFacilitiesResponse = function(r){
    console.log(r);
}