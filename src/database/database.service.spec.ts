import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { MongoClient, Db } from 'mongodb';

describe('BoardsService', () => {
  let service: DatabaseService;
  let mongoClient: MongoClient;

  beforeEach(async () => {
    mongoClient = new MongoClient(
      'mongodb://limestone:123@localhost:27017/limestone-dev',
    );
    await mongoClient.connect();
    const databaseServiceMock = new DatabaseService(mongoClient);
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: DatabaseService, useValue: databaseServiceMock }],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(async () => {
    await mongoClient.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
