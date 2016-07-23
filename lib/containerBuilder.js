'use strict';
let container = require('./container');
let isClass = require('is-class');

class ContainerBuilder {
    constructor() {
        this.registry = [];
    }

    register(key, instanceFn, lifetimeScope) {
        this.registry[key] = {
            instanceFn: instanceFn,
            isClassType: isClass(instanceFn),
            lifetimeScope: lifetimeScope
        };
    }
}

module.exports = ContainerBuilder;