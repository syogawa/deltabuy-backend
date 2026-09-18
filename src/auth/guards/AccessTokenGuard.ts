import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Access token отсутствует");
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Некорректный access token");
    }

    const payload = await this.authService.validateAccessToken(token);

    request["user"] = payload;

    return true;
  }
}
