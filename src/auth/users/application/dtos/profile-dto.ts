// import { IsEmail, IsOptional } from "class-validator";
// import { UserRole } from "../../domain/enums/role.enum"

// import { Transform } from "class-transformer";
// import { ApiProperty } from "@nestjs/swagger";
// export class ProfileDto {
//   id: string;
//   @ApiProperty({
//     description: "Adresse email de l'utilisateur",
//     example: 'jean.dupont@example.com',
//     required: false,
//   })
//   @IsEmail({}, { message: "Format d'email invalide" })
//   @IsOptional()
//   @Transform(({ value }) => value?.toLowerCase().trim())
//   email?: string;

//   password: string;
//   role: UserRole;
//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }
