import { Module } from '@nestjs/common';
import { UserModule } from 'src/auth/users/user.module';
import { DashbordModule } from 'src/dashbord/dashbord.module';
import { StartDailyReportJob } from './daily-report.cron';
import { TenantModule } from 'src/tenant/tenant.module';
import { DashbordRepositoryName } from 'src/dashbord/domain/interfaces/repository-dashbord.interface';
import { DashbordRepository } from 'src/dashbord/infrastructure/dashbord-respository.impl';
import { UserRepository } from 'src/auth/users/infrastructure/repository/user.rpository';
import { TenatRepositoryName } from 'src/tenant/domain/interfaces/tenant-repository.interface';
import { TenantRepository } from 'src/tenant/infrastructure/tenant-repository.impl';
import { DashboardMapper } from 'src/dashbord/domain/mappers/dashbord.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMapper } from 'src/auth/users/domain/mappers/user.mapper';
import { TenantMapper } from 'src/tenant/domain/mappers/tenant.mapper';
@Module({
  imports: [DashbordModule, UserModule, TenantModule],
  providers: [
    StartDailyReportJob,
    DashboardMapper,
    PrismaService,
    UserMapper,
    TenantMapper,
    {
      provide: DashbordRepositoryName,
      useClass: DashbordRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: TenatRepositoryName,
      useClass: TenantRepository,
    },
  ],
})
export class DailyReportModule {}
