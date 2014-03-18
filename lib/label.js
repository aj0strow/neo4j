var sash = require('sash');
var mixin = require('mout/object/mixIn');

function Label (graph, label, options) {
  this.graph = graph;
  this.label = label;
  this.instance = label.toLowerCase();
  this.primaryKey = options.primaryKey;
}

var getNode = sash.prop('data', 0, 0, 'data');

mixin(Label.prototype, {

  find: function (primaryKey) {
    var query = this._find();
    var params = { primaryKey: primaryKey };
    return this.graph.cypher(query, params).then(getNode);
  },

  _find: function () {
    return [
      'MATCH (' + this.instance + ':' + this.label + ' { ' + this.primaryKey + ': { primaryKey } })',
      'RETURN ' + this.instance
    ].join('\n');
  },

  merge: function (object) {
    var query = this._merge();
    var params = { props: object, primaryKey: object[this.primaryKey] };
    return this.graph.cypher(query, params).then(getNode);
  },

  _merge: function () {
    return [
      'MERGE (' + this.instance + ':' + this.label + ' { ' + this.primaryKey + ': { primaryKey } })',
      'SET ' + this.instance + ' = { props }',
      'RETURN ' + this.instance
    ].join('\n');
  },

  count: function () {
    var query = this._count();
    var params = {};
    return this.graph.cypher(query, params).then(sash.prop('data', 0, 0));
  },

  _count: function () {
    return [
      'MATCH (' + this.instance + ':' + this.label + ')',
      'RETURN count(' + this.instance + ')'
    ].join('\n');
  }

});

module.exports = Label;
