import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger";
import { CreateStockUseCase } from "../application/usecases/create-stock-usecase.use-case";
import { StockDTO } from "../application/dtos/create-stock-dto.dto";
import { StockEntity } from "../domain/entities/stock.entity";
import { Public } from "src/common/decorators/public.decorator";
@Public()
@ApiTags('Stock Movement')
@Controller('stock-movement')
export class StockMouvementController {
    constructor(
        private readonly createStockUseCase: CreateStockUseCase
    ) {}

    @Post(':deliveryId/:productId')
    @ApiOperation({ summary: 'Créer un mouvement de stock', description: 'Crée un mouvement de stock pour un produit et une livraison donnés.' })
    @ApiParam({ name: 'deliveryId', type: String, description: "ID de la livraison associée" })
    @ApiParam({ name: 'productId', type: String, description: "ID du produit concerné" })
    @ApiBody({ type: StockDTO, description: "Données du mouvement de stock" })
    @ApiResponse({ status: 201, description: 'Mouvement de stock créé avec succès', type: StockEntity })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiResponse({ status: 500, description: 'Erreur serveur' })
    async createStock(
        @Param('deliveryId') deliveryId: string, 
        @Param('productId') productId: string, 
        @Body() dataStock: StockDTO
    ): Promise<StockEntity> {
        return await this.createStockUseCase.execute(deliveryId, productId, dataStock);
    }
}
