var Promise = require('bluebird');
var rp = require('request-promise');
var program = require('commander');
const uuid = require('uuid/v1');
const replace = require('replace-in-file');
var fs = require('fs');

/*
1) Enable auto_ts (master api key)
2) Preparing the Admin User (post account/create)
3) Create the Admin Profile (post user/text)
4) Reference the Admin Profile (post user/account)
5) Create the Admin ACL (post user/access)
6) Develop and Upload the Administrative Snippet (post admin)
*/

/*
app_id: //
api_key: //
*/


/*
node initCareKit.js -k 8cbe1d7c83ac4efa8df21c8f35c99a81 -a 7f3e17595e7f8f43166a523f997421e4 -e "jraymond+test5@cloudmineinc.com" -n "Josh Raymond" -p "password" -l "./Example.js" -s "insertCKObject"
*/


program
  .version('0.0.1')
  .option('-k, --master-api-key <key>', 'CloudMine Master API Key')
  .option('-a, --app-id <app-id>', 'CloudMine App Id')
  .option('-e, --admin-email <admin-email>', 'CloudMine Admin Email')
  .option('-n, --admin-name <admin-name>', 'CloudMine Admin Name')
  .option('-p, --password <password>', 'CloudMine Admin Password')
  .option('-l, --snippet-example-path <path>', 'Snippet to be uploaded for ACL management')
  .option('-s, --snippet-name <name>', 'Snippet Name')
  .parse(process.argv);

var masterApiKey = program.masterApiKey;
var appId = program.appId;
var adminEmail = program.adminEmail;
var adminName = program.adminName;
var adminPassword = program.password;
var baseUrl = "https://api.cloudmine.io";
var sessionToken = null;
var adminId = null;
var adminProfileId = null;
var adminAclUUID = null;
var snippetName = program.snippetName;
var snippetExamplePath = program.snippetExamplePath;

function enableAutoTs(){
  var finishedUrl = baseUrl + '/admin/app/' + appId + '/prefs';
  var options = {
    uri: finishedUrl,
    method: "post",
    body: {
      auto_ts: true
    },
    json: true
  };
  return getPromisifiedRequest(options);
}

function createAdminUser(){
  var body = {
  "credentials": {
      "email": adminEmail,
      "username": adminEmail,
      "password": adminPassword
  },
  "profile": {
      "name": adminName,
  }
};
    var finishedUrl = baseUrl + '/v1/app/' + appId + '/account/create';
    var options = {
      uri: finishedUrl,
      method: "post",
      body: body,
      json: true
    };
    return getPromisifiedRequest(options);
}

function createProfile(data){
  adminId = data.__id__;
  var finishedUrl = baseUrl + '/v1/app/' + appId + '/user/text?userid=' + adminId;
  adminProfileId = uuid();
  var body = {};
  body[adminProfileId] =  {
      "__id__": adminProfileId,
      "cmh_owner": adminId,
      "__access__": [
        null
      ],
      "gender": null,
      "isAdmin": true,
      "dateOfBirth": null,
      "__class__": "CMHInternalProfile",
      "email": adminEmail,
      "familyName": null,
      "givenName": null,
      "userInfo": {
        "__class__": "map"
      }
    };
  var options = {
    uri: finishedUrl,
    method: "post",
    body: body,
    json: true
  };

  return getPromisifiedRequest(options);
}

function updateAdminWithProfileId(data){
  var finishedUrl = baseUrl + '/v1/app/' + appId + '/account?userid=' + adminId;
  var body = {
  "profileId": adminProfileId
};
var options = {
  uri: finishedUrl,
  method: "post",
  body: body,
  json: true
};

return getPromisifiedRequest(options);
}

function createAdminAcl(){
  var finishedUrl = baseUrl + '/v1/app/' + appId + '/user/access?userid=' + adminId;
  var body = {
    "members": [adminId],
    "permissions": ["r", "c", "u", "d"],
    "my_extra_info": "for CK admins"
};
var options = {
  uri: finishedUrl,
  method: "post",
  body: body,
  json: true
}

return getPromisifiedRequest(options);
}

function processACL(data){
  //console.log(data);
  var ACLguid = Object.keys(data)[0];
  adminAclUUID = ACLguid;
}

function prepareSnippet(data){
  processACL(data);
  var apiKeyString = 'var MasterApiKey = \'Master-API-Key-Goes-Here\';';
  var apiReplacement = 'var MasterApiKey = \'' + masterApiKey + '\';';

  var aclIdString = 'var SharedAclId = \'Admin-ACL-Id-Goes-Here\';';
  var aclReplacement = 'var SharedAclId = \'' + adminAclUUID + '\';';

  var appIdString = 'var AppId = \'App-Id-Goes-Here\';';
  var appReplacement = 'var AppId = \'' + appId + '\';';

  var optionsApi = {from: apiKeyString, to: apiReplacement, files: snippetExamplePath};
  var optionsAcl = {from: aclIdString, to: aclReplacement, files: snippetExamplePath};
  var optionsApp = {from: appIdString, to: appReplacement, files: snippetExamplePath};

  return new Promise.all([replace.sync(optionsApi), replace.sync(optionsAcl), replace.sync(optionsApp)]);
}

function uploadSnippet(){
  var snippetCode = fs.readFileSync(snippetExamplePath, 'utf8');
  var finishedUrl = baseUrl + '/admin/app/' + appId + '/code';
  var options = {
    uri: finishedUrl,
    method: "post",
    formData: {
      name: snippetName,
      id: '',
      code: snippetCode
    }
  };

  return getPromisifiedRequest(options);
  //do upload here
}

function getPromisifiedRequest(options){
  options.headers = {"X-CloudMine-ApiKey": masterApiKey};
  return rp(options)
    .then(function (data) {
        return data;
    })
    .catch(function (err) {
        return err;
    });
}

enableAutoTs()
  .then(createAdminUser)
  .then(createProfile)
  .then(updateAdminWithProfileId)
  .then(createAdminAcl)
  .then(prepareSnippet)
  .then(uploadSnippet)
  .then(function(value){
    console.log("Finished snippet creation.");
  })
  .catch(function(err){
    console.log(err);
  });

/*get1stData()
  .then(get2ndData)
  .then(get3rdData)
  .then(function(value2){
    console.log("final data: " + JSON.stringify(value2));
  })
  .catch(function(err){
    console.log(err);
  });
*/
