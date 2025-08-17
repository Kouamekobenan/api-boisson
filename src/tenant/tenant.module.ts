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

@Module({
  controllers: [TenantController],
  providers: [
    PrismaService,
    TenantMapper,
    {
      provide: TenatRepositoryName,
      useClass: TenantRepository,
    },
    CreateTenantUseCase,
    FindByIdTenantUseCase,
    DeleteTenantUseCase,
    UpdateTenantUseCase,
    FindAllTenantUseCase,
  ],
  exports: [TenantModule],
})
export class TenantModule {}
