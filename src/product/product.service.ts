import { Injectable } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import { StatusEnum } from "../../configs/enum";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProductService {
  constructor(private readonly db: PrismaService) {
  }

  create = async (data: CreateProductDto) => {
    const id = uuidv4();
    const e = await this.db.$transaction([
      this.db.product.create({
        data: {
          title: data.title,
          description: data.description,
          name: data.name,
          price: data.price,
          oldPrice: data.oldPrice,
          category: data.category,
          status: StatusEnum.ACTIVE,
          id
        }
      }),
      this.db.image.create({
        data: {
          imageUrl: data.image,
          productId: id
        }
      })
    ]);
    return {
      statusCode: 200,
      message: "Product created successfully",
      data: e
    };
  };

  update = async (data: UpdateProductDto) => {

    try {
      const product = await this.db.product.update({
        where: { id: data.id },
        data: {
          name: data.name,
          price: data.price
        }
      });
      return {
        statusCode: 200,
        message: "Product updated successfully",
        data: product
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };

  async delete(id: string) {
    try {
      const product = await this.db.product.update({
        where: { id },
        data: {
          status: StatusEnum.DELETED
        }
      });
      return {
        statusCode: 200,
        message: "Product deleted successfully",
        data: product
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  }

  list = async (offset: number, limit: number, search: string, idUser: string) => {
    const products = await this.db.product.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            name: {
              contains: search
            }
          },
          {
            category: {
              contains: search
            }
          }
        ],
        status: StatusEnum.ACTIVE
      },
      include: {
        UserProductFavorite: {
          select: {
            id: true,
            userId: true
          }
        },
        imageUrl: {
          select: {
            imageUrl: true
          }
        }
      }
    });

    const productsWithFavoriteFlag = products.map((product) => {
      const isFavorite = product.UserProductFavorite.some((favorite) => favorite.userId === idUser);
      const totalFavorite = product.UserProductFavorite.length;
      return {
        ...product,
        isFavorite,
        totalFavorite,
        imageUrl: product.imageUrl.map((image) => image.imageUrl)
      };
    });

    const total = await this.db.product.count({
      where: {
        OR: [
          {
            name: {
              contains: search
            }
          },
          {
            category: {
              contains: search
            }
          }
        ],
        status: StatusEnum.ACTIVE
      }
    });

    const page = Math.ceil(total / limit);

    const result = { products: productsWithFavoriteFlag, total, page };

    return {
      statusCode: 200,
      message: "Product list successfully",
      data: result
    };
  };
  getListProduct = async (offset: number, limit: number, search: string) => {
    try {
      const products = await this.db.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search
              }
            },
            {
              category: {
                contains: search
              }
            }
          ],
          status: StatusEnum.ACTIVE
        },
        skip: offset,
        take: limit,
        include: {
          UserProductFavorite: {
            select: {
              id: true,
              userId: true
            }
          },
          imageUrl: {
            select: {
              imageUrl: true
            }
          }
        }
      });

      const total = await this.db.product.count({
        where: {
          OR: [
            {
              name: {
                contains: search
              }
            },
            {
              category: {
                contains: search
              }
            }
          ],
          status: StatusEnum.ACTIVE
        }
      });

      const productsWithFavoriteFlag = products.map((product) => {
        const totalFavorite = product.UserProductFavorite.length;
        return {
          ...product,
          totalFavorite,
          imageUrl: product.imageUrl.map((image) => image.imageUrl)
        };
      });

      const page = Math.ceil(total / limit);

      const result = { products: productsWithFavoriteFlag, total, page };

      return {
        statusCode: 200,
        message: "Product list successfully",
        data: result
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };
  toggleFavorite = async (userId: string, productId: string) => {
    try {
      const existingFavorite = await this.db.userProductFavorite.findFirst({
        where: {
          userId,
          productId
        }
      });

      if (existingFavorite) {
        await this.db.userProductFavorite.delete({
          where: {
            id: existingFavorite.id
          }
        });

        return {
          statusCode: 200,
          message: "Product unfavorited successfully"
        };
      } else {
        await this.db.product.update({
          where: { id: productId },
          data: {
            UserProductFavorite: {
              create: {
                userId
              }
            }
          }
        });

        return {
          statusCode: 200,
          message: "Product favorited successfully"
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        error
      };
    }
  };


  getProductFavorite = async (userId: string) => {
    try {
      const listProductFavorite = await this.db.userProductFavorite.findMany({
        where: {
          userId
        },
        include: {
          product: true
        }
      });
      return {
        statusCode: 200,
        message: "Product favorite successfully",
        data: listProductFavorite
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
