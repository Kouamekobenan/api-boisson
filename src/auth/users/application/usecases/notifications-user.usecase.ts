import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  IUserRepository,
  PushSubscriptionType,
} from '../interfaces/user.interface.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AddNotificationUseCase {
  private logger = new Logger(AddNotificationUseCase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(
    userId: string,
    subscription: PushSubscriptionType,
  ): Promise<User | null> {
    try {
      const addPushSubscription = await this.userRepo.updatePushSubscription(
        userId,
        subscription,
      );
      this.logger.log(`data to update: ${JSON.stringify(addPushSubscription)}`);
      return addPushSubscription;
    } catch (error) {
      this.logger.error(`Failled to add Push :${error.message}`);
      throw new BadRequestException(`Failled to add Push`, {
        cause: error,
        description: error.message,
      });
    }
  }
}
