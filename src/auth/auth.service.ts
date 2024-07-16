import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthLoginDto, UserRegisterDto } from "./dto";
import * as argon2 from 'argon2';
import { StatusEnum } from "../../configs/enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService
  ) {


  }

  signJwt = async (userId: string, email: string): Promise<string> => {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload,{
      expiresIn: process.env.EXPIRES,
      secret: process.env.SECRET_KEY,
      issuer: 'monorail',
    });
  };

  register = async (body: UserRegisterDto) => {
    try {
      if (!body.username || !body.email || !body.password) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username, email, and password are required',
        };
      }

      const existingUserByEmail = await this.db.user.findUnique({
        where: { email: body.email },
      });
      if (existingUserByEmail) {
        if (existingUserByEmail.status === 0) {
          return {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Account is not active',
          };
        }

        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email is already registered',
        };
      }

      const existingUserByUsername = await this.db.user.findUnique({
        where: { username: body.username },
      });
      if (existingUserByUsername) {
        if (existingUserByUsername.status === 0) {
          return {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Account is not active',
          };
        }
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username is already taken',
        };
      }

      const hashedPassword = await argon2.hash(body.password);
      const data = {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        location:body.location,
      };
      console.log(data)
      const newUser = await this.db.user.create({
        data,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Register successfully',
        data: newUser,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  };

  login = async (obj: AuthLoginDto): Promise<any | HttpStatus> => {
    try {
      if (!obj.email || !obj.password) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username and password are required',
        };
      }

      const user = await this.db.user.findUnique({
        where: { email: obj.email },
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      } else {
        if (user.status !== StatusEnum.ACTIVE) {
          if (user.status === StatusEnum.INACTIVE)
            return {
              statusCode: HttpStatus.FORBIDDEN,
              message: 'Account is not active',
            };
        }
        const passwordMatched = await argon2.verify(user.password, obj.password);

        if (passwordMatched) {

          

          const result = await this.signJwt(user.id, user.email);
          return {
            statusCode: HttpStatus.OK,
            message: 'Login successfully',
            token: result,
          };

        } else {
          return {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Wrong password',
          };
        }
      }



    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error ' + error,
      };
    }
  };

  getProfile = async (userId: string): Promise<any> => {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Get profile successfully',
        data: user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };

    }
  };



}
