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
  let stringModels = helper.populateModels(app, keyVal); //,String)

  helper.setConfigPriority(
    stringModels,
    fieldConfigName,
    globalConfig,
    this.defProps
  );
  helper.setValidate(stringModels, validate);

  return stringModels;
};

function validate(ctx) {
  let instance = helper.getDataFromContext(ctx);
  for (let property in instance) {
    var currentProp = instance[property];
    // var checks =   _.get(this,property["stringProps"],null) //this[property]["stringProps"]||null;
    var checks = helper.getNested(this, property, fieldConfigName);
    if (checks) check(currentProp, checks);
  }
}

function check(string, options) {
  this.debug = debug;
  if (Array.isArray(string)) {
    validateStringArray.call(this, string, options, this);
  } else {
    validateStringLen.call(this, string, options, this);
  }
}

validateStringLen = function(string, options, self) {
 
  if (typeof string === "number") string = string.toString();
  let minLen = options.minLen;
  let maxLen = options.maxLen;

  if (string.length < minLen || string.length > maxLen) {
    self.debug("Invalid string length", minLen, maxLen);
    try {
      throw new Error(
        `Invalid string length of '${string}'. Accepted range is '${minLen}' to '${maxLen}`
      );
    } catch (error) {
      throw error;
      self.debug(options);
    }
  }
  self.debug(string, options, "correct");
};
validateStringArray = (arr, options, self) => {
  arr.forEach(string => {
    validateStringLen(string, options, self);
  });
};