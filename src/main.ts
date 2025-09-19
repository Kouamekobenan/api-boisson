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

  const configService = app.get(ConfigService);
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.get<number>('PORT', 3000);
  const host = '0.0.0.0';

  // ✅ Configuration CORS améliorée
  app.enableCors({
    origin: (origin, callback) => {
      // Liste des domaines autorisés
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'https://api-boisson-production-bd26.up.railway.app',
        'https://depot-website-seven.vercel.app',
        /^https:\/\/.*\.vercel\.app$/,
        'https://depot-website-production.up.railway.app',
      ];

      // Autoriser les requêtes sans origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Vérifier si l'origin est autorisé
      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === 'string') {
          return allowed === origin;
        }
        return allowed.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, // Pour les anciens navigateurs
  });

  // ✅ Middleware de debug pour CORS (seulement en développement)
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      console.log(
        `🔍 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`,
      );

      // Log des headers CORS pour debug
      if (req.method === 'OPTIONS') {
        console.log('🔄 Preflight request detected');
        console.log('Headers:', req.headers);
      }

      next();
    });
  }

  // ✅ Helmet avec configuration adaptée
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                  "'self'",
                  'https://*.vercel.app',
                  'https://depot-website-seven.vercel.app',
                  'https://api-boisson-production-bd26.up.railway.app',
                  'https://depot-website-production.up.railway.app',
                ],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
              },
            }
          : false,
      crossOriginEmbedderPolicy: false, // Important pour éviter les conflits CORS
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

    if (process.env.NODE_ENV !== 'production') {
      logger.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);
    }

    logger.log(`🚀 Application running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on ${host}:${port}`);
    logger.log(`🔗 Railway URL should be accessible now`);

    // Log des domaines CORS autorisés
    logger.log('✅ CORS enabled for:', [
      'http://localhost:3000',
      'https://depot-website-seven.vercel.app',
      'https://depot-website-production.up.railway.app',
      '*.vercel.app',
    ]);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}
bootstrap();
