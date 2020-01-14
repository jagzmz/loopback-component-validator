loadValidations = loopbackApplication => {
  var validations = require("./validation");
  validations(loopbackApplication);
};
module.exports = function(loopbackApplication) {
  loadValidations(loopbackApplication);
};
