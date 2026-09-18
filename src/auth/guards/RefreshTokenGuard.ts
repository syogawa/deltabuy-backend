import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request.cookies["refreshToken"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token отсутствует");
    }

    const payload = await this.authService.validateRefreshToken(refreshToken);

    request["user"] = payload;

    return true;
  }
}
