import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { adminUser } from '../mocks/admin-user.mock';
import { memberUser } from '../mocks/member-user.mock';
import { User } from '../users/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardColumn } from '../columns/entities/column.entity';
import { Board } from './entities/board.entity';

describe('BoardsService', () => {
  let boardsService: BoardsService;
  let databaseService: DatabaseService;
  const insertId = new ObjectId(0);
  const createDate = new Date();
  const updateDate = new Date();

  beforeEach(async () => {
    const databaseServiceMock = new DatabaseServiceMock(
      insertId,
      createDate,
      updateDate,
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        ConfigService,
        { provide: DatabaseService, useValue: databaseServiceMock },
      ],
    }).compile();

    boardsService = module.get<BoardsService>(BoardsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('method: create', () => {
    it('should return the created board', async () => {
      // Arrange
      const createBoardDto: CreateBoardDto = {
        title: 'Board',
        users: [],
        columns: [],
      };
      const expectedResult: Board = {
        title: 'Board',
        admin: adminUser._id,
        owner: adminUser._id,
        columns: [],
        users: [],
        archived: false,
        _id: insertId,
        created: createDate,
        updated: updateDate,
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      // Act
      const result = await boardsService.create(createBoardDto, adminUser);
      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('should insert the new board without columns in the database', async () => {
      // Arrange
      const createBoardDto: CreateBoardDto = {
        title: 'Board',
        users: [memberUser._id.toString()],
        columns: [],
      };
      const newBoard: Omit<Board, '_id' | 'created' | 'updated'> = {
        title: createBoardDto.title,
        admin: adminUser._id,
        users: [memberUser._id],
        owner: adminUser._id,
        columns: [] as BoardColumn[],
        archived: false,
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      // Act
      const insertOne = jest.spyOn(databaseService, 'insertOne');
      await boardsService.create(createBoardDto, adminUser);
      // Assert
      expect(insertOne).toBeCalledWith('boards', newBoard);
    });

    it('should create board columns if any', async () => {
      // Arrange
      const createBoardDto: CreateBoardDto = {
        title: 'Board',
        users: [memberUser._id.toString()],
        columns: ['To-do', 'In progress', 'Done'],
      };
      // Act
      const createdBoard = await boardsService.create(
        createBoardDto,
        adminUser,
      );
      // Assert
      expect(createdBoard.columns).toHaveLength(createBoardDto.columns.length);
    });
  });

  describe('method: getAll', () => {
    it('should search for the boards in the database', async () => {
      // Arrange
      const findMany = jest.spyOn(databaseService, 'findMany');
      const searchFilter = { admin: adminUser._id, archived: false };
      // Act
      await boardsService.getAll(adminUser._id.toString());
      // Assert
      expect(findMany).toBeCalledWith('boards', searchFilter);
    });
  });

  describe('method: findOne', () => {
    it('should search for the boards in the database', async () => {
      // Arrange
      const findOne = jest.spyOn(databaseService, 'findOne');
      const boardId = new ObjectId(0);
      const searchFilter = { _id: boardId };
      // Act
      await boardsService.findOne(boardId.toString());
      // Assert
      expect(findOne).toBeCalledWith('boards', searchFilter);
    });
  });

  describe('method: update', () => {
    it('should return the updated board', async () => {
      // Arrange
      const boardId = insertId;
      const updateBoardDto: UpdateBoardDto = {
        title: 'Board',
        owner: memberUser._id.toString(),
        users: [memberUser._id.toString()],
        archived: false,
        columns: [
          { _id: insertId.toString(), title: 'To-do' },
          { _id: insertId.toString(), title: 'In progress' },
          { _id: insertId.toString(), title: 'Done' },
        ],
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      const updatedBoard: Board = {
        _id: boardId,
        created: createDate,
        updated: updateDate,
        title: 'Board',
        admin: adminUser._id,
        owner: memberUser._id,
        users: [memberUser._id],
        archived: false,
        columns: [
          { _id: insertId, title: 'To-do', cardCount: 0 },
          { _id: insertId, title: 'In progress', cardCount: 0 },
          { _id: insertId, title: 'Done', cardCount: 0 },
        ],
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      jest.spyOn(databaseService, 'findOne').mockImplementation(async () => ({
        _id: insertId,
        admin: adminUser._id,
      }));
      jest
        .spyOn(databaseService, 'findMany')
        .mockImplementation(async () => []);
      // Act
      const result = await boardsService.update(
        boardId.toString(),
        updateBoardDto,
      );
      console.log('result', result);
      // Assert
      expect(result).toStrictEqual(updatedBoard);
    });

    it('should update the board in the database', async () => {
      // Arrange
      const boardId = insertId;
      const updateBoardDto: UpdateBoardDto = {
        title: 'Board',
        owner: memberUser._id.toString(),
        users: [memberUser._id.toString()],
        archived: false,
        columns: [
          { _id: insertId.toString(), title: 'To-do' },
          { _id: insertId.toString(), title: 'In progress' },
          { _id: insertId.toString(), title: 'Done' },
        ],
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      const boardUpdatePayload = {
        title: 'Board',
        owner: memberUser._id,
        users: [memberUser._id],
        archived: false,
        columns: [
          { _id: insertId, title: 'To-do', cardCount: 0 },
          { _id: insertId, title: 'In progress', cardCount: 0 },
          { _id: insertId, title: 'Done', cardCount: 0 },
        ],
        settings: {
          canCommentOnCards: [],
          canCreateCards: [],
        },
      };
      const searchFilter = {
        _id: boardId,
      };
      const updateOne = jest.spyOn(databaseService, 'updateOne');
      jest
        .spyOn(databaseService, 'findMany')
        .mockImplementation(async () => []);
      // Act
      await boardsService.update(boardId.toString(), updateBoardDto);
      // Assert
      expect(updateOne).toBeCalledWith(
        'boards',
        boardUpdatePayload,
        searchFilter,
      );
    });
  });

  describe('method: delete', () => {
    it('should return a successfull message', async () => {
      // Arrange
      const boardId = new ObjectId();
      const expectedResult = 'Board deleted successfully';
      // Act
      const result = await boardsService.delete(boardId.toString());
      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should delete the board in the database', async () => {
      // Arrange
      const boardId = new ObjectId();
      const searchFilter = { _id: boardId };
      // Act
      const deleteOne = jest.spyOn(databaseService, 'deleteOne');
      await boardsService.delete(boardId.toString());
      // Assert
      expect(deleteOne).toBeCalledWith('boards', searchFilter);
    });
  });
});
