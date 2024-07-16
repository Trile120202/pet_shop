import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StatusEnum } from "../../configs/enum";

@Injectable()
export class CartService {
  constructor(
    private readonly db: PrismaService
  ) {
  }

  addToCart = async (userId: string, productId: string, quantity: number) => {
    let cart;
    let res;
    cart = await this.db.cart.findFirst({
      where: {
        userId,
        status: StatusEnum.ACTIVE
      }
    });

    if (!cart) {
      cart = await this.db.cart.create({
        data: {
          userId
        }
      });
    } else {
      const checkProductId = await this.db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId
        }
      });
      if (!checkProductId) {
        res = await this.db.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity
          }
        });
      } else {
        res = await this.db.cartItem.update({
          where: {
            id: checkProductId.id
          },
          data: {
            quantity: quantity,
            productId: productId
          }
        });
      }

    }
    return {
      statusCode: 200,
      message: "Cart item created successfully",
      data: res
    };
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
