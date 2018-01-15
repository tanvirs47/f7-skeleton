var applicationMAP = {};
applicationMAP.map = null;
//applicationMAP.markers = new PruneClusterForLeaflet();
applicationMAP.markers = new L.FeatureGroup();
applicationMAP.markerIDMAP = {};
applicationMAP.popups = [];
applicationMAP.casepopup = [];


applicationMAP.init = function() {    
    applicationMAP.map = new L.Map('imap', {
		center : new L.LatLng(0, 0),
		zoom : 2,
		maxBounds : [[90, -180], [-90, 180]],
		zoomControl : false
	});
    
    var zoomControl = L.control.zoom({
		position: 'bottomright'
	});
	applicationMAP.map.addControl(zoomControl);        
    
    if(navigator.onLine) {
		var ggl = new L.Google();
		applicationMAP.map.addLayer(ggl);

		google.maps.event.addListenerOnce(applicationMAP.map, 'idle', function() {
			google.maps.event.trigger(applicationMAP.map, 'resize');
		});
	}
}

function getRandomLatLng(map) {
    var bounds = map.getBounds(),
        southWest = bounds.getSouthWest(),
        northEast = bounds.getNorthEast(),
        lngSpan = northEast.lng - southWest.lng,
        latSpan = northEast.lat - southWest.lat;

    return new L.LatLng(
    southWest.lat + latSpan * Math.random(),
    southWest.lng + lngSpan * Math.random());
}

function populate(position) {
    for (var i = 0; i < 15; i++) {
        var theLatLng = getRandomLatLng(applicationMAP.map);
        var marker = L.marker(theLatLng);
        var fromLL = new L.LatLng(position.coords.latitude, position.coords.longitude);
        var toLL = new L.LatLng(theLatLng.lat, theLatLng.lng);
        
        var context = {};
        context.name = "NAME#"+i;
        context.summary = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</p><p>Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque.";
        context.latitude = theLatLng.lat;
        context.longitude = theLatLng.lng;
        context.distance = fromLL.distanceTo(toLL).toFixed(0)/1000 + ' KMs';
        
        var html = application.mapPopupTemplate(context);;        
        marker.bindPopup(html, {
            showOnMouseOver: true
        });
        applicationMAP.markers.addLayer(marker);
    }
    
    applicationMAP.map.on('popupopen', function(e) {
		var px = applicationMAP.map.project(e.popup._latlng);
		px.y -= e.popup._container.clientHeight / 2;
		applicationMAP.map.panTo(applicationMAP.map.unproject(px), {
			animate : true
		});
	});
    
    return false;
}


applicationMAP.mapView = function(position) {
    console.log(position);
    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
    applicationMAP.map.setZoomAround(latlng, 10, {
        animate : true
    });
    
    applicationMAP.markers.clearLayers();
    applicationMAP.map.removeLayer(applicationMAP.markers);
    applicationMAP.markers = new L.FeatureGroup();
    populate(position);
    applicationMAP.map.addLayer(applicationMAP.markers);
}

applicationMAP.resetMAP = function() {
    applicationMAP.markers.clearLayers();
    applicationMAP.map.removeLayer(applicationMAP.markers);
    applicationMAP.markers = new L.FeatureGroup();
    
    //reset cluster markers array
    markerContainer = [];
}

applicationMAP.markerView = function(r) {
    applicationMAP.resetMAP();
    var marker = L.marker([application.nmPosition.coords.latitude, application.nmPosition.coords.longitude], {}).addTo(applicationMAP.map);
    applicationMAP.markers.addLayer(marker);
    marker.bindPopup(translations.translateKeyIfExist('nearme.yourLocation',"You are here!"), {
        showOnMouseOver: true
    });
    applicationMAP.markers.openPopup(marker); 
    //Marker cluster
    markerContainer.push(marker);
    
    if(r.data.length > 0) {
           
        var nmDB = TAFFY(r.data);
        $.get('templates/nm-facilitiesList.html', function (data) {
            var compiled = Template7.compile(data);
            $(".facilitiesList ul").append(compiled(r.data)); 
           
            $('.trigger-nm').on('click', function(){
                console.log($(this));
                var selectedFacID = $(this).data('id');
                var facObj = nmDB({facilityId:selectedFacID}).first();
                console.log(facObj);
                $.get('templates/facility-details.html', function (data) {
                    var compiled = Template7.compile(data);
                    application.popup('<div class="popup popup-facility-details tablet-fullscreen">' + compiled(facObj) + '</div>');
                    
                    $$('.trigger-set-facility').off('click');
                    $$('.trigger-set-facility').on('click', function () {
                        ux.selectedFacility = {
                            name:facObj.name,
                            id:facObj.facilityId
                        }
                        application.closeModal('.popup-facility-details');
                        mainView.router.back()
                    });
                    
                    $$(".trigger-close-popup").off('click');
                    $$(".trigger-close-popup").on('click',function(){
                        application.closeModal('.popup-facility-details');
                        
                    })
                });
            })
        });
        
        var latLngList = [];
        $(r.data).each(function(i, e) {
            //alert(JSON.stringify(e));
            latLngList.push(new L.latLng(e.latitude,e.longitude));
            applicationMAP.buildMarker(e);
        });
        
        markerGroup = L.markerClusterGroup(); // make markerClusterGroup object
        markerGroup.addLayers(markerContainer); // add marker container markerGroup
        applicationMAP.map.addLayer(markerGroup);
        //console.log(latLngList);
        
        applicationMAP.map.on('popupopen', function(e) {
            var px = applicationMAP.map.project(e.popup._latlng);
            px.y -= e.popup._container.clientHeight / 2;
            applicationMAP.map.panTo(applicationMAP.map.unproject(px), {
                animate : true
            });

            /*$('.trigger-navigator').off('click');
            $('.trigger-navigator').on('click', function() {
                application.html5API.launchNavigator({                
                    source : {
                        lat : position.coords.latitude,
                        lng : position.coords.longitude
                    },
                    destination : {
                        lat : $(this).attr('data-latitude'),
                        lng : $(this).attr('data-longitude')
                    }
                });
            });*/
        });        
        //applicationMAP.map.addLayer(applicationMAP.markers);
        applicationMAP.map.fitBounds(new L.latLngBounds(latLngList), {padding: [50, 50]});
    }
   
    application.hidePreloader();
    //marker.bindPopup("Please position this marker where you would like to locate!").openPopup();
}


