import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from "../security/auth";
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';



@Module({

  imports: [PrismaModule, AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    CartModule,
    OrderModule],
  controllers: [AppController],
  providers: [AppService,JwtStrategy]
})
export class AppModule {
}
