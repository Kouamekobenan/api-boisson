import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  // ✅ Helmet avec contentSecurityPolicy correct
  const configService = app.get(ConfigService);
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.get<number>('PORT', 3000);
  const host = '0.0.0.0';

  // ✅ Configuration CORS pour le frontend Electron/Next.js
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'https://api-boisson-production-bd26.up.railway.app',
      'https://depot-website-seven.vercel.app',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type, Accept',
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                  "'self'",
                  'https://depot-website-seven.vercel.app',
                  'https://api-boisson-production-bd26.up.railway.app',
                ],
              },
            }
          : false, // ⚠️ désactive CSP en dev
    }),
  );

  // ✅ Filtres et guards globaux
  app.useGlobalFilters(new HttpExceptionFilter());

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

    // 🔒 Ne pas logger les secrets en production
    if (process.env.NODE_ENV !== 'production') {
      logger.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);
    }

    logger.log(`🚀 Application running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on ${host}:${port}`);

    // 🔧 Log supplémentaire pour Railway
    logger.log(`🔗 Railway URL should be accessible now`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}

bootstrap();
