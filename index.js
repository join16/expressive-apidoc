'use strict';

var apidoc = require('apidoc');
var _ = require('lodash');

var path = require('path');

var apidocCommentGenerator = require('./lib/apidoc-comment-generator');
var fileHandler = require('./lib/file-handler');

var defaultInputDirectory = path.join(__dirname, 'apidoc-inputs');

/**
 * Generates apidoc input comments and output result
 * 
 * @param {Object} options
 * @param {String} options.dest dest path of apidoc result
 * @param {String} [options.inputDest] destPath for apidoc input comments file
 * @param {Object} options.apidoc content object for apidoc.json
 * @param {Boolean} [options.keepInput] if true, comments input file will not be removed 
 * @param {Array} routeTables routeTables array from expressiveRoute.getRouteTables()
 */
exports.generate = function(options, routeTables) {
  var dest = options.dest;
  var inputDest = path.resolve(options.inputDest) || defaultInputDirectory;
  var apidocConfig = options.apidoc;
  var version = apidocConfig.version || '0.0.0';
  
  var comments = _.map(routeTables, function(table) {
    return apidocCommentGenerator.generateApidocCommentBlock(table, version);
  }).join('\n');

  fileHandler.writeApidocJson(inputDest, apidocConfig);
  fileHandler.writeInputFile(inputDest, version, comments);

  apidoc.createDoc({
    src: inputDest,
    dest: path.resolve(dest)
  });

  if (options.keepInput) {
    fileHandler.cleanApidocJson(inputDest);
    fileHandler.cleanInputFile(inputDest, version);
  }
};