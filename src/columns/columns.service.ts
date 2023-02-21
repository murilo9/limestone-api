import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CardsService } from '../cards/cards.service';
import { Card } from '../cards/entities/card.entity';
import { DatabaseService } from '../database/database.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    @Inject(CardsService) private cardsService: CardsService,
  ) {}

  async create(createColumnDto: CreateColumnDto, boardId: string) {
    const { title, index } = createColumnDto;
    const newColumn: Omit<Column, '_id' | 'created' | 'updated'> = {
      title,
      index,
      boardId: new ObjectId(boardId),
    };
    const createdColumn = await this.databaseService.insertOne(
      'columns',
      newColumn,
    );
    return createdColumn;
  }

  async update(columnId: string, updateColumnDto: UpdateColumnDto) {
    const columnToUpdate = await this.databaseService.findOne<Column>(
      'columns',
      {
        _id: new ObjectId(columnId),
      },
    );
    Object.keys(updateColumnDto).forEach((key) => {
      columnToUpdate[key] = updateColumnDto[key];
    });
    // Update in database
    const updateResult = await this.databaseService.updateOne(
      'columns',
      columnToUpdate,
      { _id: new ObjectId(columnId) },
    );
    return updateResult;
  }

  async get(columnId: string) {
    const column = await this.databaseService.findOne('columns', {
      _id: new ObjectId(columnId),
    });
    return column;
  }

  async getByBoard(boardId: string) {
    const columns = await this.databaseService.findMany('columns', {
      boardId: new ObjectId(boardId),
    });
    return columns;
  }

  async delete(columnId: string) {
    const columnCards = await this.databaseService.findMany<Card>('cards', {
      columnId: new ObjectId(columnId),
    });
    await this.databaseService.deleteOne('columns', {
      _id: new ObjectId(columnId),
    });
    for (const card of columnCards) {
      const cardId = card._id.toString();
      await this.cardsService.delete(cardId);
    }
    return `Column deleted successfully`;
  }
}
