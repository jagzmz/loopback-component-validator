"use strict";
var _ = require("lodash");
module.exports = (Model, options) => {
  let customValidation = ["StringValidation","NumberValidation"]

  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      this[prop](Model, options);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
};

this.StringValidation = (Model, options) => {
  require("./lib/stringValidation")(Model, options);
};

this.NumberValidation = (Model, options) => {
  require("./lib/numberValidation")(Model, options);
};
