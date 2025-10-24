import { World } from 'miniplex';
import { type Entity } from './types';



export const MyWorld = new World<Entity>();

export function create(entity: Partial<Entity> = {}): Entity {

  return MyWorld().add{entity}
}



export type MyWorldType = typeof MyWorld;
export default MyWorld;

