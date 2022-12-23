import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { Board } from 'src/boards/entities/board.entity';
import { DatabaseService } from 'src/database/database.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  async create(createCardDto: CreateCardDto, columnId: string) {
    const { title, assignee, priority } = createCardDto;
    const newCard: Omit<Card, '_id' | 'created' | 'updated'> = {
      title,
      assignee: new ObjectId(assignee),
      priority,
      columnId: new ObjectId(columnId),
    };
    const createdCard = await this.databaseService.insertOne('cards', newCard);
    return createdCard;
  }

  async update(cardId: string, updateCardDto: UpdateCardDto) {
    const cardToUpdate = await this.databaseService.findOne('cards', {
      _id: new ObjectId(cardId),
    });
    Object.keys(updateCardDto).forEach((key) => {
      cardToUpdate[key] = updateCardDto[key];
    });
    const updateResult = await this.databaseService.updateOne(
      'cards',
      cardToUpdate,
      { _id: new ObjectId(cardId) },
    );
    return updateResult;
  }

  async get(cardId: string) {
    const card = await this.databaseService.findOne('cards', {
      _id: new ObjectId(cardId),
    });
    return card;
  }

  async getByColumn(columnId: string) {
    const cards = await this.databaseService.findMany('cards', {
      columnId: new ObjectId(columnId),
    });
    return cards;
  }

  // async getByBoard(boardId: string) {
  //   const board = await this.databaseService.findOne<Board>('boards', {
  //     _id: new ObjectId(boardId),
  //   });
  //   if (board) {
  //     board.columns.forEach((column) => {
  //       const columnCards = this.databaseService.findMany<Card>('cards', )
  //     });
  //   }
  // }

  async delete(cardId: string) {
    await this.databaseService.deleteOne('cards', {
      _id: new ObjectId(cardId),
    });
    return `Card deleted successfully`;
  }
}
