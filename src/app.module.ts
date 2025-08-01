import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeliveryPersonModule } from './deliveryPerson/deliveryPerson.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ProductModule } from './products/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { StockModule } from './stockMouvement/stock.module';
import { OderModule } from './order/order.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CategoryProductModule } from './categories/category.module';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DirecteSaleModule } from './directSale/directSalt.module';
import { CustomerModule } from './customer/customer.module';
import { CreditPaymentModule } from './creditPayment/creditPayment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    DeliveryPersonModule,
    DeliveryModule,
    ProductModule,
    SupplierModule,
    StockModule,
    OderModule,
    InvoiceModule,
    CategoryProductModule,
    DirecteSaleModule,
    CustomerModule,
    CreditPaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
