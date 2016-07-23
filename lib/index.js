'use strict';

module.exports = {
    Container: require('./container'),
    ContainerBuilder: require('./containerBuilder'),
    LifetimeScope: require('./lifetimeScope'),
    printMsg: () => {
        console.log("This is a message from the demo package");
    }
}