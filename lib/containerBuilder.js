'use strict';
let container = require('./container');

class ContainerBuilder {
    constructor() {
        this.registry = [];
    }

    register(key, instanceFn, lifetimeScope) {
        this.registry[key] = {
            instanceFn: instanceFn,
            lifetimeScope: lifetimeScope
        };
    }
}

module.exports = ContainerBuilder;