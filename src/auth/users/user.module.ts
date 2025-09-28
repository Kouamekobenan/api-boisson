import { Injectable, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserRepository } from './infrastructure/repository/user.rpository';
import { UserMapper } from './domain/mappers/user.mapper';
import { FindAllUserUseCase } from './application/usecases/findAlluser.user.use-case';
import { DeleteUserUseCase } from './application/usecases/delete.user.use-case';
import { FindUserByIdUseCase } from './application/usecases/find_user_by_id.use_case';
import { PaginateUserUseCase } from './application/usecases/paginate-user.usecase';
import { FilterUserUseCase } from './application/usecases/filter-user.usecase';

@Module({
  imports: [],

  controllers: [UserController],
  providers: [
    // serviec
    PrismaService,

    // use cases
    FindAllUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    PaginateUserUseCase,
    FilterUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },

    //   mappers
    UserMapper,
  ],
  exports: [UserModule],
})
export class UserModule {}
