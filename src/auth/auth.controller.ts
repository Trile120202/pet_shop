import { Body, Controller,Request, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "../../security/auth";

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('register')
  register(@Body() body:UserRegisterDto) {
    return this.service.register(body)
  }

  @Post('login')
  login(@Body() body:any) {
    return this.service.login(body)
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req, @Res({ passthrough: true }) res: any): Promise<any> {
    // console.log('---',req.token)
    return this.service.getProfile(req.user.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  updateUser(@Request() req,@Body() body:any, @Res({ passthrough: true }) res: any) {
    return this.service.updateUser(req.user.sub,body)
  }

}
