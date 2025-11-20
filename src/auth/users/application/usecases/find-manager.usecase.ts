import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.interface.repository';
import { UserRole } from '../../domain/enums/role.enum';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindAllManagerUseCase {
  private readonly logger = new Logger(FindAllManagerUseCase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(): Promise<User[]> {
    try {
      const users = await this.userRepo.findAllManager();
    //   this.logger.log(`managers of 12DEPOT: ${JSON.stringify(users)}`);
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve the manger of 12DEPOT`,
        error.stack,
      );
      if (error.code === 'P2002') {
        throw new ConflictException('Database constraint violation');
      }
      throw new InternalServerErrorException(
        'Failed to retrieve all managers. Please try again later.',
        { cause: error },
      );
    }
  }
}
