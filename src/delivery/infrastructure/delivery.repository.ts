import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryMapper } from '../domain/mappers/delivery-mapper.mapper';
import { DeliveryDto } from '../application/dtos/delivery-dto.dto';
import { Delivery } from '../domain/entities/delivery.entity';
import { IDeliveryRepository } from '../application/interface/delivery-repository.interface';
import { UpdateDeliveryDto } from '../application/dtos/update-delivery-dto.dto';
import { BaseExceptionFilter } from '@nestjs/core';
import { DeliveryStatus } from '../domain/enums/deliveryStatus.enums';
import { toSafeNumber } from 'src/common/number/conversion';

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(
    private prisma: PrismaService,
    private mapper: DeliveryMapper,
  ) {}
  async created(
    deliveryPersonId: string,
    data: DeliveryDto,
  ): Promise<Delivery> {
    try {
      const isDelivery = this.mapper.toApplication(data);
      for (const product of isDelivery.getDeliveryProducts()) {
        const productInDb = await this.prisma.product.findUnique({
          where: { id: product.getProductId() },
        });

        // Si le produit n'existe pas ou le stock est insuffisant
        if (!productInDb) {
          throw new Error(`Produit ${product.getProductId()} non trouvé.`);
        }

        if (productInDb.stock < product.getQuantity()) {
          throw new Error(
            `Stock insuffisant pour le produit ${product.getProductId()}.`,
          );
        }

        // Mettre à jour le stock du produit
        await this.prisma.product.update({
          where: { id: product.getProductId() },
          data: {
            stock: productInDb.stock - product.getQuantity(), // Réduire le stock
          },
        });
      }
      console.log('Delivery Products reçus:', data.deliveryProducts);
      const newDelivery = await this.prisma.delivery.create({
        data: {
          // ...isDelivery,
          status: 'IN_PROGRESS',
          deliveryPerson: {
            connect: { id: deliveryPersonId },
          },
          deliveryProducts: isDelivery.getDeliveryProducts()?.length
            ? {
                create: isDelivery.getDeliveryProducts().map((p) => ({
                  productId: p.getProductId(),
                  quantity: p.getQuantity(),
                })),
              }
            : undefined,
        },
        include: {
          deliveryProducts: {
            include: {
              product: {
                select: {
                  name: true,
                  description: true,
                  price: true,
                  stock: true,
                },
              },
            },
          },
          stockMovements: true, // ✅ Ajout des mouvements de stock
        },
      });
      // create stock movement
      for (const product of isDelivery.getDeliveryProducts()) {
        await this.prisma.stockMovement.create({
          data: {
            productId: product.getProductId(),
            type: 'EXIT', // Type de mouvement
            quantity: product.getQuantity(),
            deliveryId: newDelivery.id, // Associer à la livraison
          },
        });
      }
      const result = this.mapper.toDomain(newDelivery);
      return result;
    } catch (error) {
      console.error(
        `une erreur lors de la creation de la livraison ${error.message}`,
      );
      throw new BadGatewayException(`delevery:repositored: ${error.message}`);
    }
  }

  // RECUPERER TOUS LES LIVRAISONS
  async findAllDelivery(): Promise<(Delivery & { totalPrice: number })[]> {
    try {
      const delivery = await this.prisma.delivery.findMany({
        include: {
          deliveryPerson: {
            select: {
              id: true,
              name: true,
            },
          },
          deliveryProducts: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      // Ajout du champ totalPrice
      const result = delivery.map((data) => {
        const totalPrice = data.deliveryProducts.reduce((sum, dp) => {
          const price = dp.product.price;
          return sum + price.toNumber() * toSafeNumber(dp.quantity);
        }, 0);

        const domainData = this.mapper.toDomain(data) as Delivery & {
          totalPrice: number;
        };

        domainData.totalPrice = totalPrice;

        return domainData;
      });

      return result;
    } catch (error) {
      console.error(`erreur repo: ${error.message}`);
      throw new BadGatewayException(`delivery:repositored: ${error.message}`);
    }
  }

  // UPADTE TO DELIVERY
  async updateDelivery(
    deliveryId: string,
    data: UpdateDeliveryDto,
  ): Promise<Delivery> {
    try {
      const DataToApplication = this.mapper.toUpdate(data);
      const updateData = await this.prisma.delivery.update({
        where: { id: deliveryId },
        data: DataToApplication,
      });
      return this.mapper.toDomain(updateData);
    } catch (error) {
      console.error('update-delivery: repo:', error.message);
      throw new BadGatewayException('une erreur lors de la modification');
    }
  }

  // Delete DELIVERY
  async DeleteDelivery(deliveryId: string): Promise<void> {
    try {
      const delivery = await this.prisma.delivery.findUnique({
        where: { id: deliveryId },
        select: { status: true },
      });
      if (!delivery) {
        throw new BadRequestException(`la livraison avec l\'Id :${deliveryId}`);
      }
      if (delivery.status === 'COMPLETED') {
        throw new BadRequestException(
          `Seule les livraison en cours peut être supprimer`,
        );
      }

      // SUPPRIMER LES PRODUITS ASSOCIES A LA LIVRAISON
      await this.prisma.deliveryProduct.deleteMany({
        where: { id: deliveryId },
      });

      // SUPPRIME LA LIVRAISON
      await this.prisma.delivery.delete({
        where: { id: deliveryId },
      });
    } catch (error) {
      throw new BaseExceptionFilter();
    }
  }
  // FIND ALLS ENTER DATE ALEATOR
  async findDetails(
    deliveryPersonId: string,
    startDate: string,
    endDate: string,
  ): Promise<Delivery[]> {
    try {
      if (!startDate || !endDate) {
        throw new BadRequestException(
          'Les dates de début et de fin sont requises.',
        );
      }
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException(
          'Format de date invalide. Utilisez YYYY-MM-DD.',
        );
      }
      end.setHours(23, 59, 59, 999);
      const deliveries = await this.prisma.delivery.findMany({
        where: {
          deliveryPersonId: deliveryPersonId,
          createdAt: {
            gte: start, // Supérieur ou égal à la date de début
            lte: end, // Inférieur ou égal à la date de fin
          },
        },
        include: {
          deliveryProducts: {
            include: {
              product: {
                select: {
                  name: true,
                  description: true,
                  price: true,
                  stock: true,
                },
              },
            },
          },
          // stockMovements:true,
        },
      });
      return deliveries.map((delivery) => this.mapper.toDomain(delivery));
    } catch (error) {
      throw new BadRequestException(`error repository :${error.message}`);
    }
  }
  // DELIVERY BY ID
  async findById(
    deliveryId: string,
  ): Promise<{ data: Delivery & { totalPrice: number } }> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        deliveryPerson: {
          select: {
            id: true,
            name: true,
          },
        },
        deliveryProducts: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!delivery) {
      throw new BadRequestException(`delivery is not found`);
    }

    const totalPrice = delivery.deliveryProducts.reduce((sum, dp) => {
      const price = dp.product?.price ?? 0;
      return sum + price.toNumber() * toSafeNumber(dp.quantity);
    }, 0);

    const domainData = this.mapper.toDomain(delivery) as Delivery & {
      totalPrice: number;
    };

    domainData.totalPrice =totalPrice

    return {data:domainData};
  }
  async validateDeliveryById(
    deliveryId: string,
    data: DeliveryDto,
  ): Promise<Delivery> {
    try {
      const dataToValidate = this.mapper.toApplication(data);
      const existingDelivery = await this.prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          deliveryProducts: true,
        },
      });

      if (!existingDelivery) {
        throw new NotFoundException(`Livraison ${deliveryId} non trouvée.`);
      }
      if (existingDelivery.status !== 'IN_PROGRESS') {
        throw new BadRequestException(
          `Seules les livraisons en cours peuvent être validées.`,
        );
      }

      // Parcourir les produits pour traiter livraisons et retours
      for (const product of dataToValidate.getDeliveryProducts()) {
        const productInDb = await this.prisma.deliveryProduct.findUnique({
          where: { id: product.getId() },
        });
        // console.log('data:', productInDb)
        if (!productInDb) {
          throw new Error(`Produit ${product.getId()} non trouvé.`);
        }

        const deliveredQuantity = product.getDeliveredQuantity(); // Nouvelle méthode pour récupérer la quantité livrée
        const returnedQuantity = product.getReturnedQuantity(); // Nouvelle méthode pour récupérer la quantité retournée

        // Vérifier si la somme des livrés + retournés correspond au total initial
        const originalProductDelivery = existingDelivery.deliveryProducts.find(
          (p) => p.productId === product.getProductId(),
        );

        if (!originalProductDelivery) {
          throw new Error(
            `Produit ${product.getProductId()} introuvable dans la livraison.`,
          );
        }
        if (
          deliveredQuantity + returnedQuantity !==
          toSafeNumber(originalProductDelivery.quantity)
        ) {
          throw new BadRequestException(
            `Erreur sur le produit ${product.getProductId()} : les quantités livrées et retournées ne correspondent pas à la quantité sortie.`,
          );
        }
        if (returnedQuantity > 0) {
          await this.prisma.product.update({
            where: { id: product.getProductId() },
            data: {
              stock: {
                increment: returnedQuantity, // Ajouter au stock
              },
            },
          });
        }
      }

      // Mise à jour des données de la livraison avec les produits
      const updateData = await this.prisma.delivery.update({
        where: { id: deliveryId },
        data: {
          status: 'COMPLETED',
          deliveryProducts: {
            update: dataToValidate.getDeliveryProducts().map((product) => ({
              where: {
                id: product.getId(),
              },
              data: {
                deliveredQuantity: product.getDeliveredQuantity(),
                returnedQuantity: product.getReturnedQuantity(),
              },
            })),
          },
        },
        include: {
          deliveryProducts: true,
        },
      });

      return this.mapper.toDomain(updateData);
    } catch (error) {
      throw new BadRequestException(`error repo: ${error.message}`);
    }
  }

  async annulateDelivery(deliveryId: string): Promise<Delivery> {
    try {
      const delivery = await this.prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: { deliveryProducts: true },
      });

      if (!delivery) {
        throw new BadRequestException(
          `la livraison avec l\'Id ${deliveryId} n\'exist pas`,
        );
      }
      if (delivery.status === DeliveryStatus.CANCELED) {
        throw new BadRequestException(`Cette livraison est déjà annulée`);
      }
      if (delivery.status !== DeliveryStatus.IN_PROGRESS) {
        throw new BadRequestException(
          `seules les livraisons en cours peuvent être supprimer`,
        );
      }
      // RENDRE LES STOCKS AUX PRODUITS
      for (const deliveryProduct of delivery.deliveryProducts) {
        await this.prisma.product.update({
          where: { id: deliveryProduct.productId },
          data: {
            stock: {
              increment: toSafeNumber(deliveryProduct.quantity),
            }, // Ajouter la quantité au stock
          },
        });
      }

      // annullé la livraison
      const canceledDelevery = await this.prisma.delivery.update({
        where: { id: deliveryId },
        data: {
          status: 'CANCELED',
        },
      });

      return this.mapper.toDomain(canceledDelevery);
    } catch (error) {
      throw new BadRequestException(`error on  repository: ${error.message}`);
    }
  }
  async paginate(
    limit: number,
    page: number,
    search: string,
    status: DeliveryStatus | 'ALL',
  ): Promise<{
    data: (Delivery & { totalPrice: number })[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit; // Construction du filtre dynamique
      const where: any = {};
      if (search) {
        where.id = {
          contains: search,
          mode: 'insensitive', // pour ne pas être sensible à la casse
        };
      }
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const [deliveries, total] = await Promise.all([
        this.prisma.delivery.findMany({
          where,
          include: {
            deliveryPerson: {
              select: {
                id: true,
                name: true,
              },
            },
            deliveryProducts: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.delivery.count({ where }),
      ]);

      const result = deliveries.map((data) => {
        const totalPrice = data.deliveryProducts.reduce((sum, dp) => {
          const price = dp.product.price;
          return sum + price.toNumber() * toSafeNumber(dp.quantity);
        }, 0);

        const domainData = this.mapper.toDomain(data) as Delivery & {
          totalPrice: number;
        };

        domainData.totalPrice = totalPrice;
        return domainData;
      });
      return {
        data: result,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failed to paginate delivery', {
        cause: error,
        description: error.message,
      });
    }
  }
  async history(deliveryPersonId: string): Promise<Delivery[]> {
    try {
      const delivery = await this.prisma.delivery.findMany({
        where: { deliveryPersonId },
        orderBy: { createdAt: 'desc' },
        include: {
          deliveryProducts: {
            include: { product: true },
          },
        },
      });
      const allDelivery = delivery.map((data) => this.mapper.toDomain(data));
      return allDelivery;
    } catch (error) {
      throw new BadRequestException(`Failed to get history deliveryPerson`, {
        cause: error,
        description: error.message,
      });
    }
  }
  async process(): Promise<Delivery[]> {
    try {
      const deliveries = await this.prisma.delivery.findMany({
        where: { status: DeliveryStatus.IN_PROGRESS },
      });
      const allDeliveries = deliveries.map((delivery) =>
        this.mapper.toDomain(delivery),
      );
      return allDeliveries;
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve deliveries in progress',
      );
    }
  }
}
