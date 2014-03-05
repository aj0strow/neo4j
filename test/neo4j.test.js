describe('neo4j', function () {
  it('should return a database client', function () {
    assert.equal('NeoClient', neo4j().constructor.name);
  });

  describe('#cypher', function () {
    var graphdb = neo4j();

    describe('valid query', function () {
      var query = 'CREATE (n:Person { props } ) RETURN n AS person';
      var params = { props: { name: 'AJ' } };
      var results = graphdb.cypher(query, params);

      it('should have correct columns', function () {
        var columns = results.then(sash.prop('columns'));
        return assert.becomes(columns, [ 'person' ]);
      });

      it('should have correct data', function () {
        var data = results.then(sash.prop('data', 0, 0, 'data'));
        return assert.becomes(data, { name: 'AJ' });
      });
    });

    describe('invalid query', function () {
      var nonsense = 'DO something WITH another thing PLEASE;';
      var errors = graphdb.cypher(nonsense, {});

      it('should have correct error', function () {
        return assert.isRejected(errors);
      });
    });

    describe('cached query', function () {
      var query = 'MATCH (p:Person) WHERE p.id = { id } RETURN p AS person';
      var person = graphdb.cypher(query);

      it('should execute when passed params', function () {
        var columns = person({ id: 1 }).then(sash.prop('columns'));
        return assert.becomes(columns, [ 'person' ])
      });
    });

    describe('transaction', function () {
      var props = { username: 'testing' };
      var create = graphdb.cypher('CREATE (node { props })');
      var match = graphdb.cypher('MATCH (node) WHERE node.username = {username} RETURN node');

      it('should return the same props', function () {
        var object = create({ props: props }).then(function () {
          return match(props).then(sash.prop('data', 0, 0, 'data'));
        });
        return assert.becomes(object, props);
      });
    });
  });

  after(function () {
    var graphdb = neo4j();
    var query = 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r';
    return graphdb.cypher(query, {});  
  });
});
