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

      console.log(data.id);

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

  list = async (offset: number, limit: number) => {
    try {

      const products = await this.db.product.findMany({
        skip: offset,
        take: limit
      });

      const total = await this.db.product.count();

      const page = Math.ceil(total / limit);

      const result = { products, total, page };

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
}
