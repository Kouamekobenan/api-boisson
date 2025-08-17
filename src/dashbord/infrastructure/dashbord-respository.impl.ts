import { Injectable } from '@nestjs/common';
import { IDashbordRepository } from '../domain/interfaces/repository-dashbord.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardMapper } from '../domain/mappers/dashbord.mapper';
import { DashboardSummary } from '../domain/entities/dashbord.entity';

@Injectable()
export class DashbordRepository implements IDashbordRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DashboardMapper,
  ) {}
  async sammary(tenantId: string): Promise<DashboardSummary> {
    const dateDay = new Date();
    dateDay.setHours(0, 0, 0, 0);
    const totalSales = await this.prisma.directSale.count({
      where: { tenantId },
    });

    const totalDeliveries = await this.prisma.delivery.count({
      where: { tenantId },
    });

    const totalRevenue = await this.prisma.directSale.aggregate({
      where: { tenantId },
      _sum: { totalPrice: true },
    });

    const salesToday = await this.prisma.directSale.count({
      where: {
        tenantId,
        createdAt: { gte: dateDay },
      },
    });

    const deliveriesToday = await this.prisma.delivery.count({
      where: {
        tenantId,
        createdAt: { gte: dateDay },
      },
    });
    const result = this.mapper.toEntity({
      totalSales,
      totalDeliveries,
      totalRevenue: Number(totalRevenue._sum.totalPrice || 0),
      salesToday,
      deliveriesToday,
    });
    return result;
  }
  async getSalesByDay(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ total: number }> {
    const directeSale = await this.prisma.directSale.groupBy({
      by: ['createdAt'],
      where: {
        tenantId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { totalPrice: true },
      _count: { _all: true },
    });

    // Somme de tous les totalPrice
    const total = directeSale.reduce(
      (sum, item) => sum + Number(item._sum.totalPrice || 0),
      0,
    );

    return { total };
  } 

}
