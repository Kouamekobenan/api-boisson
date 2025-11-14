import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.interface.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindManagerByTenantUseCase {
  private readonly logger = new Logger(FindManagerByTenantUseCase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(tenantId: string): Promise<User | null> {
    try {
      return await this.userRepo.findManagerByTenant(tenantId);
    } catch (error) {
      this.logger.error(`Failled to retrieve with keys`, error.stack);
      throw new BadRequestException('Failled to retrieve with keys', {
        cause: error,
        description: error.message,
      });
    }
  }
}
