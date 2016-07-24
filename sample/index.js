'use strict';
let express = require('express');
let winston = require('winston');
let UserRepository = require('./userRepository');
let autonode = require('../lib');
let ContainerBuilder = autonode.ContainerBuilder;

var app = express();

app.use(autonode.Middleware);
app.use((req, res, next) => {
    let containerBuilder = new ContainerBuilder();
    containerBuilder.registerType('userRepository', UserRepository, autonode.LifetimeScope.InstancePerRequest);
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
    autonode.Container.load(containerBuilder);

    next();
});

app.get('/', (req, res, next) => {
    let userRepo = autonode.Container.resolve('userRepository');
    let user = userRepo.getCurrentUser();
    res.send(user.name);
    next();
});

app.listen(3000);