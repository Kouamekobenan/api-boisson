import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';
import { User } from '../users/domain/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly authservice: AuthService,
  ) {}
  async execute(
    email: string,
    password: string,
  ): Promise<{ user: User; token: {} }> {
    const isUser = await this.userRepository.findByEmail(email);
    if (!isUser) {
      throw new Error(`ce email:${email} est incorrect`);
    }
    const isComparePassword = await this.authservice.comparePassword(
      password,
      isUser.getPassword(),
    );
    if (!isComparePassword) {
      throw new Error(`ce password:${password} est incorrect`);
    }

    const generateToken = await this.authservice.generateToken({
      userId: isUser.getId(),
      email: isUser.getEmail(),
      role: isUser.getRole(),
    });
    return { user: isUser, token: generateToken };
  }
}
