import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../domain/enums/role.enum';

export class UserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "Adresse email de l'utilisateur",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securepassword123',
    description: "Mot de passe de l'utilisateur",
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Jean Dupont',
    description: "Nom de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '+221770000000',
    description: "Numéro de téléphone de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: "Rôle de l'utilisateur",
  })
  @IsEnum(UserRole)
  role: UserRole;
}
