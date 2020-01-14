var helper = require("./helper");
var _ = require("lodash");
var baseDebg = "loopback:component-validator:stringValidation";
var debug = require("debug")(baseDebg),
  observe = debug.extend("init");

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



this.verifyString = (Model, instance, debg) => {
  let chckFields = Model.options.stringFields || [];
  let defProps = Model.options.defStringProps;
  for (let field in instance) {
    if (chckFields.includes(field)) {
      defProps = Model.definition.rawProperties[field].stringProps || defProps;

      for (let prop in this.defProps) {
        defProps[prop] = defProps[prop] || this.defProps[prop];
      }
      helper.validateStringLen.call(this, instance[field], defProps);
      debg(field, defProps,true);
    }
  }
};


this.initObserveHook = (app, modelName) => {
  let Model = app.models[modelName];
  Model.options = {};
  Model.options.stringFields = this.models[modelName];
  let tmpProps = app.get("defStringProps");
  for (let prop in this.defProps) {
    this.defProps[prop] = _.get(tmpProps, prop, this.defProps[prop]);
  }
  observe(
    `${modelName} model string defaults ${JSON.stringify(this.defProps)}`
  );

  Model.options.defStringProps = this.defProps;
  Model.observe("before save", async ctx => {
    let obs = observe.extend(modelName);

    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance && instance.__data) {
      instance = instance.__data;
    }

    this.verifyString(Model, instance, debug.extend("beforeSave"));
  });
};

module.exports = app => {
  this.models = {};
  this.debug=debug
  _.keys(app.models).forEach(model => {
    helper.populateFields.call(this,app.models[model], this.models, "type", "string");
  });
  for (let modelName in this.models) {
    this.initObserveHook(app, modelName);
  }
};
