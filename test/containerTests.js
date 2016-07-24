'use strict';
const assert = require('chai').assert;
const autonode = require('../lib');
const ContainerBuilder = autonode.ContainerBuilder;
const exceptions = autonode.Exceptions;
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

    describe('When a circular dependency exists', () => {
        it('Should throw a CircularDependencyException', () => {
            let containerBuilder = new ContainerBuilder();

            containerBuilder.register('type1', (c) => c.resolve('type2'));
            containerBuilder.register('type2', (c) => c.resolve('type1'));
            container.load(containerBuilder);

            try {
                container.resolve('type1');
            } catch (e) {
                assert.equal(e instanceof exceptions.CircularDependencyException, true);
                return;
            }
            assert.fail();
        });
    });
});
