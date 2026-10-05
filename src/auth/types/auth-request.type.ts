import { Request } from "express";
import { Role } from "../../../generated/prisma/enums";
export type AuthRequest = Request & { user: { id: number; role: Role } };
