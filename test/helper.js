require('mocha-as-promised')();

var chai = require('chai');
chai.use(require('chai-as-promised'));
global.assert = chai.assert;

global.sash = require('sash');

global.neo4j = require('..');

global.db = neo4j();

after(function () {
  return db.clear();
});
