import { ObjectId } from 'mongodb';

export interface Engine {
  power: number;
  volume: number;
  transmission: string;
  fuel: string;
}

export interface StockItem {
  _id: ObjectId;
  mark: string;
  model: string;
  engine: Engine;
  drive: string;
  equipmentName: string;
  price: number;
  createdAt: Date;
}
