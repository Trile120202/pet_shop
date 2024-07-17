import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { JwtAuthGuard } from "../../security/auth";

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Body()body: any, @Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.createOrder(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-order')
  getOrder(@Request() req, @Res({ passthrough: true }) res: any) {
    return this.service.findAllOrders(req.user.sub);
  }

}
