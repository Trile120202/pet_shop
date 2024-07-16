import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EnumStatusOrder } from "../../configs/enum";

@Injectable()
export class OrderService {
  constructor(
    private readonly db: PrismaService
  ) {}
  createItem = async (data: any) => {
    try {
      const product = await this.db.product.findFirst({
        where: {
          id: data.productId,
        }
      });
      if (!product) {
        return {
          statusCode: 404,
          message: "Product not found"
        };
      }

      const res = await this.db.$transaction([
        this.db.order.update({
          where: {
            id: data.orderId
          },
          data: {
            status: EnumStatusOrder.PENDING
          }
        }),

        this.db.orderItem.create({
          data: {
            ...data,
          }
        })
      ])
      return {
        statusCode: 200,
        message: "Item created successfully",
        data: res
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };

  createOrder = async (userId: string, data: any) => {
    try {
      const order = await this.db.order.create({
        data: {
          userId,
          deliveryStatus:"123",
          paymentStatus:"321",
          total: "123",
        }
      });
      return {
        statusCode: 200,
        message: "Order created successfully",
        data: order
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };
}