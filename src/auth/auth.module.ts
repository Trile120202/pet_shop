import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: process.env.EXPIRES },
  })

  ],

  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}