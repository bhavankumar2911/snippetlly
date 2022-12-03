import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { TokenConfig } from "../config";
import IJWTPayload from "../interfaces/IJWTPayload";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import RefreshToken from "../models/RefreshToken";

const auth: RequestHandler = (req: IRequestWithUser, res, next) => {
  const cookies = req.cookies;

  //   token not present
  if (!cookies.access_token || !cookies.refresh_token)
    return next(createHttpError.Unauthorized("You are unauthorized"));

  // verify access token
  try {
    const decoded = jwt.verify(
      cookies.access_token,
      TokenConfig.accessTokenSecret as string
    ) as IJWTPayload;

    req.userId = decoded.userId;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name == "TokenExpiredError")
        return next(createHttpError.Unauthorized("token expired"));
      else return next(createHttpError.Unauthorized("You are unauthorized"));
    }
  }

  // verify refresh token
  try {
    const decoded = jwt.verify(
      cookies.refresh_token,
      TokenConfig.refreshTokenSecret as string
    ) as IJWTPayload;

    // check token in blacklist
    const refreshToken = RefreshToken.findOne({
      where: { userId: decoded.userId },
    });

    if (refreshToken != cookies.refresh_token)
      return next(createHttpError.Unauthorized("You are unauthorized"));

    return next();
  } catch (error) {
    return next(createHttpError.Unauthorized("You are unauthorized"));
  }
};
