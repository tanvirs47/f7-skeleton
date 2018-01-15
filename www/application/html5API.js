Framework7.prototype.plugins.html5API = function (app, globalPluginParams) {
    'use strict';
    
    var html5API = function () {
        var self = this;
        
        this.getReverseGeoGoogleAPI = function(position, callback) {
            return {
                get : function() {
                    var lat = position.coords.latitude, lng = position.coords.longitude;
                    
                    var instance = {};
                    $.extend(true, instance, position)
                    
                    var defer = $.Deferred();
                    defer.promise( app.html5API );
                    
                    app.html5API.done(function(r) {
                        $('.notification-item').hide();
                        callback(r);
                        return r;
                    });
                    
                    var latlng = lat+","+lng;
                    apiservices.revergeoGoogleAPI(latlng, function(r) {
                        if (r.status == 'OK') {
                            var addresses = TAFFY(r.results[0].address_components);
                            instance.country = addresses({types:{like:"country"}}).select("long_name")[0];
                            instance.state = addresses({types:{like:"administrative_area_level_1"}}).select("long_name")[0];
                            instance.district = addresses({types:{like:"administrative_area_level_2"}}).select("long_name")[0];
                            instance.city = addresses({types:{like:"locality"}}).select("long_name")[0];            
                            instance.area = addresses({types:{like:"sublocality"}}).select("long_name")[0]; //TODO
                            instance.postal = addresses({types:{like:"postal_code"}}).select("long_name")[0];
                            instance.formatted_address = r.results[0].formatted_address;
                            defer.resolve( instance );
                        } else {
                            defer.resolve( instance );
                        }
                    }, function() {
                        defer.resolve( instance );
                    });
                    
                    
                    /*var latlng = new google.maps.LatLng(lat, lng);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                        if (status == 'OK') {
                            var addresses = TAFFY(results[0].address_components);
                            instance.country = addresses({types:{like:"country"}}).select("long_name")[0];
                            instance.state = addresses({types:{like:"administrative_area_level_1"}}).select("long_name")[0];
                            instance.district = addresses({types:{like:"administrative_area_level_2"}}).select("long_name")[0];
                            instance.city = addresses({types:{like:"locality"}}).select("long_name")[0];            
                            instance.area = addresses({types:{like:"sublocality"}}).select("long_name")[0]; //TODO
                            instance.postal = addresses({types:{like:"postal_code"}}).select("long_name")[0];
                            instance.formatted_address = results[0].formatted_address;
                            defer.resolve( instance );
                        } else {
                            defer.resolve( instance );
                        }
                    });*/
                }
            }
        };
        
        this.getReverseGeoCodingData = function(position, callback) {
            return {
                get : function() {
                    var lat = position.coords.latitude, lng = position.coords.longitude;
                    
                    var instance = {};
                    $.extend(true, instance, position)
                    
                    var defer = $.Deferred();
                    defer.promise( app.html5API );
                    
                    app.html5API.done(function(r) {
                        $('.notification-item').hide();
                        callback(r);
                        return r;
                    });
                    
                    var latlng = new google.maps.LatLng(lat, lng);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                        if (status == 'OK') {
                            var addresses = TAFFY(results[0].address_components);
                            instance.country = addresses({types:{like:"country"}}).select("long_name")[0];
                            instance.state = addresses({types:{like:"administrative_area_level_1"}}).select("long_name")[0];
                            instance.district = addresses({types:{like:"administrative_area_level_2"}}).select("long_name")[0];
                            instance.city = addresses({types:{like:"locality"}}).select("long_name")[0];            
                            instance.area = addresses({types:{like:"sublocality"}}).select("long_name")[0]; //TODO
                            instance.postal = addresses({types:{like:"postal_code"}}).select("long_name")[0];
                            instance.formatted_address = results[0].formatted_address;
                            defer.resolve( instance );
                        } else {
                            defer.resolve( instance );
                        }
                    });
                }
            }
        };
        
        this.errorHandler = function(err) {            
            if(err.code == 1) {
               alert(translations.translateKeyIfExist('lbl.permissionsDenied',"Error: Access is denied!"));
            }else if( err.code == 2) {
               alert(translations.translateKeyIfExist('lbl.positionUnavailable',"Error: Position is unavailable!"));
            }
         };
        
        this.watchPosition = function(successCallback, failureCallback) {
            if(!app.params.html5API.gps) {
                failureCallback({                    
                    code: 0,
                    message: translations.translateKeyIfExist('lbl.deprecatedVersion',"Not configured by application")
                });
                return false;
            }
            
            if(!navigator.onLine) {
                failureCallback({                    
                    code: 1,
                    message: "You are OFFLINE"
                });
                return false;
            }
            
            if(navigator.geolocation) {
                if(!failureCallback) {
                    failureCallback = app.gps.error;
                }                
                this.watchID = navigator.geolocation.watchPosition(successCallback, failureCallback, $.extend(true, app.params.gps, {}));
            }  else {
                console.error("GPS not supported");
                failureCallback({                    
                    code: 2,
                    message: translations.translateKeyIfExist('lbl.gpsSettings',"GPS not supported")
                });
                return false;
            }            
        };
        
        this.launchNavigator = function(params) {
            if(params) {
                if(params.source && params.destination) {
                    if(application.launchnavigator) {
                        launchnavigator.navigate(
                            [params.source.lat, params.source.lng],
                            [params.destination.lat, params.destination.lng],
                            function() {
                                //alert("Plugin success");
                            }, 
                            function(error) {
                                alert(translations.translateKeyIfExist('lbl.pluginError',"Plugin error: ")+ error);
                            }, 
                            {
                                preferGoogleMaps: true,
                                enableDebug: true
                            });
                    } else {                            
                        var url = "http://maps.google.com/?saddr="+params.source.lat+","+params.source.lng+"&daddr="+params.destination.lat+","+params.destination.lng;
                        window.open(url, "_system");
                    }
                }
            }
        };
        
        this.getGEOLocation = function(successCallback, failureCallback) {
            if(!app.params.html5API.gps) {
                failureCallback({                    
                    code: 0,
                    message: translations.translateKeyIfExist('lbl.deprecatedVersion',"Not configured by application!")
                });
                return false;
            }
            
            if(navigator.geolocation) {
                if(!failureCallback) {
                    failureCallback = app.gps.error;
                }
                
                application.cordovaAPI.toast({
                    text : translations.translateKeyIfExist('lbl.locating',"Locating .. ")
                });
                
                /*alert(JSON.stringify(uc.deviceState));*/
                
                /*alert(JSON.stringify(app.cordovaAPI));*/
                /*alert(JSON.stringify(globalPluginParams));*/
                
                if(app.cordovaAPI.isAPP) {                    
                    //Check the Network Information state, Disgnostic (gps|wifi), curent location
                    if(!uc.deviceState.gps && !uc.deviceState.online) {
                        app.alert(translations.translateKeyIfExist('lbl.internetConnection',"Please turn on location Services & check for internet connections !!"), function() {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        });                        
                    } else if(uc.deviceState.gps && !uc.deviceState.online) {
                        uc.locationOptions.enableHighAccuracy = true; // Only Hardware
                        uc.locationOptions.timeout = 60000; // 1m
                    } else if(uc.deviceState.online) {
                        uc.locationOptions.enableHighAccuracy = false; // Only wifi - no hardware
                        uc.locationOptions.timeout = 30000; // 30s
                    }
                    /*alert(JSON.stringify(uc.locationOptions));*/

                    if(uc.deviceState.gps || uc.deviceState.online) {
                        navigator.geolocation.getCurrentPosition(function(r) {
                            $('.notification-item').hide();
                            successCallback(r);
                        }, failureCallback, uc.locationOptions);
                    }
                    
                } else { // For NON-APP                    
                    if(!navigator.onLine) {
                        $('.notification-item').hide();
                        failureCallback({                    
                            code: 1,
                            message: translations.translateKeyIfExist('lbl.internetConnection',"Please check your internet connection!")
                        });
                        return false;
                    }
                    
                    uc.locationOptions.enableHighAccuracy = false;
                    uc.locationOptions.timeout = 10000;
                    
                    navigator.geolocation.getCurrentPosition(function(r) {
                        $('.notification-item').hide();
                        successCallback(r);
                    }, failureCallback, uc.locationOptions);
                }
                
            }  else {
                console.error("GPS not supported");
                failureCallback({                    
                    code: 2,
                    message: translations.translateKeyIfExist('lbl.gpsSettings',"GPS not supported")
                });
                return false;
            }
        };
        
        this.getGEOLocationDetails = function(successCallback, failureCallback) {
            app.html5API.getCurrentLocation(function(position) {                
                app.html5API.getReverseGEO(position, successCallback).get();                
            }, failureCallback);
        };
        
        this.getGooglePositionDetails = function(successCallback, failureCallback) {
            app.html5API.getCurrentLocation(function(position) {                
                app.html5API.getReverseGeoGoogleAPI(position, successCallback).get();                
            }, failureCallback);
        };
        
        return {
            getCurrentLocation : this.getGEOLocation,
            watchPosition : this.watchPosition,
            getCurrentLocationDetails : this.getGEOLocationDetails,
            getReverseGEO : this.getReverseGeoCodingData,
            getReverseGeoGoogleAPI : this.getReverseGeoGoogleAPI,
            getGooglePositionDetails : this.getGooglePositionDetails,
            launchNavigator : this.launchNavigator,
            error: this.errorHandler
        }
        
        return this;        
    };
        
    app.html5API = (function () {
        return new html5API();
    })();
    
    return this;
};
