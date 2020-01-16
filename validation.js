"use strict";
var _ = require("lodash");
var debug = require("debug")("loopback:component-validator:validation");
var beforeSaveValidators = [];
var customValidators = [];

module.exports = (app, options) => {
  let customValidation = ["StringValidation", "NumberValidation"];
  if (options.disableAll) {
    return;
  }
  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      console.log(options, prop, options[prop] == false);
      if (options[prop] != false) this[prop](app);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
  attachBeforeSave(app);
};

this.StringValidation = app => {
  var stringValidator = require("./lib/stringValidation").setup(app);
  var deb = debug.extend("stringModels");
  deb(stringValidator);
  customValidators.push(stringValidator);
};
this.NumberValidation = app => {
  var numberValidator = require("./lib/numberValidation").setup(app);
  var deb = debug.extend("numberModels");
  deb(numberValidator);
  customValidators.push(numberValidator);
};

function attachBeforeSave(app) {
  _.keys(app.models).forEach(Model => {
    app.models[Model].observe("before save", async ctx => {
      for (let validator of customValidators) {
        validator[Model].validate(ctx);
      }
    });
  });
}
