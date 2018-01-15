$$(document).on('pageInit', function(e) {
    //console.log("pageinit");
    //var page = e.detail.page;
    $('.trigger-logout').off('click');
    $('.trigger-logout').on('click', function() {
                    
        
        application.confirm(translations.translateKey("logout.areYouSure"), function () {
            
            appDB.getLocalPatientCount(function(result){
                if(result.total_rows > 0){
                    application.alert(translations.translateKey('app.logoutPubError'));
                    return false;
                }else{
                    $.jStorage.flush();
                    localStorage.clear();
                    appDB.clean();
                    $('body').removeClass('delegatedpanels');

                    mainView.loadPage("fragments/signin.html");
                    application.cordovaAPI.toast({
                        text: translations.translateKey("logout.logOut")
                    });   
                }
            });
        });
    });
    
    if($.jStorage.get('appLocale')) {
        translations.loadTranslations($.jStorage.get('appLocale'));
    } else {
        $.jStorage.set('appLocale', 'en');
        translations.loadTranslations('en');
    }
    
    $(".trigger-home-page").off("click");
    $(".trigger-home-page").on("click",function(e){
        uc.backToHome();
        application.closePanel();
        return false;
    });
    
    
    
    $(".btn-client-profile").off("click");
    $(".btn-client-profile").on("click",function(e){
        
        if($.jStorage.get("userObject").userrole == "HTC_P" || $.jStorage.get("userObject").userrole == "STI_P"){
            mainView.router.loadPage("fragments/referred-clients.html");
        }else{
            mainView.router.loadPage("fragments/my-clients.html");
        }
        application.closePanel();
        return false;
    });
    if($.jStorage.get("userObject") != null){
        $(".logged-in-user").html($.jStorage.get("userObject").username);
    }
    
    
    $('.language-item').off('click');
    $('.language-item').on('click', function() {
        var language_code = $(this).data('code');
        ux.updateLanguage(language_code);
    });
});

application.onPageInit('signin', function () {
    
    $('input:text').bind('cut copy paste', function (e) {
        e.preventDefault();
        translations.loadTranslations($.jStorage.get('appLocale'));
        application.alert(translations.translateKey('signin.userDisabled'));
    });
    
     $('input:password').bind('cut copy paste', function (e) {
        e.preventDefault();
         translations.loadTranslations($.jStorage.get('appLocale'));
         application.alert(translations.translateKey('signin.passwordDisabled'));
    });
    
    $("#frmLogin").validate({
        rules: {
            j_username: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            j_password: {
                required: true,
                minlength: 2,
                maxlength: 50
            }
        },
        messages: {
            j_username: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                minlength: function (){ return translations.translateKey("validationMsg.min2")},
                maxlength: function (){ return translations.translateKey("validationMsg.max20")}
            },
            j_password: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                minlength: function (){ return translations.translateKey("validationMsg.min2")},
                maxlength: function (){ return translations.translateKey("validationMsg.max20")}
            }
        }

    });
    
    //alert("signin page");
    $(".trigger-signin").off("click");
    $(".trigger-signin").on("click", function () {
        if($("#frmLogin").valid()){
            var loginData = application.formToJSON('#frmLogin');
            loginData.appversion = config.buildversion;
            loginData.preflanguage = $.jStorage.get("appLocale");
            //console.log(loginData);


            ux.authparam = "Basic " + btoa(loginData.j_username + ":" + loginData.j_password);
            $.jStorage.set("authparam", "Basic " + btoa(loginData.j_username + ":" + loginData.j_password));
            apiservices.login(loginData, ux.loginSuccessCallback, ux.fail);
        }
        return;
    });

    $('.trigger-changeLang').off('click');
    $('.trigger-changeLang').on('click', function () {
        $.get('templates/chooseLanguage.html', function (data) {
            var compiled = Template7.compile(data);
            translations.loadTranslations($.jStorage.get('appLocale'));
            application.popup(compiled([{
                    "title": "English",
                    "localiedTitle": "English",
                    "code": "en"
            }, {
                    "title": "Burmese",
                    "localiedTitle": "မြန်မာ",
                    "code": "my"
            }
            ]));

            $$('.popup-chooseLanguage').on('opened', function () {
                $('.trigger-change-lang').off('click');
                $('.trigger-change-lang').on('click', function() {
                    var appLocale = $(this).attr('data-code');
                    $.jStorage.set('appLocale', appLocale);
                    translations.loadTranslations($.jStorage.get('appLocale'));
                });                
            });

        });

    });
    
    $("#chk-showpassword").on("change",function(){
        //console.log($(this));
        if($(this).is(":checked")) {
            $("input[name='j_password']").attr("type","text");
        }else{
            $("input[name='j_password']").attr("type","password");
        }
    });
    
    $("#changeLanguage").on("change",function(){
        var appLocale = $(this).val();
        $.jStorage.set('appLocale', appLocale);
        translations.loadTranslations($.jStorage.get('appLocale'));
    });
    
});

application.onPageInit('settings', function (page) {
   
    
    $('.language-item').off('click');
    $('.language-item').on('click', function() {
        //console.log($(this).data('code'));
        var language_code = $(this).data('code');
        ux.updateLanguage(language_code);
    });
    
    ux.getSyncCount();
    /*appDB.getLocalPatientCount(function(result){
        $(".patientCount").html(ux.getSyncCount());
    });*/
    
    $('.trigger-sync-records').off('click');
    $('.trigger-sync-records').on('click', function() {
        ux.syncPatients();
    });
    
    $(".trigger-back").off("click");
    $(".trigger-back").on("click",function(e){
        uc.backToHome();
    });
});

application.onPageInit('home', function (page) {
    $('body').addClass('delegatedpanels');
    translations.loadTranslations($.jStorage.get('appLocale'));
    
    
    //Clear all forms
    ux.clearLocalFormsData();
    ux.selectedPatient = {};
    ux.serviceValidations = {};
    uc.formData = {};
    
    $('.open-my-client').off('click');
    $('.open-my-client').on('click', function() {
        mainView.loadPage('fragments/my-clients.html');
    });
    
   
    $$('#tab2').on('tab:show', function () {
    
        if($("#dashboardIndicator").html() == ""){
            var localObject = $.jStorage.get("userObject");
            apiservices.getORWIndicatorData({"userid": localObject.userid}, ux.dashboardORW, ux.fail);
        }
        
    });
    $('.trigger-show-dashboard').off('click');
    $('.trigger-show-dashboard').on('click', function() {
        if($("#dashboardIndicator").html() == ""){
            var localObject = $.jStorage.get("userObject");
            apiservices.getORWIndicatorData({"userid": localObject.userid}, ux.dashboardORW, ux.fail);
        }
    });
    
    //$(".btn-targets").hide();
});
application.onPageInit('htc-home', function (page) {
    $('body').addClass('delegatedpanels');
    translations.loadTranslations($.jStorage.get('appLocale'));
    
    $(".logged-in-user").html($.jStorage.get("userObject").username);
    //Clear all forms
    ux.clearLocalFormsData();
    ux.selectedPatient = {};
    
    $('.open-my-client').off('click');
    $('.open-my-client').on('click', function() {
        mainView.loadPage('fragments/referred-clients.html');
    });
    
    // Dashboard start
    var localObject = $.jStorage.get("userObject");
    $$('#tab2').on('tab:show', function () {
        if($("#dashboardIndicator").html() == ""){
            //apiservices.getIndicatorData({"orgid": localObject.orgid, "username": localObject.username}, ux.getMobileDashboardChartData, ux.fail);
        }
    });
    $('.trigger-show-dashboard').off('click');
    $('.trigger-show-dashboard').on('click', function() {
        if($("#dashboardIndicator").html() == ""){
            //apiservices.getIndicatorData({"orgid": localObject.orgid, "username": localObject.username}, ux.getMobileDashboardChartData, ux.fail);
        }
    });
    // Dashboard End
    
    // hide side panel links
    $(".alerts-module").hide();
    
    if($.jStorage.get("userObject").userrole == 'STI_P'){
        $("a[href='#tab1'] span").text(translations.translateKey("SR-HTC.sti-clinic"));
    }else if($.jStorage.get("userObject").userrole == 'ART_P'){
        $("a[href='#tab1'] span").text(translations.translateKey("SR-HTC.art-clinic"));
        $(".alerts-module").hide();
    }else if($.jStorage.get("userObject").userrole == 'HTC_P'){
        $("a[href='#tab1'] span").text(translations.translateKey("SR-HTC.htc-lab"));
    }
    
});
application.onPageInit('sup-home', function (page) {
    $('body').addClass('delegatedpanels');
    translations.loadTranslations($.jStorage.get('appLocale'));
    $(".logged-in-user").html($.jStorage.get("userObject").username);
    
    //Clear all forms
    ux.clearLocalFormsData();
    ux.selectedPatient = {};
    
    ux.selectedUserFlow = "";
    
    $(".btn-client-profile").parent().hide();
    
    $('.open-my-client').off('click');
    $('.open-my-client').on('click', function() {
        //console.log($(this).data('usertype'));
        ux.selectedUserFlow = $(this).data('usertype');
        mainView.loadPage('fragments/referred-clients.html');
    });
    
    $('.open-sup-alerts').off('click');
    $('.open-sup-alerts').on('click', function() {
        //console.log($(this).data('usertype'));
        ux.selectedUserFlow = $(this).data('usertype');
        mainView.loadPage('fragments/alerts.html');
    });
    
    $('.open-sup-search').off('click');
    $('.open-sup-search').on('click', function() {
        
        ux.selectedUserFlow = $(this).data('usertype');
        mainView.loadPage('fragments/search.html');
    });
    
    
    // Dashboard start
    var localObject = $.jStorage.get("userObject");
    $$('#tab4').on('tab:show', function () {
        if($("#dashboardIndicator").html() == ""){
            apiservices.getIndicatorData({"orgid": localObject.orgid, "username": localObject.username}, ux.getMobileDashboardChartData, ux.fail);
        }
    });
    $('.trigger-show-dashboard').off('click');
    $('.trigger-show-dashboard').on('click', function() {
        if($("#dashboardIndicator").html() == ""){
            apiservices.getIndicatorData({"orgid": localObject.orgid, "username": localObject.username}, ux.getMobileDashboardChartData, ux.fail);
        }
    });
    // Dashboard End
    
    
    
});

