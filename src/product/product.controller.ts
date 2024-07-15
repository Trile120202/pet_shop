import { Body, Controller, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "../../security/auth";

@Controller("product")
export class ProductController {
  constructor(private readonly service: ProductService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() body: CreateProductDto) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update")
  async update(@Body() body: UpdateProductDto) {
    return await this.service.update(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("delete")
  delete(@Query("id") id: string) {
    console.log(id);
    return this.service.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("list")
  list(@Query("offset") offset: number, @Query("limit") limit: number) {
    return this.service.list(offset ?? 0, limit ?? 20);
  }

}
