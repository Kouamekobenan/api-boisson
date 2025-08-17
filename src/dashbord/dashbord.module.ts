import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashbordController } from './presentation/dashbord.controller';
import { DashboardMapper } from './domain/mappers/dashbord.mapper';
import { DashbordRepositoryName } from './domain/interfaces/repository-dashbord.interface';
import { DashbordRepository } from './infrastructure/dashbord-respository.impl';
import { GetSammaryUseCase } from './application/usecases/get-sammary.usecase';
import { GetSaleByDayUseCase } from './application/usecases/getSalesBy.usecases';

@Module({
  controllers: [DashbordController],
  imports: [],
  providers: [
    // prismaservice
    PrismaService,
    // mappers
    DashboardMapper,
    {
      provide: DashbordRepositoryName,
      useClass: DashbordRepository,
    },
    // use-cases
    GetSammaryUseCase,
    GetSaleByDayUseCase,
  ],
  exports: [],
})
export class DashbordModule {}
