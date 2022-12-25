import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { DatabaseServiceMock } from '../database/database.service.mock';
import { CardsService } from './cards.service';

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(async () => {
    const databaseServiceMock = new DatabaseServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        ConfigService,
        { provide: DatabaseService, useValue: databaseServiceMock },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  describe('method: create', () => {
    it('should return the created card');
    it('should insert the created card in the database');
  });
  describe('method: update', () => {
    it('should return the updated card');
    it('should update the card in the database');
  });
  describe('method: get', () => {
    it('should return the card when it exists');
    it('should return null when the card does not exist');
    it('should search for the card in the database');
  });
  describe('method: getByColumn', () => {
    it('should return an array of cards when cards exist');
    it('should return an empty array when no cards exist with column id');
    it('should return an empty array when column does not exist');
  });
  describe('method: delete', () => {
    it('should return a scuccess message');
    it('should delete the card in the database');
  });
});