application.onPageInit('register', function (page) {
    application.formFromData('#registration', uc.formData);
    if(page.query.backto != undefined){
         application.showTab('#tab2'); 
    }
    var instance = {};
    instance.appversion = config.buildversion;
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.orgid = $.jStorage.get("userObject").orgid;
    instance.userid = $.jStorage.get("userObject").userid;
    
    //form validations
    vx.registerFormValidations();
    //uc.calendar();
    
    // fill year of birth dropdown list 
    for (i = new Date().getFullYear(); i > 1917; i--)
    {
        $('select[name="DaNLHNTlMFK"]').append($('<option />').val(i).html(i));
    }
    
    //Get hotspot list 
    apiservices.getHotspotsList(instance,function(r){
        if(r.status == "success"){
            $.each(r.data,function(i,v){
                $('select[name="RjWEK8DxHiq"]').append($('<option />').val(i).html(v));
            });
            var userTemp = $.jStorage.get("userObject");
            userTemp.hotspot = r.data;
            $.jStorage.set("userObject",userTemp);
        }else if(r.status == "fail") {
            if(r.appversion != undefined){
                application.alert(r.message,function(){
                    window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
                });
            }else{
                application.alert(r.message);
            }
        }   
        
    },function(){
        $.each($.jStorage.get("userObject").hotspot,function(i,v){
            $('select[name="RjWEK8DxHiq"]').append($('<option />').val(i).html(v));
        });
    });
    
    // get states
    apiservices.getStateList(instance,function(r){
        r = JSON.parse(r);
        //if(r.status == "success"){
            $.each(r[$.jStorage.get("appLocale")],function(i,v){
                console.log(i+":"+v);
                $('select[name="nQRMXpjxjGo"]').append($('<option />').val(v.id).html(i));
            });
        //}    
    },ux.fail);
    
    
    
    $("select[name='nQRMXpjxjGo']").on("change",function(){
        if(this.value != ''){
            var stateID = this.value;
            var instanceBo = {};
            instanceBo.stateid = this.value;
            instanceBo.preflanguage = $.jStorage.get("appLocale");
            /*apiservices.getTownshipList(instanceBo,function(r){
                if(r.status == "success"){
                    $('select[name="NnnAD4jJqBl"]').html("");
                    $('select[name="NnnAD4jJqBl"]').append($('<option />').val("").html("-"));
                    $.each(r.data,function(i,v){
                        $('select[name="NnnAD4jJqBl"]').append($('<option />').val(v.cityId).html(v.cityName));
                    });
                }    
            },ux.fail);*/
            
            apiservices.getStateList(instance,function(r){
                r = JSON.parse(r);
                $.each(r[$.jStorage.get("appLocale")],function(i,v){
                    if(stateID == v.id){
                        $('select[name="NnnAD4jJqBl"]').html("");
                        $('select[name="NnnAD4jJqBl"]').append($('<option />').val("").html("-"));
                        $.each(v.data,function(idx,val){
                             //console.log(idx+":"+JSON.stringify(val));
                            $('select[name="NnnAD4jJqBl"]').append($('<option />').val(val.cityId).html(val.cityName));
                        });
                    }
                });
                   
            },ux.fail);
        }
    });
    
    //key populations OVP
    if($('input[type=checkbox][name=mLOtu6ftELJ]').is(':checked')){
        $('input[type=checkbox][name=mLOtu6ftELJ]').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        $('#ovp-options').show();
    }else{
        $('input[type=checkbox][name=mLOtu6ftELJ]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
        $('#ovp-options').hide();
    }
    $('input[type=checkbox][name=mLOtu6ftELJ]').on("change",function(){
        if($(this).is(':checked')){
            $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
            $('#ovp-options').show();
        }else{
            $(this).parent().siblings().removeClass("bg-red").addClass("bg-gray");
            $('#ovp-options').hide();
            $('#ovp-options input[type=checkbox]:checked').each(function(){$(this).attr('checked',false)});
        }
    });
    
    //Hotspot selection
    $("select[name='RjWEK8DxHiq']").on("change",function(e){
        //console.log(this.value);
        if(this.value == "0"){
            $.get('fragments/add-hotspot.html', function (data) {
                var location = {};

                var compiled = Template7.compile(data);
                translations.loadTranslations($.jStorage.get('appLocale'));
                application.popup('<div class="popup popup-select-hotspot tablet-fullscreen">' + compiled({}) + '</div>');

                $$('.popup-select-hotspot').on('opened', function () {
                    application.showPreloader(translations.translateKey('app.txtloading'));
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        application.hidePreloader();
                        location.lat = pos.coords.latitude;
                        location.lng = pos.coords.longitude;
                        nmmaplocator.initMAP('anmmap', pos.coords.latitude, pos.coords.longitude);
                    }, ux.gpsFail, {timeout: 20000});
                    
                    //validations
                    $("#frm-hotspot").validate({
                        rules: {
                            hotspot_name: {
                                required: true,
                                minlength: 2
                            }
                        },
                        messages: {
                            hotspot_name: {
                                required: function (){ return translations.translateKey("validationMsg.required")},
                                minlength: function (){ return translations.translateKey("validationMsg.min2")}
                            }
                        }
                    });
                    //console.log('hi');
                    $$('.trigger-set-hotspot').off('click');
                    $$('.trigger-set-hotspot').on('click', function () {
                        //console.log(ux.area); 
                        if($("#frm-hotspot").valid()){
                            $('select[name="RjWEK8DxHiq"]').append($('<option />').val("00").html($("input[name='hotspot_name']").val()).attr("selected","selected"));
                            $("input[name='RjWEK8DxHiq_name']").val($("input[name='hotspot_name']").val());
                            $("input[name='RjWEK8DxHiq_lat']").val(location.lat);
                            $("input[name='RjWEK8DxHiq_lng']").val(location.lng);
                            application.closeModal('.popup-select-hotspot');
                        }
                        return;
                        
                    });
                    $$(".trigger-close-popup").off('click');
                    $$(".trigger-close-popup").on('click',function(){
                        $('select[name="RjWEK8DxHiq"]').val("");
                        application.closeModal('.popup-select-hotspot');
                        
                    })
                });

            });
        }else{
            $("input[name='RjWEK8DxHiq_name']").val("");
            $("input[name='RjWEK8DxHiq_lat']").val("");
            $("input[name='RjWEK8DxHiq_lng']").val("");
        }
        
    });
    
    
    // Gender color change 
    if($('input[type=radio][name=IClOfxEogHN]:checked')){
       $('input[type=radio][name=IClOfxEogHN]:checked').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        $('input[type=radio][name=IClOfxEogHN]:checked').parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    }
    $('input[type=radio][name=IClOfxEogHN]').on("change",function(){
        $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
        
        $(this).parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });
    
   
    // key population MSW Checkbox
    if($('input[type=checkbox][name=k2x7u7ygYd5]').is(':checked')){
        $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        
        // uncheck FSW
        $('input[type=checkbox][name=k2x7u7ygYd5_1]').attr('checked',false);
        $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
    }else{
        $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
    }
    $('input[type=checkbox][name=k2x7u7ygYd5]').on("change",function(){    
        if($(this).is(':checked')){
            $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
            
            // uncheck FSW
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').attr('checked',false);
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
        }else{
            $(this).parent().siblings().removeClass("bg-red").addClass("bg-gray");
        }
    });
    
    
    // FSW Checkbox
    if($('input[type=checkbox][name=k2x7u7ygYd5_1]').is(':checked')){
        $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        
        // uncheck MSW
        $('input[type=checkbox][name=k2x7u7ygYd5]').attr('checked',false);
        $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
    }else{
        $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
    }
    $('input[type=checkbox][name=k2x7u7ygYd5_1]').on("change",function(){    
        if($(this).is(':checked')){
            $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
            // uncheck MSW
            $('input[type=checkbox][name=k2x7u7ygYd5]').attr('checked',false);
            $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
        }else{
            $(this).parent().siblings().removeClass("bg-red").addClass("bg-gray");
        }
    });
    
    
    /* using radio 
    if($('input[type=radio][name=k2x7u7ygYd5]:checked')){
       $('input[type=radio][name=k2x7u7ygYd5]:checked').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        $('input[type=radio][name=k2x7u7ygYd5]:checked').parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    }
    $('input[type=radio][name=k2x7u7ygYd5]').on("change",function(){
        $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
        $(this).parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });*/
    
    // Scan QR for association
    $('.trigger-scan-QR').off('click');
    $('.trigger-scan-QR').on('click', function() {

        //using barcode scanner plugin
        cordova.plugins.barcodeScanner.scan(function(result){
            
            if(result.text != ""){
                if(result.text.indexOf('stc_qr',0) != -1){
                    apiservices.checkQRAssociation({"qrcode":result.text},function(r){
                        if(r.used){
                            application.alert(translations.translateKey('search.QRUsed'));
                        }else{
                            $("input[name='vyWWkQcTa4i']").val(result.text);
                            $("#associatedQRspan").html(result.text);
                        }
                    },function(r){
                        //TODO
                        ux.fail(r);
                    });
                }else{
                    application.alert(translations.translateKey('register.invalidQR'));
                }
                
            }else if(result.cancelled){
                application.alert(translations.translateKey('search.operationCancelled'));
            } 
          },
          function (error) {
              application.alert(translations.translateKey('search.scanningFailed')+": " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : true, // iOS and Android
              showTorchButton : false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : translations.translateKey('search.placeQR'), // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
              disableSuccessBeep: false // iOS
          }
       );

    });
    
    $('.trigger-register').off('click');
    $('.trigger-register').on('click', function() {
        if($("input[name='IClOfxEogHN']:checked").val() != undefined && $('.check-required:checked').val() != undefined){
            if($("#registration").valid()){

                //console.log('true');return;
                ux.updateFormData('registration');
                //console.log(application.formGetData("registration"));
                application.confirm(translations.translateKey('profile.publishConfirm'), function () {
                    //application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
                    var modeOfPublish = "COMPLETE";
                    uc.registerPatient({"aYy7fsHVypc": "0","pVXE3EjEUDa" : "0"},modeOfPublish);

                    //get lat lng
                    /*navigator.geolocation.getCurrentPosition(function(r) {
                         uc.registerPatient({"aYy7fsHVypc": r.coords.latitude,"pVXE3EjEUDa" : r.coords.longitude},modeOfPublish); 
                    }, function(e) {
                        var userobj = $.jStorage.get("userObject");
                        uc.registerPatient({"aYy7fsHVypc": userobj.latitude,"pVXE3EjEUDa" : userobj.longitude},modeOfPublish);
                    },{timeout:30000, enableHighAccuracy: true});*/

                });



            }
            return;
        }else{
            application.alert(translations.translateKey('validationMsg.allFieldsRequired'));
        }
        
    });
    
    /* ------Tab 2 Referral ------------*/
    
    //user role wise show hide 
    switch($.jStorage.get("userObject").userrole) {
        case 'ORW':
            $("#SR_HTC,#SR_STI,#SR_TB").hide();
        break;
        case 'HTC_P':
            $("#SR_STI,#SR_TB,#SR_ORW").hide();
        break;
        case 'STI_P':
            $("#SR_HTC,#SR_TB,#SR_ORW").hide();
        break;
        case 'TB_P':
            $("#SR_HTC,#SR_STI,#SR_ORW").hide();
        break;
        default:
    };
    
    $(".trigger-referral-tab").off('click');
    $(".trigger-referral-tab").on('click',function(e){
        if(ux.selectedPatient == undefined || $.isEmptyObject(ux.selectedPatient)){
            //console.log('1');
            application.alert(translations.translateKey("app.errorServiceSelect"));
            return false;
            
        }else{
           application.showTab('#tab2'); 
        }
    });
    $$('#tab2').on('tab:show', function () {
        //myApp.alert('Tab 2 is visible');
    });
});

