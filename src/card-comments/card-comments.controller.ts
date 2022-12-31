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
import { CardGuard } from './guards/card-comment.guard';

@Controller('boards')
export class CardCommentsController {
  constructor(private readonly cardCommentsService: CardCommentsService) {}

  @UseGuards(IdentityGuard, BoardGuard, CardGuard)
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

  @UseGuards(IdentityGuard, BoardGuard, BoardGuard, CardGuard)
  @Get('/:boardId/cards/:cardId/comments')
  findByCard(@Param('cardId') cardId: string) {
    return this.cardCommentsService.getByCard(cardId);
  }

  @UseGuards(IdentityGuard, BoardGuard, CardGuard)
  @Put('/:boardId/cards/:cardId/comments/:cardCommentId')
  update(
    @Body(new ValidationPipe()) updateCardCommentDto: UpdateCardCommentDto,
    @Param('cardCommentId') cardCommentId: string,
  ) {
    return this.cardCommentsService.update(updateCardCommentDto, cardCommentId);
  }

  @UseGuards(IdentityGuard, BoardGuard, CardGuard)
  @Delete('/:boardId/cards/:cardId/comments/:cardCommentId')
  delete(@Param('cardCommentId') cardCommentId: string) {
    return this.cardCommentsService.delete(cardCommentId);
  }
}
