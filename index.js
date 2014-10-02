/* Copyright (c) 2014 Shimon Schwartz, MIT License */

var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN,
	couchbase = require('couchbase');

function CouchbaseDOWN(location) {
	if (!(this instanceof CouchbaseDOWN)) {
		return new CouchbaseDOWN(location);
	}

	AbstractLevelDOWN.call(this, location);
}

CouchbaseDOWN.prototype = Object.create(AbstractLevelDOWN.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: CouchbaseDOWN,
		writable: true
	},

	_cluster:	null,
	_manager:	null,
	_bucket:	null,

	_open: function (options, callback) {
		var self = this, manager;

		if (!this._cluster) {
			this._cluster = new couchbase.Cluster(location);
		}

		if (options.createIfMissing || options.errorIfExists) {
			if (!options.adminUser) {
				throw new Error('Couchbase adminUser is not set');
			}

			if (!options.adminPass) {
				throw new Error('Couchbase adminPass is not set');
			}
			
			manager = this._cluster.manager(options.adminUser, options.adminPass);

			manager.listBuckets(function (err, bucketInfo) {
				if (err) {
					process.nextTick(function () {
						callback(err);
					});

					return;
				}

				// TODO
				console.log(bucketInfo);

				if (bucketInfo.indexOf(options.bucket) >= 0) {
					if (options.errorIfExists) {
						throw new Error('Bucket ' + options.bucket + ' already exists');
					}
				} else {
					if (options.createIfMissing) {
						manager.createBucket(options.bucket)
					} else {
						throw new Error('Bucket ' + options.bucket + ' doesn\'t exist');
					}
				}

				self._openBucket(options.bucket, options.pass, callback);
			});
		} else {
			self._openBucket(options.bucket, options.pass, callback);
		}
	},

	_openBucket: function (bucket, password, callback) {
		var self = this;

		process.nextTick(function () {
			self._bucket = self._cluster.openBucket(bucket || null, password || null, callback);
		});
	}

	_close: function (callback) {
		this._bucket.disconnect();

		process.nextTick(callback)
	},

	_get: function (key, options, callback) {
		if (!options.couchbase) {
			options.couchbase = {};
		}

		this._bucket.get(key, options.couchbase, callback);
	},

	_put: function (key, value, options, callback) {
		if (!options.couchbase) {
			options.couchbase = {};
		}

		this._bucket.upsert(key, value, options.couchbase, callback);
	},

	_del: function (key, options, callback) {
		if (!options.couchbase) {
			options.couchbase = {};
		}

		this._bucket.remove(key, options.couchbase, callback);
	},

	_batch: function (array, options, callback) {
		throw new Error('batch() not implemented');
	}
});

module.exports.CouchbaseDOWN = CouchbaseDOWN;
