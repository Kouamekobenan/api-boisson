import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantRepository } from './infrastructure/tenant-repository.impl';
import { CreateTenantUseCase } from './application/usecases/create-tenant.usecase';
import { TenantMapper } from './domain/mappers/tenant.mapper';
import { TenantController } from './representation/tenant.controller';
import { TenatRepositoryName } from './domain/interfaces/tenant-repository.interface';
import { FindByIdTenantUseCase } from './application/usecases/find-by-Id.usecase';
import { DeleteTenantUseCase } from './application/usecases/delete-tenant.usecase';
import { UpdateTenantUseCase } from './application/usecases/update-tenant.usecase';
import { FindAllTenantUseCase } from './application/usecases/findAll-tenant.usecase';
import { CreateEspaceTenantUseCase } from './application/usecases/createEspace-tenant.usecase';
import { UserModule } from 'src/auth/users/user.module';
import { UserRepository } from 'src/auth/users/infrastructure/repository/user.rpository';
import { UserMapper } from 'src/auth/users/domain/mappers/user.mapper';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TenantController],
  imports: [UserModule],
  providers: [
    PrismaService,
    TenantMapper,
    UserMapper,
    AuthService,
    JwtService,
    {
      provide: TenatRepositoryName,
      useClass: TenantRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    CreateTenantUseCase,
    FindByIdTenantUseCase,
    DeleteTenantUseCase,
    UpdateTenantUseCase,
    FindAllTenantUseCase,
    CreateEspaceTenantUseCase,
  ],
  exports: [TenantModule],
})
export class TenantModule {}
