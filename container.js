'use strict';

class Container {
    constructor() {
        this.registry = [];
    }

    load(containerBuilder) {
        this.registry = containerBuilder.registry;
    }

    resolve(key) {
        return this.registry[key](this);
    }
}

module.exports = new Container();