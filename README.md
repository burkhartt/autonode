# Autonode

Dependency injection for NodeJS inspired by Autofac (C# DI library)

## Getting Started

Installation
````Javascript
npm install auto-node
````

Setup
````Javascript
let autonode = require('auto-node');

let app = express();
app.use(autonode.Middleware);

app.use((req, res, next) => {
  let containerBuilder = new autonode.ContainerBuilder();
  containerBuilder.registerType('UserRepository', UserRepository, autonode.LifetimeScope.InstancePerRequest);
  autonode.Container.load(containerBuilder);
}
````

## API

Registration

````Javascript
containerBuilder.register(key, instanceFunction, lifetimeScope);
containerBuilder.registerType(key, classType, lifetimeScope);
````

Lifetime Scopes
````
autonode.LifetimeScope.InstancePerRequest
autonode.LifetimeScope.SingleInstance
autonode.LifetimeScope.None
````

## Example Usage

### Basic Usage
````Javascript
let container = autonode.Container;

let containerBuilder = new ContainerBuilder();
containerBuilder.register('logger', () => new Logger(), autonode.LifetimeScope.InstancePerRequest);
containerBuilder.register('userRepository', () => new UserRepository(), autonode.LifetimeScope.InstancePerRequest);
container.load(containerBuilder);
````

````Javascript
let container = require('./lib/container');

class UserRepository {
  constructor() {
    this.logger = container.resolve('logger');
  }
}
````

### Instance referencing another registration
````Javascript
containerBuilder.register('lineItemRepository', () => new LineItemRepository(), autonode.LifetimeScope.InstancePerRequest);
containerBuilder.register('tripRepository', (c) => new TripRepository(c.resolve('lineItemRepository'), autonode.LifetimeScope.InstancePerRequest);
````

### Automatic constructor injection
````Javascript
containerBuilder.registerType('lineItemRepository', LineItemRepository, autonode.LifetimeScope.InstancePerRequest);
conatienrBuilder.registerType('tripRepository', TripRepository, autonode.LifetimeScope.InstancePerRequest);

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
