jQuery.validator.addMethod("lettersonly", function (value, element) {
    if($.jStorage.get("appLocale") == "en_US"){
        return this.optional(element) || /^[a-z]+$/i.test(value) || /[^\u0000-\u0080]+$/i.test(value);
        //return this.optional(element) || /^[a-z]+$/i.test(value) || /[^\u0E2F-\u0E7F]+$/i.test(value);
    }else{
        return this.optional(element) || /[^\u0000-\u0080]+$/i.test(value)|| /^[a-z]+$/i.test(value);
        //return this.optional(element) || /[^\u0E2F-\u0E7F]+$/i.test(value)|| /^[a-z]+$/i.test(value);
    }
    
}, "Letters only please");

jQuery.validator.addMethod("mobilenumber", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.match('^[1-9][0-9]*$');
}, "Mobile number should not start with 0");

jQuery.validator.addMethod("atLeastTwoConsonants", function (value, element) {
    //console.log(value+" : "+ element);
    if($.jStorage.get("appLocale") == "en_US"){
        return this.optional(element) || /^[a-z]+$/i.test(value) || /(?=(.*[^\u0E30-\u0E7F]){2})/.test(value);
        //return this.optional(element) || /^[a-z]+$/i.test(value) || /[^\u0E2F-\u0E7F]+$/i.test(value);
    }else{
        return this.optional(element) || /(?=(.*[^\u0E30-\u0E7F]){2})/.test(value)|| /^[a-z]+$/i.test(value);
        //return this.optional(element) || /[^\u0E30-\u0E7F]{2}/.test(value)|| /^[a-z]+$/i.test(value);
        //return this.optional(element) || /[^\u0E2F-\u0E7F]+$/i.test(value)|| /^[a-z]+$/i.test(value);
    }
    
}, "Invalid Name. Please use atleast 2 consonants");

$.validator.addMethod("IClOfxEogHN", function (value, element) {
    return false;
},"error");


var vx = {};

