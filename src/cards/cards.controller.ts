import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { IdentityGuard } from '../auth/identity.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoardGuard } from './guards/board.guard';
import { ColumnGuard } from './guards/column.guard';
import { CreateCardGuard } from './guards/create-card.guard';
import { UpdateCardGuard } from './guards/update-card.guard';

@Controller('boards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard, CreateCardGuard)
  @Post(':boardId/columns/:columnId/cards')
  create(
    @Body(new ValidationPipe()) createCardDto: CreateCardDto,
    @Param('columnId') columnId: string,
  ) {
    return this.cardsService.create(createCardDto, columnId);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard)
  @Get(':boardId/columns/:columnId/cards')
  findByColumn(@Param('columnId') columnId: string) {
    return this.cardsService.getByColumn(columnId);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard)
  @Get(':boardId/columns/:columnId/cards/:cardId')
  findById(@Param('cardId') cardId: string) {
    return this.cardsService.get(cardId);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard, UpdateCardGuard)
  @Put(':boardId/columns/:columnId/cards/:cardId')
  update(
    @Param('cardId') cardId: string,
    @Body(new ValidationPipe()) updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(cardId, updateCardDto);
  }

  @UseGuards(IdentityGuard, BoardGuard, ColumnGuard, UpdateCardGuard)
  @Delete(':boardId/columns/:columnId/cards/:cardId')
  delete(@Param('cardId') cardId: string) {
    return this.cardsService.delete(cardId);
  }
}
