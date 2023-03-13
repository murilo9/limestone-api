import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IdentityGuard } from '../auth/identity.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoardGuard } from './guards/board.guard';
import { ColumnGuard } from './guards/column.guard';
import { CreateCardGuard } from './guards/create-card.guard';
import { UpdateCardGuard } from './guards/update-card.guard';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(IdentityGuard, BoardGuard, CreateCardGuard)
  @Post('boards/:boardId/columns/:columnId/cards')
  create(
    @Body(new ValidationPipe(CreateCardDto)) createCardDto: CreateCardDto,
    @Param('columnId') columnId: string,
  ) {
    return this.cardsService.create(createCardDto, columnId);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard)
  @Get('boards/:boardId/columns/:columnId/cards')
  findByColumn(@Param('columnId') columnId: string) {
    return this.cardsService.getByColumn(columnId);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard, UpdateCardGuard)
  @Put('boards/:boardId/columns/:columnId/cards/:cardId')
  update(
    @Param('cardId') cardId: string,
    @Body(new ValidationPipe(UpdateCardDto)) updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(cardId, updateCardDto);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard, UpdateCardGuard)
  @Delete('boards/:boardId/columns/:columnId/cards/:cardId')
  delete(@Param('cardId') cardId: string) {
    return this.cardsService.delete(cardId);
  }
}
