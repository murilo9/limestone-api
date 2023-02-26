import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { Card } from '../cards/entities/card.entity';
import { ColumnsService } from '../columns/columns.service';
import { Column } from '../columns/entities/column.entity';
import { DatabaseService } from '../database/database.service';
import { User } from '../users/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    @Inject(ColumnsService) private columnsService: ColumnsService,
  ) {}

  async create(createBoardDto: CreateBoardDto, creator: User) {
    const { title, users, columns } = createBoardDto;
    const newBoard: Omit<Board, '_id' | 'created' | 'updated'> = {
      title,
      admin: new ObjectId(creator.createdBy || creator._id),
      users: users.map((user) => new ObjectId(user)),
      owner: new ObjectId(creator._id),
      archived: false,
      settings: {
        canCommentOnCards: createBoardDto.settings.canCommentOnCards.map(
          (userId) => new ObjectId(userId),
        ),
        canCreateCards: createBoardDto.settings.canCreateCards.map(
          (userId) => new ObjectId(userId),
        ),
      },
    };
    const createdBoard = await this.databaseService.insertOne(
      'boards',
      newBoard,
    );
    for (const [index, column] of columns.entries()) {
      await this.columnsService.create(
        { title: column, index },
        createdBoard._id,
      );
    }
    return createdBoard;
  }

  async getAll(adminId: string, includeArchived?: boolean) {
    const searchFilter: { admin: ObjectId; archived?: boolean } = {
      admin: new ObjectId(adminId),
    };
    if (!includeArchived) {
      searchFilter.archived = false;
    }
    const boards = await this.databaseService.findMany<Board>(
      'boards',
      searchFilter,
    );
    return boards;
  }

  async findOne(id: string) {
    const board = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(id),
    });
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const boardToUpdate = await this.databaseService.findOne<Board>('boards', {
      _id: new ObjectId(id),
    });
    Object.keys(updateBoardDto).forEach((key) => {
      boardToUpdate[key] = updateBoardDto[key];
    });
    // Fill ObjectIDs
    boardToUpdate.owner = new ObjectId(updateBoardDto.owner);
    boardToUpdate.users = updateBoardDto.users.map(
      (user) => new ObjectId(user),
    );
    boardToUpdate.settings.canCommentOnCards =
      updateBoardDto.settings.canCommentOnCards.map(
        (userId) => new ObjectId(userId),
      );
    boardToUpdate.settings.canCreateCards =
      updateBoardDto.settings.canCreateCards.map(
        (userId) => new ObjectId(userId),
      );
    // Save in database
    const updateResult = await this.databaseService.updateOne(
      'boards',
      boardToUpdate,
      {
        _id: new ObjectId(id),
      },
    );
    return updateResult;
  }

  async delete(boardId: string) {
    const boardColumns = await this.databaseService.findMany<Column>(
      'columns',
      {
        boardId: new ObjectId(boardId),
      },
    );
    await this.databaseService.deleteOne('boards', {
      _id: new ObjectId(boardId),
    });
    for (const column of boardColumns) {
      const columnId = column._id.toString();
      await this.columnsService.delete(columnId);
    }
    return 'Board deleted successfully';
  }
}
