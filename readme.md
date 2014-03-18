# Neo4j

Why another Neo4j client? Promises. I use this library for a project called Bookspo. 

```
$ npm install aj0strow/neo4j --save
```

Connect to a local graph database. 

```javascript
var neo4j = require('neo4j');
var graphdb = neo4j();
```

Cypher queries return a promise. Bad syntax and other errors result in rejection. 

```javascript
var rejected = graphdb.cypher('this is nonsense', {});

var props = { props: { name: 'AJ' } };
var resolved = graphdb.cypher('CREATE (node { props })', props);
```

Queries cache for usage later if you don't pass properties, which is useful for internal modules. 

```javascript
var findUser = graphdb.cypher('MATCH (user:User) WHERE user.id = { id } RETURN user');
var promise = findUser({ id: 5 });
```

You can find and save nodes scoped to a label. It uses `MERGE` so as to respect unique primary keys. 

```javascript
var User = graphdb.label('User', { primaryKey: 'id' });
User.merge({ id: 1, name: 'AJ' })
User.find(1)
```

### Notes

I read the manual and took notes available in `doc/notes.md`. 

License: **MIT**
