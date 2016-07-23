'use strict';
const assert = require('chai').assert;
const autonode = require('../lib');
const ContainerBuilder = autonode.ContainerBuilder;
const container = autonode.Container;
const NUMBER_OF_INSTANCES = 10;

describe('Container', () => {
    describe('When a registration has no lifetime scope', () => {
        it('Should be instantiated on every resolution', () => {
            let instanceCount = 0;

            let containerBuilder = new ContainerBuilder();
            containerBuilder.register('myType', () => {
                instanceCount++;
                return instanceCount;
            });
            container.load(containerBuilder);

            for (let i = 0; i < NUMBER_OF_INSTANCES; i++) {
                container.resolve('myType');
            }
            assert.equal(instanceCount, NUMBER_OF_INSTANCES);
        });
    });

    describe('When a registration is SingleInstance', () => {
        it('Should be instantiated only once', () => {
            let instanceCount = 0;

            let containerBuilder = new ContainerBuilder();
            containerBuilder.register('myType', () => {
                instanceCount++;
                return instanceCount;
            }, autonode.LifetimeScope.SingleInstance);
            container.load(containerBuilder);

            for (let i = 0; i < NUMBER_OF_INSTANCES; i++) {
                container.resolve('myType');
            }
            assert.equal(instanceCount, 1);
        });
    });
});
