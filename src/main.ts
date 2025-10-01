import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { configSwagger } from './configs/api-docs.config';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from '@nestjs/passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters();
  app.use(cookieParser()); // Add cookie parser middleware
  
  // Trust proxy headers - critical for cookies in production with secure flag
  app.set('trust proxy', 1);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept,Origin,X-Requested-With,x-access-token',
    exposedHeaders: ['Set-Cookie', 'Authorization', 'x-access-token'],
    credentials: true,
  });
  configSwagger(app);
 
  app.useStaticAssets(join(__dirname, './served'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  const port = process.env.PORT || 4000;
  await app.listen(port, () =>
    logger.log(`🚀 Server running on: http://localhost:${port}/api-docs`),
  );
}
bootstrap();
