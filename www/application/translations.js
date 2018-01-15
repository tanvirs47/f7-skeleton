var translations = {};
translations.i18next;

translations.loadTranslations = function(locale) {
    if(locale) {
        $.jStorage.set('appLocale', locale);
        
        i18n.init({
            resGetPath: 'locales/__lng__/__ns__.json',
            sendType: 'GET',
            sendMissingTo: 'fallback',
            lng:locale,
            ns: {
                namespaces: ['translation'],
                defaultNs: 'translation'
            },
            debug: true,
            fallbackOnEmpty: true,
            fallbackLng:'en',
            //useLocalStorage: true,
            dynamicLoad:false,
            escapeInterpolation: true
        }, function(t) {
            translations.i18next = t;
            //console.log(t("app.name"));
            
            $("[data-i18n]").i18n();
            moment.locale(locale);
            
            application.params.modalButtonOk = translations.translateKey("app.modalButtonOk");
            application.params.modalButtonCancel = translations.translateKey("app.modalButtonCancel");
            application.params.modalTitle = translations.translateKey("app.modalTitle");
            
            application.params.smartSelectPopupCloseText = translations.translateKey("app.smartSelectPopupCloseText");
            application.params.smartSelectBackText = translations.translateKey("app.smartSelectBackText");
            application.params.modalPreloaderTitle = translations.translateKey("app.modalPreloaderTitle");
            application.params.notificationCloseButtonText = translations.translateKey("app.notificationCloseButtonText");
            
            if($("[icon-key]")) {
                $("[icon-key]").each(function(index, obj)  {
                    if(obj) {
                        if(translations.i18next($(obj).attr("icon-key"))) {
                            $(obj).removeClass();
                            $(obj).addClass(translations.i18next($(obj).attr("icon-key")));
                        }                        
                    }
                });
            }
            
        });
        
        
    }
}


translations.translateKey = function(key) {
    if(translations.i18next) {
        return translations.i18next(key);
    }
    return '';
};

translations.translateKeyIfExist = function(key, _default) {
    if(translations.i18next) {
        //console.log(translations.i18next(key) == key);
        if(translations.i18next(key) != key) {
            return translations.i18next(key);
        } else {
            return _default;
        }
    }
    return _default;
};

translations.translateKeyParams = function(key, instance) {
    if(translations.i18next) {
        if(translations.i18next(key) != key) {
            return translations.i18next(key, instance);
        }
    }
    return _default;
};