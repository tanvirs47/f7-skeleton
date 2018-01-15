var nmmaplocator = {};
nmmaplocator.map = null;

nmmaplocator.initMAP = function(mapContainer, lat, lng) {
	//console.log(lat + " " + lng);
    nmmaplocator.map = new L.Map(mapContainer, {
		center : new L.LatLng(7,21.09),
		zoom : 15,
		zoomControl : false
	});
	
	var SATELLITE = new L.Google('SATELLITE');
	var ROADMAP = new L.Google('ROADMAP');
	var TERRAIN = new L.Google('TERRAIN');
	var HYBRID = new L.Google('HYBRID');
	
	nmmaplocator.map.addLayer(ROADMAP);
	
	var zoomControl = L.control.zoom({
		position: 'bottomright'
	});
	nmmaplocator.map.addControl(zoomControl);
	
	var baseMaps = {
		"SATELLITE": SATELLITE,
		"ROADMAP": ROADMAP,
		"TERRAIN": TERRAIN,
		"HYBRID" : HYBRID
	};
	L.control.layers(baseMaps, {}).addTo(nmmaplocator.map);	
	
	//nmmaplocator.getGEOLocationForAddBusiness();
	
	$('._lat').html(lat);
    $('._lng').html(lng);
    nmmaplocator.reverseGEO(lat+","+lng);
    
    nmmaplocator.marker = L.marker([lat, lng], {
        draggable: true
    }).addTo(nmmaplocator.map);
	
	nmmaplocator.marker.bindPopup(translations.translateKey('addnearme.yourLocation')).openPopup();
	
    nmmaplocator.map.panTo([lat, lng]);
	
	nmmaplocator.marker.on("dragend", function (ev) {
        //console.log(ev.target._latlng.lat + " " + ev.target._latlng.lng);
        var chagedPos = ev.target.getLatLng().toString();
        //console.log(chagedPos);
        ux.areaLat = ev.target._latlng.lat;
        ux.areaLng = ev.target._latlng.lng;
        $('._lat').html(ev.target._latlng.lat);
        $('._lng').html(ev.target._latlng.lng);
        nmmaplocator.reverseGEO(ev.target._latlng.lat+","+ev.target._latlng.lng);
    });
	
};



nmmaplocator.reverseGEO = function(geolocation) {
	$.ajax({
		url: 'http://maps.googleapis.com/maps/api/geocode/json',
		data: 'latlng=' + geolocation, // + '&sensor=false',
		dataType: 'json',
		cache: false,
		success: function(response) { 
			//console.log(JSON.stringify(response));
			if(response.status == 'OK') {
				var db = TAFFY(response.results[0]);
				var formattedAddress = db({}).get()[0].formatted_address;
				
				var addresses = TAFFY(response.results[0].address_components); 
                ux.area = addresses({types:{like:"sublocality_level_2"}}).select("long_name")[0];
				var country = addresses({types:{like:"country"}}).select("long_name")[0];
	            var state = addresses({types:{like:"administrative_area_level_1"}}).select("long_name")[0];
	            //console.log(ux.area);
	            $('._formattedAddress').html(formattedAddress);
	            //$('#address1').val(formattedAddress);
                
	            //$.jStorage.set('formattedAddress', formattedAddress);
	            //$.jStorage.set('currentCountry', country);
	            //$.jStorage.set('currentState', state);
			}
		}
	});
};

$(".nearme-add").click(function(e) {
	nmmaplocator.save();
	e.preventDefault();
});

nmmaplocator.save = function() {
	
	if(!$("#name").val()) {
		swal({
			title: "Insifficient Details?",
			  text: "Please recheck on the details required for placing the business!",
			type: "error",
		  showCancelButton: true,
		  confirmButtonClass: "btn-danger",
		  confirmButtonText: "Re-enter the details",
		  
		  },function(isConfirm) {
			  if (isConfirm) {
				   window.location.reload();
				  }else{
					} 
		});
		return false;
	}
	
	var nearmeBO = {};
	var nearme = {};
	nearme.code = $("#name").val().replace(/[^a-z\d\s]+/gi, "");
	nearme.name = $("#name").val();
	nearme.summary = $("#summary").val();
	nearme.type = $("#type").val();
        nearme.tags = $("#type").val();
	//alert(nearme.type);
	nearme.communitylist=$("#list").val();
	//alert(nearme.communitylist);
	nearme.country = $.jStorage.get('currentCountry'); //$("#country").val();
	nearme.state = $.jStorage.get('currentState'); //$("#state").val();
	
	var x = document.getElementById("type").selectedIndex;
	var y = document.getElementById("type").options;
	nearme.fontFamily = $(y[x]).attr("data-font-family");
	nearme.fontType = $(y[x]).attr("data-font-type");
	nearme.scope = 'PUBLIC';
	nearme.active = true;
	nearme.rate = 0.00;
	
	nearme.latitude = $('._lat').html();
	nearme.longitude = $('._lng').html();
	
	
	nearmeBO.nearme = nearme;
	
	var  nearmeExtesionBOs = [];
	$('.nm_extensions').each(function(index, item) {
		var nearmeExtesionBO = {};
		var nearmeExtension={};
		nearmeExtension.active = true;
		nearmeExtension.text = $(item).val();
		
		nearmeExtension.fontFamily = $(item).attr("data-font-family");
		nearmeExtension.fontType = $(item).attr("data-font-type");
		nearmeExtension.extkey = $(item).attr("data-key");
		nearmeExtension.module = 'POPUP';
		
		nearmeExtesionBO.nearmeExtension = nearmeExtension;
		nearmeExtesionBO.theKey = $(item).attr("data-key");
		
		nearmeExtesionBOs.push(nearmeExtesionBO);		
	});
	
	nearmeBO.nearmeExtesionBOs = nearmeExtesionBOs;
	
	
	apiservices.addNearMe(nearmeBO, 'nmmaplocator.addNearMeResponse');	
};

nmmaplocator.addNearMeResponse = function(nearmeBO) {
	
	//sweet Alert
	swal({
		title: "Congratulations",
		  text: "Your image has been published !!",
		type: "success",
	  confirmButtonClass: "btn-success",
	  confirmButtonText: "OK",
	  
	  },function(isConfirm) {
		  if (isConfirm) {
			  window.location.reload();
			  }else{
				  
				 // alert('cancelled');
			  }
	  
	});
	return false;
};