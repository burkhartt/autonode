'use strict';
let container = require('./container');

class ContainerBuilder {
    constructor() {
        this.registry = [];
    }

    register(key, instanceFn) {
        this.registry[key] = instanceFn;
    }
}

module.exports = ContainerBuilder;