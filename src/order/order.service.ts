import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EnumStatusOrder } from "../../configs/enum";
import { v4 as uuidv4 } from "uuid";


@Injectable()
export class OrderService {
  constructor(
    private readonly db: PrismaService
  ) {
  }

  createOrder = async (data: any) => {
    const id = uuidv4();

    const res = await this.db.$transaction([
      this.db.order.create({
        data: {
          ...data,
          id
        }
      })
    ]);
  };

}
