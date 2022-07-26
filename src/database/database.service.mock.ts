import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Filter, WithId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseServiceMock {
  async findOne<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T> | null> {
    return null;
  }

  async findMany<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T>[]> {
    return [];
  }

  async insertOne<T>(
    collectionName: string,
    entity: T,
  ): Promise<T & { _id: string }> {
    const entityInserted = {
      ...entity,
      _id: uuidv4(),
    };
    return entityInserted;
  }

  async updateOne<T>(
    collectionName: string,
    entity: T,
    filter: Filter<T>,
  ): Promise<WithId<T>> {
    const entityUpdated = {
      ...entity,
      _id: uuidv4(),
    };
    return entityUpdated as unknown as WithId<T>;
  }

  async updateMany<T>(
    collectionName: string,
    entity: T,
    filter: Filter<T>,
  ): Promise<WithId<T>[]> {
    const updatedEntities = [];
    return updatedEntities;
  }

  async deleteOne(
    collectionName: string,
    filter: { [key: string]: any },
  ): Promise<number> {
    return 1;
  }

  async deleteMany(
    collectionName: string,
    filter: { [key: string]: any },
  ): Promise<number> {
    return 1;
  }
}
