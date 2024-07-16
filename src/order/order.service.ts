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

    const { userId, paymentUrl, cartItems } = data;

    const orderItems = cartItems.map(item => ({
      id: uuidv4(),
      orderId: id,
      productId: item.id,
      quantity: item.cartQuantity,
      price: item.price
    }));

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.cartQuantity, 0).toString();

    const order = {
      id,
      userId,
      total,
      paymentUrl,
      deliveryStatus: "Pending",
      paymentStatus: "Pending",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.$transaction([
      this.db.order.create({ data: order }),
      ...orderItems.map(item => this.db.orderItem.create({ data: item }))
    ]);

    return order;
  };

  findAllOrders = async (userId: string) => {
    const data = await this.db.order.findMany({
      where: {
        userId
      },
      include: {
        orderItems: true
      }
    });
    return {
      statusCode: 200,
      message: "Success",
      data
    };

  };

}
