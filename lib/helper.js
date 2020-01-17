var _ = require("lodash");
const isRequired = param => {
  throw new Error(`${param}`);
};
module.exports.getNested=(obj, ...args)=>{
  return args.reduce((obj, level) => obj && obj[level], obj);
}
function getCount(data, level) {
  level = level || 0;
  count[level] = count[level] || 0;
  for (var k in data) {
    data.hasOwnProperty(k) && count[level]++;
    typeof data[k] === "object" && getCount(data[k], level + 1);
  }
}
const checkArgs = (args, lim) => {
  for (let arg in arguments) {
    if (!arg) isRequired(`${lim} arguments are required`);
  }
};

module.exports.setValidate = (models, validate) => {
  for (let model in models) {
    models[model].validate = validate;
  }
};
module.exports.getDataFromContext = ctx => {
  let instance = ctx.instance || ctx.data;
  if (ctx.isNewInstance && instance.__data) {
    instance = instance.__data;
  }
  return instance;
};

module.exports.setConfigPriority = function(
  models,
  fieldConfigName,
  globalConfig,
  modelConfig
) {
  for (let model in models) {
    let properties = models[model];
    for (let property in properties) {
      models[model][property][fieldConfigName] =
        models[model][property][fieldConfigName] || globalConfig || modelConfig;

      for (let gConf in modelConfig) {
        models[model][property][fieldConfigName][gConf] =
          models[model][property][fieldConfigName][gConf] ||
          globalConfig[gConf] ||
          modelConfig[gConf];
      }
    }
  }
};

module.exports.populateModels = function(app, keyVal, changeToValue) {
  checkArgs({ app, keyVal });
  let key = keyVal.key;
  let value = keyVal.value;
  var requiredModels = {};
  for (let model in app.models) {
    let Model = app.models[model];
    this.populateFields(Model, key, value, requiredModels, changeToValue);
  }

  return requiredModels;
};
var defPropKey = "type";
module.exports.populateFields = function(
  Model,
  key,
  value,
  requiredModels,
  changeToValue
) {
  checkArgs({ Model, key, value, requiredModels });

  let properties = Model.definition.rawProperties;
  let keyName = key;
  let customValue = value;
  let data = {};
  var flag = false;
  for (let property in properties) {
    if (
      properties.hasOwnProperty(property) &&
      properties[property][keyName] == customValue
    ) {
      data[property] = properties[property];
      flag = true;
      if (changeToValue)
        changePropValue(Model, property, "type", changeToValue);
    }
  }

  if (flag) requiredModels[Model.modelName] = data;
  flag = false;
};

function changePropValue(Model, property, keyName, value) {
  Model.definition.rawProperties[property][
    keyName
  ] = Model.definition.properties[property][keyName] = value;
}



