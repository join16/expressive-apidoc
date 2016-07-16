'use strict';

var _ = require('lodash');

var templates = require('./templates');

module.exports = {
  
  /**
   * Generates apidoc block from params object
   * 
   * @param {Object} params
   * @param params.url
   * @param params.method
   * @param params.title
   * @param params.query
   * @param params.body
   * @param params.params
   * 
   * @param version
   */
  generateApidocCommentBlock: function(params, version) {
    var arr = [];
    var docsConfig = params.config.docs || {};

    arr.push(templates.api({
      url: params.url,
      method: params.method,
      title: docsConfig.title
    }));

    if (params.config.authority) {
      arr.push(templates.permission({ authority: params.config.authority }));
    }

    if (docsConfig.group) {
      arr.push(templates.group({ name: docsConfig.group }));
    }
    
    if (params.config.validate) {
  
      // params
      // query
      if (_.isObject(params.config.validate.params)) {
        arr = _.concat(arr, _generateParamCommentArray('params', params.config.validate.params));
      }
      // query
      if (_.isObject(params.config.validate.query)) {
        arr = _.concat(arr, _generateParamCommentArray('query', params.config.validate.query));
      }
      // body
      if (_.isObject(params.config.validate.body)) {
        arr = _.concat(arr, _generateParamCommentArray('body', params.config.validate.body));
      }
      
    }
    
    if (_.isString(docsConfig.comment)) {
      arr.push(templates.description({ description: docsConfig.comment }));
    }
    
    arr.push(templates.version({
      version: docsConfig.version || version
    }));
    
    return _toCommentBlock(arr);
  }

};

////////// private

/**
 * @param {String} name
 * @param {Object} config
 */
function _generateParamCommentArray(name, config) {
  var arr = [];
  var type = config.type;
  var description = '';
  var isObject = _.capitalize(type) === 'Object';
  
  if (config.multiple) {
    type += '[]';
  }
  if (config.optional) {
    name = '[' + name + ']';
  }
  if (_.isString(config.comment)) {
    description += config.comment + ' ';
  }
  if (_.isArray(config.spec)) {
    description += '(' + config.spec.join(' | ') + ')';
  }
  
  arr.push(templates.param({
    type: type,
    name: name,
    description: description
  }));

  // if type is object, add additional param block for schema
  if (isObject) {
    _.forOwn(config.schema, function(value, key) {
      var actualKey = name + '.' + key;
      arr = _.concat(arr, _generateParamCommentArray(actualKey, value));
    });
  }
  
  return arr;
}

function _toCommentBlock(arr) {
  var comments = _.map(arr, function(element) {
    return _toCommentString(element);
  });

  return _.concat([
    '/**'
  ], comments, [
    ' */'
  ]).join('\n');
}

function _toCommentString(str) {
  var tokens = str.split('\n');
  
  return _.map(tokens, function(token) {
    return ' * ' + token;
  }).join('\n');
}