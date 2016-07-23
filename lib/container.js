'use strict';
let lifetimeScope = require('./lifetimeScope');
let getConstructorParamNames = require('get-parameter-names');

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
            let registryItem = this.registry[key];
            if (registryItem.isClassType) {
                let constructorParams = getConstructorParamNames(registryItem.instanceFn);
                let instanceParams = [null].concat(constructorParams.map(p => this.resolve(p)));
                this.components[key] = new (Function.prototype.bind.apply(registryItem.instanceFn, instanceParams));
            } else {
                this.components[key] = this.registry[key].instanceFn(this);
            }
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