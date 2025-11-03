import {World} from 'miniplex'
import * as ECS from 'miniplex-react'


export type Entity = {
  id: number;
  isBuilding: boolean;
  isDrone: boolean;
  MessageLog?: Message[]|null;
  MessagePending?: Message[]|null;
}

export type Message = {
  text: string;
  createdAt?:number;
  fromEntityId?: number;
  toEntityId?: number;
}

const world= new World<Entity>();

export type ECSWorldType = typeof world;

