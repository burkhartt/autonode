'use strict';
let express = require('express');
let cls = require('continuation-local-storage');
let ns = cls.createNamespace('request');
let winston = require('winston');
let UserRepository = require('./userRepository');
let autonode = require('./lib');
let ContainerBuilder = autonode.ContainerBuilder;
let container = autonode.Container;

var app = express();
app.use((req, res, next) => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);
    ns.run(() => next());
});

app.use((req, res, next) => {
    let containerBuilder = new ContainerBuilder();
    containerBuilder.register('userRepository', () => new UserRepository(), autonode.LifetimeScope.Singleton);
    containerBuilder.register('currentUser', (c) => c.resolve('request').query.userId, autonode.LifetimeScope.InstancePerRequest);
    containerBuilder.register('request', () => req, autonode.LifetimeScope.InstancePerRequest);
    containerBuilder.register('logger', (c) => {
        let request = c.resolve('request');
        let logger = new winston.Logger({
            transports: [
                new winston.transports.Console()
            ],
            rewriters: [
                (level, msg, meta) => { 
                    meta.sessionId = request.query.sessionId; 
                    return meta;
                }
            ]
        });
        return logger;
    }, autonode.LifetimeScope.InstancePerRequest)
    container.load(containerBuilder);
    next();
});

app.get('/', (req, res, next) => {
    let userRepo = container.resolve('userRepository');
    let user = userRepo.getCurrentUser();
    res.send(user.name);
    next();
});

app.use((req, res, next) => {
    container.requestFinished();
    next();
});

app.listen(3000);