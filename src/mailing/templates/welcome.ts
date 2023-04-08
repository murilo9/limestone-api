export class WelcomeEmailTemplate {
  to: string;
  text: string;
  subject: string;

  constructor(
    to: string,
    firstName: string,
    verifyId: string,
    initialPassword?: string,
  ) {
    const confirmUrl = 'https://api.limestone.app.br/verify/' + verifyId;
    this.to = to;
    this.subject = 'Greetings!';
    this.text = `
    <h3>Hello ${firstName}!</h3>
    <p>Welcome to Limestone</p><br/> 
    ${
      initialPassword
        ? `You may sign in with your e-mail address. Your password is <b>${initialPassword}</b></p></br>`
        : ''
    }
    <p>Please confirm this is your e-mail address by clicking the link bellow</p>
    <a href="${confirmUrl}">Verify</a>
    
    `;
  }
}
