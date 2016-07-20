'use strict';
let express = require('express');
let cls = require('continuation-local-storage');
let ns = cls.createNamespace('request');
let winston = require('winston');
let UserRepository = require('./userRepository');
let ContainerBuilder = require('./containerBuilder');
let container = require('./container');

var app = express();
app.use((req, res, next) => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);
    ns.run(() => next());
});

app.use((req, res, next) => {
    let containerBuilder = new ContainerBuilder();
    containerBuilder.register('userRepository', () => new UserRepository());
    containerBuilder.register('currentUser', (c) => c.resolve('request').query.userId);
    containerBuilder.register('request', () => req);
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
    })
    container.load(containerBuilder);
    next();
});

app.get('/', (req, res) => {
    let userRepo = container.resolve('userRepository');
    let user = userRepo.getCurrentUser();
    res.send(user.name);
});

app.listen(3000);