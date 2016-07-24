'use strict';
let lifetimeScope = require('./lifetimeScope');
let getConstructorParamNames = require('get-parameter-names');
let exceptions = require('./exceptions');

class Container {
    constructor() {
        this.registry = [];
        this.components = [];
    }

    load(containerBuilder) {
        this.registry = containerBuilder.registry;
        this.components = [];
    }

    resolve(key) {
        let registryItem = this.registry[key];
        try {
            if (!this.components[key] || registryItem.lifetimeScope === lifetimeScope.None) {            
                if (registryItem.isClassType) {
                    let constructorParams = getConstructorParamNames(registryItem.instanceFn);
                    let instanceParams = [null].concat(constructorParams.map(p => this.resolve(p)));
                    this.components[key] = new (Function.prototype.bind.apply(registryItem.instanceFn, instanceParams));
                } else {
                    this.components[key] = this.registry[key].instanceFn(this);
                }
            }
            return this.components[key];
        } catch (ex) {
            if (ex instanceof RangeError) {
                throw new exceptions.CircularDependencyException();
            }
            throw ex;
        }
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