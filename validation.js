"use strict";
var _ = require("lodash");
var debug = require("debug")("loopback:component-validator:validation");
var beforeSaveValidators = [];
var customValidators = [];

module.exports = app => {
  let customValidation = ["StringValidation", "NumberValidation"];

  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      this[prop](app);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
  attachBeforeSave(app);
};

this.StringValidation = app => {
  var stringValidator = require("./lib/stringValidation");
  customValidators.push(stringValidator.setup(app));
};
this.NumberValidation = app => {
  var numberValidator = require("./lib/numberValidation");
  customValidators.push(numberValidator.setup(app));
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
