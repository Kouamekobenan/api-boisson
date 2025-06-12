import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class UpdateSupplierDto {
    @ApiProperty({ description: "Nom du fournisseur", example: "ABC Distributions" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Email du fournisseur", example: "contact@abc.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: "Numéro de téléphone du fournisseur", example: "+33612345678" })
    @IsString()
    @IsNotEmpty()
    phone: string;
}
