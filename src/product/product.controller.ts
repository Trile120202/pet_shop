import { Body, Controller, Get, Param, Post, Query, Request, Res, UseGuards } from "@nestjs/common";
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
    return this.service.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("list")
  list(@Query("offset") offset: number, @Query("limit") limit: number, @Query("search") search, @Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.list(offset ?? 0, limit ?? 20, search ?? "", req.user.sub);
  }

  @Get("get-list-product")
  async getListProduct(@Query("offset") offset: number, @Query("limit") limit: number, @Query("search") search: string) {
    return await this.service.getListProduct(offset ?? 0, limit ?? 20, search ?? "");
  }

  @UseGuards(JwtAuthGuard)
  @Post("favorite")
  favorite(@Query("id") id: string, @Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.toggleFavorite(req.user.sub, id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post("get-favorite")
  getFavorite(@Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.getProductFavorite(req.user.sub);
  }

}
