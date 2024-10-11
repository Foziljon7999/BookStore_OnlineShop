import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token) {
      throw new UnauthorizedException('Token is missing or expired');
    }

    try {
      const payload = await this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
      console.log(payload);
      
      request.user = payload;
      return true;
    } catch (error) {
      console.error('JWT verification error:', error); 
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
