var db = new PouchDB('STC');
/*db.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
	console.log(result);
    console.log(result.total_rows);
	$(result.rows).each(function(i, e) {
		console.log(e);
	});	
}).catch(function (err) {
	console.log(err);
});*/


var appDB = {};

appDB.saveEntity = function(instance, callback) {
    //console.log(instance);
    /*if(uc.editClientId != ""){
        db.get(uc.editClientId).then(function(doc) {
            return db.put({
                _id: uc.editClientId,
                _rev: doc._rev,
                data: instance
            });
        }).then(function(response) {
            // handle response
            callback(response);
        }).catch(function (err) {
          console.log(err);
        });
        
    }else{*/
        db.post({data: instance}).then(function (response) {
            //console.log(response);
            callback(response);
        }).catch(function (err) {
             //console.log(err);
            callback(err);
        });
    //}
}

appDB.getSingleEntity = function(_id, callback){
    db.get(_id).then(function(doc) {  
        console.log(doc);
        callback(doc);
    }).catch(function (err) {
      console.log(err);
    });
};
appDB.clean = function() {
    db.allDocs({
        include_docs: true,
      attachments: true
    }).then(function (result) {
        console.log(result);
        $(result.rows).each(function(i, e) {
            console.log(e.doc);
            db.get(e.id).then(function(doc) {
              return db.remove(doc._id, doc._rev);
            }).then(function (result) {
              console.log(result);
            }).catch(function (err) {
              console.log(err);
            });
            //localDB.remove(e.doc.id, e.doc.rev);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

//5F8FCF5D-C248-D36D-BC25-4D505FA26254
appDB.deleteEntity = function(_id) {
    db.get(_id).then(function(doc) {        
        console.log(doc);
        db.remove(doc).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
      console.log(err);
    });    
}

appDB.getLocalPatientCount = function(successCallback){
    db.allDocs({
        include_docs: true,
        attachments: true,
        descending: true
    }).then(function (result) {
        //console.log(result);
        //console.log(result.total_rows);
         //$(".patientCount").html(result.total_rows);
        successCallback(result);
        
    }).catch(function (err) {
        console.log(err);
        application.alert(err);
    });
}

