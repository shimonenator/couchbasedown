# CouchbaseDOWN
===============

**A drop in replacement for [LevelDOWN](https://github.com/rvagg/node-leveldown) that works with Couchbase as its storage. Can be used as a back-end for [LevelUP](https://github.com/rvagg/node-levelup) rather than an actual LevelDB store.**

As of version 0.7, LevelUP allows you to pass a `'db'` option when you create a new instance. This will override the default LevelDOWN store with a LevelDOWN API compatible object. CouchbaseDOWN conforms exactly to the LevelDOWN API but performs operations against a Couchbase database.

Install
-------

```sh
$ npm install couchbasedown
```

Usage
-----



ToDo
----

- Proper error handling
- Test coverage
- CB CAS support
- CB Lock support
- LD Batch support

Licence
-------

MIT © [Shimon Schwartz](https://github.com/shimonenator) 
