const isRequired = param => {
  throw new Error(`${param}`);
};

module.exports.populateFields = function(
  Model,
  arr,
  key,
  value,
  changeToString
) {
  let error = "Invalid arguments";
  if (!Model || !arr || !key || !value)
    isRequired("More arguments are required");

  let properties = Model.definition.rawProperties;
  let keyName = key;
  let customValue = value;
  let props = [];
  for (let field in properties) {
    if (
      properties.hasOwnProperty(field) &&
      properties[field][keyName] == customValue
    ) {
      props.push(field);
      arr[Model.modelName] = props;
      if (changeToString) {
        Model.definition.rawProperties[field][
          keyName
        ] = Model.definition.properties[field][keyName] = String;
      }
    }
  }
  let modelName = Model.modelName;
  if (props.length && this.debug)
    this.debug(modelName, ` model ${value} fields `, arr[Model.modelName]);
};

module.exports.validateStringLen = function(string, options) {
  let minLen = options.minLen;
  let maxLen = options.maxLen;
  if (string.length < minLen || string.length > maxLen) {
    this.debug("Invalid string length");
    throw new Error(
      `Invalid string length of '${string}'. Accepted range is '${minLen}' to '${maxLen}`
    );
  }
};
