import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Filter, ObjectId, WithId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseServiceMock {
  private insertId: ObjectId | undefined;
  private createDate: Date | undefined;
  private updateDate: Date | undefined;

  constructor(insertId?: ObjectId, createDate?: Date, updateDate?: Date) {
    this.insertId = insertId;
    this.createDate = createDate;
    this.updateDate = updateDate;
  }

  async findOne<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T> | null> {
    return {} as WithId<T>;
  }

  async findMany<T>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<WithId<T>[]> {
    return [{}] as WithId<T>[];
  }

  async insertOne<T>(
    collectionName: string,
    entity: T,
  ): Promise<T & { _id: ObjectId }> {
    const entityInserted = {
      ...entity,
      _id: this.insertId,
      created: this.createDate,
      updated: this.updateDate,
    };
    return entityInserted;
  }

  async updateOne<T>(
    collectionName: string,
    entity: T,
    filter: Filter<T>,
  ): Promise<T & { _id: ObjectId }> {
    const entityUpdated = {
      ...entity,
      _id: this.insertId,
      created: this.createDate,
      updated: this.updateDate,
    };
    return entityUpdated;
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
