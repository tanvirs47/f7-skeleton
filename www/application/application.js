//disable dropdown select auto sorting
//Alpaca.defaultSort = undefined;

var application = new Framework7({
    modalTitle: 'SC Outreach Module',
    
    // Single Page View
    preloadPreviousPage:false,
    swipeBackPage: false,
    
    // Enable Material theme
    material: true,
    animatePages: false,
    pushState: true,
    
    
    uniqueHistory: true, 
    
    fastClicksDistanceThreshold: 10 * window.devicePixelRatio,
    
    // Template7
    templates: {},
    template7Data: {},
    template7Pages: true,
    precompileTemplates: true,    
    
    CordovaAPI : {
        support : true,
        isAPP : true        
    }
    
    /*html5API : {
        gps : true,
    },
    
    logger : {
        
    }*/
    
});


Template7.global = {
    app : {
        name : "STC",
        tagline : "",
        version : 'v1.0'
    },    
    support: 'support@ddrtcm.com'
};

// Expose Internal DOM library
var $$ = Dom7;


var leftView;
if($$('.view-left').length > 0) {
    leftView = application.addView('.view-left', {
        //dynamicNavbar:true
    });
}

var mainView;
if($$('.view-main').length > 0) {
    mainView = application.addView('.view-main', {
        dynamicNavbar: true
    });
}

var rightView;
if($$('.view-right').length > 0) {
    rightView = application.addView('.view-right', {
        //dynamicNavbar: true
    });
}

$(document).on('ajaxSend', function (e) {
    application.hidePreloader();
    application.showIndicator();
});

$(document).on('ajaxStop', function (e) {
    application.hideIndicator();
});

// T7 Registries
Template7.registerHelper('stringify', function (instance) {    
    return JSON.stringify(instance);
});
Template7.registerHelper('convertToThaiDate', function (instance) {
    var check = moment(instance, 'YYYY-MM-DD');
    var day   = check.format('DD');
    var month = check.format('MM');
    var year  = check.format('YYYY');
    year = parseInt(year) + 543;
    return moment(month+"-"+day+"-"+year,"MM-DD-YYYY").format("DD-MM-YYYY");
    
    
   /* var d = new Date(instance);
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    year= year+543;
    //return month+"-"+day+"-"+year;
    return moment(month+"-"+day+"-"+year,"MM-DD-YYYY").format("DD-MM-YYYY");*/
});
Template7.registerHelper('DateToAge', function (instance) {
    if(instance.indexOf('*') == -1){
        return moment().diff(instance, 'years', false);
    }else{
        return "**";
    }
    
});

Template7.registerHelper('fromNow', function (value) {
    moment(value).format("YYYY-MM-DD HH:mm");
    return moment(value).fromNow();
});

/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
    
    //links show hide
    uc.roleBaseLeftPanel();
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});

application.mapPopupTemplate = Template7.compile($('#marker-popup-template').html());

/*if($.jStorage.get("userObject")) {
    mainView.loadPage("fragments/home.html");
}else{
    mainView.loadPage("fragments/signin.html"); 
}*/
