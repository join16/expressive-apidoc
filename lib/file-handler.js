'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
  
  writeInputFile: function(inputDirectory, version, content) {
    fs.writeFileSync(_getInputFilePath(inputDirectory, version), content);
  },
  cleanInputFile: function(inputDirectory, version) {
    fs.unlinkSync(_getInputFilePath(inputDirectory, version));
  },
  
  writeApidocJson: function(inputDirectory, obj) {
    fs.writeFileSync(_getApidocJsonPath(inputDirectory), JSON.stringify(obj));
  },
  cleanApidocJson: function(inputDirectory) {
    fs.unlinkSync(_getApidocJsonPath(inputDirectory));
  }
  
};

///

function _getInputFilePath(inputDirectory, version) {
  return path.join(inputDirectory, 'input-' + version + '.js');
}

function _getApidocJsonPath(inputDirectory) {
  return path.join(inputDirectory, 'apidoc.json');
}