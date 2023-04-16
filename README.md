### Start in development mode

`docker-compose -f docker-compose.dev.yml up [--build]`

### Start in production mode

`docker-compose up [--build]`

**Note: every time docker-compose runs with the --build flag, it re-creates the ./mongo-data folder**

### Clear docker-compose

`docker-compose <-f docker-compose.dev.yml> down --clean-orphan`

### Deployment notes

- Make sure the server repository has a proper .env file

### Useful tutorials:

- [Nodemailer Gmail config](https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9)
