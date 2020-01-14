var helper = require("./helper");
var _ = require("lodash");
var baseDebg = "loopback:component-validator:numberValidation";
var debug = require("debug")(baseDebg),
  observe = debug.extend("init");
var fieldKeyName="numberProps"
var configKeyName="defNumberProps"
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




this.verifyNumber = (Model, instance, debg) => {
    console.log("aaa")
  let chckFields = Model.options.numberFields || [];
  let defProps = Model.options.defProps;
  debg(chckFields)
  for (let field in instance) {
    if (chckFields.includes(field)) {
        debg(field)
        debg(Model.definition.rawProperties[field][fieldKeyName])

      defProps = Model.definition.rawProperties[field][fieldKeyName] || defProps;
        debug(defProps,"Aaaaaaaaaaaaa")
      for (let prop in this.defProps) {
        debug(defProps[prop],this.defProps[prop])

        defProps[prop] = defProps[prop] || this.defProps[prop];
        debug(defProps[prop])
      }
      debug(defProps)
      helper.validateStringLen.call(this, instance[field], defProps);
      debg(field, defProps,true);
    }
  }
};


this.initObserveHook = (app, modelName) => {
  let Model = app.models[modelName];
  Model.options = {};
  Model.options.numberFields = this.models[modelName];
  let tmpProps = app.get(configKeyName);
  for (let prop in this.defProps) {
    this.defProps[prop] = _.get(tmpProps, prop, this.defProps[prop]);
  }
  observe(
    `${modelName} model number defaults ${JSON.stringify(this.defProps)}`
  );

  Model.options.defProps = this.defProps;
  Model.observe("before save", async ctx => {
    let obs = observe.extend(modelName);

    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance && instance.__data) {
      instance = instance.__data;
    }

    this.verifyNumber(Model, instance, debug.extend("beforeSave"));
    // debug("done")
  });
};

module.exports = app => {
  this.models = {};
  this.debug=debug
  _.keys(app.models).forEach(model => {
    helper.populateFields.call(this,app.models[model], this.models, "type", "number");
  });
  for (let modelName in this.models) {
    this.initObserveHook(app, modelName);
  }
};
