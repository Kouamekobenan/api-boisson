import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { RolesGuard } from './auth/guards/role.guard';
import helmet from 'helmet';

// const helmet = require('helmet');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Activation des logs en production
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", 'http://127.0.0.1:3000'], // Ajoutez l'origine de votre front-end ici
        },
      },
    }),
  );
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '0.0.0.0');

  app.enableCors({
    origin: ' http://localhost:5173', 
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Si tu utilises des cookies/session
  });

  app.use(helmet());
  //middleware d'eception d'erreur
  app.useGlobalFilters(new HttpExceptionFilter());
 
  // recuperation du reflactor
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.useGlobalGuards(app.get(JwtAuthGuard));
  app.useGlobalGuards(new RolesGuard(reflector));
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Api DrinkFlow')
    .setDescription('API de gestion immobilière')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // Ce nom doit être utilisé dans `ApiBearerAuth()`
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  try {
    await app.listen(port , host);

    const logger = new Logger('Bootstrap');
    logger.log(`🚀 Application running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on ${host}:${port}`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}
bootstrap();
