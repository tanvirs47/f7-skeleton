var nmMAP = {};
nmMAP.map = null;
//nmMAP.markers = new PruneClusterForLeaflet();
nmMAP.markers = new L.FeatureGroup();
nmMAP.markerIDMAP = {};
nmMAP.popups = [];
nmMAP.casepopup = [];
var markerContainer = [];
var markerGroup = null;

nmMAP.init = function() {    
    nmMAP.map = new L.Map('nmmap', {
		center : new L.LatLng(0, 0),
		zoom : 10,
		maxBounds : [[90, -180], [-90, 180]],
		zoomControl : false
	});
    
    var zoomControl = L.control.zoom({
		position: 'bottomright'
	});
	nmMAP.map.addControl(zoomControl);        
    var ggl = new L.Google();
    nmMAP.map.addLayer(ggl);

    google.maps.event.addListenerOnce(nmMAP.map, 'idle', function() {
        google.maps.event.trigger(nmMAP.map, 'resize');
    });
}



nmMAP.resetMAP = function() {
    nmMAP.markers.clearLayers();
    nmMAP.map.removeLayer(nmMAP.markers);
    nmMAP.markers = new L.FeatureGroup();
    
    //reset cluster markers array
    markerContainer = [];
}

nmMAP.markerView = function(r) {
    
    //alert(JSON.stringify(r.data));
    nmMAP.resetMAP();
    /*//console.log(application.nmPosition);
    var marker = L.marker([application.nmPosition.coords.latitude, application.nmPosition.coords.longitude], {});
    nmMAP.markers.addLayer(marker); 
    marker.bindPopup(translations.translateKeyIfExist('nearme.yourLocation',"You are here!"), {
        showOnMouseOver: true
    });
   
    //Marker cluster
    markerContainer.push(marker);*/
    
    var marker = L.marker([application.nmPosition.coords.latitude, application.nmPosition.coords.longitude], {}).addTo(nmMAP.map);
    nmMAP.markers.addLayer(marker);
    marker.bindPopup(translations.translateKeyIfExist('nearme.yourLocation',"You are here!"), {
        showOnMouseOver: true
    });
    nmMAP.markers.openPopup(marker); 
    //Marker cluster
    markerContainer.push(marker);
    
    if(r.data.length > 0) {
           
        var latLngList = [];
        $(r.data).each(function(i, e) {
            //alert(JSON.stringify(e));
            latLngList.push(new L.latLng(e.latitude,e.longitude));
            nmMAP.buildMarker(e);
        });
        
        markerGroup = L.markerClusterGroup(); // make markerClusterGroup object
        markerGroup.addLayers(markerContainer); // add marker container markerGroup
        nmMAP.map.addLayer(markerGroup);
        //console.log(latLngList);
        
        nmMAP.map.on('popupopen', function(e) {
            var px = nmMAP.map.project(e.popup._latlng);
            px.y -= e.popup._container.clientHeight / 2;
            nmMAP.map.panTo(nmMAP.map.unproject(px), {
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
        //nmMAP.map.addLayer(nmMAP.markers);
        nmMAP.map.fitBounds(new L.latLngBounds(latLngList));
    }
   
    application.hidePreloader();
    //marker.bindPopup("Please position this marker where you would like to locate!").openPopup();
}


nmMAP.buildMarker = function(e) {
    //console.log(e);
    var marker = L.marker([e.latitude, e.longitude], {
        icon : L.AwesomeMarkers.icon(nmMAP.markerType(e.facilityType))
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
    marker.bindPopup(html, {
        showOnMouseOver: true
    });
    nmMAP.markers.addLayer(marker);    
}

nmMAP.markerType = function(facilityType) {
    //console.log(JSON.stringify(facilityType));
    var fontMarker = {};
    fontMarker.icon = facilityType.icon;
    fontMarker.prefix = "fa";
    fontMarker.markerColor = facilityType.color;
    return fontMarker;
}

