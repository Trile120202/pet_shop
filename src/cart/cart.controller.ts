import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "../../security/auth";

@Controller("cart")
export class CartController {
  constructor(private readonly service: CartService) {
  }


  @UseGuards(JwtAuthGuard)
  @Post("add-cart-item")
  addToCart(@Body()body: any, @Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.addToCart(req.user.sub, body.productId, body.quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Post("get-cart")
  getCart(@Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.getListItemWithCart(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post("delete-cart-item")
  deleteCartItem(@Body()body: any, @Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.deleteItemCart(req.user.sub, body.productId);
  }

}
