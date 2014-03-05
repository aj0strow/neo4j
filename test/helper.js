require('mocha-as-promised')();

var chai = require('chai');
chai.use(require('chai-as-promised'));
global.assert = chai.assert;

global.neo4j = require('..');