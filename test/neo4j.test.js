describe('neo4j', function () {
  it('should return a database client', function () {
    assert.equal('NeoClient', neo4j().constructor.name);
  });
});