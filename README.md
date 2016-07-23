# Autonode

Dependency injection for NodeJS inspired by Autofac (C# DI library)

## Defining Dependencies

### Simple class registration
````Javascript
containerBuilder.register('userRepository', () => new UserRepository(), autonode.LifetimeScope.InstancePerRequest);
````

### Instance referencing another registration
````Javascript
containerBuilder.register('lineItemRepository', () => new LineItemRepository(), autonode.LifetimeScope.InstancePerRequest);
containerBuilder.register('tripRepository', (c) => new TripRepository(c.resolve('lineItemRepository'), autonode.LifetimeScope.InstancePerRequest);
````

### Automatic constructor injection
````Javascript
containerBuilder.register('lineItemRepository', LineItemRepository, autonode.LifetimeScope.InstancePerRequest);
conatienrBuilder.register('tripRepository', TripRepository, autonode.LifetimeScope.InstancePerRequest);

class TripRepository {
  constructor(lineItemRepository) { // parameter name must match registration key
    this.lineItemRepository = lineItemRepository;
  }
}

class LineItemRepository {
  constructor() { }
}
````

### Access request from anywhere without passing it to every function
````Javascript
containerBuilder.register('request', () => req);
containerBuilder.register('requestAwareTripRepository', (c) => new TripRepository(c.resolve('request')));
````
