'use strict';
let lifetimeScope = require('./lifetimeScope');

class Container {
    constructor() {
        this.registry = [];
        this.components = [];
    }

    load(containerBuilder) {
        this.registry = containerBuilder.registry;
    }

    resolve(key) {
        if (!this.components[key]) {
            this.components[key] = this.registry[key].instanceFn(this);
        }
        return this.components[key];
    }

    requestFinished() {
        for (let key in this.registry) {
            if (this.registry[key].lifetimeScope === lifetimeScope.InstancePerRequest) {
                delete this.components[key];
            }
        }
    }
}

module.exports = new Container();