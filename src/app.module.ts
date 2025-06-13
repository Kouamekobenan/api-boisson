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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
