import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  async create(createBoardDto: CreateBoardDto, creator: User) {
    const { title, users, columns } = createBoardDto;
    const newBoard: Omit<Board, '_id' | 'created' | 'updated'> = {
      title,
      admin: new ObjectId(creator.createdBy || creator._id),
      users: users.map((user) => new ObjectId(user)),
      owner: new ObjectId(creator._id),
      columns: columns.map((columnTitle) => ({
        title: columnTitle,
        cardCount: 0,
        _id: new ObjectId(),
      })),
      archived: false,
    };
    const createdBoard = await this.databaseService.insertOne(
      'boards',
      newBoard,
    );
    return createdBoard;
  }

  async getAll(adminId: string, includeArchived?: boolean) {
    const searchFilter: { admin: ObjectId; archived?: boolean } = {
      admin: new ObjectId(adminId),
    };
    if (!includeArchived) {
      searchFilter.archived = false;
    }
    const boards = await this.databaseService.findMany('boards', searchFilter);
    return boards;
  }

  async findOne(id: string) {
    const board = await this.databaseService.findMany('boards', {
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

  async delete(id: string) {
    await this.databaseService.deleteOne('boards', { _id: new ObjectId(id) });
    return 'Board deleted successfully';
  }
}
