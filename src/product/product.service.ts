import { Injectable } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import { StatusEnum } from "../../configs/enum";

@Injectable()
export class ProductService {
  constructor(private readonly db: PrismaService) {
  }

  create = async (data: CreateProductDto) => {
    try {
      const product = await this.db.product.create({
        data: {
          ...data
        }
      });
      return {
        statusCode: 200,
        message: "Product created successfully",
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

  update = async (data: UpdateProductDto) => {

    try {


      const product = await this.db.product.update({
        where: { id: data.id },
        data: {
          name: data.name,
          image: data.image,
          price: data.price,
          quantity: data.quantity
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
    try {
      const products = await this.db.product.findMany({
        skip: offset,
        take: limit,
        where: {
          name: {
            contains: search
          },
          status: StatusEnum.ACTIVE
        },
        include: {
          UserProductFavorite: {
            select: {
              id: true,
              userId: true
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
          totalFavorite
        };
      });

      const total = await this.db.product.count();

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

  getListProduct = async (offset: number, limit: number, search: string) => {
    try {

      const products = await this.db.product.findMany({
        where: {
          name: {
            contains: search
          },
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
          }
        }

      });


      const total = await this.db.product.count({
        where: {
          name: {
            contains: search
          }
        }
      });

      const productsWithFavoriteFlag = products.map((product) => {
        const totalFavorite = product.UserProductFavorite.length;
        return {
          ...product,
          totalFavorite
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

  favorite = async (userId: string, productId: string) => {
    try {
      const product = await this.db.product.update({
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
        message: "Product favorite successfully",
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

  unfavorite = async (userId: string, productId: string) => {
    try {
      const result = await this.db.userProductFavorite.deleteMany(
        {
          where: {
            userId,
            productId
          }
        }
      );
      return {
        statusCode: 200,
        message: "Product unfavorite successfully",
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
