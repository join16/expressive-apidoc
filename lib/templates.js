'use strict';

var _ = require('lodash');
var Handlebars = require('handlebars');

var data = {
  api: '@api {{wrapBracket method}} {{url}} {{title}}',
  permission: '@apiPermission {{authority}}',
  description: '@apiDescription {{description}}',
  group: '@apiGroup {{name}}',
  success: '@apiSuccess {{name}}\n{{description}}',
  param: '@apiParam {{wrapBracket type}} {{name}} {{description}}',
  version: '@apiVersion {{version}}'
};
var templates = {};

module.exports = templates;

Handlebars.registerHelper('wrapBracket', function(string) {
  return '{' + string + '}';
});

_.forOwn(data, function(value, key) {
  templates[key] = Handlebars.compile(value);
});