application.onPageInit('search', function (page) {
    
    ux.roleWiseRegistrationButton();
    
    ux.selectedPatient = {};
    ux.serviceValidations = {};
    vx.searchFormsValications();
    // fill year of birth dropdown list 
    for (i = new Date().getFullYear(); i > 1917; i--)
    {
        $('select[name="dob"]').append($('<option />').val(i).html(i));
    }
    
    // Gender color change 
    if($('input[type=radio][name=gender]:checked')){
       $('input[type=radio][name=gender]:checked').parent().siblings().removeClass("bg-gray").addClass("bg-red");
        $('input[type=radio][name=gender]:checked').parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    }
    $('input[type=radio][name=gender]').on("change",function(){
        $(this).parent().siblings().removeClass("bg-gray").addClass("bg-red");
        
        $(this).parent().parent().siblings().children("span").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });
    
    var instanceBo = {};
    
    instanceBo.user = $.jStorage.get("userObject").username;
    instanceBo.authparam = $.jStorage.get("authparam");
    instanceBo.appversion = apiservices.appversion;
    instanceBo.preflanguage = $.jStorage.get("appLocale");
    instanceBo.orgid = $.jStorage.get("userObject").orgid;
    
    // Supervisor user search
    if(ux.selectedUserFlow != ""){
        instanceBo.type = ux.selectedUserFlow;
    }
    $('.trigger-uic-search').off('click');
    $('.trigger-uic-search').on('click', function() {
        if($("#frmUicSearch").valid()){
            
            $.extend(true, instanceBo, application.formToJSON('#frmUicSearch'));
            //console.log(JSON.stringify(instanceBo));
            apiservices.search(instanceBo,ux.searchSuccessCallback,ux.fail);
            
        }
        return;
    });
    
    $('.trigger-search').off('click');
    $('.trigger-search').on('click', function() {
        if($("#frmSearch").valid()){
            var formData = application.formToJSON('#frmSearch');
            formData.gender = (formData.gender == undefined) ? "" :formData.gender;
            
            if(formData.fathername == "" && formData.mothername == "" && formData.nickname == "" && formData.dob == "" && formData.gender == ""){
                application.alert(translations.translateKey('validationMsg.fillAtleatOne'));
            }else{
                $.extend(true, instanceBo, formData);
                //console.log(JSON.stringify(instanceBo));
                apiservices.search(instanceBo,ux.searchSuccessCallback,ux.fail);
            }

        }

    });
    
    $('#btn-register1').off('click');
    $('#btn-register1').on('click', function() {
    //alert("btn-register1");
    var fname=$('#fname').val();
    var mName=$('#mname').val();
    var Gender = $("input[name='gender']:checked").val()
    var nickname=$('#nickname').val();
    var dob= $('select[name="dob"]').val();
    
    uc.formData = {
     hcU0DS208wx :fname,
     R7Ll1Hp8XgI :mName,
     IClOfxEogHN: Gender,
     yjsuldl4RAA: nickname ,
     DaNLHNTlMFK: dob
     }; 
        
    mainView.loadPage("fragments/register.html");

    });
    
    $('.trigger-scan').off('click');
    $('.trigger-scan').on('click', function() {

        //using barcode scanner plugin
        cordova.plugins.barcodeScanner.scan(function(result){
            if(result.text != ""){
                instanceBo.qrcode = result.text;
                //alert(JSON.stringify(instanceBo));
                apiservices.search(instanceBo,ux.searchSuccessCallback,ux.fail);
            }else if(result.cancelled){
                application.alert(translations.translateKey('search.operationCancelled'));
            } 
          },
          function (error) {
              application.alert(translations.translateKey('search.scanningFailed')+": " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : true, // iOS and Android
              showTorchButton : false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : translations.translateKey('search.placeQR'), // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
              disableSuccessBeep: false // iOS
          }
       );

    });
    
    // Attribute base search
    $$('#tab2').on('show', function () {
        ux.roleWiseRegistrationButton();
    });
    $$('#tab3').on('show', function () {
        ux.roleWiseRegistrationButton();
    });
     
});

application.onPageInit('services-home', function (page) {
    if(page.query.backto != undefined){
         application.showTab('#tab2'); 
    }
    
    switch($.jStorage.get("userObject").userrole) {
        case 'ORW':
            $("#SR_HTC,#SR_STI,#SR_TB,#SR_ART").hide();
        break;
        case 'HTC_P':
            $("#SR_STI,#SR_TB,#SR_ORW,#SR_ART").hide();
        break;
        case 'STI_P':
            $("#SR_HTC,#SR_TB,#SR_ORW,#SR_ART").hide();
        break;
        case 'TB_P':
            $("#SR_HTC,#SR_STI,#SR_ORW,#SR_ART").hide();
        break;
        case 'ART_P':
            $("#SR_HTC,#SR_STI,#SR_ORW,#SR_TB").hide();
        break;
        case 'SUP':
            if(ux.selectedUserFlow == "STI"){
                $("#SR_HTC,#SR_TB,#SR_ORW,#SR_ART").hide();
            }else if(ux.selectedUserFlow == "HTC"){
                $("#SR_STI,#SR_TB,#SR_ORW,#SR_ART").hide();
            }else if(ux.selectedUserFlow == "ART"){
                $("#SR_HTC,#SR_STI,#SR_ORW,#SR_TB").hide();
            }
        break;
    };
    $(".selected-uic").html("UIC : "+ux.selectedPatient.GHIjkEcm2NN.slice(0,10));
    
    // API to get registration and services data
    var instance = {};
    instance.preflanguage = $.jStorage.get('appLocale');
    instance.appversion = apiservices.appversion;
    instance.sysuic = ux.selectedPatient.G4L6aiyDSeE;
    instance.userrole = $.jStorage.get("userObject").userrole;
    apiservices.casehistory(instance,function (r) {
        console.log(r);
        
        application.formFromData('#profile',r.profiledata);
        if(r.profiledata.aYy7fsHVypc != "" && r.profiledata.pVXE3EjEUDa != ""){
            nmmaplocator.initMAP('hotspot-marker', r.profiledata.aYy7fsHVypc, r.profiledata.pVXE3EjEUDa);
            nmmaplocator.marker = L.marker([r.profiledata.aYy7fsHVypc, r.profiledata.pVXE3EjEUDa], {
                draggable: false
            }).addTo(nmmaplocator.map);
            nmmaplocator.map.closePopup();
           //nmmaplocator.marker.bindPopup(translations.translateKey('addnearme.yourLocation')).openPopup();
        }
        
        
        $.get('templates/tab-casehistory.html', function (data) {
            var compiled = Template7.compile(data);
            $("#services-accordion").append(compiled(r)); 
            translations.loadTranslations($.jStorage.get('appLocale'));
        });
        
        $(".trigger-call").off("click");
        $(".trigger-call").on("click",function(){
            if($("input[name='kMJbCoe133i']").val() != null){
                document.location.href = "tel:"+$("input[name='kMJbCoe133i']").val();
            }
        });
        
        // Gender color change 
        if($('input[type=radio][name=IClOfxEogHN]:checked')){
           $('input[type=radio][name=IClOfxEogHN]:checked').parent().siblings().removeClass("bg-gray").addClass("bg-red");
            $('input[type=radio][name=IClOfxEogHN]:checked').parent().parent().siblings().children("span").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }
        
        /*
        
        //key populations dependencies
        if($('input[type=radio][name=k2x7u7ygYd5]:checked').val() == "3"){
            $('#ovp-options').show();
        }else{
            $('#ovp-options').hide();
        }
        
        // key population color change 
        if($('input[type=radio][name=k2x7u7ygYd5]:checked')){
           $('input[type=radio][name=k2x7u7ygYd5]:checked').parent().siblings().removeClass("bg-gray").addClass("bg-red");
            $('input[type=radio][name=k2x7u7ygYd5]:checked').parent().parent().siblings().children("span").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }*/
        
        //key populations OVP
        if($('input[type=checkbox][name=mLOtu6ftELJ]').is(':checked')){
            $('input[type=checkbox][name=mLOtu6ftELJ]').parent().siblings().removeClass("bg-gray").addClass("bg-red");
            $('#ovp-options').show();
        }else{
            $('input[type=checkbox][name=mLOtu6ftELJ]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
            $('#ovp-options').hide();
        }
        // key population MSW Checkbox
        if($('input[type=checkbox][name=k2x7u7ygYd5]').is(':checked')){
            $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings().removeClass("bg-gray").addClass("bg-red");

            // uncheck FSW
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').attr('checked',false);
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
        }else{
            $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
        }
        // FSW Checkbox
        if($('input[type=checkbox][name=k2x7u7ygYd5_1]').is(':checked')){
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings().removeClass("bg-gray").addClass("bg-red");

            // uncheck MSW
            $('input[type=checkbox][name=k2x7u7ygYd5]').attr('checked',false);
            $('input[type=checkbox][name=k2x7u7ygYd5]').parent().siblings("span").removeClass("bg-red").addClass("bg-gray");
        }else{
            $('input[type=checkbox][name=k2x7u7ygYd5_1]').parent().siblings().removeClass("bg-red").addClass("bg-gray");
        }
        
        $("#profile input").prop("disabled", true);
        
    }, ux.fail);
    
    // HTC STI Services validations
    apiservices.getHTCandSTIValidations({"sysuic":ux.selectedPatient.G4L6aiyDSeE},function(r){
        console.log(r);
        ux.serviceValidations = r.data;
    },ux.fail);
    
    
    
    $('.trigger-hiv-validate').off('click');
    $('.trigger-hiv-validate').on('click', function() {
        if(ux.serviceValidations.HTC != undefined){
            var dateTime = new Date(ux.serviceValidations.HTC.refdate);
            dateTime = moment(dateTime).format("DD/MM/YYYY");
            application.alert(translations.translateKey('service-home.alreadyReferred')+"<br />"+
                translations.translateKey('service-home.facility')+ ux.serviceValidations.HTC.fname+"<br />"+
                translations.translateKey('service-home.dateOfReferral')+dateTime+"<br />"+
                translations.translateKey('service-home.referredBy')+ux.serviceValidations.HTC.refby
            );
            return false;
        }else{
            return true;
        }
        
    });
    
    $('.trigger-sti-validate').off('click');
    $('.trigger-sti-validate').on('click', function() {
        if(ux.serviceValidations.STI != undefined){
            var dateTime = new Date(ux.serviceValidations.STI.refdate);
            dateTime = moment(dateTime).format("DD/MM/YYYY");
            application.alert(translations.translateKey('service-home.alreadyReferred')+"<br />"+
                translations.translateKey('service-home.facility')+ ux.serviceValidations.STI.fname+"<br />"+
                translations.translateKey('service-home.dateOfReferral')+dateTime+"<br />"+
                translations.translateKey('service-home.referredBy')+ux.serviceValidations.STI.refby
            );
            return false;
        }else{
            return true;
        }
    });
    
    // show client contacted location
    $('.trigger-marker-popup').off('click');
    $('.trigger-marker-popup').on('click', function() {
        
    });
    
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        //application.mainView.back();
        uc.backToHome();
    });
    
    
});


