import { DbExceptionFilter, HttpExceptionFilter } from '@exceptions';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WinstonProvider } from './utils/providers';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonProvider);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(csurf());
  app.use(helmet());
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  app.useLogger(logger);

  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new DbExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Dependency injection for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = +process.env.PORT || 3001;
  await app
    .listen(port)
    .then(() => logger.warn(`YOUR APP IS READY ON PORT: ${port}`, 'WELCOME'))
    .catch((err) => logger.error(err, 'Application is crashed'));
}

bootstrap();
