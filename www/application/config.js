var config = {};
config.buildversion = "1.0.8"; 
//config.server = "http://10.115.62.169:8080/dhis/api/stc/";
//config.serverService = "http://10.115.62.169:8080/dhis/api/";

config.server = "http://data-scpr-mm-hiv.org/service/api/stc/";
config.serverService = "http://data-scpr-mm-hiv.org/service/api/";

//one signal
var onesignal = {};
onesignal.appID = "249e0294-3ea3-4ce3-bac3-5cb9dc67af54";
config.onesignal = onesignal;


config.googleProjectNumber = "900710540228";


//cloudinary 
var cloudinary = {};
cloudinary.cloudName = "ddcrtcm";
cloudinary.uploadPreset = "aepfqu2o";
cloudinary.endPoint = "https://api.cloudinary.com/v1_1/"+cloudinary.cloudName+"/image/upload";
config.cloudinary = cloudinary;

config.isApp = true;

