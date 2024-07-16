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
    let cartData;
    let res;
    cartData = await this.db.cart.findFirst({
      where: {
        userId,
        status: StatusEnum.ACTIVE
      }
    });

    if (!cartData) {
      cartData = await this.db.cart.create({
        data: {
          userId
        }
      });
    } else {
      const checkProductId = await this.db.cartItem.findFirst({
        where: {
          cartId: cartData.id,
          productId
        }
      });
      if (!checkProductId) {
        res = await this.db.cartItem.create({
          data: {
            cartId: cartData.id,
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
    const res = await this.db.cart.findMany({
      where: {
        userId,
        status: StatusEnum.ACTIVE
      }, include: {
        cartItems: {
          include: {
            product: {
              include: {
                imageUrl: {
                  select: {
                    imageUrl: true
                  }
                }
              }
            }
          }
        }

      }
    });

    return {
      statusCode: 200,
      message: "Get list item with cart successfully",
      data: res
    };
  };


  deleteItemCart = async (userId: string, productId: string) => {
    const cartData = await this.db.cart.findFirst({
      where: {
        userId, status: StatusEnum.ACTIVE
      }
    });

    if (!cartData) {
      return {
        statusCode: 404,
        message: "Cart not found"
      };
    }
    const cartItemData = await this.db.cartItem.findFirst({
      where: {
        cartId: cartData.id,
        productId
      }
    });
    if (!cartItemData) {
      return {
        statusCode: 404,
        message: "Cart item not found"
      };
    }
    const res = await this.db.cartItem.delete({
      where: {
        id: cartItemData.id
      }
    });
    return {
      statusCode: 200,
      message: "Cart item deleted successfully",
      data: res
    };

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
