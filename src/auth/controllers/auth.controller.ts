import { query, Request as request } from 'express';

interface AuthenticatedRequest extends request {
  user: { id: string; email: string; role: string };
}

import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Req,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../usecases/register.user.use-case';
import { LoginUserUseCase } from '../usecases/login.use-case';
import { UserDto } from '../users/application/dtos/user.dto';
import { LoginDto } from '../users/application/dtos/login-dto.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../users/domain/entities/user.entity';
import { AuthMeUseCase } from '../usecases/authme.usecase';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';

@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly authMeUseCase: AuthMeUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get full current user' })
  @ApiResponse({ status: 200, description: 'User info from database' })
  async me(@Req() query: any) {
    console.log('user id:', query.user);
    return await this.authMeUseCase.execute(query.user.userId);
  }
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur est crée, retourne un token',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiBody({ type: UserDto }) // Permet de documenter le body attendu
  async register(@Body() userData: UserDto) {
    return this.registerUseCase.execute(userData);
  }
  @Public()
  @Post('login')
  @ApiOperation({ summary: "Connexion d'un utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, retourne un token',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiBody({ type: LoginDto }) // Permet de documenter le body attendu
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUserUseCase.execute(
      loginDto.email,
      loginDto.password,
    );
  }
}
