import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { GoogleSignDto } from './dto/google-sign-dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignInGuard } from './signin.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/google-sign')
  googleSign(@Body(new ValidationPipe(GoogleSignDto)) body: GoogleSignDto) {
    return this.authService.googleSign(body.googleAccessToken);
  }

  @UseGuards(SignInGuard)
  @Post('/signin')
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
