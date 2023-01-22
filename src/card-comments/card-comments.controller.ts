import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IdentityGuard } from '../auth/identity.guard';
import { BoardGuard } from '../cards/guards/board.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from '../users/entities/user.entity';
import { CardCommentsService } from './card-comments.service';
import { CreateCardCommentDto } from './dto/create-card-comment.dto';
import { UpdateCardCommentDto } from './dto/update-card-comment.dto';
import { CardCommentGuard } from './guards/card-comment.guard';
import { CardExistsGuard } from './guards/card-exists.guard';
import { CreateCardCommentGuard } from './guards/create-card-comment.guard';

@Controller('boards')
export class CardCommentsController {
  constructor(private readonly cardCommentsService: CardCommentsService) {}

  @UseGuards(IdentityGuard, BoardGuard, CardExistsGuard, CreateCardCommentGuard)
  @Post('/:boardId/cards/:cardId/comments')
  create(
    @Body(new ValidationPipe()) createCardCommentDto: CreateCardCommentDto,
    @Param('cardId') cardId: string,
    @Req() request: { user: User },
  ) {
    return this.cardCommentsService.create(
      createCardCommentDto,
      cardId,
      request.user._id.toString(),
    );
  }

  @UseGuards(IdentityGuard, BoardGuard, BoardGuard, CardExistsGuard)
  @Get('/:boardId/cards/:cardId/comments')
  findByCard(@Param('cardId') cardId: string) {
    return this.cardCommentsService.getByCard(cardId);
  }

  @UseGuards(IdentityGuard, BoardGuard, BoardGuard, CardExistsGuard)
  @Get('/:boardId/cards/:cardId/comments-count')
  getCommentsCount(@Param('cardId') cardId: string) {
    return this.cardCommentsService.getCommentsCount(cardId);
  }

  @UseGuards(IdentityGuard, BoardGuard, CardExistsGuard, CardCommentGuard)
  @Put('/:boardId/cards/:cardId/comments/:cardCommentId')
  update(
    @Body(new ValidationPipe()) updateCardCommentDto: UpdateCardCommentDto,
    @Param('cardCommentId') cardCommentId: string,
  ) {
    return this.cardCommentsService.update(updateCardCommentDto, cardCommentId);
  }

  @UseGuards(IdentityGuard, BoardGuard, CardExistsGuard, CardCommentGuard)
  @Delete('/:boardId/cards/:cardId/comments/:cardCommentId')
  delete(@Param('cardCommentId') cardCommentId: string) {
    return this.cardCommentsService.delete(cardCommentId);
  }
}
