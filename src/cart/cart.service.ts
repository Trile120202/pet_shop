import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StatusEnum } from "../../configs/enum";

@Injectable()
export class CartService {
  constructor(
    private readonly db: PrismaService
  ) {

  }

  findCart = async (userId: string, status: StatusEnum = StatusEnum.ACTIVE) =>
    await this.db.cart.findFirst({
      where: {
        userId,
        status
      }
    });


  createCart = async (userId: string) => {
    try {
      const cart = await this.findCart(userId, StatusEnum.ACTIVE);
      if (!cart) {
        const res = await this.db.cart.create({
          data: {
            userId
          }
        });
        return {
          statusCode: 200,
          message: "Cart created successfully",
          data: res
        };
      }
      return {
        statusCode: 200,
        message: "Cart already exists",
        data: cart
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };

  addToCart = async (userId: string, productId: string, quantity: number) => {
    const cart = await this.findCart(userId, StatusEnum.ACTIVE);
    if (cart) {
      const item = await this.db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId
        }
      });
      if (item) {
        const res = await this.db.cartItem.update({
          where: {
            id: item.id
          },
          data: {
            quantity: quantity
          }
        });
        return {
          statusCode: 200,
          message: "Item updated successfully",
          data: res
        };
      }
      const itemCart = await this.db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });

      if (itemCart) {
        return {
          statusCode: 200,
          message: "Item added successfully",
          data: itemCart
        };
      } else {
        return {
          statusCode: 500,
          message: "Internal server error"
        };
      }
    } else {
      return {
        statusCode: 404,
        message: "Cart not found"
      };
    }
  };

  getListItemWithCart = async (userId: string) => {
    try {
      const res = await this.db.cart.findMany({
        where: {
          userId,
          status: StatusEnum.ACTIVE
        }, include: {
          cartItems: true
        }
      });

      return {
        statusCode: 200,
        message: "Get list item with cart successfully",
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


  updateCart = async () => {
  };

  addItemInCart = async () => {
    try {


    } catch (error) {

      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };

  removeItemInCart = async () => {
  };

  createItemCart = async (data: any) => {
    try {
      const res = await this.db.cartItem.create({
        data: {
          ...data
        }
      });
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

}
