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
    it('should return the created card', () => {
      /* todo */
    });
    it('should insert the created card in the database', () => {
      /* todo */
    });
  });
  describe('method: update', () => {
    it('should return the updated card', () => {
      /* todo */
    });
    it('should update the card in the database', () => {
      /* todo */
    });
  });
  describe('method: get', () => {
    it('should return the card when it exists', () => {
      /* todo */
    });
    it('should return null when the card does not exist', () => {
      /* todo */
    });
    it('should search for the card in the database', () => {
      /* todo */
    });
  });
  describe('method: getByColumn', () => {
    it('should return an array of cards when cards exist', () => {
      /* todo */
    });
    it('should return an empty array when no cards exist with column id', () => {
      /* todo */
    });
    it('should return an empty array when column does not exist', () => {
      /* todo */
    });
  });
  describe('method: delete', () => {
    it('should return a scuccess message', () => {
      /* todo */
    });
    it('should delete the card in the database', () => {
      /* todo */
    });
  });
});
