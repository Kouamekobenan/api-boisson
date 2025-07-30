import { BadRequestException, Injectable } from '@nestjs/common';
import { ISupplierRepository } from '../application/interface/supplier-interface.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierMapper } from '../domain/mappers/supplier-mapper.mapper';
import { SupplierDto } from '../application/dtos/supplier-dto.dto';
import { SupplierEntity } from '../domain/entities/supplier.entity';
import { UpdateSupplierDto } from '../application/dtos/update-dto.dto';
import { SuccessResponse } from 'src/common/types/response-controller.type';

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SupplierMapper,
  ) {}
  async create(data: SupplierDto): Promise<SuccessResponse<SupplierEntity>> {
    try {
      const supplierTosend = this.mapper.toSend(data);
      const created = await this.prisma.supplier.create({
        data: supplierTosend,
      });
      return {
        status: 201,
        success: true,
        message: 'Fournisseurs créer avec succès!',
        data: this.mapper.toReceive(created),
      };
    } catch (error) {
      console.error(`error in repo:${error.message}`);
      throw new BadRequestException(`error confict: repo:${error.message}`);
    }
  }
  // FIND SUPPLIER BY ID
  async findSupplierById(supplierId: string): Promise<SupplierEntity> {
    try {
      const isSupplierExist = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!isSupplierExist) {
        throw new BadRequestException(
          "cet fournisseur n'exist pas dans la base",
        );
      }
      return this.mapper.toReceive(isSupplierExist);
    } catch (error) {
      throw new BadRequestException(`error repository: ${error.message}`);
    }
  }
  // FIND ALL SUPPLIER
  async findAll(): Promise<SupplierEntity[]> {
    try {
      const suppliers = await this.prisma.supplier.findMany();
      const allSyuppliers = suppliers.map((supplier) =>
        this.mapper.toReceive(supplier),
      );
      return allSyuppliers;
    } catch (error) {
      throw new BadRequestException(`error repo: ${error.message}`);
    }
  }
  async update(
    supplierId: string,
    data: UpdateSupplierDto,
  ): Promise<SupplierEntity> {
    try {
      const supplierToUpdate = await this.mapper.toUpdate(data);
      const update = await this.prisma.supplier.update({
        where: { id: supplierId },
        data: { ...supplierToUpdate },
      });
      return this.mapper.toReceive(update);
    } catch (error) {
      throw new BadRequestException(`error on repository: ${error.message}`);
    }
  }

  async deleted(supplierId: string): Promise<void> {
    try {
      // supprime tous les produits liés au fournisseurs supprimer
      await this.prisma.product.deleteMany({
        where: { id: supplierId },
      });

      // supprime le fournisseur en question
      await this.prisma.supplier.delete({ where: { id: supplierId } });
    } catch (error) {
      throw new BadRequestException(`error repository: ${error.message}`);
    }
  }
}
