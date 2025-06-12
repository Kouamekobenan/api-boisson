import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';
import { User } from '../users/domain/entities/user.entity';

@Injectable()
export class AuthMeUseCase {
  private readonly logger = new Logger(AuthMeUseCase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(userId: string):Promise<User> {
    console.log('User trouvé:', userId);
    try {
      const user = await this.userRepository.getUserById(userId);
      console.log('User trouvé:', user);
      this.logger.log('user connect:', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve user', {
        cause: error,
        description: error.message,
      });
    }
  }
}
