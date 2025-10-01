import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { configSwagger } from './configs/api-docs.config';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters();
  app.enableCors({
    origin: [
      'https://www.notby.id.vn',
      'https://notby.id.vn', 
      'https://notby-be-8q9y.onrender.com',
      // Include development origins for testing
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: ['Set-Cookie'],
    credentials: true, // Very important for cookies
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
