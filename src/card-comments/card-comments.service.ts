import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { CreateCardCommentDto } from './dto/create-card-comment.dto';
import { UpdateCardCommentDto } from './dto/update-card-comment.dto';
import { CardComment } from './entities/card-comment.entity';

@Injectable()
export class CardCommentsService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  async create(
    createCardCommentDto: CreateCardCommentDto,
    cardId: string,
    author: string,
  ) {
    const { body } = createCardCommentDto;
    const cardComment = {
      author: new ObjectId(author),
      cardId: new ObjectId(cardId),
      body,
    };
    const newCardComment = await this.databaseService.insertOne(
      'cardComments',
      cardComment,
    );
    return newCardComment;
  }

  async update(
    updateCardCommentDto: UpdateCardCommentDto,
    cardCommentId: string,
  ) {
    const { body } = updateCardCommentDto;
    const cardComment = await this.databaseService.findOne<CardComment>(
      'cardComments',
      { _id: new ObjectId(cardCommentId) },
    );
    cardComment.body = body;
    const updatedCardComment = await this.databaseService.updateOne(
      'cardComments',
      cardComment,
      { _id: new ObjectId(cardCommentId) },
    );
    return updatedCardComment;
  }

  async getByCard(cardId: string) {
    const cardComments = await this.databaseService.findMany<CardComment>(
      'cardComments',
      { cardId: new ObjectId(cardId) },
    );
    return cardComments;
  }

  async delete(cardId: string) {
    await this.databaseService.deleteMany('cardComments', {
      _id: new ObjectId(cardId),
    });
    return 'Comment deleted successfully';
  }
}
