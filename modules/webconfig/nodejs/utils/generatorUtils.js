/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

exports.mainComment = 'This configuration was generated by automatically by Ignite ($date)';

function addLeadingZero(numberStr, minSize) {
    if (typeof (numberStr) != 'string')
        numberStr = '' + numberStr;
    
    while (numberStr.length < minSize) {
        numberStr = '0' + numberStr;
    }
    
    return numberStr;
}

exports.formatDate = function (date) {
    var dd = addLeadingZero(date.getDate(), 2);
    var mm = addLeadingZero(date.getMonth() + 1, 2);
    
    var yyyy = date.getFullYear();

    return mm + '/' + dd + '/' + yyyy + ' ' + addLeadingZero(date.getHours(), 2) + ':' + addLeadingZero(date.getMinutes(), 2);
};

exports.builder = function () {
    var res = [];

    res.deep = 0;
    res.lineStart = true;

    res.append = function(s) {
        if (this.lineStart) {
            for (var i = 0; i < this.deep; i++)
                this.push('    ');

            this.lineStart = false;
        }

        this.push(s);

        return this;
    };

    res.line = function(s) {
        if (s)
            this.append(s);

        this.push('\n');
        this.lineStart = true;

        return this;
    };

    res.startBlock = function(s) {
        if (s)
            this.append(s);

        this.push('\n');
        this.lineStart = true;
        this.deep++;

        return this;
    };

    res.endBlock = function(s) {
        this.deep--;

        if (s)
            this.append(s);

        this.push('\n');
        this.lineStart = true;

        return this;
    };

    res.emptyLineIfNeeded = function() {
        if (this.needEmptyLine) {
            this.line();

            this.needEmptyLine = false;
            
            return true;
        }

        return false;
    };

    return res;
};

function ClassDescriptor(className, fields) {
    this.className = className;

    this.shortClassName = className.substr(className.lastIndexOf('.') + 1);

    this.fields = fields;
}

exports.evictionPolicies = {
    'LRU': new ClassDescriptor('org.apache.ignite.cache.eviction.lru.LruEvictionPolicy',
        {batchSize: null, maxMemorySize: null, maxSize: null}),
    'RND': new ClassDescriptor('org.apache.ignite.cache.eviction.random.RandomEvictionPolicy', {maxSize: null}),
    'FIFO': new ClassDescriptor('org.apache.ignite.cache.eviction.fifo.FifoEvictionPolicy',
        {batchSize: null, maxMemorySize: null, maxSize: null}),
    'SORTED': new ClassDescriptor('org.apache.ignite.cache.eviction.sorted.SortedEvictionPolicy',
        {batchSize: null, maxMemorySize: null, maxSize: null})
};

exports.knownClasses = {
    
    
    OracleDialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.OracleDialect', {}),
    BasicJdbcDialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.BasicJdbcDialect', {}),
    DB2Dialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.DB2Dialect', {}),
    SQLServerDialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.SQLServerDialect', {}),
    MySQLDialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.MySQLDialect', {}),
    H2Dialect: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.dialect.H2Dialect', {})
};

exports.storeFactories = {
    CacheJdbcPojoStoreFactory: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.CacheJdbcPojoStoreFactory', {
        dataSourceBean: null,
        dialect: {type: 'className'}
    }),

    CacheJdbcBlobStoreFactory: new ClassDescriptor('org.apache.ignite.cache.store.jdbc.CacheJdbcBlobStoreFactory', {
        user: null,
        dataSourceBean: null,
        initSchema: null,
        createTableQuery: null,
        loadQuery: null,
        insertQuery: null,
        updateQuery: null,
        deleteQuery: null
    }),

    CacheHibernateBlobStoreFactory: new ClassDescriptor('org.apache.ignite.cache.store.hibernate.CacheHibernateBlobStoreFactory', {
        hibernateProperties: {type: 'propertiesAsList', propVarName: 'props'}
    })
};

exports.atomicConfiguration = new ClassDescriptor('org.apache.ignite.configuration.AtomicConfiguration', {
    backups: null,
    cacheMode: {type: 'enum', enumClass: 'CacheMode'},
    atomicSequenceReserveSize: null
});

exports.swapSpaceSpi = new ClassDescriptor('org.apache.ignite.spi.swapspace.file.FileSwapSpaceSpi', {
    baseDirectory: null,
    readStripesNumber: null,
    maximumSparsity: {type: 'float'},
    maxWriteQueueSize: null,
    writeBufferSize: null
});

exports.transactionConfiguration = new ClassDescriptor('org.apache.ignite.configuration.TransactionConfiguration', {
    defaultTxConcurrency: {type: 'enum', enumClass: 'TransactionConcurrency'},
    transactionIsolation: {type: 'TransactionIsolation', setterName: 'defaultTxIsolation'},
    defaultTxTimeout: null,
    pessimisticTxLogLinger: null,
    pessimisticTxLogSize: null,
    txSerializableEnabled: null
});

exports.hasProperty = function(obj, props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            if (obj[propName])
                return true;
        }
    }

    return false;
};