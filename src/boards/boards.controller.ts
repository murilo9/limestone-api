import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IdentityGuard } from '../auth/identity.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from '../users/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DeleteBoardGuard } from './guards/delete-board.guard';
import { UpdateBoardGuard } from './guards/update-board.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(IdentityGuard)
  @Post()
  create(
    @Body(new ValidationPipe(CreateBoardDto)) createBoardDto: CreateBoardDto,
    @Req() request: { user: User },
  ) {
    const { user } = request;
    return this.boardsService.create(createBoardDto, user);
  }

  @UseGuards(IdentityGuard)
  @Get()
  findAll(
    @Req() request: { user: User },
    @Query() query: { includeArchived?: string },
  ) {
    const { user } = request;
    const adminId = user.createdBy || user._id;
    return this.boardsService.getAll(
      adminId.toString(),
      Boolean(query.includeArchived),
    );
  }

  @UseGuards(IdentityGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @UseGuards(IdentityGuard, UpdateBoardGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe(UpdateBoardDto)) updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @UseGuards(IdentityGuard, DeleteBoardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.delete(id);
  }
}