vx.registerFormValidations = function() {
    $("#registration").validate({
        rules: {
            hcU0DS208wx:{
                required: true,
                lettersonly: true,
                minlength: 1
            },
            R7Ll1Hp8XgI: {
                required: true,
                lettersonly: true,
                minlength: 1
            },
            nQRMXpjxjGo: {
                required: true
            },
            NnnAD4jJqBl: {
                required: true
            },
            IClOfxEogHN: {
                required: true
            },
            DaNLHNTlMFK: {
                required: true
            },
            yjsuldl4RAA: {
                required: true,
                lettersonly: true,
                minlength: 1
            },
            kMJbCoe133i: {
                required: false,
                digits: true,
                minlength:10,
                maxlength: 11
            },
            k2x7u7ygYd5: {
                required: true
            },
            RjWEK8DxHiq: {
                required: true
            }
        },
        messages: {
            
            hcU0DS208wx:{
                required: function (){ return translations.translateKey("validationMsg.required")},
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")},
                minlength: function (){ return translations.translateKey("validationMsg.min1char")}
            },
            R7Ll1Hp8XgI:{
                required: function (){ return translations.translateKey("validationMsg.required")},
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")},
                minlength: function (){ return translations.translateKey("validationMsg.min1char")}
            },
            nQRMXpjxjGo:{
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            NnnAD4jJqBl:{
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            IClOfxEogHN:{
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            DaNLHNTlMFK:{
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            yjsuldl4RAA:{
                required: function (){ return translations.translateKey("validationMsg.required")},
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")},
                minlength: function (){ return translations.translateKey("validationMsg.min1char")}
            },
            kMJbCoe133i: {
                digits: function (){ return translations.translateKey("validationMsg.digits")},
                minlength: function (){ return translations.translateKey("validationMsg.min10")},
                maxlength: function (){ return translations.translateKey("validationMsg.max11")}
            },
            k2x7u7ygYd5: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            RjWEK8DxHiq: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            console.log(element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }

    });

};

vx.searchFormsValications = function() {
    
    $("#frmUicSearch").validate({
        rules: {
            uic: {
                required: true,
                minlength: 2
            }
        },
        messages: {
            uic: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                minlength: function (){ return translations.translateKey("validationMsg.min2")}
            }
        }
    });
    
    $("#frmSearch").validate({
        rules: {
            nickname:{
                required: false,
                lettersonly: true,
                minlength: 1
            },
            fathername:{
                required: false,
                lettersonly: true
            },
            mothername: {
                required: false,
                lettersonly: true
            }
        },
        messages: {
            nickname: {
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")}
            },
            fathername:{
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")}
            },
            mothername:{
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")}
            }
        }

    });
}

vx.htcServicesFormValidation = function(){
   
    // place this here for custome validation and some radio button related issue
    $("#SR_HTC").validate({

        rules: {
            aDzHAj64SsC: {
                required: true
            },
            JDb81Myh4LW:{
               required: true 
            },
            dnFxSkuWLUo:{
                required: true 
            },
            xbVZviYxWFI:{
                required: true
            },
            ZvKUwXb6tJn: {
               required: true 
            },
            ZdWY8efOQOB:{
                required: true 
            },
            fAkDnJQeN53: {
                required: true 
            }
        },

        messages: {
            aDzHAj64SsC: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            ZvKUwXb6tJn: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            fAkDnJQeN53: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row1'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}
vx.hivReferralFormValidation = function(){
   
    // place this here for custome validation and some radio button related issue
    $("#REF_HIV").validate({

        rules: {
            pFyMZEjVJPl: {
                required: true
            },
            HdFrLpdSs4Z:{
               required: true 
            },
            DTrfQCylagK:{
                required: true 
            },
            hHMXmJuoOUn:{
                required: true 
            }
        },

        messages: {
            pFyMZEjVJPl: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            HdFrLpdSs4Z: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            DTrfQCylagK: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            hHMXmJuoOUn: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}

vx.STIReferralFormValidation = function(){
   
    // place this here for custome validation and some radio button related issue
    $("#REF_STI").validate({

        rules: {
            JZd66Q9cThg: {
                required: true
            },
            rq5B4SfhaEl:{
               required: true 
            }
        },

        messages: {
            JZd66Q9cThg: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            rq5B4SfhaEl: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}

vx.STIServicesFormValidation = function(){
   
    $("#SR_STI").validate({

        rules: {
            NAJNypIfDZo: {
                required: true
            },
            SmbInVdc8th:{
               required: true 
            },
            XZouao8CYES:{
                required: true 
            }
        },

        messages: {
            JZd66Q9cThg: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            rq5B4SfhaEl: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            XZouao8CYES: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            //console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}
vx.ARTServicesFormValidation = function(){
   
    $("#SR_ART").validate({

        rules: {
            GbbOYGML3Xx: {
                required: true
            },
            TUfI4Ft8oWC:{
               required: true 
            }
        },

        messages: {
            GbbOYGML3Xx: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            TUfI4Ft8oWC: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            //console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}
vx.TBReferralFormValidation = function(){
   
    $("#REF_TB").validate({
        rules: {
            pQlw1ekDWQr: {
                required: true
            }
        },
        messages: {
            pQlw1ekDWQr: {
                required: function (){ return translations.translateKey("validationMsg.required")}
            }
        },
        errorPlacement: function(error, element) 
        {
            //console.log(error + element);
            if (element.is(":radio")) 
            {
                error.appendTo(element.parents('.row'));
            }
            else 
            { // This is the default behavior 
                error.insertAfter(element);
            }
         }
    });
}


vx.userProfileFormValidations = function() {
    $("#user-profile").validate({
        rules: {
            firstName: {
                required: true,
                minlength: 1,
                lettersonly: true
            },
            lastName: {
                required: true,
                minlength: 1,
                lettersonly: true
            },
            dob: {
                required: true,
                date: true
            },
            email:{
                require: false,
                email: true
            },
            gender:{
                required: false
            },
            phone: {
                required: false,
                digits: true,
                minlength:10,
                maxlength: 13
            }
        },
        messages: {
            firstName: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                minlength: function (){ return translations.translateKey("validationMsg.min1char")},
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")}
            },
            lastName: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                minlength: function (){ return translations.translateKey("validationMsg.min1char")},
                lettersonly: function (){ return translations.translateKey("validationMsg.lettersonly")}
            },
            dob: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                date: function (){ return translations.translateKey("validationMsg.date")}
            },
            email:{
                required: function (){ return translations.translateKey("validationMsg.required")},
                email: function (){ return translations.translateKey("validationMsg.email")}
            },
            gender:{
                required: function (){ return translations.translateKey("validationMsg.required")}
            },
            phone: {
                required: function (){ return translations.translateKey("validationMsg.required")},
                digits: function (){ return translations.translateKey("validationMsg.digits")},
                minlength: function (){ return translations.translateKey("validationMsg.min10")},
                maxlength: function (){ return translations.translateKey("validationMsg.max13")}
            }
        }

    });

};

