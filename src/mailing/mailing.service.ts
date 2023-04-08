import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { auth } from 'googleapis/build/src/apis/oauth2';
import * as nodemailer from 'nodemailer';

export class MailingService {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async sendMail(template: { to: string; subject: string; text: string }) {
    const { to, subject, text } = template;
    const user = this.configService.get('MAIL_USER');
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    const redirectUrl = this.configService.get('GOOGLE_REDIRECT_URL');
    const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
    const myOAuth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    myOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    const accessToken = await myOAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken: accessToken.token,
      },
    });
    const sendEmailRes = await transporter.sendMail({
      from: user,
      to,
      subject,
      html: text,
    });
    console.log('sendEmailRes', sendEmailRes);
  }
}
