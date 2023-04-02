import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import jwt = require('jsonwebtoken');
import { Axios } from 'axios';
import { GoogleApiResponse } from './types/google-api-response';
import { DatabaseService } from '../database/database.service';
import { GooglePeopleApiResponse } from './types/google-people-api-response';
import { CreateUserOnSignUpDto } from '../users/dto/create-user-on-signup.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('JWT_SECRET') private secret: string,
    @Inject(Axios) private axios: Axios,
    @Inject(DatabaseService) private databaseService: DatabaseService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  /**
   * Signs a user via Google OAuth.
   * NOTE: for now, only admin users may sign this way.
   * @param googleAccessToken access_token sent from Google OAuth consent screen
   */
  async googleSign(googleAccessToken: string) {
    const googleApiRes = await this.axios.get<GoogleApiResponse>(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAccessToken}`,
    );
    const { user_id, email } = googleApiRes.data;
    let user = await this.databaseService.findOne<User>('users', { email });
    // Register user if not registered
    if (!user) {
      const googlePeopleApiRes = await this.axios.get<GooglePeopleApiResponse>(
        `https://people.googleapis.com/v1/people/me?personFields=names&access_token=${googleAccessToken}`,
      );
      const { names } = googlePeopleApiRes.data;
      const userName = names.find((name) => name.metadata.primary) || names[0];
      if (!userName) {
        throw new BadRequestException(
          'Could not get your name at Google profile',
        );
      }
      const newUserDto: CreateUserOnSignUpDto = {
        firstName: userName.metadata.givenName,
        lastName: userName.metadata.familyName,
        email,
        password: user_id,
      };
      await this.usersService.create(newUserDto);
      user = await this.databaseService.findOne<User>('users', { email });
    }
    return {
      access_token: jwt.sign(user, this.secret),
      user,
    };
  }

  async signIn(user: User) {
    return {
      access_token: jwt.sign(user, this.secret),
      user,
    };
  }
}
