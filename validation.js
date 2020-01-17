"use strict";
var _ = require("lodash");
var debug = require("debug")("loopback:component-validator:validation");
var beforeSaveValidators = [];
var customValidators = [];

module.exports = (app, options) => {
  let customValidation = ["StringValidation", "NumberValidation"];
  
  if (options.disableAll==true) {
    return;
  }

  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      if (options[prop] != false) this[prop](app);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
  debug(options);

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
  _.keys(app.models).forEach(model => {
    app.models[model].observe("before save", async ctx => {
      for (let validator of customValidators) {
        let Model=app.models[model]
        if(typeof validator[model].validate==='function')
          validator[model].validate(ctx,Model);
      }
    });
  });
}
