import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PocketBaseClientService } from './services/pocketbase/pocketbaseClient.service';

const PORT = process.env.APP_PORT || '4000';
const ENV = process.env.NODE_ENV || 'dev';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pocketBaseClientService = app.get(PocketBaseClientService);

  const config = new DocumentBuilder()
    .setTitle('Api swagger')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  if (ENV === 'dev') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors();
  if (ENV === 'prod') {
    app.use(
      rateLimit({
        windowMs: 1 * 1000,
        max: 1000,
        message: 'too many request! slow down! DDOS is bad :(',
      }),
    );
  }

  try {
    const db = pocketBaseClientService.getPocketBase();
    await pocketBaseClientService.authenticate(db);
    console.log({
      message:
        'PocketBase admin authentication success! PocketBase perfectly configured! Now deauthenticate the admin user.',
      status: 200,
    });
    await pocketBaseClientService.deAuthenticate(db);
  } catch (error) {
    console.log(error);
    throw new Error('PocketBase authentication failed!');
  }

  if (ENV !== 'test') {
    await app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}
bootstrap();