application.onPageInit('REF-HIV', function (page) {
    
    
    // fill Months dropdown list 
    /*for (i = 1; i <= 12; i++)
    {
        $('select[name="HdFrLpdSs4Z"]').append($('<option />').val(i).html(i));
    }*/
    // fill years dropdown list 
    for (i = new Date().getFullYear(); i > 1917; i--)
    {
        $('select[name="oP2UMRUQaRt"]').append($('<option />').val(i).html(i));
    }
    
    //Get HTC Centers list 
    apiservices.getTestingCentersList({"orgid": $.jStorage.get("userObject").orgid,"name":"HTC"},function(r){
        if(r.status == "success"){
            if(r.data.HTC != undefined){
                $.each(r.data.HTC,function(i,v){
                    $('select[name="hHMXmJuoOUn"]').append($('<option />').val(i).html(v));
                });
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
    },function(){
        if($.jStorage.get("userObject").data.HTC != undefined){
            $.each($.jStorage.get("userObject").data.HTC,function(i,v){
                $('select[name="hHMXmJuoOUn"]').append($('<option />').val(i).html(v));
            });
        }
    });
    
    
    
    // Ever Tested Dependencies 
    if($('input[type=radio][name=pFyMZEjVJPl]:checked').val() == "2"){
        $('select[name="HdFrLpdSs4Z"]').closest("li").hide();
    }else{
        $('select[name="HdFrLpdSs4Z"]').closest("li").show();
    }
    $('input[type=radio][name=pFyMZEjVJPl]').on("change",function(){
        $("form").validate().resetForm();
        if(this.value == '2'){
            $('select[name="HdFrLpdSs4Z"]').closest("li").hide();
        }else{
            $('select[name="HdFrLpdSs4Z"]').closest("li").show();
        }
    });
    
    // Testing Services Dependencies 
    if($('input[type=radio][name=DTrfQCylagK]:checked').val()){
        if($('input[type=radio][name=DTrfQCylagK]:checked').val() == "1"){
            $('select[name="hHMXmJuoOUn"]').closest("li").hide();
        }else{
            $('select[name="hHMXmJuoOUn"]').closest("li").show();
        }
        $('input[type=radio][name=DTrfQCylagK]:checked').parent().siblings("span.floating-button-custom").removeClass("bg-gray").addClass("bg-red");
        $('input[type=radio][name=DTrfQCylagK]:checked').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
        
    }else{
        $('select[name="hHMXmJuoOUn"]').closest("li").hide();
    }
    $('input[type=radio][name=DTrfQCylagK]').on("change",function(){
        $("form").validate().resetForm();
        
        if(this.value == '1'){
            $('select[name="hHMXmJuoOUn"]').closest("li").hide();
        }else{
            $('select[name="hHMXmJuoOUn"]').closest("li").show();
        }
        
        $(this).parent().siblings("span.floating-button-custom").removeClass("bg-gray").addClass("bg-red");
        
        $(this).parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });
    
    vx.hivReferralFormValidation();
    // Submit form data
    $('.trigger-ref-hiv').off('click');
    $('.trigger-ref-hiv').on('click', function() {
        vx.hivReferralFormValidation();
        if($("#REF_HIV").valid()){
            ux.updateFormData('REF_HIV');
            if($("input[name='DTrfQCylagK']:checked").val() == "3" || $("input[name='DTrfQCylagK']:checked").val() == "2"){
                if($("select[name='hHMXmJuoOUn']").val() != ''){
                    console.log($("select[name='hHMXmJuoOUn']").val());
                    //console.log("success1");return;
                    var modeOfPublish = "COMPLETE";
                    uc.saveStageDetails('REF_HIV',modeOfPublish);
                }else{
                    application.alert(translations.translateKey('validationMsg.centerRequired'));
                }

            }else{
                 //console.log("success2");return;
                var modeOfPublish = "COMPLETE";
                uc.saveStageDetails('REF_HIV',modeOfPublish);
            }
            
        }
        return;
        
         
        
    });
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
    
    $('.trigger-nearme').off('click');
    $('.trigger-nearme').on('click', function() {
        mainView.router.loadPage("fragments/nm-facilities.html?type=HTC");
        
    });
    
    if(ux.selectedFacility){
        $('select[name="hHMXmJuoOUn"]').append($('<option />').val(ux.selectedFacility.id).html(ux.selectedFacility.name));
        $('select[name="hHMXmJuoOUn"]').val(ux.selectedFacility.id);
        ux.selectedFacility = '';
    }
});

application.onPageBeforeAnimation('nm-facilities', function (page) { //onPageInit TODO
	applicationMAP.init('imap');
});

application.onPageInit('nm-facilities', function (page) {
    application.showPreloader(translations.translateKey('app.txtloading'));
    navigator.geolocation.getCurrentPosition(function (pos) {
        application.nmPosition = pos;
        application.hidePreloader();
        location.lat = pos.coords.latitude;
        location.lng = pos.coords.longitude;
        var instance = {
            "latitude": location.lat,
            "longitude": location.lng,
            "type":page.query.type
        }
        apiservices.loadNmFacilities(instance, function(r){
            if(r.data.length > 0){
                applicationMAP.markerView(r);
            }else{
                application.alert(translations.translateKey('nearme.noNearme'));
            }
        }, ux.fail);
    }, ux.gpsFail, {timeout: 20000});
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.back()
    });
});

