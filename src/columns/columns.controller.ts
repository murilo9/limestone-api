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
import { BoardGuard } from '../cards/guards/board.guard';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @UseGuards(IdentityGuard, BoardGuard)
  @Post('boards/:boardId/columns')
  create(
    @Body(new ValidationPipe()) createColumnDto: CreateColumnDto,
    @Param('boardId') boardId: string,
  ) {
    return this.columnsService.create(createColumnDto, boardId);
  }

  @UseGuards(IdentityGuard, BoardGuard)
  @Get('boards/:boardId/columns')
  findByBoard(@Param('columnId') columnId: string) {
    return this.columnsService.getByBoard(columnId);
  }

  @UseGuards(IdentityGuard, BoardGuard)
  @Put('boards/:boardId/columns/:columnId')
  update(
    @Param('columnId') columnId: string,
    @Body(new ValidationPipe()) updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnsService.update(columnId, updateColumnDto);
  }

  @UseGuards(IdentityGuard, BoardGuard)
  @Delete('boards/:boardId/columns/:columnId')
  delete(@Param('columnId') columnId: string) {
    return this.columnsService.delete(columnId);
  }
}