applicationMAP.buildMarker = function(e) {
    //console.log(e);
    var marker = L.marker([e.latitude, e.longitude], {
        icon : L.AwesomeMarkers.icon(applicationMAP.markerType(e.facilityType))
    });
    
    //push marker in marker cluster
    markerContainer.push(marker);
    
    var fromLL = new L.LatLng(application.nmPosition.coords.latitude, application.nmPosition.coords.longitude);
    var toLL = new L.LatLng(e.latitude, e.longitude);
    
    var context = {};
    context.name = e.name;
    context.type = "<strong>"+e.facilityType.name+"</strong>";
    context.summary = e.address1 + " " + e.address2 + " " + e.city;
    context.latitude = e.latitude;
    context.longitude = e.longitude;
    context.distance = e.distance + ' KMs';
	context.details = e.details;
	context.facilityId = e.facilityId;
	//context.images = null;
    //console.log(e);
	/*$.each(e.details,function(key,object)
	{
		//console.log(key);	
		if(object.hasOwnProperty("image"))
		{
			//console.log("inside");	
			if(!context.images)
			{
				context.images = [];
			}
			context.images.push({"url":object['image']});
		}
	});*/
    
	//console.log(context);
	
    var html = application.mapPopupTemplate(context);;        
    /*marker.bindPopup(html, {
        showOnMouseOver: true
    });*/
    
    marker.on('click', function() {
        var selectedFacID = e.facilityId;
        var facObj = e;
        console.log(facObj);
        $.get('templates/facility-details.html', function (data) {
            var compiled = Template7.compile(data);
            application.popup('<div class="popup popup-facility-details tablet-fullscreen">' + compiled(facObj) + '</div>');

            $$('.trigger-set-facility').off('click');
            $$('.trigger-set-facility').on('click', function () {
                ux.selectedFacility = {
                    name:facObj.name,
                    id:facObj.facilityId
                }
                application.closeModal('.popup-facility-details');
                mainView.router.back()
            });

            $$(".trigger-close-popup").off('click');
            $$(".trigger-close-popup").on('click',function(){
                application.closeModal('.popup-facility-details');

            })
        });
    });
    applicationMAP.markers.addLayer(marker);    
}

applicationMAP.markerType = function(facilityType) {
    console.log(JSON.stringify(facilityType));
    var fontMarker = {};
    fontMarker.icon = facilityType.icon ? facilityType.icon : "plus" ;
    fontMarker.prefix = "fa";
    fontMarker.markerColor = facilityType.color;
    return fontMarker;
}



/*applicationMAP.resetMAP = function() {
	applicationMAP.markers.clearLayers();
	applicationMAP.map.removeLayer(applicationMAP.markers);
	applicationMAP.markers = new L.FeatureGroup();
}


applicationMAP.markerView = function(r) {
	//console.log(r);
	applicationMAP.resetMAP();

	var latLngListRepository = [];
	console.log(r.data);
	
	$(r.data).each(function(i, e) {
		var eLL = new L.LatLng(e.latitude,e.longitude);
		latLngListRepository.push(new L.latLng(e.latitude,e.longitude));

		//var icon = "<i class='" + e.nearme.fontFamily + "-" + e.nearme.fontType + "'></i>";
		var fontMarker = {};
        fontMarker.icon = "plus";
        fontMarker.prefix = "fa";
		fontMarker.markerColor = 'red';
        
		var marker = L.marker(eLL, {
			icon: L.AwesomeMarkers.icon(fontMarker),
			id: e.facilityId
		});


		marker.on('click', function() {
			$.get('templates/nearme.html', function(data) {
				var compiled = Template7.compile(data);
				application.popup(compiled(db.getNearmeObject(r.nearmeList, e.nearme.id)));

				$('.popup-nearme').on('opened', function () {
					
				});
			});

		});
        console.log(marker);
		applicationMAP.markers.addLayer(marker);
	});

	applicationMAP.map.addLayer(applicationMAP.markers);
	applicationMAP.map.fitBounds(new L.latLngBounds(latLngListRepository), {padding: [10, 10]});
};*/
