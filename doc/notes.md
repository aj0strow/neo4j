# Notes

My notes from reading the Neo4j manual. It's a work in progress, but should be enough to get started. 

### Chapter 1

Suitable for full enterprise deployment. ACID. A single server instance can handle a graph of billions of nodes and relationships. 

Use a graph database when storing richly-connected data (social stuff, for example). 

### Chapter 2

A graph database has nodes, relationships, indexes, constraints. 

### Chapter 3

#### Nodes

Nodes are used for representing entities of domain logic, like a user or comment. Nodes have labels, properties, and relationships. 

#### Labels

Labels are optional, but useful. They are used to group nodes into a set, like a table or collection. Indexes and constraints are scoped to a label. Lebels can be used for state, such as online / offline status. 

Labels are usually camel case, like `User`. Even though labels can be created on-the-fly, they weren't meant for arbitrary tags, and are hard-limited to around 2 billion at any given time.

#### Relationships

Relationships are used for connecting exactly two nodes. Relationships are always directed (outgoing or incoming relative to each node). 

*They are equally well traversed in either direction*, meaning duplicate relationships in the opposite direction are unecessary. In graph terminology every *edge* is both directed and undirected as far as traversal performance. 

Fun fact: a node can have a relationship with itself. 

Relationships have a *type* providing meaning. Relationships are usually upper snake case, such as `FOLLOWS` or `BLOCKS`. You can use types with spaces if you query with backticks. 

#### Properties

Properties are key-value pairs. The key is a string. The value is a non-null primitive or typed array of primities. Once more: *the value can't be null*. Instead exclude the key all together. 

If the value is a typed array, it cannot be initialized as an empty array. This will actually cause errors (oh java). 

#### Path

A path is a type of query result with 1 or more nodes joined by relationships. **TODO: better explanation**

Traversing the graph involves starting at a *start node* and following relationhips. It's good to limit traversals to a subset of the graph using labels and relationship types. 

#### Indexes

Indexes are eventually available. That means when declared on a property, the index is built in the background, and once every node has been indexed, the index comes online and starts speeding up queries. 

If something goes wrong, the index ends up in a failed state never coming online. To rebuild it, drop and recreate the index. Logs will tell of failed indexes, and the status can be queried via the rest api. 

#### Constraints

Constraints are for data consistency. Transactions that break a constraint are rolled back. Right now, only uniqueness is supported. 

### Chapter 4

The Cypher query language reads like a hybrid of SQL, JSON, Objective-C. Very straight-forward to say the least. Note that the :Label is always optional. 

#### Create

Warning: create will create duplicate entries, and `CREATE UNIQUE` isn't a thing. 

```
CREATE (var { properties })
CREATE (:Label { properties })
CREATE (var:Label { properties })
```

#### Match

Always returns an array of matches. The Label and { properties } are optional. 

```
MATCH (var:Label { properties }) RETURN var
```

#### Where

Where is like the sql clause.

```
MATCH (var:Label)
WHERE var.propertyKey = propertyValue
RETURN var
```

#### Set

Set is used to update node or relationship properties. 

```
MATCH (var:Label { properties })
SET var.propertyKey = propertyValue
RETURN var
```

#### Relationships

The syntax for relationships, being that they're always directed, is:

```
(node)-[relationship:TYPE]->(node')
```

You can return the relationship iteself.

```
MATCH (user:User { id: 5 }), (friend:User { id: 20 })
CREATE UNIQUE (user)-[friendship:FRIENDS_WITH]->(friend)
RETURN friendship
```

Relationship properties can be queried. So new friendships.

```
MATCH (user:User)-[friendship:FRIENDS_WITH]-(friend:User)
WHERE user.id = 5 AND friendship.created < 101002934802
RETURN friend
```

It's also possible to create a node on-the-fly when creating relationships.

```
CREATE UNIQUE (actor)-[rel:ACTED_IN]->(movie:Movie { title: "The Matrix" })
```

#### Order By, Limit, Offset

Just like sql, results may be ordered, limited and offset. 

```
MATCH (actor:Actor)
RETURN actor.name
ORDER BY actor.name
LIMIT 12
OFFSET 36
```

#### Traverse Relationships

Querying can be directionless, so lets find friends.

```
MATCH (user:User)-[:FRIENDS_WITH]-(friend:User)
WHERE user.id = 5
RETURN friend
```

The relationship may also be directed.

```
MATCH (user:User), (follower:User)
WHERE user.id = 5 AND (user)<-[:FOLLOWS]-(follower)
RETURN follower
```

The relationship can be nested, like friends of friends.

```
MATCH (user:User), (other:User)
WHERE user.id = 5
AND (user)-[:FRIENDS_WITH]-(:User)-[:FRIENDS_WITH]-(other)
RETURN other
```

Neo4j automatically excludes duplicates, so friends-of-friends and the like should just work. Woah right? 

### Builtins

Count a collection.

```
MATCH (user:User)
RETURN count(user)
```

Get the ids of users if name matches.

```
MATCH (user:User)
WHERE user.name =~ "^AJ.*"
RETURN id(user)
```

Get types of relationships between two users.

```
MATCH (user:User, { id: 5 })-[rel]-(other:User, { id: 10 })
RETURN type(rel)
```
