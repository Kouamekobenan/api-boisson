import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { RolesGuard } from './auth/guards/role.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  // app.use(helmet());

  // ✅ Helmet avec contentSecurityPolicy correct
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'http://localhost:3000',
            'http://localhost:5173',
            'https://depot-website-seven.vercel.app',
          ],
        },
      },
    }),
  );

  const configService = app.get(ConfigService);

  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.get<number>('PORT', 3000);

  const host = configService.get<string>('HOST', '0.0.0.0');

  // ✅ Configuration CORS pour le frontend Electron/Next.js
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://depot-website-seven.vercel.app',
      /^https:\/\/.*\.vercel\.app$/,
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });

  // ✅ Filtres et guards globaux
  app.useGlobalFilters(new HttpExceptionFilter());

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector, PrismaService), new RolesGuard(reflector));

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Api MonDepot')
    .setDescription(
      'API de gestion comptable: Gerer les livreurs et les livraison',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  try {
    await app.listen(port, host);

    const logger = new Logger('Bootstrap');
    logger.log('JWT_SECRET:', process.env.JWT_SECRET);
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
