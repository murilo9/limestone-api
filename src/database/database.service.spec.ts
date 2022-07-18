import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { DatabaseServiceMock } from './database.service.mock';

describe('BoardsService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const databaseServiceMock = new DatabaseServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: DatabaseService, useValue: databaseServiceMock }],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have findOne method working', () => {
    const findOne = jest.spyOn(service, 'findOne');
    const filter = { foo: 'bar' };
    service.findOne('foos', filter);
    expect(findOne).toHaveBeenCalledWith('foos', filter);
  });

  it('should have findMany method working', () => {
    const findOne = jest.spyOn(service, 'findOne');
    const filter = { bar: 'baz' };
    service.findOne('bars', filter);
    expect(findOne).toHaveBeenCalledWith('bars', filter);
  });
});
