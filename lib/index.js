'use strict';
let cls = require('continuation-local-storage');
let ns = cls.createNamespace('request');

module.exports = {
    Container: require('./container'),
    ContainerBuilder: require('./containerBuilder'),
    LifetimeScope: require('./lifetimeScope'),
    Exceptions: require('./exceptions'),
    Middleware: (req, res, next) => {
        ns.bindEmitter(req);
        ns.bindEmitter(res);
        ns.run(() => next());

        res.on('finish', () => {
            require('./container').requestFinished();
        });
        next();
    }
}