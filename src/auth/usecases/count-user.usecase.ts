import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';

@Injectable()
export class CountUserConnectUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(): Promise<{ total: number }> {
    return await this.userRepository.count();
  }
}
