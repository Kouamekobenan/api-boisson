import { ApiProperty } from "@nestjs/swagger";

export class ProductByDto {
   
    @ApiProperty({ example: 100, description: "Quantité en stock du produit" })
    stock: number;
}


