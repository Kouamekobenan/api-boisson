import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from 'src/auth/users/application/dtos/user.dto';

export class CreateTenantDtoSpace {
  @ApiProperty({
    example: 'MonEntreprise',
    description: 'Nom du tenant (espace)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Informations du premier utilisateur (propriétaire)',
    type: UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
