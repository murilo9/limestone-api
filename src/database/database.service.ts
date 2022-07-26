import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Db,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb';

@Injectable()
export class DatabaseService {
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor(@Inject(MongoClient) client: MongoClient) {
    this.client = client;
    this.db = client.db();
  }

  private async connect() {
    await this.client.connect();
  }

  async findOne<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T> | null> {
    const collection = this.db.collection<T>(collectionName);
    const query = await collection.findOne(filter);
    return query;
  }

  async findMany<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T>[]> {
    const collection = this.db.collection<T>(collectionName);
    const query = await collection.find(filter);
    return query.toArray();
  }

  async insertOne<T>(
    collectionName: string,
    entity: T,
  ): Promise<T & { _id: string }> {
    const collection = this.db.collection<T>(collectionName);
    const query = await collection.insertOne(
      entity as OptionalUnlessRequiredId<T>,
    );
    const entityInserted = {
      ...entity,
      _id: query.insertedId.toString(),
    };
    return entityInserted;
  }

  async updateOne<T>(
    collectionName: string,
    entity: T,
    filter: Filter<T>,
  ): Promise<WithId<T>> {
    const collection = this.db.collection<T>(collectionName);
    const query = await collection.findOneAndUpdate(filter, entity);
    return query.value;
  }

  async updateMany<T>(
    collectionName: string,
    entity: T,
    filter: Filter<T>,
  ): Promise<WithId<T>[]> {
    const collection = this.db.collection<T>(collectionName);
    await collection.updateMany(filter, entity);
    const updatedEntities = await collection.find(filter).toArray();
    return updatedEntities;
  }

  async deleteOne(
    collectionName: string,
    filter: { [key: string]: any },
  ): Promise<number> {
    const collection = this.db.collection(collectionName);
    const query = await collection.deleteOne(filter);
    return query.deletedCount;
  }

  async deleteMany(
    collectionName: string,
    filter: { [key: string]: any },
  ): Promise<number> {
    const collection = this.db.collection(collectionName);
    const query = await collection.deleteMany(filter);
    return query.deletedCount;
  }
}