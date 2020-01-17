var helper = require("./helper");
var _ = require("lodash");
var baseDebg = "loopback:component-validator:stringValidation";
var debug = require("debug")(baseDebg),
  observe = debug.extend("init");
let keyVal = { key: "type", value: "string" };
let fieldConfigName = "stringProps";
let globalConfigName = "defStringProps";

/* 
    Usage:

    Global model default:
      Give default string properties in your config.json file
      {
        "defStringProps": {
          "minLen":10,
          "maxLen": 200
        }
      }
    
    Property specific default:
      Give default string properties in your model.json file
      {
        "type":"string",
        "stringProps": {
          "minLen":1,
          "maxLen": 10
        }
      }
    
*/

//Global string properties
this.defProps = {
  minLen: 1,
  maxLen: 2000
};

module.exports.setup = app => {
  let globalConfig = app.get(globalConfigName);
  let stringModels = helper.populateModels(app, keyVal);

  helper.setConfigPriority(
    stringModels,
    fieldConfigName,
    globalConfig,
    this.defProps
  );

  setValidators(stringModels, app);

  return stringModels;
};

setValidators = (stringModels, app) => {
  for (let model in stringModels) {
    
    for (let property in stringModels[model]) {
      let prop = stringModels[model][property];
      let min=_.get(prop, `${fieldConfigName}.minLen`)
      let max=_.get(prop, `${fieldConfigName}.maxLen`)
      let options = {
        min: min,
        max:max,
        message:`Invalid range {min:${min},max:${max}}`,
        propName: property
      };
      if (Array.isArray(prop.type)) {
        app.models[model].validate(property, validateStringArray(options),options);
      } else app.models[model].validatesLengthOf(property, {min:options.min,max:options.max,message:{min:options.message,max:options.message}})//},{min:options.message,max:options.message});
    }
  }
};

function validateStringArray(val) {
  return function(err) {
    var values = this[val.propName];
    _.forEach(values, item => {
      if (item.length < val.min || item.length > val.max) err();
    });
  };
}
