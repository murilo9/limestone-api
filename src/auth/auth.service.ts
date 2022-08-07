import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(private secret: string) {}

  async signIn(user: User) {
    return {
      access_token: jwt.sign(user, this.secret),
    };
  }
}
