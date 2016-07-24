'use strict';
let container = require('./container');
let lifetime = require('./lifetimeScope');

class ContainerBuilder {
    constructor() {
        this.registry = [];
    }

    register(key, instanceFn, lifetimeScope) {
        this.registry[key] = {
            instanceFn: instanceFn,
            isClassType: false,
            lifetimeScope: lifetimeScope || lifetime.None
        };
    }

    registerType(key, type, lifetimeScope) {
        this.registry[key] = {
            instanceFn: type,
            isClassType: true,
            lifetimeScope: lifetimeScope || lifetime.None
        };
    }
}

module.exports = ContainerBuilder;