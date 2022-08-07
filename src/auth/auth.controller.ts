import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignInGuard } from './signin.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SignInGuard)
  @Post('/signin')
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
