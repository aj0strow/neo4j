describe('label', function () {
  var Book = db.label('Book', { primaryKey: 'isbn' });

  describe('#_find', function () {
    it('should be the correct query', function () {
      var expected = 'MATCH (book:Book { isbn: { primaryKey } })\nRETURN book';
      assert.equal(Book._find(), expected);
    });
  });

  describe('#find', function () {
    var props = { isbn: '001', title: 'Hackers & Painters' };

    before(function () {
      return db.cypher('CREATE (:Book { props })', { props: props });
    });

    it('should return matching items', function () {
      return assert.becomes(Book.find(props.isbn), props);
    });
  });

  describe('#_merge', function () {
    it('should be the correct query', function () {
      var expected = 'MERGE (book:Book { isbn: { primaryKey } })\nSET book = { props }\nRETURN book';
      assert.equal(Book._merge(), expected);
    });
  });

  describe('#merge', function () {
    var props = { isbn: '002' };

    it('should save and return', function () {
      return assert.becomes(Book.merge(props), props);
    });
  });
});
