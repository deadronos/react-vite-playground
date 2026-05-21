/*

4. ECS Playground (very useful for game architecture)

Make:

Entity
Component
System

Components:

Position
Velocity
Health

System:

MovementSystem

Render moving squares.

React only displays state:

entities.map(...)

Simulation runs separately.

This teaches decoupling UI from game logic.


*/

import React from 'react';

interface Entity {
  id: number;
  components: Record<string, Component>;
}

interface Component {
  name: string;
}

interface PositionComponent extends Component {
  x: number;
  y: number;
}

interface VelocityComponent extends Component {
  vx: number;
  vy: number;
}

interface HealthComponent extends Component {
  hp: number;
}

interface ECSWorld {
  entities: Record<number, Entity>;
  addEntity(components: Component[]): Entity;
  removeEntity(entityId: number): void;
  addComponentToEntity(entityId: number, component: Component): void;
  removeComponentFromEntity(entityId: number, componentName: string): void;
  getEntitiesWithComponents(componentNames: string[]): Entity[];
}

class SimpleECSWorld implements ECSWorld {
  entities: Record<number, Entity> = {};
  private nextId = 1;

  addEntity(components: Component[]): Entity {
    const entity: Entity = { id: this.nextId++, components: {} };
    components.forEach(component => {
      entity.components[component.name] = component;
    });
    this.entities[entity.id] = entity;
    return entity;
  }

  removeEntity(entityId: number): void {
    delete this.entities[entityId];
  }

  addComponentToEntity(entityId: number, component: Component): void {
    const entity = this.entities[entityId];
    if (entity) {
      entity.components[component.name] = component;
    }
  }

  removeComponentFromEntity(entityId: number, componentName: string): void {
    const entity = this.entities[entityId];
    if (entity) {
      delete entity.components[componentName];
    }
  }

  getEntitiesWithComponents(componentNames: string[]): Entity[] {
    return Object.values(this.entities).filter(entity =>
      componentNames.every(name => name in entity.components)
    );
  }
}

interface MovementSystem {
  update(world: ECSWorld, deltaTime: number): void;
}

type MovementSystemImpl = {
  update(world: ECSWorld, deltaTime: number): void;
};

class SimpleMovementSystem implements MovementSystemImpl {
  update(world: ECSWorld, deltaTime: number): void {
    const entities = world.getEntitiesWithComponents(['Position', 'Velocity']);
    entities.forEach(entity => {
      const position = entity.components['Position'] as PositionComponent;
      const velocity = entity.components['Velocity'] as VelocityComponent;
      position.x += velocity.vx * deltaTime;
      position.y += velocity.vy * deltaTime;
    });
  }
}

interface RenderSystem {
  render(world: ECSWorld): React.ReactElement;
}

type RenderSystemImpl = {
  render(world: ECSWorld): React.ReactElement;
};

class SimpleRenderSystem implements RenderSystemImpl {
  render(world: ECSWorld): React.ReactElement {
    const entities = world.getEntitiesWithComponents(['Position']);
    return (
      <div>
        {entities.map(entity => {
          const position = entity.components.Position as PositionComponent;
          return (
            <div
              key={entity.id}
              style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: 20,
                height: 20,
                backgroundColor: 'blue',
              }}
            />
          );
        })}
      </div>
    );
  }
}

export function ChatGPTChallenge2():React.ReactElement {
  const ECSWorldInstance = React.useMemo(() => new SimpleECSWorld(), []);

  const movementSystem = React.useMemo(() => new SimpleMovementSystem(), []);
  const renderSystem = React.useMemo(() => new SimpleRenderSystem(), []);
  const [tick, setTick] = React.useState(0); // State to trigger re-render

  React.useEffect(() => {
    // Create some entities with Position and Velocity components
    const entity1 = ECSWorldInstance.addEntity([
      { name: 'Position', x: 50, y: 50 } as PositionComponent,
      { name: 'Velocity', vx: 1, vy: 0 } as VelocityComponent,
    ]);

    const entity2 = ECSWorldInstance.addEntity([
      { name: 'Position', x: 100, y: 100 } as PositionComponent,
      { name: 'Velocity', vx: 0, vy: 1 } as VelocityComponent,
    ]);

    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;

      movementSystem.update(ECSWorldInstance, deltaTime);
      setTick(tick => tick + 1); // Trigger re-render
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    return () => {
      // Cleanup if needed
    };
  }, [ECSWorldInstance, movementSystem]);


  return (
    <div>
      <h1>ECS Playground</h1>
      <p>moving squares...</p>
      {renderSystem.render(ECSWorldInstance)}
    </div>
  );
}
