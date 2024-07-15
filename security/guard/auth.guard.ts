import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service'; // Import JwtService

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly db: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractJwtFromRequest(request);


    let decoded = this.jwtService.decode(token) as { sub: string, email: string, role: number };

    if(!decoded) {
      return false
    }

    const user = await this.db.user.findUnique({
      where: {
        id: decoded.sub,
      },
    })

    if(!user) {
      return false
    }

    // decoded.role = user.roleId
    request.token = decoded
    // console.log(request.token)

    return true;
  }

  private extractJwtFromRequest(request) {

    const bearerHeader = request.headers['authorization'];
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      if (bearer[0] === 'Bearer' && bearer[1]) {
        return bearer[1];
      }
    }
    if (request.cookies) {
      if (request.cookies.jwt) {
        return request.cookies.jwt;
      }
    }
    return null;
  }
}
