import { Request } from "express";
import { IUser } from "../models/models.types";

export interface AuthRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user: IUser;
}
