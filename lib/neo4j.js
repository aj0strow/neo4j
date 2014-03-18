var http = require('http');
var when = require('when');
var merge = require('mout/object/merge');
var mixin = require('mout/object/mixIn');

var Label = require('./label');

var defaultOptions = {
  host: 'localhost',
  port: 7474,
  headers: {
    'Accept': 'application/json; charset=UTF-8',
    'Content-Type': 'application/json',
    'X-Stream': true
  }
};

function NeoClient (options) {
  this.options = merge(defaultOptions, options);
}

mixin(NeoClient.prototype, {

  request: function (method, path, body) {
    var options = merge(this.options, {
      method: method,
      path: '/db/data' + path
    });
    var req = http.request(options);

    var deferred = when.defer();
    req.on('response', function (res) {
      var chunks = [];
      res.on('data', chunks.push.bind(chunks));
      res.on('end', function () {
        var json = JSON.parse(chunks.join(''));
        if (res.statusCode >= 400) {
          deferred.reject(json);
        } else {
          deferred.resolve(json);
        }
      });
    });

    if (body !== undefined) {
      req.write(JSON.stringify(body));
    }
    req.end();
    return deferred.promise;
  },

  cypher: function (query, params) {
    function exec(params) {
      return this.request('POST', '/cypher', { query: query, params: params });
    }
    return (params === undefined) ? exec.bind(this) : exec.call(this, params);
  },

  clear: function () {
    return this.cypher('MATCH (node) OPTIONAL MATCH (node)-[rel]-() DELETE node, rel', {});
  },

  label: function (label, options) {
    return new Label(this, label, options);
  }

});

module.exports = function (options) {
  return new NeoClient(options);
};