application.onPageInit('REF-STI', function (page) {
    
    //Get STI Centers list 
    apiservices.getTestingCentersList({"orgid": $.jStorage.get("userObject").orgid,"name":"STI"},function(r){
        if(r.status == "success"){
            if(r.data.STI != undefined){
                $.each(r.data.STI,function(i,v){
                    $('select[name="rq5B4SfhaEl"]').append($('<option />').val(i).html(v));
                });
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
        
    },function(){
        if($.jStorage.get("userObject").data.STI != undefined){
            $.each($.jStorage.get("userObject").data.STI,function(i,v){
                $('select[name="rq5B4SfhaEl"]').append($('<option />').val(i).html(v));
            });
        }
    });
    
    // STI Clinic Dropdown Dependencies 
    if($('input[type=radio][name=JZd66Q9cThg]:checked').val()){
        if($('input[type=radio][name=JZd66Q9cThg]:checked').val() == "1"){
            $('select[name="rq5B4SfhaEl"]').closest("li").hide();
        }else{
            $('select[name="rq5B4SfhaEl"]').closest("li").show();
        }
        $('input[type=radio][name=JZd66Q9cThg]:checked').parent().siblings("span.floating-button-custom").removeClass("bg-gray").addClass("bg-red");
        $('input[type=radio][name=JZd66Q9cThg]:checked').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    }else{
        $('select[name="rq5B4SfhaEl"]').closest("li").hide();
    }
    $('input[type=radio][name=JZd66Q9cThg]').on("change",function(){
        $("form").validate().resetForm();
        if(this.value == '1'){
            $('select[name="rq5B4SfhaEl"]').closest("li").hide();
        }else{
            $('select[name="rq5B4SfhaEl"]').closest("li").show();
        }
        
        $(this).parent().siblings("span.floating-button-custom").removeClass("bg-gray").addClass("bg-red");
        
        $(this).parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });
    
    // Other Specify Checkbox Dependencies
    if($('input[type=checkbox][name=e4bIyq3bexC]:checked').val() == "on"){
        $('input[name="sKKW47zsKep"]').closest("li").show();
    }else{
        $('input[name="sKKW47zsKep"]').closest("li").hide();
    }
    $('input[type=checkbox][name=e4bIyq3bexC]').on("change",function(){
        
        if(this.checked){
            $('input[name="sKKW47zsKep"]').closest("li").show();
        }else{
            $('input[name="sKKW47zsKep"]').closest("li").hide();
        }
    });
    vx.STIReferralFormValidation();
    
    // Submit form data
    $('.trigger-ref-sti').off('click');
    $('.trigger-ref-sti').on('click', function() {
        vx.STIReferralFormValidation();
        
        if($("#REF_STI").valid()){
            if($("input[name='JZd66Q9cThg']:checked").val() == "3" || $("input[name='JZd66Q9cThg']:checked").val() == "2"){
                if($("select[name='rq5B4SfhaEl']").val() != ''){
                    //console.log("success1");return;
                    var modeOfPublish = "COMPLETE";
                    uc.saveStageDetails('REF_STI',modeOfPublish);
                }else{
                    application.alert(translations.translateKey('validationMsg.centerRequired'));
                }

            }else{ 
                //console.log("success2");return;
                var modeOfPublish = "COMPLETE";
                uc.saveStageDetails('REF_STI',modeOfPublish);
            }
        }
        return;
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
});

application.onPageInit('REF-TB', function (page) {
    
    //Get HTC Centers list 
    apiservices.getTestingCentersList({"orgid": $.jStorage.get("userObject").orgid,"name":"TB"},function(r){
        if(r.status == "success"){
            if(r.data.TB != undefined){
                $.each(r.data.TB,function(i,v){
                    $('select[name="pQlw1ekDWQr"]').append($('<option />').val(i).html(v));
                });
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
    },function(){
        if($.jStorage.get("userObject").data.TB != undefined){
            $.each($.jStorage.get("userObject").data.TB,function(i,v){
                $('select[name="pQlw1ekDWQr"]').append($('<option />').val(i).html(v));
            });
        }
        
    });
    
    if($("#REF_TB input[type=checkbox]:checked").length > 0){
        $(".tb-suspect-msg").show();
    }else{
        $(".tb-suspect-msg").hide();
    }
    $("#REF_TB input[type=checkbox]").on("change",function(){
        if($("input[type=checkbox]:checked").length > 0){
            $(".tb-suspect-msg").show();
        }else{
            $(".tb-suspect-msg").hide();
        }
    });
    // Submit form data
    $('.trigger-ref-tb').off('click');
    $('.trigger-ref-tb').on('click', function() {
        vx.TBReferralFormValidation();
        if($("#REF_TB").valid()){
            ux.updateFormData('REF_TB');
            var modeOfPublish = "COMPLETE";
            uc.saveStageDetails('REF_TB',modeOfPublish); 
        }
        return;
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
    
    $('.trigger-nearme').off('click');
    $('.trigger-nearme').on('click', function() {
        mainView.router.loadPage("fragments/nm-facilities.html?type=TB");
        
    });
    
    if(ux.selectedFacility){
        $('select[name="pQlw1ekDWQr"]').append($('<option />').val(ux.selectedFacility.id).html(ux.selectedFacility.name));
        $('select[name="pQlw1ekDWQr"]').val(ux.selectedFacility.id);
        ux.selectedFacility = '';
    }
});
application.onPageInit('services-commodities', function (page) {
    
    // comdon denied Checkbox Dependencies
    /*if($('input[type=checkbox][name=kJgGDtCwDYl]:checked').val() == "on"){
        $('input[name="xv5xVN4Yxqq"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="xv5xVN4Yxqq"]').removeAttr('disabled','disabled');
    }
    $('input[type=checkbox][name=kJgGDtCwDYl]').on("change",function(){
        if(this.checked){
            $('input[name="xv5xVN4Yxqq"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="xv5xVN4Yxqq"]').removeAttr('disabled','disabled');
        }
    });*/
    if($('select[name=kJgGDtCwDYl]').val() != ""){
        $('input[name="xv5xVN4Yxqq"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="xv5xVN4Yxqq"]').removeAttr('disabled','disabled');
    }
    $('select[name=kJgGDtCwDYl]').on("change",function(){
        if(this.value != ""){
            $('input[name="xv5xVN4Yxqq"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="xv5xVN4Yxqq"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $condomInput = $('input[name="xv5xVN4Yxqq"]');
    $condomInput.val(0);
    $(".altera").click(function(){
        if(!$condomInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $condomInput.val(parseInt($condomInput.val())+1);
            else if ($condomInput.val()>=1)
                $condomInput.val(parseInt($condomInput.val())-1);
        }
        
    });
    
    // lubricant denied Checkbox Dependencies
    /*if($('input[type=checkbox][name=gb44vFC3ENE]:checked').val() == "on"){
        $('input[name="Tj7LVYoA3CL"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="Tj7LVYoA3CL"]').removeAttr('disabled','disabled');
    }
    $('input[type=checkbox][name=gb44vFC3ENE]').on("change",function(){
        if(this.checked){
            $('input[name="Tj7LVYoA3CL"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="Tj7LVYoA3CL"]').removeAttr('disabled','disabled');
        }
    });*/
    
    if($('select[name=gb44vFC3ENE]').val() != ""){
        $('input[name="Tj7LVYoA3CL"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="Tj7LVYoA3CL"]').removeAttr('disabled','disabled');
    }
    $('select[name=gb44vFC3ENE]').on("change",function(){
        if(this.value != ""){
            $('input[name="Tj7LVYoA3CL"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="Tj7LVYoA3CL"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $lubricantInput = $('input[name="Tj7LVYoA3CL"]');
    $lubricantInput.val(0);
    $(".altera1").click(function(){
        if(!$lubricantInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $lubricantInput.val(parseInt($lubricantInput.val())+1);
            else if ($lubricantInput.val()>=1)
                $lubricantInput.val(parseInt($lubricantInput.val())-1);
        }
        
    });
    
    // N/S denied Checkbox Dependencies
    if($('input[type=checkbox][name=okSS8zZHuZ6]:checked').val() == "on"){
        $('input[name="drwa3ArLO2k"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="drwa3ArLO2k"]').removeAttr('disabled','disabled')
    }
    $('input[type=checkbox][name=okSS8zZHuZ6]').on("change",function(){
        if(this.checked){
            $('input[name="drwa3ArLO2k"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="drwa3ArLO2k"]').removeAttr('disabled','disabled')
        }
    });
    
    // Submit form data
    $('.trigger-sr-comm').off('click');
    $('.trigger-sr-comm').on('click', function() {
        var modeOfPublish = "COMPLETE";
        ux.updateFormData('SR_COMM');
        uc.saveStageDetails('SR_COMM',modeOfPublish); 
        
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
    
});
application.onPageInit('SR-HE', function (page) {
    
    var instance ={};
    instance.sysuic = ux.selectedPatient.G4L6aiyDSeE;
    instance.prefLanguage = $.jStorage.get("appLocale");
    instance.role = $.jStorage.get("userObject").userrole;
    instance.appversion = config.buildversion;
    
    apiservices.getHealthEducationValidation(instance,function(r){
        if(r.status == "success"){
            if(!$.isEmptyObject(r.data)){
                application.formFromData('#SR_HE',r.data);
                $('input[type="checkbox"]:checked').attr("disabled",true);
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
        //console.log(r);
    },ux.fail);
    
    //pamplates 
    if($('select[name=UphWcAbulLj]').val() != ""){
        $('input[name="tgcYrB1KuS6"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="tgcYrB1KuS6"]').removeAttr('disabled','disabled');
    }
    $('select[name=UphWcAbulLj]').on("change",function(){
        if(this.value != ""){
            $('input[name="tgcYrB1KuS6"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="tgcYrB1KuS6"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $condomInput = $('input[name="tgcYrB1KuS6"]');
    $condomInput.val(0);
    $(".altera").click(function(){
        if(!$condomInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $condomInput.val(parseInt($condomInput.val())+1);
            else if ($condomInput.val()>=1)
                $condomInput.val(parseInt($condomInput.val())-1);
        }
        
    });
    
    // broucher denied Checkbox Dependencies
    
    
    if($('select[name=ovejv2qy2rr]').val() != ""){
        $('input[name="BwhreghOH97"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="BwhreghOH97"]').removeAttr('disabled','disabled');
    }
    $('select[name=ovejv2qy2rr]').on("change",function(){
        if(this.value != ""){
            $('input[name="BwhreghOH97"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="BwhreghOH97"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $lubricantInput = $('input[name="BwhreghOH97"]');
    $lubricantInput.val(0);
    $(".altera1").click(function(){
        if(!$lubricantInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $lubricantInput.val(parseInt($lubricantInput.val())+1);
            else if ($lubricantInput.val()>=1)
                $lubricantInput.val(parseInt($lubricantInput.val())-1);
        }
        
    });
    
    // Submit form data
    $('.trigger-sr-he').off('click');
    $('.trigger-sr-he').on('click', function() {
        var modeOfPublish = "COMPLETE";
        ux.updateFormData('SR_HE')
        uc.saveStageDetails('SR_HE',modeOfPublish); 
        
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
    
});

application.onPageInit('SR-IEC', function (page) {
    //pamplates 
    if($('select[name=UphWcAbulLj]').val() != ""){
        $('input[name="tgcYrB1KuS6"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="tgcYrB1KuS6"]').removeAttr('disabled','disabled');
    }
    $('select[name=UphWcAbulLj]').on("change",function(){
        if(this.value != ""){
            $('input[name="tgcYrB1KuS6"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="tgcYrB1KuS6"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $condomInput = $('input[name="tgcYrB1KuS6"]');
    $condomInput.val(0);
    $(".altera").click(function(){
        if(!$condomInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $condomInput.val(parseInt($condomInput.val())+1);
            else if ($condomInput.val()>=1)
                $condomInput.val(parseInt($condomInput.val())-1);
        }
        
    });
    
    // broucher denied Checkbox Dependencies
    
    
    if($('select[name=ovejv2qy2rr]').val() != ""){
        $('input[name="BwhreghOH97"]').val("0").attr('disabled','disabled');
    }else{
        $('input[name="BwhreghOH97"]').removeAttr('disabled','disabled');
    }
    $('select[name=ovejv2qy2rr]').on("change",function(){
        if(this.value != ""){
            $('input[name="BwhreghOH97"]').val("0").attr('disabled','disabled');
        }else{
            $('input[name="BwhreghOH97"]').removeAttr('disabled','disabled');
        }
    });
    
    
    var $lubricantInput = $('input[name="BwhreghOH97"]');
    $lubricantInput.val(0);
    $(".altera1").click(function(){
        if(!$lubricantInput.prop('disabled')){
            if ($(this).hasClass('acrescimo'))
                $lubricantInput.val(parseInt($lubricantInput.val())+1);
            else if ($lubricantInput.val()>=1)
                $lubricantInput.val(parseInt($lubricantInput.val())-1);
        }
        
    });
    
    // Submit form data
    $('.trigger-sr-iec').off('click');
    $('.trigger-sr-iec').on('click', function() {
        var modeOfPublish = "COMPLETE";
        ux.updateFormData('SR_IEC');
        uc.saveStageDetails('SR_IEC',modeOfPublish); 
        
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        
    });
    
});

application.onPageInit('SR-HTC', function (page) {
    
    
    
    //Get STI Centers list 
    apiservices.getTestingCentersList({"orgid": $.jStorage.get("userObject").orgid,"name":"HIV"},function(r){
        if(r.status == "success"){
            if(r.data.HIV != undefined){
                $.each(r.data.HIV,function(i,v){
                    $('select[name="fAkDnJQeN53"]').append($('<option />').val(i).html(v));
                });
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
    },function(){
        if($.jStorage.get("userObject").data.HIV != undefined){
            $.each($.jStorage.get("userObject").data.HIV,function(i,v){
                $('select[name="fAkDnJQeN53"]').append($('<option />').val(i).html(v));
            });
        }
        
    });
    
    
    // Type of hiv Test Dependencies 
    if($('select[name="aDzHAj64SsC"]').val() == "2"){
        $('#test1').show();
        $("#hivTestResults").hide();
    
        $('input[type=radio][name=ZvKUwXb6tJn]').attr('checked',false);
        
        // clear values
        $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
        $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
        $('select[name="fAkDnJQeN53"]').val("");
        
    }else if($('select[name="aDzHAj64SsC"]').val() == "1"){
        console.log("1");
        $('#test1').hide();
        $("#hivTestResults").show();
        
        if($('input[type=radio][name=ZvKUwXb6tJn]:checked').val() == "1"){
            $('#liReferralsRadio,#liTreatmentCenterList').show();
        }else{
            $('#liReferralsRadio,#liTreatmentCenterList').hide();
        }
        // clear values
        //$('input[type=radio][name=ZvKUwXb6tJn]').attr('checked',false);
        
        // clear values
        $('#liInfoMessage').hide();//#liReferralsRadio,#liTreatmentCenterList,
        //$('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
        //$('select[name="fAkDnJQeN53"]').val("");
    }else{
        $('#test1').hide();
        
        // clear values
        $('input[type=radio][name=ZvKUwXb6tJn]').attr('checked',false);
        
        // clear values
        $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
        $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
        $('select[name="fAkDnJQeN53"]').val("");
    }
    $('select[name="aDzHAj64SsC"]').on("change",function(){
        if(this.value == '2'){
            $('#test1').show();
            $("#hivTestResults").hide();
            
            $('input[type=radio][name=ZvKUwXb6tJn]').attr('checked',false);
            // clear values
            $('#liReferralsRadio,#liTreatmentCenterList').hide();
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
        }else if(this.value == '1'){
            $('#test1,#test2,#test3').hide();
            $("#hivTestResults").show();
            
            // clear values
            $('select[name=Sop8n4Bf7Oj]').val("");
            $('input[type=radio][name=JDb81Myh4LW]').attr('checked',false);
            $('input[type=radio][name=dnFxSkuWLUo]').attr('checked',false);
            $('input[type=radio][name=xbVZviYxWFI]').attr('checked',false);
            
            // clear values
            $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
        }else{
            $('#test1,#test2,#test3').hide(); 
            $("#hivTestResults").hide();
            
            // clear values
            $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('input[type=radio][name=JDb81Myh4LW]').attr('checked',false);
            $('input[type=radio][name=ZvKUwXb6tJn]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
        }
    });
    // Type of hiv test end
    
    // Determine test result radio
    $('input[type=radio][name=JDb81Myh4LW]').on("change",function(){
        if(this.value == '1'){
            $('#test2,#test3').show();
            if($('input[type=radio][name=dnFxSkuWLUo]:checked').val() == '1' && $('input[type=radio][name=xbVZviYxWFI]:checked').val() == '1'){
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').show();
            }else{
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
                //change referrel radio color
                $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                    if($(this).hasClass('bg-red')){
                        $(this).removeClass('bg-red').addClass('bg-gray');
                    }
                });
            }
        }else{
            $('#test2,#test3').hide(); 
            $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
            $("#onsiteActiveReactive").hide();
            
            // clear values 
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
            $('input[type=radio][name=O4qbki4e2cd]').attr('checked',false);
            $('input[type=radio][name=dnFxSkuWLUo]').attr('checked',false);
            $('input[type=radio][name=xbVZviYxWFI]').attr('checked',false);
            
            //change referrel radio color
            $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }
    });
    // Determine test result radio end
    
    // Uni-gold test result radio
    $('input[type=radio][name=dnFxSkuWLUo]').on("change",function(){
        if(this.value == '1'){
            if($('input[type=radio][name=JDb81Myh4LW]:checked').val() == '1' && $('input[type=radio][name=xbVZviYxWFI]:checked').val() == '1'){
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').show();
            }else{
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
                //change referrel radio color
                $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                    if($(this).hasClass('bg-red')){
                        $(this).removeClass('bg-red').addClass('bg-gray');
                    }
                });
            }
        }else{
            $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
            
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
            //change referrel radio color
            $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }
    });
    
    // Stat-pak test result radio
    $('input[type=radio][name=xbVZviYxWFI]').on("change",function(){
        if(this.value == '1'){
            if($('input[type=radio][name=JDb81Myh4LW]:checked').val() == '1' && $('input[type=radio][name=dnFxSkuWLUo]:checked').val() == '1'){
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').show();
            }else{
                $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
                
                //change referrel radio color
                $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                    if($(this).hasClass('bg-red')){
                        $(this).removeClass('bg-red').addClass('bg-gray');
                    }
                });
            }
        }else{
            $('#liReferralsRadio,#liTreatmentCenterList,#liInfoMessage').hide();
            
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
            //change referrel radio color
            $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }
    });
    
    // HIV test result radio
    $('input[type=radio][name=ZvKUwXb6tJn]').on("change",function(){
        $("form").validate().resetForm();
        
        if(this.value == '1'){
            $('input[type=radio][name=ZdWY8efOQOB]').closest("li").show();
            $('select[name="fAkDnJQeN53"]').closest("li").show();
        }else{
            
            $('input[type=radio][name=ZdWY8efOQOB]').closest("li").hide();
            $('select[name="fAkDnJQeN53"]').closest("li").hide();
            $("#onsiteActiveReactive").hide();
            
            // clear values
            $('input[type=radio][name=ZdWY8efOQOB]').attr('checked',false);
            $('select[name="fAkDnJQeN53"]').val("");
            $('input[type=radio][name=O4qbki4e2cd]').attr('checked',false);
            
            $('input[type=radio][name=ZdWY8efOQOB]').parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
                if($(this).hasClass('bg-red')){
                    $(this).removeClass('bg-red').addClass('bg-gray');
                }
            });
        }
    });
    
    // HIV test result radio end
    //$('#liReferralsRadio,#liTreatmentCenterList').hide();
    
    $('input[type=radio][name=ZdWY8efOQOB]').on("change",function(){
        $("form").validate().resetForm();
        
        $(this).parent().siblings("span.floating-button-custom").removeClass("bg-gray").addClass("bg-red");
        $(this).parent().parent().siblings().children("span.floating-button-custom").each(function(i,v){
            if($(this).hasClass('bg-red')){
                $(this).removeClass('bg-red').addClass('bg-gray');
            }
        });
    });
    vx.htcServicesFormValidation();
    // Submit form data
    $('.trigger-sr-htc').off('click');
    $('.trigger-sr-htc').on('click', function() {
        vx.htcServicesFormValidation();
        if($("#SR_HTC").valid()){
            ux.updateFormData('SR_HTC');
            var formdata = application.formGetData('SR_HTC');
            /*if(formdata['JDb81Myh4LW'] != undefined){
                formdata['ZvKUwXb6tJn'] = formdata['JDb81Myh4LW'];
            }else if(formdata['dnFxSkuWLUo'] != undefined){
                formdata['ZvKUwXb6tJn'] = formdata['dnFxSkuWLUo'];     
            }else if(formdata['xbVZviYxWFI'] != undefined){
                formdata['ZvKUwXb6tJn'] = formdata['xbVZviYxWFI']; 
            }*/
            
           //console.log(formdata);return;
            application.formStoreData('SR_HTC',formdata);

            //var modeOfPublish = "COMPLETE";
            //uc.saveStageDetails('SR_HTC',modeOfPublish); 
            
            if($("input[name='ZdWY8efOQOB']:checked").val() == "3" || $("input[name='ZdWY8efOQOB']:checked").val() == "2"){
                if($("select[name='fAkDnJQeN53']").val() != ''){
                    //console.log("success1");return;
                    var modeOfPublish = "COMPLETE";
                    uc.saveStageDetails('SR_HTC',modeOfPublish);
                }else{
                    application.alert(translations.translateKey('validationMsg.centerRequired'));
                }

            }else{ 
                //console.log("success2");return;
                var modeOfPublish = "COMPLETE";
                uc.saveStageDetails('SR_HTC',modeOfPublish);
            }
        }
        return;
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        if(page.query.backto != undefined){
            mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        }else{
            uc.backToHome();
        }
        
    });
    
    $('.trigger-nearme').off('click');
    $('.trigger-nearme').on('click', function() {
        mainView.router.loadPage("fragments/nm-facilities.html?type=HIV");
        
    });
    
    if(ux.selectedFacility){
        $('select[name="fAkDnJQeN53"]').append($('<option />').val(ux.selectedFacility.id).html(ux.selectedFacility.name));
        $('select[name="fAkDnJQeN53"]').val(ux.selectedFacility.id);
        ux.selectedFacility = '';
    }
});

application.onPageInit('SR-STI', function (page) {
    
    //Get STI Centers list 
    apiservices.getTestingCentersList({"orgid": $.jStorage.get("userObject").orgid,"name":"STI"},function(r){
        if(r.status == "success"){
            if(r.data.STI != undefined){
                $.each(r.data.STI,function(i,v){
                    $('select[name="XZouao8CYES"]').append($('<option />').val(i).html(v));
                });
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
        
    },function(){
        if($.jStorage.get("userObject").data.STI != undefined){
            $.each($.jStorage.get("userObject").data.STI,function(i,v){
                $('select[name="XZouao8CYES"]').append($('<option />').val(i).html(v));
            });
        }
        
    });
    
    // STI Type Dependencies 
    if($('input[type=radio][name=NAJNypIfDZo]:checked').val() == "1"){
        $('select[name="SmbInVdc8th"], select[name="XZouao8CYES"]').closest("li").show();
    }else{
        $('select[name="SmbInVdc8th"], select[name="XZouao8CYES"]').closest("li").hide();
    }
    $('input[type=radio][name=NAJNypIfDZo]').on("change",function(){
        $("form").validate().resetForm();
        if(this.value == '1'){
            $('select[name="SmbInVdc8th"], select[name="XZouao8CYES"]').closest("li").show();
        }else{
            $('select[name="SmbInVdc8th"], select[name="XZouao8CYES"]').closest("li").hide();
        }
    });
    
    // Submit form data
    $('.trigger-sr-sti').off('click');
    $('.trigger-sr-sti').on('click', function() {
        vx.STIServicesFormValidation();
        if($("#SR_STI").valid()){
            var modeOfPublish = "COMPLETE";
            uc.saveStageDetails('SR_STI',modeOfPublish);
        }
        return;
        
        
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        if(page.query.backto != undefined){
            mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        }else{
            uc.backToHome();
        }
        
    });
    
});
application.onPageInit('SR-ART', function (page) {

    if($('input[type=radio][name=GbbOYGML3Xx]:checked').val() == "2"){
        $('select[name="TUfI4Ft8oWC"]').closest("li").show();
        $('input[name="XI8at21LXbg"]').closest("li").hide();
    }else{
        $('select[name="TUfI4Ft8oWC"]').closest("li").hide();
        $('input[name="XI8at21LXbg"]').closest("li").show();
    }
    $('input[type=radio][name=GbbOYGML3Xx]').on("change",function(){
        $("form").validate().resetForm();
        if(this.value == '2'){
            $('select[name="TUfI4Ft8oWC"]').closest("li").show();
            $('input[name="XI8at21LXbg"]').closest("li").hide();
        }else{
            $('select[name="TUfI4Ft8oWC"]').closest("li").hide();
            $('input[name="XI8at21LXbg"]').closest("li").show();
        }
    });
    // Submit form data
    $('.trigger-sr-art').off('click');
    $('.trigger-sr-art').on('click', function() {
        vx.ARTServicesFormValidation();
        if($("#SR_ART").valid()){
            var modeOfPublish = "COMPLETE";
            uc.saveStageDetails('SR_ART',modeOfPublish); 
        }
        return;
        
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        if(page.query.backto != undefined){
            mainView.router.loadPage("fragments/"+page.query.backto+".html?backto="+page.query.backto);
        }else{
            uc.backToHome();
        }
    });
    
});

application.onPageInit('SR-TB', function (page) {
    
    // Submit form data
    $('.trigger-sr-tb').off('click');
    $('.trigger-sr-tb').on('click', function() {
        var modeOfPublish = "COMPLETE";
        uc.saveStageDetails('SR_TB',modeOfPublish);
        
    });
    
});

application.onPageInit('targets', function (page) {
    apiservices.getOrwusersList({"orgid": $.jStorage.get("userObject").orgid},function(r){
        //console.log(r);
        if(r.status == "success" && r.data.length > 0){
            $.each(r.data,function(i,v){
                $('select[name="userid"]').append($('<option />').val(v.userid).html(v.firstname+" "+v.lastname));
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
    },ux.fail);
   /* for (i = new Date().getFullYear(); i > 2010; i--)
    {
        $('select[name="year"]').append($('<option />').val(i).html(i));
    }
    */
    $('select[name="month"]').on('change',function(){
        if(this.value != ''){
            var instance = {};
            instance.username = $.jStorage.get("userObject").username;
            instance.userid = $('select[name="userid"]').val();
            instance.year = $('select[name="year"]').val();
            instance.month = $('select[name="month"]').val();
            apiservices.getOrwTargets(instance,function(r){
                //console.log(r);
                if(r.status == 'success'){
                    $.get('templates/targets-form.html', function (data) {
                        
                        var compiled = Template7.compile(data);
                        
                        $('#weeksData').html(compiled(r.data)); 
                        translations.loadTranslations($.jStorage.get('appLocale'));
                        
                        // week data handling
                        var weekCount = parseInt(ux.getWeekByMonthAndYears(instance.year,instance.month,1));
                       // console.log(weekCount);
                        if(weekCount == 4){
                            $('input[name="week5"],input[name="week6"],input[name="ref_week5"],input[name="ref_week6"]').parent().parent().parent().parent().hide();
                        }
                        if(weekCount == 5){
                            $('input[name="week6"],input[name="ref_week6"]').parent().parent().parent().parent().hide();
                        }
                        
                        
                        $(".trigger-weekdata-submit").off("click");
                        $(".trigger-weekdata-submit").on("click",function(){
                            var instance = {};
                            instance.username = $.jStorage.get("userObject").username;
                            instance.userid = $('select[name="userid"]').val();
                            instance.orgid = $.jStorage.get("userObject").orgid;
                            instance.year = $('select[name="year"]').val();
                            instance.month = $('select[name="month"]').val();
                            $.extend(true,instance,application.formToData("#weeksData"));
                            //console.log(instance);
                            apiservices.updateOrwTargets(instance,function(r){
                                application.cordovaAPI.toast({
                                    text: translations.translateKey("targets.updatedSuccess")
                                });
                            },ux.fail);

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
                }
                

            },ux.fail);
        }
    });
    
    $('.trigger-back').off('click');
    $('.trigger-back').on('click', function() {
        uc.backToHome();
    });
    
});
application.onPageInit('add-nearme', function (page) {
    application.showPreloader(translations.translateKey('addnearme.locating'));
    navigator.geolocation.getCurrentPosition(function(pos) {
        application.hidePreloader();
       // var latlng = pos.coords.latitude+","+pos.coords.longitude;
        nmmaplocator.initMAP('anmmap',pos.coords.latitude,pos.coords.longitude);    
    },ux.gpsFail,{timeout : 30000, enableHighAccuracy: true});
    
    $('.capture-image').off('click');
    $('.capture-image').on('click', function() {
        application.cordovaAPI.mediaAPI.capturePhoto(function(imageURI) {
           alert(imageURI);
            //ux.upload2ImageServer(imageURI, ux.publishHotspotPics, ux.imagePublishFailed);
            ux.appendHotspotImage(imageURI);
            //alert(JSON.stringify(ux.hotspotImages));
        });
    });
    
    $('.gallery-image').off('click');
    $('.gallery-image').on('click', function() {
        /*application.cordovaAPI.mediaAPI.galleryPhoto(function(imageURI) {
            ux.upload2ImageServer(imageURI, ux.publishHotspotPics, ux.imagePublishFailed);
        });*/
        
        window.imagePicker.getPictures(
            function(results) {
                for(var i = 0; i < results.length; i++) {
                    alert(results[i]);
                    ux.appendHotspotImage(results[i]);
                }
                //alert(JSON.stringify(ux.hotspotImages));
            }, function (error) {
                alert('Error: ' + error);
            }, {
                maximumImagesCount: 5
            }
        );
    });
    
    $('.trigger-addnm').off('click');
    $('.trigger-addnm').on('click', function() {
        var imageCount = ux.hotspotImages.length; //.limit(5)
        //console.log(imageCount);
        ux.requestCallback = new MyRequestsCompleted({
            numRequest: imageCount,
            singleCallback: function() {
                application.hidePreloader();
                //console.log( "I'm the callback");

                availImageCount = ux.hotspotImages.length; // .limit(5)

                var passed = imageCount - availImageCount;
                var failed = availImageCount;

                var msg =  translations.translateKeyParams('app.publishImageResponsePassed', {
                    "passed" : passed,
                    "imageCount" : imageCount
                });

                if(failed > 0) {
                   msg += translations.translateKeyParams('app.publishImageResponseFailed', {
                        "failed" : failed
                    });
                }

                application.alert(msg);

                //API call to submit data TODO  
                alert("api call here");
            }
        });
        $.each(ux.hotspotImages,function(i,e){
            ux.upload2ImageServer(e, ux.publishHotspotPics, ux.imagePublishFailed);
        });
    });
    
});

application.onPageBeforeAnimation('nearme', function (page) { 
    nmMAP.init();
});

application.onPageInit('nearme', function (page) {
    //nmMAP.init();
    apiservices.checkoutNearme();
    
    $('.reload-nm').off('click');
    $('.reload-nm').on('click', function() {
        nmMAP.resetMAP();
        apiservices.checkoutNearme();
    });
   
});

application.onPageInit('help', function (page) {
   
    $(".trigger-back").off("click");
    $(".trigger-back").on("click",function(e){
        uc.backToHome();
        //application.closePanel();
        //return false;
    });
         
});

application.onPageInit('notifications', function (page) {
    var instance = {};
    instance.username = $.jStorage.get("userObject").username;
    instance.preflanguage = $.jStorage.get("appLocale");
    application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
    apiservices.getNotificationsList(instance, ux.notificationsListSuccessCallback, ux.fail);
   
});

application.onPageInit('messages', function (page) {
    var instance = {};
    instance.username = $.jStorage.get("userObject").username;
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    
    application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
    apiservices.getMessagesList(instance, ux.messageListSuccessCallback, ux.fail);  
    
    $(".trigger-refresh-messages").off("click");
    $(".trigger-refresh-messages").on("click",function(){
        application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
        apiservices.getMessagesList(instance, ux.messageListSuccessCallback, ux.fail);  
    });
});


application.onPageInit('send-messages', function (page) {
    var instance = {};
    instance.orgid = $.jStorage.get("userObject").orgid;
    instance.preflanguage = $.jStorage.get("appLocale");
    instance.appversion = apiservices.appversion;
    
    application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
    apiservices.getUsersList(instance, function(r){
        application.hidePreloader();
        if(r.status == "success"){
            $.each(r.data,function(i,v){
                console.log(JSON.stringify(v));
                $('select[name="to"]').append($('<option />').val(v.username).html(v.firstname+" "+v.lastname));
            })
        
        }else if(r.status == "fail") {
            if(r.appversion != undefined){
                application.alert(r.message,function(){
                    window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
                });
            }else{
                application.alert(r.message);
            }
        }
    
    }, ux.fail);
    //vx.validateSendMessage();
    $('.trigger-send').off('click');
    $('.trigger-send').on('click', function() {
        if($("#frmSendMessage").valid()){
            var instance = {};
            instance.to = [];
            instance.username = $.jStorage.get("userObject").username;
            instance.to.push(application.formGetData('frmSendMessage').to);
            instance.message = application.formGetData('frmSendMessage').message;
            //$.extend(true,instance,application.formGetData('frmSendMessage'));
            //console.log(instance);return;
                    
            apiservices.broadcastMessage(instance, function(r){
                if(r.status == "success"){
                    application.alert(translations.translateKey("send-message.messageSent"));
                    //application.formDeleteData('frmSendMessage');
                    document.getElementById("frmSendMessage").reset();
                    //mainView.loadPage("fragments/messages.html");
                }else if(r.status == "fail") {
                    if(r.appversion != undefined){
                        application.alert(r.message,function(){
                            window.open("https://play.google.com/store/apps/details?id=com.duretechnologies.apps.android.stc");
                        });
                    }else{
                        application.alert(r.message);
                    }
                }

            }, ux.fail);
        }
        return;
    });
    
});

application.onPageInit('my-clients', function (page) {
    
    $('.trigger-sync').off('click');
    $('.trigger-sync').on('click', function() {
        ux.syncPatients();
    });
    try{
        application.showOfflineClientList();
    }catch(e){
        console.log(e);
    }
    
    $('.trigger-myclient').off('click');
    $('.trigger-myclient').on('click', function() {
        //alert("callmyclients");
        ux.onlineNow();
    });
    
    if($$('.infinite-scroll .list-block li').length > 0){
    }else{
        //$('.infinite-scroll .list-block ul').html('');
        var instance = {};
        instance.username = $.jStorage.get("userObject").username;
        instance.orgid = $.jStorage.get("userObject").orgid;
        instance.preflanguage = $.jStorage.get("appLocale");
        instance.appversion = apiservices.appversion;
        instance.start = 0;
        //console.log(instance);
        apiservices.patientList(instance, ux.patientList, ux.fail);
    }
    $$('#tab2').on('show', function () {
        //console.log('123');
    });
});

application.onPageInit('referred-clients', function (page) {
    
    if($$('.infinite-scroll .list-block li').length > 0){
    }else{
        //$('.infinite-scroll .list-block ul').html('');
        var instance = {};
        instance.username = $.jStorage.get("userObject").username;
        instance.orgid = $.jStorage.get("userObject").orgid;
        instance.preflanguage = $.jStorage.get("appLocale");
        instance.appversion = apiservices.appversion;
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
        
        
        instance.start = 0;
        //console.log(instance);
        apiservices.referredPatientList(instance, ux.referredPatientList, ux.fail);
    }
    
    $(".trigger-back").off("click");
    $(".trigger-back").on("click",function(e){
        uc.backToHome();
    });
    
});

application.onPageInit('user-profile', function (page) {
    // param code, locale, formdata
    uc.generateForm('user-profile',$.jStorage.get('appLocale'),$.jStorage.get("userObject"));
    //vx.userProfileFormValidations();  
    $('.trigger-update-profile').off('click');
    $('.trigger-update-profile').on('click', function() {
        if($("#user-profile").valid()){
            //console.log(uc.formArrayToJSON($("#user-profile")));
            $.extend( true, $.jStorage.get("userObject"), uc.formArrayToJSON($("#user-profile")));
            //console.log($.jStorage.get("userObject"));
            apiservices.updateUserProfile($.jStorage.get("userObject"),ux.updateProfileSuccess,ux.fail);
        }
        return;
    });
});

application.onPageInit('color-themes', function (page) {
  $$(page.container).find('.ks-color-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('theme') === 0) classList.remove(classList[i]);
        }
        classList.add('theme-' + $$(this).attr('data-theme'));
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('layout-') === 0) classList.remove(classList[i]);
        }
        classList.add('layout-' + $$(this).attr('data-theme'));
    });
});

application.showOfflineClientList = function() {
    
    appDB.getLocalPatientCount(function(result){
        if(result.total_rows > 0){
            //application.showPreloader(translations.translateKeyIfExist('app.txtloading',"Loading.."));
            var list = [];
            console.log(result.rows);
            $.each(result.rows,function(i,v){
                 console.log(v.doc.data);
                if(v.doc.data != undefined){
                    var instance = {};
                    instance._id = v.doc._id;
                    instance.mode = v.doc.data.mode;
                    //instance.fname = v.doc.data.registerForm.ZFFqvZkdib5;
                    //instance.lname = v.doc.data.registerForm.YlOhmTgrBQ2;
                    instance.nickname = v.doc.data.registerForm.yjsuldl4RAA;
                    instance.dob = v.doc.data.registerForm.DaNLHNTlMFK;
                    instance.gender = v.doc.data.registerForm.IClOfxEogHN;
                    //instance.uic = v.doc.data.registerForm.GHIjkEcm2NN;
                   //console.log(instance);                 
                    list.push(instance);
                }
                
            });
            
            $.get('templates/clients-offline-list.html', function(data) {
                var compiled = Template7.compile(data);
                translations.loadTranslations($.jStorage.get('appLocale'));
                $('.surveyList-container').html(compiled(list));       

                //taphold
                $('.trigger-survey-options').off('click'); 
                $('.trigger-survey-options').on('click', function(e) {
                    e.preventDefault();
                    //ux.surveyType = db.surveyTypes({type : $(this).data('type')}).get()[0];
                    var objectid = $(this).data('objectid');
                    //console.log(objectid);
                    uc.actionButtons(objectid);
                });
            });
        }else{
            $(".ul-draft").empty();
        }
    });
}

application.onPageInit('clientsList', function (page) {
    //application.showOfflineClientList();
});

application.onPageInit('alerts', function (page) {
    
    var instance = {};
    instance.user = $.jStorage.get("userObject").username;
    instance.userrole = $.jStorage.get("userObject").userrole;
    instance.type = "due";
    
    apiservices.alerts(instance,function(r){
        //console.log(r);
        $.get('templates/due-alert.html', function (data) {
            var compiled = Template7.compile(data);
            $('#duePatientList').html(compiled(r)); 
            translations.loadTranslations($.jStorage.get('appLocale'));
            
            $(".trigger-goto-services").off("click");
            $(".trigger-goto-services").on("click",function(e){
                uc.commingFromSearch = true;
                //console.log($(this).data('sysuic'));
                var clientInstance = {};
                clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                clientInstance.GHIjkEcm2NN = $(this).data('uic');
                ux.selectedPatient = clientInstance;
                if(ux.selectedUserFlow != ""){
                    if(ux.selectedUserFlow == "STI"){
                        mainView.router.loadPage("fragments/sti-services.html");
                    }else if(ux.selectedUserFlow == "HTC"){
                        mainView.router.loadPage("fragments/htc-services.html");
                    }
                }else{
                    if($.jStorage.get("userObject").userrole == 'HTC_P'){
                        mainView.router.loadPage("fragments/htc-services.html");
                    }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                        mainView.router.loadPage("fragments/sti-services.html");
                    }else{
                        mainView.router.loadPage("fragments/services-home.html");
                    }
                }
            });
            
            if($.jStorage.get("userObject").userrole == 'SUP'){
                 $(".trigger-goto-services").hide();
             }
        });
    },ux.fail);
    
    $$('#tab2').on('tab:show', function () {
        instance.type = "followup";
        apiservices.alerts(instance,function(r){
            //console.log(r);
             $.get('templates/referral-alert.html', function (data) {
                var compiled = Template7.compile(data);
                $('#refPatientList').html(compiled(r)); 
                translations.loadTranslations($.jStorage.get('appLocale'));

                $(".trigger-goto-services").off("click");
                $(".trigger-goto-services").on("click",function(e){
                    uc.commingFromSearch = true;
                    //console.log($(this).data('sysuic'));
                    var clientInstance = {};
                    clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                    clientInstance.GHIjkEcm2NN = $(this).data('uic');
                    ux.selectedPatient = clientInstance;
                    if(ux.selectedUserFlow != ""){
                        if(ux.selectedUserFlow == "STI"){
                            mainView.router.loadPage("fragments/sti-services.html");
                        }else if(ux.selectedUserFlow == "HTC"){
                            mainView.router.loadPage("fragments/htc-services.html");
                        }
                    }else{
                        if($.jStorage.get("userObject").userrole == 'HTC_P'){
                            mainView.router.loadPage("fragments/htc-services.html");
                        }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                            mainView.router.loadPage("fragments/sti-services.html");
                        }else{
                            mainView.router.loadPage("fragments/services-home.html");
                        }
                    }
                });
                 
                 if($.jStorage.get("userObject").userrole == 'SUP'){
                     $(".trigger-goto-services").hide();
                 }
            });
        },ux.fail);
    });
    
    $(".trigger-referral-tab").off("click");
    $(".trigger-referral-tab").on("click",function(e){
        instance.type = "followup";
        apiservices.alerts(instance,function(r){
            //console.log(r);
             $.get('templates/referral-alert.html', function (data) {
                var compiled = Template7.compile(data);
                $('#refPatientList').html(compiled(r)); 
                translations.loadTranslations($.jStorage.get('appLocale'));

                $(".trigger-goto-services").off("click");
                $(".trigger-goto-services").on("click",function(e){
                    uc.commingFromSearch = true;
                    //console.log($(this).data('sysuic'));
                    var clientInstance = {};
                    clientInstance.G4L6aiyDSeE = $(this).data('sysuic');
                    clientInstance.GHIjkEcm2NN = $(this).data('uic');
                    ux.selectedPatient = clientInstance;
                    if(ux.selectedUserFlow != ""){
                        if(ux.selectedUserFlow == "STI"){
                            mainView.router.loadPage("fragments/sti-services.html");
                        }else if(ux.selectedUserFlow == "HTC"){
                            mainView.router.loadPage("fragments/htc-services.html");
                        }
                    }else{
                        if($.jStorage.get("userObject").userrole == 'HTC_P'){
                            mainView.router.loadPage("fragments/htc-services.html");
                        }else if($.jStorage.get("userObject").userrole == 'STI_P'){
                            mainView.router.loadPage("fragments/sti-services.html");
                        }else{
                            mainView.router.loadPage("fragments/services-home.html");
                        }
                    }
                });
                 
                 if($.jStorage.get("userObject").userrole == 'SUP'){
                     $(".trigger-goto-services").hide();
                 }
            });
        },ux.fail);
    });
    
    $(".trigger-back").off("click");
    $(".trigger-back").on("click",function(e){
        uc.backToHome();
    });
    
});

application.onPageInit('alerts-result', function (page) {
    
    var instance = {};
    instance.userName =  $.jStorage.get('userObject').userName;
    instance.prefLanguage = "en";
    application.showPreloader(translations.translateKey('app.modalPreloaderTitle'));
    apiservices.alerts(instance, ux.alerts, ux.fail); 
    
});