var helper = require("./helper");
var _ = require("lodash");
var baseDebg = "loopback:component-validator:numberValidation";
var debug = require("debug")(baseDebg);
let keyVal = { key: "type", value: "number" };
let fieldConfigName = "numberProps";
let globalConfigName = "defNumberProps";
/* 
    Usage:

    Global model default:
      Give default string properties in your config.json file
      {
        "defNumberProps": {
          "minLen":10,
          "maxLen": 200
        }
      }
    
    Property specific default:
      Give default string properties in your model.json file
      {
        "type":"number",
        "numberProps": {
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
  let numberModels = helper.populateModels(app, keyVal); //,String)

  helper.setConfigPriority(
    numberModels,
    fieldConfigName,
    globalConfig,
    this.defProps
  );
  helper.setValidate(numberModels, validate);

  return numberModels;
};

function validate(ctx) {
  let instance = helper.getDataFromContext(ctx);
  for (let property in instance) {
    var currentProp = instance[property];
    var checks = helper.getNested(this, property, fieldConfigName);
    if (checks) check(currentProp, checks);
  }
}

check=(string, options)=> {
  this.debug = debug;
  if (Array.isArray(string)) {
    validateNumberArray.call(this, string, options, this);
  } else {
    validateNumberLen.call(this, string, options, this);
  }
}
validateNumberLen = (number, options, self) =>{
  let minLen = options.minLen;
  let maxLen = options.maxLen;
  if (number < minLen || number > maxLen) {
    self.debug("Invalid number length", minLen, maxLen);
    try {
      throw new Error(
        `Invalid number length of '${number}'. Accepted range is '${minLen}' to '${maxLen}`
      );
    } catch (error) {
      throw error;
      self.debug(options);
    }
  }
  self.debug(number, options, "correct");
};

validateNumberArray = (arr, options, self) => {
  arr.forEach(number => {
    validateNumberLen(number, options, self);
  });
};