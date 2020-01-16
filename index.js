/*
 Add this to your component-config.json
  "loopback-component-validator":{}

 By default all validations are active

 You can disable them accordingly...

"loopback-component-validator":{
  "disableAll":true|false,
  "StringValidation":true|false,
  "NumberValidation":true|false
} 

*/

module.exports = function(loopbackApplication, options) {
  var validations = require("./validation");
  validations(loopbackApplication,options);
};
