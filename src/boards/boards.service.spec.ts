import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { BoardsService } from './boards.service';

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const databaseServiceMock = new DatabaseServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        ConfigService,
        { provide: DatabaseService, useValue: databaseServiceMock },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  describe('method: create', () => {
    it('should return the expected result');
    it('should insert the new board in the database');
  });

  describe('method: getAll', () => {
    it('should return all boards, if any board exist');
    it('should return an empty array, if no boards exist');
    it('hould search for the boards in the database');
  });
  describe('method: findOne', () => {
    it('should return the board when it exists');
    it('should return null when the board does not exist');
    it('should search for the boar in the database');
  });
  describe('method: update', () => {
    it('should return the updated board');
    it('should update the board in the database');
  });
  describe('method: delete', () => {
    it('should return a successfull message');
    it('should delete the board in the database');
  });
});
